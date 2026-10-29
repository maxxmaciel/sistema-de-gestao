package framework.sql.component;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.man.Man;
import framework.servlet.helper.ReqParms;
import framework.sql.Select;
import framework.sql.StatementSet;
import resources.PARM;
import resources.S;

/**
 * Componente que LÊ (select) e opcionalmente GRAVA (set). Quase tudo herda daqui.
 *
 * exec()          -> a=component : roda o select e devolve colunas + linhas + caption + derived
 * execStatement() -> a=c_up      : valida (IntegrityValidator) e roda o set
 *
 * DERIVAÇÃO AUTOMÁTICA (buildDerived): depois do select, olha todos os componentes registrados
 * e oferece como ação de linha os que tiverem TODOS os seus parâmetros entre as colunas deste
 * resultado. Ex.: U_PRODUTO pede ?cod_produto; qualquer grid com a coluna cod_produto ganha
 * "Editar produto" sem ninguém configurar nada.
 */
public class WidgetGet extends Widget {
	protected final Select select;
	protected final GridColumns columns;
	protected final StatementSet set;
	protected final IntegrityValidator integrityValidator;
	protected final List<WidgetGet> explicitDerived = new ArrayList<>();

	public WidgetGet(String nmFriendly, Select select, StatementSet set, GridColumns columns,
			IntegrityValidator integrityValidator) {
		super(S.EMPTY, nmFriendly);
		this.select = select;
		this.set = set;
		this.columns = columns == null ? new GridColumns() : columns;
		this.integrityValidator = integrityValidator;
	}

	/**
	 * Ação que NÃO entra por coincidência de coluna (ex.: exclusão): só onde for pendurada aqui.
	 */
	@SuppressWarnings("unchecked")
	public <T extends WidgetGet> T withExplicitDerived(WidgetGet... derivedComponents) {
		for (WidgetGet derived : derivedComponents) {
			if (derived != null && derived != this && !explicitDerived.contains(derived)) {
				explicitDerived.add(derived);
			}
		}
		return (T) this;
	}

	public JSONObject exec(ReqParms parms) throws SQLException {
		var resources = parms.getUser().resourcesMap;
		var objects = parms.getValues(select.getParms());
		var result = select.exec(getColumns(), objects);

		var caption = new JSONObject();
		fillCaption(caption);

		result.put(PARM.TYPE, getClass().getSimpleName());
		result.put(PARM.CAPTION, caption);
		result.put(PARM.DERIVED, buildDerived(new JSONArray(), resources));

		if (set != null) {
			result.put(PARM.UPDATE_FIELDS, set.getParms().names());
		}
		return result;
	}

	public JSONObject execStatement(ReqParms parms) throws SQLException {
		if (set == null) {
			return new JSONObject().put(PARM.SUCCESS, S.FALSE).put(PARM.MSG, PARM.MSG_SEM_GRAVACAO);
		}
		if (integrityValidator != null) {
			var refused = integrityValidator.validate(parms);
			if (refused != null) {
				return refused;
			}
		}
		return set.exec(parms.getValues(set.getParms()));
	}

	protected JSONArray buildDerived(JSONArray json, Map<String, String> resourcesMap) {
		for (WidgetGet e : Man.i().getWidgetGetMan().getMap().values()) {
			// Exclusão nunca entra por coincidência de coluna: só via withExplicitDerived.
			if (e instanceof ModalDelete) {
				continue;
			}
			if (isDerivedAllowed(json, e, resourcesMap)) {
				var predicateCols = e.getParms().excluding(PARM.COD_PROJETO);
				if (!predicateCols.isEmpty() && columns.getCols().contains(predicateCols)) {
					json.put(e.fillQueryParms());
				}
			}
		}

		for (WidgetGet e : explicitDerived) {
			if (isDerivedAllowed(json, e, resourcesMap)) {
				json.put(e.fillQueryParms());
			}
		}
		return json;
	}

	/** Só modais viram ação, só se o usuário tiver o recurso e sem repetir. */
	private boolean isDerivedAllowed(JSONArray json, WidgetGet component, Map<String, String> resourcesMap) {
		return component != null
				&& component != this
				&& component instanceof ModalBase
				&& resourcesMap.containsKey(component.getNm())
				&& !hasDerived(json, component.getNm());
	}

	private static boolean hasDerived(JSONArray json, String name) {
		for (int i = 0; i < json.length(); i++) {
			var item = json.optJSONObject(i);
			if (item != null && name.equals(item.optString(PARM.NAME))) {
				return true;
			}
		}
		return false;
	}

	protected void fillCaption(JSONObject caption) {
		caption.put(PARM.NM_FRIENDLY, getNmFriendly());
	}

	/** O que o front precisa para abrir este componente a partir de uma linha. */
	protected JSONObject fillQueryParms() {
		var result = new JSONObject();
		result.put(PARM.KEYS, getParms().excluding(PARM.COD_PROJETO).names());
		result.put(PARM.NAME, getNm());
		result.put(PARM.NM_FRIENDLY, getNmFriendly());
		result.put(PARM.TYPE, getClass().getSimpleName());
		return result;
	}

	public Select getSelect() {
		return select;
	}

	public GridColumns getColumns() {
		return columns;
	}

	public StatementSet getSet() {
		return set;
	}

	@Override
	public Cols getParms() {
		return select.getParms();
	}
}
