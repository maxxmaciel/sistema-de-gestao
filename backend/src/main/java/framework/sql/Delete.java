package framework.sql;

import org.json.JSONObject;

import resources.PARM;
import resources.S;

/** Gravação por SQL direto (DELETE/UPDATE). Devolve linhas_afetadas, igual o contrato das SPs. */
public class Delete extends StatementSet {

	public Delete(String sql) {
		super(sql);
	}

	@Override
	public JSONObject exec(Object[] objects) {
		JSONObject result;
		try {
			result = Command.execUpdate(sql, objects);
		} catch (Exception e) {
			result = new JSONObject();
			result.put(PARM.ERROR, e.getMessage());
			result.put(PARM.MSG, PARM.MSG_ERRO_GRAVACAO);
			return result.put(PARM.SUCCESS, S.FALSE);
		}
		return result.put(PARM.SUCCESS, S.TRUE);
	}
}
