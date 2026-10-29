package framework.sql.component;

import resources.INamed;

/** Contrato mínimo de qualquer peça do framework: nome, nome amigável e parâmetros que precisa. */
public interface IComponent extends INamed {
	String getNmFriendly();

	Cols getParms();
}
