package framework.sql.component;

import java.util.List;

import org.json.JSONArray;

import resources.S;

public class Combos extends Component {
	protected final List<Combo> combos;

	public Combos(Combo... combos) {
		super(S.EMPTY, S.EMPTY);
		this.combos = List.of(combos);
	}

	public JSONArray buildCombosArray() {
		var result = new JSONArray();
		for (Combo combo : combos) {
			result.put(combo.toJSON());
		}
		return result;
	}
}
