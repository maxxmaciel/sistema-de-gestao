package framework.sql.component;

import java.util.Arrays;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import resources.PARM;

/**
 * Campo de escolha dentro de um modal. Não tem SQL próprio: aponta para um Grid registrado
 * (o front busca esse grid pelo nome) e diz qual coluna vira o valor (key) e quais aparecem.
 *
 * Sem validator explícito o front trata o combo como obrigatório.
 */
public class Combo extends Widget {
	protected final Grid grid;
	protected final Col key;
	protected final List<Col> returnedFields;
	protected Col dependsOn;
	protected Validator validator;

	public Combo(String nmFriendly, Col key, Grid grid, Col... returnedFields) {
		super(nmFriendly);
		this.grid = grid;
		this.key = key;
		this.returnedFields = Arrays.asList(returnedFields);
	}

	public Combo withDependsOn(Col dependsOn) {
		this.dependsOn = dependsOn;
		return this;
	}

	public Combo withValidator(Validator validator) {
		this.validator = validator;
		return this;
	}

	public JSONObject toJSON() {
		var json = new JSONObject();
		var columnsNm = new JSONArray();
		for (Col c : returnedFields) {
			columnsNm.put(c.getNm());
		}

		json.put(PARM.NAME, grid.getNm());
		json.put(PARM.COLUMN_KEY, key.getNm());
		json.put(PARM.COLUMNS_NM, columnsNm);
		json.put(PARM.NM_FRIENDLY, getNmFriendly());
		json.put(PARM.HELPER, key.getHelper());
		json.put(PARM.TYPE, PARM.COMBO);

		if (validator != null) {
			json.put(PARM.VALIDATOR, validator.buildJson());
		}
		if (dependsOn != null) {
			json.put(PARM.DEPENDS_ON, dependsOn.getNm());
		}
		return json;
	}
}
