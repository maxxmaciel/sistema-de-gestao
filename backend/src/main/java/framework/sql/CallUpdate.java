package framework.sql;

import org.json.JSONObject;

import resources.PARM;
import resources.S;

/**
 * Gravação por stored procedure: "CALL sp_criar_x(?campo1, ?campo2)".
 * Contrato das SPs: a última consulta devolve linhas_afetadas e msg.
 * (Aqui as SPs são mocks em Java, ver framework.mock.Procedures.)
 */
public class CallUpdate extends StatementSet {

	public CallUpdate(String sql) {
		super(sql);
	}

	@Override
	public JSONObject exec(Object[] objects) {
		JSONObject result;
		try {
			result = Command.execCallRSJsonArray(sql, objects);
		} catch (Exception e) {
			result = new JSONObject();
			result.put(PARM.ERROR, e.getMessage());
			result.put(PARM.MSG, PARM.MSG_ERRO_GRAVACAO);
			return result.put(PARM.SUCCESS, S.FALSE);
		}
		return result.put(PARM.SUCCESS, S.TRUE);
	}
}
