package framework.user;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import framework.man.Man;
import framework.sql.component.WidgetGet;

/**
 * Sessão do usuário. Na demonstração o login não valida senha e todo usuário recebe todos os
 * componentes como recurso; no sistema real os recursos vêm do perfil (tabela de permissões).
 */
public final class UserMan {
	private static final String SESSION_USER = "framework.user";
	private static final int COD_PROJETO_DEMO = 1;
	private static final String NM_PROJETO_DEMO = "Projeto Demonstração";

	private UserMan() {
	}

	public static UserBean getUser(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		return session == null ? null : (UserBean) session.getAttribute(SESSION_USER);
	}

	public static UserBean login(HttpServletRequest req, String login) {
		Map<String, String> resources = new LinkedHashMap<>();
		for (WidgetGet c : Man.i().getWidgetGetMan().getMap().values()) {
			resources.put(c.getNm(), c.getNmFriendly());
		}

		var user = new UserBean(login, nomeDoLogin(login), COD_PROJETO_DEMO, NM_PROJETO_DEMO, resources);
		HttpSession session = req.getSession(true);
		req.changeSessionId();
		session.setAttribute(SESSION_USER, user);
		return user;
	}

	public static void logout(HttpServletRequest req) {
		HttpSession session = req.getSession(false);
		if (session != null) {
			session.invalidate();
		}
	}

	/** "ana.souza" -> "Ana Souza". */
	private static String nomeDoLogin(String login) {
		var sb = new StringBuilder();
		for (String part : login.split("[._\\s]+")) {
			if (part.isEmpty()) {
				continue;
			}
			if (sb.length() > 0) {
				sb.append(' ');
			}
			sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
		}
		return sb.toString();
	}
}
