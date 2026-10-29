package framework.sql.component;

import org.json.JSONObject;

import resources.PARM;

/** Um Col dentro de um componente específico: aqui decide se aparece ou fica escondido. */
public class GridColumn {
	public boolean hidden;
	public final Col col;

	public GridColumn(Col col, boolean hidden) {
		this.col = col;
		this.hidden = hidden;
	}

	/** Por padrão a chave (pk) vai escondida: está na linha, mas não polui o grid. */
	public GridColumn(Col col) {
		this(col, col.pk);
	}

	public JSONObject buildInfoGridColumn(JSONObject json) {
		json.put(PARM.HIDDEN, hidden);
		return col.buildInfoCol(json);
	}
}
