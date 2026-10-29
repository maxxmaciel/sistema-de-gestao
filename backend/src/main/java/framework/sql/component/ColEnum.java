package framework.sql.component;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import resources.PARM;

/** Campo de valores fixos: o front vira um select (formulário) e um chip colorido (grid). */
public class ColEnum extends Col {
	private final List<String> values;

	public ColEnum(String nmField, String nmFriendly, Validator validator, String... values) {
		super(nmField, nmFriendly, Type.ENUM, validator);
		this.values = List.of(values);
	}

	@Override
	public JSONObject buildInfoCol(JSONObject json) {
		super.buildInfoCol(json);
		json.put(PARM.ENUM, new JSONArray(values));
		return json;
	}
}
