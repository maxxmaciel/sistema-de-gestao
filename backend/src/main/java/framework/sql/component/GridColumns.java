package framework.sql.component;

import framework.man.Man;
import util.BaseContainer;

/**
 * Colunas de um componente. Não precisa declarar todas: cada coluna que o SELECT devolver entra
 * sozinha (ensure) com a definição do FIELD. Declara só a exceção, ex.: mostrar o código.
 */
public class GridColumns extends BaseContainer<GridColumn> {

	protected final Cols cols = new Cols();

	public GridColumns(GridColumn... columns) {
		for (GridColumn gc : columns) {
			addCol(gc);
		}
	}

	public static GridColumns showCol(Col... cols) {
		return new GridColumns().show(cols);
	}

	public static GridColumns hiddenCol(Col... cols) {
		return new GridColumns().hide(cols);
	}

	public GridColumns show(Col... cols) {
		for (Col col : cols) {
			putCol(col, false);
		}
		return this;
	}

	public GridColumns hide(Col... cols) {
		for (Col col : cols) {
			putCol(col, true);
		}
		return this;
	}

	public synchronized GridColumn ensure(String name) {
		for (GridColumn gc : this) {
			if (gc.col.getNm().equals(name)) {
				return gc;
			}
		}

		var col = Man.i().getColMan().byKey(name);
		if (col == null) {
			col = Col.internal(name);
		}
		var result = new GridColumn(col);
		addCol(result);
		return result;
	}

	public void addCol(GridColumn c) {
		add(c);
		if (cols.byName(c.col.getNm()) == null) {
			cols.add(c.col);
		}
	}

	/** Colunas conhecidas (declaradas + as que o SELECT já devolveu). Usado na derivação. */
	public Cols getCols() {
		return cols;
	}

	private synchronized void putCol(Col col, boolean hidden) {
		for (GridColumn gc : this) {
			if (gc.col.getNm().equalsIgnoreCase(col.getNm())) {
				gc.hidden = hidden;
				return;
			}
		}
		addCol(new GridColumn(col, hidden));
	}
}
