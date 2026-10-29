package util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * Lista base dos containers do framework (Cols, GridColumns...).
 * Os componentes são declarados uma vez (static final) e lidos por várias requests ao mesmo
 * tempo, por isso a lista é sincronizada e o iterator percorre uma cópia.
 */
public class BaseContainer<T> implements Iterable<T> {
	protected final List<T> container = Collections.synchronizedList(new ArrayList<>());

	@SafeVarargs
	public BaseContainer(T... items) {
		addAll(items);
	}

	public void add(T item) {
		if (item != null) {
			container.add(item);
		}
	}

	@SafeVarargs
	public final void addAll(T... items) {
		if (items == null) {
			return;
		}
		for (T item : items) {
			add(item);
		}
	}

	public T get(int i) {
		return container.get(i);
	}

	public int size() {
		return container.size();
	}

	public boolean isEmpty() {
		return container.isEmpty();
	}

	@Override
	public Iterator<T> iterator() {
		synchronized (container) {
			return new ArrayList<>(container).iterator();
		}
	}
}
