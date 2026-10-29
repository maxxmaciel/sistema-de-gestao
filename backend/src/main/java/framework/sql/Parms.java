package framework.sql;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import framework.servlet.helper.ServletBase;
import framework.sql.component.Col;
import framework.sql.component.Cols;

/** Valores da request, lidos pelos nomes que o Statement pediu. */
public class Parms extends HashMap<String, Object> {
	private static final long serialVersionUID = 1L;

	public Parms() {
	}

	public Parms(ServletBase h, Cols cols, HttpServletRequest req) {
		for (Col col : cols) {
			put(col.getNm(), h.getParm(col.getNm(), req));
		}
	}

	/** Valores na ordem dos "?" do SQL. */
	public Object[] getValues(Cols cols) {
		Object[] values = new Object[cols.size()];
		for (int i = 0; i < cols.size(); ++i) {
			values[i] = get(cols.get(i).getNm());
		}
		return values;
	}
}
