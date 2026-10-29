package framework.sql.component;

import org.json.JSONObject;

import framework.sql.Select;
import framework.sql.StatementSet;
import resources.PARM;

/**
 * Exclusão. NÃO é derivada por coincidência de coluna (seria perigoso aparecer em todo grid
 * com a chave): só onde for pendurada com withExplicitDerived no COMPONENTS.
 * O select traz o resumo mostrado no "tem certeza?"; o set é a SP de exclusão.
 *
 * Contrato da SP: linhas_afetadas = 0 significa exclusão recusada, com o motivo em msg.
 */
public class ModalDelete extends ModalBase {

	public ModalDelete(String nmFriendly, Select select, StatementSet set) {
		super(nmFriendly, select, set, new GridColumns(), null, null);
	}

	@Override
	protected void fillCaption(JSONObject caption) {
		super.fillCaption(caption);
		caption.put(PARM.PARMS, buildParmsArray());
		caption.put(PARM.COMPONENT_UPDATE_ACTION, PARM.C_AC_COMPONENT_UPDATE);
	}

	@Override
	protected JSONObject fillQueryParms() {
		var result = super.fillQueryParms();
		result.put(PARM.PARMS, buildParmsArray());
		result.put(PARM.COMPONENT_UPDATE_ACTION, PARM.C_AC_COMPONENT_UPDATE);
		return result;
	}
}
