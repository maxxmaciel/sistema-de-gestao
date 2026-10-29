package framework.servlet.helper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import framework.user.UserMan;
import resources.PARM;

/** Servlet que exige login. Sem sessão responde auth = "Sem Sessao" e o axios manda pro login. */
public abstract class SessionedServlet extends ServletBase {
	private static final long serialVersionUID = 1L;

	@Override
	protected JSONObject dispatch(HttpServletRequest req, HttpServletResponse res) throws Exception {
		if (UserMan.getUser(req) == null) {
			return new JSONObject().put(PARM.SUCCESS, false).put(PARM.AUTH, PARM.SEM_SESSAO);
		}
		return super.dispatch(req, res);
	}
}
