package framework.servlet.helper;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;

import framework.sql.Parms;
import framework.sql.component.Col;
import framework.sql.component.Cols;
import framework.sql.component.WidgetGet;
import framework.user.UserBean;
import framework.user.UserMan;
import resources.PARM;

/**
 * Parâmetros de UMA chamada de componente, já conferidos:
 *  1. o usuário tem o recurso (nm_component) no resourcesMap?  -> senão "Acesso negado"
 *  2. veio todo parâmetro que o SQL pede?                      -> senão "Parâmetro ausente"
 * Só então roda o componente (then).
 */
public class ReqParms extends Parms {
	private static final long serialVersionUID = 1L;

	@FunctionalInterface
	public interface Fun {
		JSONObject apply(WidgetGet c, ReqParms p) throws Exception;
	}

	@FunctionalInterface
	public interface FunCols {
		Cols apply(WidgetGet c);
	}

	protected JSONObject result;
	protected JSONObject jsonReq;
	protected boolean ok;
	protected final HttpServletRequest req;
	protected final UserBean user;

	public ReqParms(ServletBase h, HttpServletRequest req, Cols cols) {
		super(h, cols, req);
		this.req = req;
		this.user = UserMan.getUser(req);
		put(PARM.COD_PROJETO, h.getParm(PARM.COD_PROJETO, req));

		String nmComponent = h.getParm(PARM.NM_COMPONENT, req);
		if (user == null || !user.resourcesMap.containsKey(nmComponent)) {
			result = new JSONObject().put(PARM.SUCCESS, false).put(PARM.ERROR, true).put(PARM.MSG, PARM.MSG_ACESSO_NEGADO);
			return;
		}

		jsonReq = ServletBase.getJsonBody(req);
		// Gravação em lote (DoubleGrid): os valores vêm em "keys", não um a um.
		boolean hasRows = jsonReq != null && jsonReq.has(PARM.KEYS);

		if (!hasRows) {
			for (Col col : cols) {
				if (get(col.getNm()) == null) {
					result = new JSONObject()
							.put(PARM.SUCCESS, false)
							.put(PARM.MSG, PARM.MSG_PARAMETRO_AUSENTE + ": " + col.getNm())
							.put(PARM.ERROR, col.getNm());
					return;
				}
			}
		}
		ok = true;
	}

	public ReqParms then(WidgetGet c, Fun foo) {
		if (!ok) {
			return this;
		}
		try {
			result = foo.apply(c, this);
			if (result != null && !result.has(PARM.SUCCESS)) {
				result.put(PARM.SUCCESS, true);
			}
		} catch (Exception e) {
			result = new JSONObject()
					.put(PARM.SUCCESS, false)
					.put(PARM.MSG, PARM.MSG_ERRO_COMPONENTE + " " + c.getNm())
					.put(PARM.ERROR, String.valueOf(e.getMessage()));
		}
		return this;
	}

	public JSONObject getResult() {
		return result;
	}

	public UserBean getUser() {
		return user;
	}

	public JSONObject getJsonReq() {
		return jsonReq;
	}

	public HttpServletRequest getReq() {
		return req;
	}
}
