package framework.sql.component;

import org.json.JSONArray;

import util.BaseContainer;

/** Lista de campos com as operações de conjunto que a derivação usa (contains/union/excluding). */
public class Cols extends BaseContainer<Col> {

	public Cols(Col... cols) {
		super(cols);
	}

	public void addCol(String nm) {
		add(Col.internal(nm));
	}

	public Col byName(String name) {
		for (Col c : this) {
			if (c.getNm().equals(name)) {
				return c;
			}
		}
		return null;
	}

	/** Todos os nomes de "other" existem aqui? */
	public boolean contains(Cols other) {
		for (Col col : other) {
			if (byName(col.getNm()) == null) {
				return false;
			}
		}
		return true;
	}

	public Cols union(Cols other) {
		Cols result = new Cols();
		for (Col col : this) {
			result.add(col);
		}
		for (Col col : other) {
			if (result.byName(col.getNm()) == null) {
				result.add(col);
			}
		}
		return result;
	}

	public Cols excluding(String... names) {
		Cols result = new Cols();
		for (Col col : this) {
			boolean exclude = false;
			for (String name : names) {
				if (col.getNm().equals(name)) {
					exclude = true;
					break;
				}
			}
			if (!exclude) {
				result.add(col);
			}
		}
		return result;
	}

	public JSONArray names() {
		var result = new JSONArray();
		for (Col col : this) {
			result.put(col.getNm());
		}
		return result;
	}
}
