package framework.sql;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import framework.sql.component.Cols;
import framework.sql.component.Component;
import resources.S;

/**
 * Base de todo SQL do framework. O SQL é escrito com parâmetros NOMEADOS (?cod_categoria) e o
 * parse troca por "?" posicional, guardando a lista de parâmetros (getParms).
 *
 * Essa lista é o que faz o resto funcionar sozinho:
 *  - o servlet sabe quais parâmetros ler da request (e recusa se faltar algum);
 *  - o ModalCreate/ModalUpdate sabe quais campos do formulário são editáveis;
 *  - o Grid descobre quais componentes "cabem" numa linha (derivação automática).
 */
public class Statement extends Component {
	/*
	 * Regex para encontrar parâmetros nomeados (?nome). O grupo 1 é o nome do parâmetro.
	 */
	private static final Pattern NAMED_PARAM = Pattern.compile("\\?(\\w+)");

	protected final String sql;
	protected final String declaredSql;
	protected final Cols parms = new Cols();

	public Statement(String sql) {
		super(S.EMPTY, S.EMPTY);
		this.declaredSql = sql;
		this.sql = parseParms(sql);
	}

	protected String parseParms(String sql) {
		Matcher m = NAMED_PARAM.matcher(sql);
		StringBuilder sb = new StringBuilder();

		while (m.find()) {
			parms.addCol(m.group(1));
			m.appendReplacement(sb, "?");
		}
		m.appendTail(sb);

		return sb.toString();
	}


	

	/** SQL pronto para o JDBC (com "?"). */
	public String getSql() {
		return sql;
	}

	/** SQL como foi declarado (com ?nome). */
	public String getDeclaredSql() {
		return declaredSql;
	}

	@Override
	public Cols getParms() {
		return parms;
	}
}
