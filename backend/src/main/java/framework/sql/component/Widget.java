package framework.sql.component;

import resources.S;

/** Peça visual. Nasce sem nome: o Refl dá o nome do campo static do COMPONENTS. */
public abstract class Widget extends Component {

	public Widget(String nmFriendly) {
		super(S.EMPTY, nmFriendly);
	}

	public Widget(String nm, String nmFriendly) {
		super(nm, nmFriendly);
	}
}
