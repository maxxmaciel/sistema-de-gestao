package resources;

import framework.sql.component.Col;
import framework.sql.component.Col.Type;
import framework.sql.component.ColEnum;
import framework.sql.component.Validator;

/**
 * Dicionário de campos. Cada coluna é descrita UMA vez e vale para todo SELECT que a devolver:
 * nome amigável (cabeçalho do grid / label do formulário), se é chave, tipo de exibição e
 * validação. Não existe tela "configurando colunas": a tela lê isso do JSON.
 */
public final class FIELD {

	private FIELD() {
	}

	// ---- comuns
	public static final Col FLAG_ATIVO = new Col("flag_ativo", "Ativo", Type.BOOLEAN);
	public static final Col NM_CIDADE = new Col("nm_cidade", "Cidade", Validator.required().maxLength(60));
	public static final Col TX_DESCRICAO = new Col("tx_descricao", "Descrição", Type.OBS, Validator.optional().maxLength(255));
	public static final Col TX_OBS = new Col("tx_obs", "Observação", Type.OBS, Validator.optional().maxLength(255));
	public static final Col VL_TOTAL = new Col("vl_total", "Total", Type.MONETARIO);

	// ---- categoria
	public static final Col COD_CATEGORIA = new Col("cod_categoria", "Cód. categoria", true);
	public static final Col NM_CATEGORIA = new Col("nm_categoria", "Categoria", Validator.required().maxLength(60));
	public static final Col QTD_PRODUTOS = new Col("qtd_produtos", "Produtos");

	// ---- produto
	public static final Col COD_PRODUTO = new Col("cod_produto", "Cód. produto", true);
	public static final Col NM_PRODUTO = new Col("nm_produto", "Produto", Validator.required().maxLength(80));
	public static final Col VL_PRECO = new Col("vl_preco", "Preço", Type.MONETARIO, Validator.required().min(0));
	public static final Col QT_ESTOQUE = new Col("qt_estoque", "Estoque", Validator.required().min(0));
	public static final Col QTD_LOJAS = new Col("qtd_lojas", "Lojas");

	// ---- cliente
	public static final Col COD_CLIENTE = new Col("cod_cliente", "Cód. cliente", true);
	public static final Col NM_CLIENTE = new Col("nm_cliente", "Cliente", Validator.required().maxLength(80));
	public static final Col TX_EMAIL = new Col("tx_email", "E-mail", Type.EMAIL, Validator.optional().email().maxLength(120));
	public static final Col TX_TELEFONE = new Col("tx_telefone", "Telefone", Type.TELEFONE, Validator.optional().maxLength(20));
	public static final Col QTD_PEDIDOS = new Col("qtd_pedidos", "Pedidos");

	// ---- pedido
	public static final Col COD_PEDIDO = new Col("cod_pedido", "Pedido", true);
	public static final Col DT_PEDIDO = new Col("dt_pedido", "Data", Type.DATE, Validator.required());
	public static final ColEnum E_STATUS = new ColEnum("e_status", "Status", Validator.required(),
			"Aberto", "Pago", "Enviado", "Cancelado");
	public static final Col QTD_ITENS = new Col("qtd_itens", "Itens");

	// ---- item do pedido
	public static final Col COD_PEDIDO_ITEM = new Col("cod_pedido_item", "Cód. item", true);
	public static final Col QT_ITEM = new Col("qt_item", "Quantidade", Validator.required().min(1));
	public static final Col VL_UNITARIO = new Col("vl_unitario", "Valor unitário", Type.MONETARIO, Validator.required().min(0));

	// ---- loja
	public static final Col COD_LOJA = new Col("cod_loja", "Cód. loja", true);
	public static final Col NM_LOJA = new Col("nm_loja", "Loja", Validator.required().maxLength(80));
	public static final Col TX_ENDERECO = new Col("tx_endereco", "Endereço", Validator.optional().maxLength(160));

	/** Força a carga da classe (e o registro de todos os Col no ColMan). */
	public static void boot() {
		// os static acima já rodaram quando este método é chamado
	}
}
