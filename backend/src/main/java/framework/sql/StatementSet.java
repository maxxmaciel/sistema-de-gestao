package framework.sql;

import java.sql.SQLException;

import org.json.JSONObject;

/**
 * Comando de gravação. O componente não sabe se por baixo é uma procedure (CallUpdate) ou um
 * DELETE direto (Delete): só chama exec com os valores na ordem de getParms().
 */
public abstract class StatementSet extends Statement {

	public StatementSet(String sql) {
		super(sql);
	}

	public abstract JSONObject exec(Object[] objects) throws SQLException;

	public JSONObject execByParms(Parms p) throws SQLException {
		return exec(p.getValues(getParms()));
	}
}
