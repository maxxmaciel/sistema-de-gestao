package framework.servlet;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.servlet.helper.SessionedServlet;
import framework.user.UserMan;
import resources.PARM;

/** Dados do usuário logado (a=r_u), lidos pelo AppContext ao abrir o app. */
public class UserServlet extends SessionedServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void buildActionTable(Map<String, Action> actions) {
		actions.put("r_u", (s, req, res) -> ((UserServlet) s).readUser(req));
	}

	private JSONObject readUser(HttpServletRequest req) {
		var u = UserMan.getUser(req);
		var row = new JSONObject()
				.put("login", u.login)
				.put("nm_usuario", u.nmUsuario)
				.put(PARM.COD_PROJETO, u.codProjeto)
				.put("nm_projeto", u.nmProjeto)
				.put("qtd_recursos", u.resourcesMap.size());
		return new JSONObject().put(PARM.SUCCESS, true).put(PARM.DATA, new JSONArray().put(row));
	}
}
