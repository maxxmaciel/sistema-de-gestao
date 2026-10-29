package framework.man;

import resources.Named;

/**
 * Tudo no framework tem um nome técnico (nm) e um nome amigável (nmFriendly).
 * Nos componentes o nm fica vazio na declaração e é preenchido pelo Refl com o nome do campo
 * static do COMPONENTS (ex.: "U_CATEGORIA"). É esse nome que o front manda em nm_component.
 */
public class NamedFriendly extends Named {
	protected String nmFriendly;

	public NamedFriendly(String nm, String nmFriendly) {
		super(nm);
		this.nmFriendly = nmFriendly == null || nmFriendly.isEmpty() ? this.nm : nmFriendly;
	}

	public String getNmFriendly() {
		return nmFriendly;
	}

	@Override
	public void setNm(String nm) {
		super.setNm(nm);
		if (nmFriendly == null || nmFriendly.isEmpty()) {
			nmFriendly = nm;
		}
	}
}
