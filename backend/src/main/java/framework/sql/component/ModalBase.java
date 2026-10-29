package framework.sql.component;

import org.json.JSONArray;

import framework.sql.Select;
import framework.sql.StatementSet;

/** Tudo que abre como modal. Só ModalBase vira ação derivada de linha (ver WidgetGet). */
public class ModalBase extends WidgetGet {
	protected final Combos combos;

	public ModalBase(String nmFriendly, Select select, StatementSet set, GridColumns gc,
			IntegrityValidator validator, Combos combos) {
		super(nmFriendly, select, set, gc, validator);
		this.combos = combos == null ? new Combos() : combos;
	}

	/** Campos que a gravação recebe = campos editáveis no formulário. */
	protected JSONArray buildParmsArray() {
		return set == null ? new JSONArray() : set.getParms().names();
	}
}
