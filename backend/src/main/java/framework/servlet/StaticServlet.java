package framework.servlet;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Serve o front buildado (classpath:/public, gerado pelo "npm run build" do frontend).
 * Rota sem extensão (/r/MD_PRODUTO, /login) devolve o index.html: quem resolve é o React Router.
 */
public class StaticServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final Map<String, String> TYPES = Map.of(
			"html", "text/html; charset=UTF-8",
			"js", "text/javascript; charset=UTF-8",
			"css", "text/css; charset=UTF-8",
			"svg", "image/svg+xml",
			"png", "image/png",
			"ico", "image/x-icon",
			"json", "application/json; charset=UTF-8",
			"woff2", "font/woff2");

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
		String path = req.getServletPath() + (req.getPathInfo() == null ? "" : req.getPathInfo());
		if (path.isEmpty() || path.equals("/")) {
			path = "/index.html";
		}
		if (path.contains("..")) {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}

		URL resource = getClass().getResource("/public" + path);
		boolean isRoute = !path.substring(path.lastIndexOf('/') + 1).contains(".");
		if (resource == null && isRoute) {
			path = "/index.html";
			resource = getClass().getResource("/public/index.html");
		}

		if (resource == null) {
			if (path.equals("/index.html")) {
				writeFrontNaoBuildado(res);
			} else {
				res.sendError(HttpServletResponse.SC_NOT_FOUND);
			}
			return;
		}

		String ext = path.substring(path.lastIndexOf('.') + 1);
		res.setContentType(TYPES.getOrDefault(ext, "application/octet-stream"));
		res.setHeader("Cache-Control", path.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
		try (InputStream in = resource.openStream()) {
			in.transferTo(res.getOutputStream());
		}
	}

	private static void writeFrontNaoBuildado(HttpServletResponse res) throws IOException {
		res.setContentType("text/html; charset=UTF-8");
		String html = "<!doctype html><meta charset=utf-8><title>Framework genérico</title>"
				+ "<body style=\"font-family:system-ui;padding:40px;max-width:640px\">"
				+ "<h2>Backend no ar</h2>"
				+ "<p>O front ainda não foi buildado para dentro do jar.</p>"
				+ "<p>Em desenvolvimento, rode <code>dev-front.cmd</code> e abra "
				+ "<a href=\"http://localhost:5173\">http://localhost:5173</a>.</p>"
				+ "<p>Para o pacote completo, rode <code>build.cmd</code>.</p></body>";
		res.getOutputStream().write(html.getBytes(StandardCharsets.UTF_8));
	}
}
