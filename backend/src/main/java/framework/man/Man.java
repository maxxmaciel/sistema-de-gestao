package framework.man;

/** Ponto único de acesso aos registros (singleton, como o Man do projeto original). */
public class Man {
	private static final Man INSTANCE = new Man();

	protected final ColMan colMan = new ColMan();
	protected final WidgetGetMan widgetGetMan = new WidgetGetMan();

	public static Man i() {
		return INSTANCE;
	}

	public ColMan getColMan() {
		return colMan;
	}

	public WidgetGetMan getWidgetGetMan() {
		return widgetGetMan;
	}
}
