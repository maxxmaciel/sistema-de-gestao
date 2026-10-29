package framework.sql.component;

import org.json.JSONObject;

import framework.sql.Select;
import framework.sql.StatementSet;
import resources.PARM;

/**
 * Alteração. O select busca o registro pela chave (?cod_x) — e essa chave é o que faz o
 * "Editar" aparecer sozinho em todo grid que tem a coluna cod_x.
 * Campo que vem no select mas não está no set aparece desabilitado (só leitura).
 */
public class ModalUpdate extends ModalBase {

	public ModalUpdate(String nmFriendly, Select select, StatementSet set) {
		this(nmFriendly, select, set, null, null);
	}

	public ModalUpdate(String nmFriendly, Select select, StatementSet set, Combos combos) {
		this(nmFriendly, select, set, null, combos);
	}

	public ModalUpdate(String nmFriendly, Select select, StatementSet set, IntegrityValidator validator) {
		this(nmFriendly, select, set, validator, null);
	}

	public ModalUpdate(String nmFriendly, Select select, StatementSet set, IntegrityValidator validator,
			Combos combos) {
		super(nmFriendly, select, set, new GridColumns(), validator, combos);
	}

	@Override
	protected void fillCaption(JSONObject caption) {
		super.fillCaption(caption);
		caption.put(PARM.PARMS, buildParmsArray());
		caption.put(PARM.COMBOS, combos.buildCombosArray());
		caption.put(PARM.COMPONENT_UPDATE_ACTION, PARM.C_AC_COMPONENT_UPDATE);
	}

	@Override
	protected JSONObject fillQueryParms() {
		var result = super.fillQueryParms();
		result.put(PARM.PARMS, buildParmsArray());
		result.put(PARM.COMBOS, combos.buildCombosArray());
		result.put(PARM.COMPONENT_UPDATE_ACTION, PARM.C_AC_COMPONENT_UPDATE);
		return result;
	}
}
