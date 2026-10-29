package framework.sql.component;

import java.sql.SQLException;

import org.json.JSONObject;

import framework.servlet.helper.ReqParms;
import framework.sql.Select;
import resources.PARM;

/** Listagem. Também é a fonte de dados dos combos (o combo é só "outro grid"). */
public class Grid extends WidgetGet {

	public Grid(String nmFriendly, Select select) {
		this(nmFriendly, select, new GridColumns());
	}

	public Grid(String nmFriendly, Select select, GridColumns gc) {
		super(nmFriendly, select, null, gc, null);
	}

	@Override
	public JSONObject exec(ReqParms parms) throws SQLException {
		var result = super.exec(parms);
		result.put(PARM.NAME, getNm());
		return result;
	}
}
