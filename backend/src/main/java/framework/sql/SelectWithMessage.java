package framework.sql;

/**
 * Consulta de validação usada pelo IntegrityValidator: devolve uma linha com "resultado"
 * (0 = recusa) e opcionalmente "msg". Sem msg na linha, usa a mensagem declarada aqui.
 */
public class SelectWithMessage extends Select {
	private final String message;

	public SelectWithMessage(String sql, String message) {
		super(sql);
		this.message = message;
	}

	public String getMessage() {
		return message;
	}
}
