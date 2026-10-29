package framework.servlet;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.man.Man;
import framework.servlet.helper.ReqParms;
import framework.servlet.helper.SessionedServlet;
import framework.sql.component.WidgetGet;
import framework.user.UserMan;
import resources.MENU;
import resources.PARM;

/**
 * O servlet genérico: UMA url para TODAS as telas.
 *
 *   GET  /api/c?a=component&nm_component=U_PRODUTO&cod_produto=3  -> exec()          (ler)
 *   POST /api/c  {a: "c_up", nm_component: "U_PRODUTO", ...campos}  -> execStatement() (gravar)
 *
 * Nenhuma tela nova cria servlet, rota ou endpoint: cria um static no COMPONENTS.
 */
public class C extends SessionedServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void buildActionTable(Map<String, Action> actions) {
		actions.put(PARM.C_AC_COMPONENT, (s, req, res) -> ((C) s).component(req));
		actions.put(PARM.C_AC_COMPONENT_UPDATE, (s, req, res) -> ((C) s).componentUpdate(req));
		actions.put(PARM.C_AC_MENU, (s, req, res) -> ((C) s).menu(req));
	}

	protected JSONObject buildResponse(HttpServletRequest req, ReqParms.FunCols foo, ReqParms.Fun fooExec) {
		String nmComponent = getParm(PARM.NM_COMPONENT, req);
		WidgetGet c = Man.i().getWidgetGetMan().byKey(nmComponent);
		if (c == null) {
			return new JSONObject()
					.put(PARM.SUCCESS, false)
					.put(PARM.ERROR, true)
					.put(PARM.MSG, PARM.MSG_COMPONENTE_INEXISTENTE + ": " + nmComponent);
		}
		return new ReqParms(this, req, foo.apply(c)).then(c, fooExec).getResult();
	}

	/** Ler: parâmetros = os do select do componente. */
	private JSONObject component(HttpServletRequest req) {
		return buildResponse(req, WidgetGet::getParms, WidgetGet::exec);
	}

	/** Gravar: parâmetros = os do set (a SP) do componente. */
	private JSONObject componentUpdate(HttpServletRequest req) {
		ReqParms.FunCols foo = (c) -> c.getSet() != null ? c.getSet().getParms() : c.getParms();
		return buildResponse(req, foo, WidgetGet::execStatement);
	}

	/** Menu lateral: só os itens cujo componente o usuário pode abrir. */
	private JSONObject menu(HttpServletRequest req) {
		var user = UserMan.getUser(req);
		var data = new JSONArray();
		for (MENU.Item item : MENU.ITENS) {
			if (user.resourcesMap.containsKey(item.component().getNm())) {
				data.put(item.toJSON());
			}
		}
		return new JSONObject().put(PARM.SUCCESS, true).put(PARM.DATA, data);
	}
}
