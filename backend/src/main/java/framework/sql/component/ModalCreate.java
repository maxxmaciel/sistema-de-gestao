package framework.sql.component;

import org.json.JSONObject;

import framework.sql.Select;
import framework.sql.StatementSet;
import resources.PARM;

/**
 * Inclusão. O select é o "registro padrão" (S_X_DEF): define os campos do formulário e os
 * valores iniciais. O set (CALL sp_criar_x) define quais desses campos são editáveis.
 */
public class ModalCreate extends ModalBase {

	public ModalCreate(String nmFriendly, Select select, StatementSet set) {
		this(nmFriendly, select, set, null, null);
	}

	public ModalCreate(String nmFriendly, Select select, StatementSet set, Combos combos) {
		this(nmFriendly, select, set, null, combos);
	}

	public ModalCreate(String nmFriendly, Select select, StatementSet set, IntegrityValidator validator) {
		this(nmFriendly, select, set, validator, null);
	}

	public ModalCreate(String nmFriendly, Select select, StatementSet set, IntegrityValidator validator,
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
