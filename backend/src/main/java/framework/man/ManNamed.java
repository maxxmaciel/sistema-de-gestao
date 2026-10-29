package framework.man;

import java.util.LinkedHashMap;
import java.util.Map;

import resources.INamed;

/** Registro nome -> objeto. LinkedHashMap: as ações derivadas saem na ordem do COMPONENTS. */
public class ManNamed<T extends INamed> {
	protected final Map<String, T> map = new LinkedHashMap<>();

	public synchronized void add(T t) {
		map.put(t.getNm(), t);
	}

	public synchronized T byKey(String key) {
		return key == null ? null : map.get(key);
	}

	public synchronized Map<String, T> getMap() {
		return new LinkedHashMap<>(map);
	}
}
