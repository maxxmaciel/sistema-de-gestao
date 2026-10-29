package framework.sql.component;

import framework.man.NamedFriendly;

/**
 * Raiz da hierarquia.
 *
 *   Component
 *   ├── Statement ─┬─ Select ── SelectWithMessage
 *   │              └─ StatementSet ─┬─ CallUpdate
 *   │                               └─ Delete
 *   └── Widget ─┬─ Combo / Combos / IntegrityValidator
 *               └─ WidgetGet (Select + Set + colunas + derivação)
 *                  ├── Grid
 *                  └── ModalBase (+ Combos)
 *                      ├── ModalCreate
 *                      ├── ModalUpdate
 *                      ├── ModalDelete
 *                      ├── MasterDetails (cabeçalho + Grid + ModalCreate)
 *                      └── DoubleGrid    (cabeçalho + 2 Grids + Set de vínculo)
 */
public class Component extends NamedFriendly implements IComponent {

	public Component(String nm, String nmFriendly) {
		super(nm, nmFriendly);
	}

	@Override
	public Cols getParms() {
		return new Cols();
	}
}
