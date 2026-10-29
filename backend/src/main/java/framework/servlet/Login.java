package framework.servlet;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;

import framework.servlet.helper.ServletBase;
import framework.user.UserMan;
import resources.PARM;

/**
 * Login aberto: NÃO valida senha (pedido do projeto). Qualquer login abre a sessão; em branco
 * entra como "visitante".
 */
public class Login extends ServletBase {
	private static final long serialVersionUID = 1L;

	@Override
	protected void buildActionTable(Map<String, Action> actions) {
		actions.put("login", (s, req, res) -> ((Login) s).login(req));
		actions.put("logout", (s, req, res) -> ((Login) s).logout(req));
	}

	@Override
	protected String defaultAction() {
		return "login";
	}

	private JSONObject login(HttpServletRequest req) {
		String login = getParm("login", req);
		if (login == null || login.isBlank()) {
			login = "visitante";
		}
		var user = UserMan.login(req, login.trim());
		return new JSONObject().put(PARM.SUCCESS, true).put("nm_usuario", user.nmUsuario);
	}

	private JSONObject logout(HttpServletRequest req) {
		UserMan.logout(req);
		return new JSONObject().put(PARM.SUCCESS, true);
	}
}
