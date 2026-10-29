package framework.refl;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

import framework.man.ManNamed;
import framework.man.NamedFriendly;

/**
 * O "pulo do gato" do registro: percorre os campos static de uma classe (ex.: COMPONENTS) e,
 * para cada um do tipo alvo, usa o NOME DO CAMPO como nome do componente e registra no Man.
 *
 *   public static final ModalUpdate U_CATEGORIA = new ModalUpdate(...);
 *     -> getNm() == "U_CATEGORIA" e Man.i().getWidgetGetMan().byKey("U_CATEGORIA") acha ele.
 *
 * Assim ninguém digita o nome duas vezes e não existe tabela de rotas para manter.
 */
public final class Refl {

	private Refl() {
	}

	@SuppressWarnings("unchecked")
	public static <T extends NamedFriendly> List<NamedFriendly> staticNameThing(Class<?> cls,
			Class<? extends NamedFriendly> targetClass, ManNamed<T> man) {
		var result = new ArrayList<NamedFriendly>();
		for (Field field : cls.getDeclaredFields()) {
			if (!Modifier.isStatic(field.getModifiers()) || !targetClass.isAssignableFrom(field.getType())) {
				continue;
			}
			try {
				NamedFriendly named = (NamedFriendly) field.get(null);
				named.setNm(field.getName());
				result.add(named);
				if (man != null) {
					man.add((T) named);
				}
			} catch (IllegalAccessException e) {
				throw new IllegalStateException("Falha ao ler o campo " + field.getName() + " de " + cls.getName(), e);
			}
		}
		return result;
	}
}
