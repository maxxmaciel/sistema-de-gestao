package framework.sql;

import org.json.JSONObject;

import framework.sql.component.GridColumns;

/** Consulta. Devolve { columns: [...metadata...], data: [...linhas...] }. */
public class Select extends Statement {

	public Select(String sql) {
		super(sql);
	}

	public JSONObject exec(GridColumns columns, Object[] objects) {
		return Command.execRSJsonArrayGrid(getSql(), columns, objects);
	}
}
