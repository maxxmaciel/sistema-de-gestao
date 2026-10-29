package framework.sql.component;

import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.servlet.helper.ReqParms;
import framework.sql.Select;
import framework.sql.StatementSet;
import resources.PARM;
import resources.S;

/**
 * Vínculo N:N entre duas listas: à esquerda o que NÃO está vinculado (source), à direita o que
 * está (linked). O usuário move itens de um lado para o outro e salva de uma vez.
 *
 * Gravação (a=c_up): o front manda em "keys" a lista COMPLETA dos vinculados. Aqui roda o
 * setDelete (limpa os vínculos do registro) e o setInsert para cada item — substitui tudo.
 */
public class DoubleGrid extends ModalBase {
	protected final Grid source;
	protected final Grid linkedGrid;
	protected final StatementSet setInsert;
	protected boolean allowUnlink = true;

	public DoubleGrid(String nmFriendly, Select select, Grid source, Grid linkedGrid, StatementSet setDelete,
			StatementSet setInsert) {
		super(nmFriendly, select, setDelete, new GridColumns(), null, null);
		this.source = source;
		this.linkedGrid = linkedGrid;
		this.setInsert = setInsert;
	}

	public DoubleGrid withAllowUnlink(boolean allowUnlink) {
		this.allowUnlink = allowUnlink;
		return this;
	}

	@Override
	protected void fillCaption(JSONObject caption) {
		super.fillCaption(caption);
		caption.put(PARM.ALLOW_UNLINK, allowUnlink);
	}

	@Override
	public Cols getParms() {
		var result = new Cols();
		if (select != null) {
			result = result.union(select.getParms());
		}
		return result.union(source.getParms()).union(linkedGrid.getParms());
	}

	@Override
	public JSONObject exec(ReqParms parms) throws SQLException {
		var result = new JSONObject();
		var cps = new JSONArray();

		if (select != null) {
			cps.put(super.exec(parms)); // cabeçalho (type = "DoubleGrid")
		}

		var sourceInfo = source.exec(parms);
		sourceInfo.put(PARM.TYPE, PARM.SOURCE_GRID);
		cps.put(sourceInfo);

		var linkedInfo = linkedGrid.exec(parms);
		linkedInfo.put(PARM.TYPE, PARM.LINKED_GRID);
		cps.put(linkedInfo);

		result.put(PARM.NAME, getNm());
		result.put(PARM.NM_FRIENDLY, getNmFriendly());
		result.put(PARM.TYPE, getClass().getSimpleName());
		result.put(PARM.COMPONENTS, cps);
		return result;
	}

	@Override
	public JSONObject execStatement(ReqParms parms) throws SQLException {
		var result = new JSONObject();
		result.put(PARM.MSG, S.EMPTY);

		if (set != null) {
			result.put(PARM.RESULT_DELETE, super.execStatement(parms));
		}

		var resultInsert = new JSONArray();
		var itens = new JSONArray(String.valueOf(parms.getJsonReq().get(PARM.KEYS)));

		for (int i = 0; i < itens.length(); i++) {
			parms.putAll(itens.getJSONObject(i).toMap());
			var obj = setInsert.execByParms(parms);
			if (S.FALSE.equals(String.valueOf(obj.opt(PARM.SUCCESS)))) {
				result.put(PARM.MSG, PARM.MSG_ERRO_VINC);
			}
			resultInsert.put(obj);
		}

		if (result.getString(PARM.MSG).isEmpty()) {
			result.put(PARM.MSG, PARM.MSG_OK_VINC);
		}
		result.put(PARM.RESULT, resultInsert);
		return result;
	}
}
