package framework.mock;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.SQLException;

import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.RunScript;

/**
 * "Banco" da demonstração: H2 em memória, sem instalar nada. A cada start ele nasce vazio e
 * carrega os scripts de src/main/resources/mock:
 *
 *   schema.sql      tabelas (sem FOREIGN KEY, mesma convenção do projeto original)
 *   procedures.sql  as "stored procedures" -> métodos Java de Procedures (CREATE ALIAS)
 *   data.sql        dados mockados
 *
 * MODE=MySQL + DATABASE_TO_LOWER deixam o SQL e os nomes de coluna iguais aos do MySQL.
 * Ao parar o backend, tudo o que foi gravado some.
 */
public final class MockDatabase {
	private static final String URL =
			"jdbc:h2:mem:framework_generico;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1";
	private static final JdbcDataSource DATA_SOURCE = new JdbcDataSource();
	private static boolean ready;

	static {
		DATA_SOURCE.setURL(URL);
		DATA_SOURCE.setUser("sa");
		DATA_SOURCE.setPassword("");
	}

	private MockDatabase() {
	}

	public static synchronized void init() throws SQLException {
		if (ready) {
			return;
		}
		try (Connection c = getConnection()) {
			runScript(c, "/mock/schema.sql");
			runScript(c, "/mock/procedures.sql");
			runScript(c, "/mock/data.sql");
		}
		ready = true;
	}

	public static Connection getConnection() throws SQLException {
		return DATA_SOURCE.getConnection();
	}

	private static void runScript(Connection c, String resource) throws SQLException {
		var in = MockDatabase.class.getResourceAsStream(resource);
		if (in == null) {
			throw new IllegalStateException("Script não encontrado no classpath: " + resource);
		}
		try (Reader reader = new InputStreamReader(in, StandardCharsets.UTF_8)) {
			RunScript.execute(c, reader);
		} catch (java.io.IOException e) {
			throw new IllegalStateException("Falha ao ler " + resource, e);
		}
	}
}
