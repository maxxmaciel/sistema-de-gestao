package framework.sql.component;

import org.json.JSONObject;

import framework.sql.Parms;
import framework.sql.SelectWithMessage;
import resources.PARM;
import resources.S;

/**
 * Regras de negócio checadas ANTES de gravar (ex.: nome duplicado). Cada SelectWithMessage
 * devolve "resultado" (0 = recusa). Recusou: o set nem roda e o front mostra error_message.
 */
public class IntegrityValidator extends Widget {
	private final SelectWithMessage[] selects;

	public IntegrityValidator(SelectWithMessage... selects) {
		super(S.EMPTY);
		this.selects = selects;
	}

	public JSONObject validate(Parms parms) {
		for (SelectWithMessage s : selects) {
			var rows = s.exec(new GridColumns(), parms.getValues(s.getParms())).getJSONArray(PARM.DATA);
			if (rows.isEmpty()) {
				continue;
			}
			var row = rows.getJSONObject(0);
			if (row.optInt(PARM.RESULTADO, 1) == 0) {
				var msg = row.optString(PARM.MSG, S.EMPTY);
				return new JSONObject()
						.put(PARM.SUCCESS, S.FALSE)
						.put(PARM.ERROR_MESSAGE, msg.isEmpty() ? s.getMessage() : msg);
			}
		}
		return null;
	}
}
