package framework.servlet.helper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import framework.user.UserBean;
import framework.user.UserMan;
import resources.PARM;

/**
 * Base de todos os servlets: uma URL por servlet e o parâmetro "a" escolhe a ação
 * (/api/c?a=component, /api/c?a=c_up...). Cada servlet só preenche a tabela de ações.
 */
public abstract class ServletBase extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String JSON_BODY = "framework.json_body";

	@FunctionalInterface
	public interface Action {
		JSONObject apply(ServletBase servlet, HttpServletRequest req, HttpServletResponse res) throws Exception;
	}

	private final Map<String, Action> actions = new HashMap<>();

	@Override
	public void init() {
		buildActionTable(actions);
	}

	protected abstract void buildActionTable(Map<String, Action> actions);

	/** Ação usada quando a request não manda "a". */
	protected String defaultAction() {
		return null;
	}

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException {
		req.setCharacterEncoding(StandardCharsets.UTF_8.name());
		readJsonBody(req);

		JSONObject result;
		try {
			result = dispatch(req, res);
		} catch (Exception e) {
			log("Erro na acao " + getParm(PARM.ACTION, req), e);
			result = new JSONObject()
					.put(PARM.SUCCESS, false)
					.put(PARM.MSG, "Erro inesperado")
					.put(PARM.ERROR, String.valueOf(e.getMessage()));
		}

		res.setContentType("application/json");
		res.setCharacterEncoding(StandardCharsets.UTF_8.name());
		res.setHeader("Cache-Control", "no-store");
		res.getWriter().write(result.toString());
	}

	protected JSONObject dispatch(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String a = getParm(PARM.ACTION, req);
		if (a == null || a.isEmpty()) {
			a = defaultAction();
		}
		Action action = a == null ? null : actions.get(a);
		if (action == null) {
			return new JSONObject().put(PARM.SUCCESS, false).put(PARM.MSG, "Ação inválida: " + a);
		}
		return action.apply(this, req, res);
	}

	/**
	 * Lê um parâmetro da query string ou do corpo JSON.
	 *
	 * cod_projeto NUNCA vem da request: é sempre o da sessão. O front até manda (o axios injeta),
	 * mas quem decide é o servidor — trocar o valor no DevTools não dá acesso a outro projeto.
	 */
	public String getParm(String nm, HttpServletRequest req) {
		if (PARM.COD_PROJETO.equals(nm)) {
			UserBean user = UserMan.getUser(req);
			return user == null ? null : String.valueOf(user.codProjeto);
		}

		String value = req.getParameter(nm);
		if (value != null) {
			return value;
		}

		JSONObject body = getJsonBody(req);
		if (body == null || !body.has(nm)) {
			return null;
		}
		Object o = body.get(nm);
		if (o == JSONObject.NULL) {
			return "";
		}
		if (o instanceof Boolean b) {
			return b ? "1" : "0";
		}
		return String.valueOf(o);
	}

	public static JSONObject getJsonBody(HttpServletRequest req) {
		return (JSONObject) req.getAttribute(JSON_BODY);
	}

	private static void readJsonBody(HttpServletRequest req) throws IOException {
		String ct = req.getContentType();
		if (ct == null || !ct.toLowerCase().contains("application/json")) {
			return;
		}
		String raw = new String(req.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
		if (!raw.isBlank()) {
			req.setAttribute(JSON_BODY, new JSONObject(raw));
		}
	}
}
