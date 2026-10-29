package framework.sql.component;

import org.json.JSONObject;

/**
 * Regras de validação declaradas no FIELD. Vão no JSON da coluna e o front monta o schema do
 * Zod a partir delas (components/Zod): a regra fica num lugar só, no back.
 *
 *   Validator.required().maxLength(60)
 *     -> { "required": {type, value: true, message}, "maxLength": {type, value: 60, message} }
 */
public class Validator {
	private final JSONObject rules = new JSONObject();

	public static Validator required() {
		return new Validator().rule("required", true, "Campo obrigatório");
	}

	public static Validator optional() {
		return new Validator();
	}

	public Validator maxLength(int max) {
		return rule("maxLength", max, "Use no máximo " + max + " caracteres");
	}

	public Validator min(Number min) {
		return rule("min", min, "O valor mínimo é " + min);
	}

	public Validator email() {
		return rule("email", true, "E-mail inválido");
	}

	private Validator rule(String type, Object value, String message) {
		rules.put(type, new JSONObject().put("type", type).put("value", value).put("message", message));
		return this;
	}

	public JSONObject buildJson() {
		return new JSONObject(rules.toString());
	}
}
