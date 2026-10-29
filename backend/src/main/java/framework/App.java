package framework;

import java.nio.file.Files;

import javax.servlet.http.HttpServlet;

import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;

import framework.mock.MockDatabase;
import framework.servlet.C;
import framework.servlet.Login;
import framework.servlet.StaticServlet;
import framework.servlet.UserServlet;
import resources.COMPONENTS;

/**
 * Sobe tudo: banco em memória com os mocks, registro dos componentes e o Tomcat embutido.
 *   /api/c      -> servlet genérico de componentes
 *   /api/login  -> login/logout
 *   /api/user   -> usuário da sessão
 *   /           -> front buildado (SPA)
 */
public class App {

	public static void main(String[] args) throws Exception {
		int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));

		MockDatabase.init();
		COMPONENTS.boot();

		var baseDir = Files.createTempDirectory("framework-generico-tomcat").toFile();
		baseDir.deleteOnExit();

		Tomcat tomcat = new Tomcat();
		tomcat.setBaseDir(baseDir.getAbsolutePath());
		tomcat.setPort(port);
		tomcat.getConnector();

		Context ctx = tomcat.addContext("", baseDir.getAbsolutePath());
		addServlet(ctx, "c", new C(), "/api/c");
		addServlet(ctx, "login", new Login(), "/api/login");
		addServlet(ctx, "user", new UserServlet(), "/api/user");
		addServlet(ctx, "static", new StaticServlet(), "/");

		tomcat.start();

		System.out.println();
		// Sem acento de propósito: o console do Windows (cp850) estraga UTF-8.
		System.out.println("  Framework generico no ar: http://localhost:" + port);
		System.out.println("  Componentes registrados: " + COMPONENTS.count());
		System.out.println("  Front em modo dev (npm run dev): http://localhost:5173");
		System.out.println();

		tomcat.getServer().await();
	}

	private static void addServlet(Context ctx, String name, HttpServlet servlet, String mapping) {
		Tomcat.addServlet(ctx, name, servlet);
		ctx.addServletMappingDecoded(mapping, name);
	}
}
