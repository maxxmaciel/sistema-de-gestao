package resources;

/**
 * Chaves do contrato JSON entre back e front.
 * Se mudar algo aqui, o front (src/contexts/AppContext/interfaces.ts) precisa acompanhar.
 */
public final class PARM {

	private PARM() {
	}

	// ---- request
	public static final String ACTION = "a";
	public static final String NM_COMPONENT = "nm_component";
	public static final String COD_PROJETO = "cod_projeto";
	public static final String KEYS = "keys";

	// ---- ações do servlet C
	public static final String C_AC_COMPONENT = "component";
	public static final String C_AC_COMPONENT_UPDATE = "c_up";
	public static final String C_AC_MENU = "menu";

	// ---- resposta
	public static final String SUCCESS = "success";
	public static final String ERROR = "error";
	public static final String ERROR_MESSAGE = "error_message";
	public static final String MSG = "msg";
	public static final String AUTH = "auth";
	public static final String DATA = "data";
	public static final String RESULT = "result";
	public static final String RESULT_DELETE = "result_delete";
	public static final String RESULTADO = "resultado";
	public static final String LINHAS_AFETADAS = "linhas_afetadas";

	// ---- componente
	public static final String NAME = "name";
	public static final String NM_FRIENDLY = "nm_friendly";
	public static final String TYPE = "type";
	public static final String COMPONENTS = "components";
	public static final String CAPTION = "caption";
	public static final String DERIVED = "derived";
	public static final String PARMS = "parms";
	public static final String COMBOS = "combos";
	public static final String UPDATE_FIELDS = "update_fields";
	public static final String COMPONENT_UPDATE_ACTION = "component_update_action";
	public static final String CREATE_INF = "create_inf";
	public static final String NM_CREATE = "nm_create";
	public static final String NM_FRIENDLY_CREATE = "nm_friendly_create";
	public static final String HELPER = "helper";
	public static final String ALLOW_UNLINK = "allow_unlink";
	public static final String SOURCE_GRID = "SourceGrid";
	public static final String LINKED_GRID = "LinkedGrid";

	// ---- coluna
	public static final String COLUMNS = "columns";
	public static final String FIELD = "field";
	public static final String HEADERNAME = "headerName";
	public static final String PK = "pk";
	public static final String HIDDEN = "hidden";
	public static final String SHOWFILTER = "showFilter";
	public static final String VALIDATOR = "validator";
	public static final String ENUM = "enum";
	public static final String BUILD_CELL = "buildCell";

	// ---- combo
	public static final String COMBO = "combo";
	public static final String COLUMN_KEY = "column_key";
	public static final String COLUMNS_NM = "columns_nm";
	public static final String DEPENDS_ON = "depends_on";

	// ---- tipos de coluna
	public static final String INT = "int";
	public static final String DOUBLE = "double";
	public static final String DATE = "date";
	public static final String DATETIME = "datetime";
	public static final String TIME = "time";
	public static final String BOOLEAN = "boolean";
	public static final String MONETARIO = "monetario";
	public static final String EMAIL = "email";
	public static final String TELEFONE = "telefone";
	public static final String OBS = "obs";

	// ---- sessão
	public static final String SEM_SESSAO = "Sem Sessao";

	// ---- mensagens
	public static final String MSG_ACESSO_NEGADO = "Acesso negado";
	public static final String MSG_COMPONENTE_INEXISTENTE = "Componente não encontrado";
	public static final String MSG_PARAMETRO_AUSENTE = "Parâmetro obrigatório ausente";
	public static final String MSG_ERRO_GRAVACAO = "Não foi possível gravar";
	public static final String MSG_ERRO_COMPONENTE = "Problema ao executar o componente";
	public static final String MSG_SEM_GRAVACAO = "Este componente não tem gravação";
	public static final String MSG_OK_VINC = "Vínculos salvos com sucesso";
	public static final String MSG_ERRO_VINC = "Erro ao salvar um ou mais vínculos";
}
