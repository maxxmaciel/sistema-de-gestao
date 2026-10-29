package framework.user;

import java.util.Map;

/** Usuário da sessão. resourcesMap = componentes que ele pode chamar (nome -> nome amigável). */
public class UserBean {
	public final String login;
	public final String nmUsuario;
	public final int codProjeto;
	public final String nmProjeto;
	public final Map<String, String> resourcesMap;

	public UserBean(String login, String nmUsuario, int codProjeto, String nmProjeto, Map<String, String> resourcesMap) {
		this.login = login;
		this.nmUsuario = nmUsuario;
		this.codProjeto = codProjeto;
		this.nmProjeto = nmProjeto;
		this.resourcesMap = Map.copyOf(resourcesMap);
	}
}
