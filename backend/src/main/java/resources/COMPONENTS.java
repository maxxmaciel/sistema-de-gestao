package resources;

import framework.man.Man;
import framework.refl.Refl;
import framework.sql.component.Combo;
import framework.sql.component.Combos;
import framework.sql.component.DoubleGrid;
import framework.sql.component.Grid;
import framework.sql.component.GridColumns;
import framework.sql.component.IntegrityValidator;
import framework.sql.component.MasterDetails;
import framework.sql.component.ModalCreate;
import framework.sql.component.ModalDelete;
import framework.sql.component.ModalUpdate;
import framework.sql.component.WidgetGet;

/**
 * TODAS as telas do sistema. Cada linha é um componente e o nome do campo é o nome que o front
 * usa (nm_component). Prefixos: G_ grid, C_ create, U_ update, D_ delete, MD_ master-details,
 * DG_ double grid.
 *
 * Não há nada declarado sobre "qual ação aparece em qual grid": isso sai da derivação automática
 * (os parâmetros de cada componente casados com as colunas de cada grid, ver WidgetGet).
 * A ordem dos campos importa: um static só pode usar o que foi declarado acima dele.
 */
public final class COMPONENTS {

	private COMPONENTS() {
	}

	// ================================================================== validações de integridade

	private static final IntegrityValidator VALIDATOR_CRIAR_CATEGORIA =
			new IntegrityValidator(SQL.NOT_EXISTS_CATEGORIA);
	private static final IntegrityValidator VALIDATOR_ATUALIZAR_CATEGORIA =
			new IntegrityValidator(SQL.NOT_EXISTS_CATEGORIA_EXCLUDING_COD);

	// ================================================================== grids

	public static final Grid G_CATEGORIA = new Grid("Categorias", SQL.S_CATEGORIAS,
			GridColumns.showCol(FIELD.COD_CATEGORIA));
	public static final Grid G_COMBO_CATEGORIA = new Grid("Categorias ativas", SQL.S_CATEGORIAS_COMBO);

	public static final Grid G_PRODUTO = new Grid("Produtos", SQL.S_PRODUTOS,
			GridColumns.showCol(FIELD.COD_PRODUTO));
	public static final Grid G_PRODUTO_CATEGORIA = new Grid("Produtos da categoria", SQL.S_PRODUTOS_CATEGORIA,
			GridColumns.showCol(FIELD.COD_PRODUTO));
	public static final Grid G_COMBO_PRODUTO = new Grid("Produtos ativos", SQL.S_PRODUTOS_COMBO);

	public static final Grid G_CLIENTE = new Grid("Clientes", SQL.S_CLIENTES,
			GridColumns.showCol(FIELD.COD_CLIENTE));
	public static final Grid G_COMBO_CLIENTE = new Grid("Clientes ativos", SQL.S_CLIENTES_COMBO);

	public static final Grid G_PEDIDO = new Grid("Pedidos", SQL.S_PEDIDOS,
			GridColumns.showCol(FIELD.COD_PEDIDO));
	public static final Grid G_PEDIDO_CLIENTE = new Grid("Pedidos do cliente", SQL.S_PEDIDOS_CLIENTE,
			GridColumns.showCol(FIELD.COD_PEDIDO));
	public static final Grid G_PEDIDO_ITEM = new Grid("Itens do pedido", SQL.S_PEDIDO_ITENS);

	public static final Grid G_LOJA = new Grid("Lojas", SQL.S_LOJAS,
			GridColumns.showCol(FIELD.COD_LOJA));
	public static final Grid G_DB_PRODUTO_N_LOJA = new Grid("Produtos disponíveis", SQL.S_DB_PRODUTO_N_LOJA);
	public static final Grid G_DB_PRODUTO_LOJA = new Grid("Produtos da loja", SQL.S_DB_PRODUTO_LOJA);

	// ================================================================== combos (apontam para um grid)

	private static final Combo COMBO_CATEGORIA = new Combo("Categoria", FIELD.COD_CATEGORIA, G_COMBO_CATEGORIA,
			FIELD.NM_CATEGORIA);
	private static final Combo COMBO_CLIENTE = new Combo("Cliente", FIELD.COD_CLIENTE, G_COMBO_CLIENTE,
			FIELD.NM_CLIENTE, FIELD.NM_CIDADE);
	private static final Combo COMBO_PRODUTO = new Combo("Produto", FIELD.COD_PRODUTO, G_COMBO_PRODUTO,
			FIELD.NM_PRODUTO, FIELD.VL_PRECO);

	// ================================================================== CATEGORIA

	public static final ModalCreate C_CATEGORIA = new ModalCreate("Nova categoria",
			SQL.S_CATEGORIA_DEF, SQL.I_CATEGORIA, VALIDATOR_CRIAR_CATEGORIA);
	public static final ModalUpdate U_CATEGORIA = new ModalUpdate("Editar categoria",
			SQL.S_CATEGORIA, SQL.U_CATEGORIA, VALIDATOR_ATUALIZAR_CATEGORIA);
	public static final ModalDelete D_CATEGORIA = new ModalDelete("Excluir categoria",
			SQL.S_D_CATEGORIA, SQL.D_CATEGORIA);

	// ================================================================== PRODUTO

	public static final ModalCreate C_PRODUTO = new ModalCreate("Novo produto",
			SQL.S_PRODUTO_DEF, SQL.I_PRODUTO, new Combos(COMBO_CATEGORIA));
	public static final ModalUpdate U_PRODUTO = new ModalUpdate("Editar produto",
			SQL.S_PRODUTO, SQL.U_PRODUTO, new Combos(COMBO_CATEGORIA));
	public static final ModalDelete D_PRODUTO = new ModalDelete("Excluir produto",
			SQL.S_D_PRODUTO, SQL.D_PRODUTO);

	/** Abre de qualquer linha com cod_categoria (cabeçalho = a categoria, detalhe = os produtos). */
	public static final MasterDetails MD_CATEGORIA_PRODUTO = new MasterDetails("Produtos da categoria",
			SQL.S_CATEGORIA, G_PRODUTO_CATEGORIA, C_PRODUTO);

	// ================================================================== CLIENTE

	public static final ModalCreate C_CLIENTE = new ModalCreate("Novo cliente",
			SQL.S_CLIENTE_DEF, SQL.I_CLIENTE);
	public static final ModalUpdate U_CLIENTE = new ModalUpdate("Editar cliente",
			SQL.S_CLIENTE, SQL.U_CLIENTE);

	// ================================================================== PEDIDO

	public static final ModalCreate C_PEDIDO = new ModalCreate("Novo pedido",
			SQL.S_PEDIDO_DEF, SQL.I_PEDIDO, new Combos(COMBO_CLIENTE));
	public static final ModalUpdate U_PEDIDO = new ModalUpdate("Editar pedido",
			SQL.S_PEDIDO, SQL.U_PEDIDO, new Combos(COMBO_CLIENTE));

	/**
	 * Ação AVULSA (prefixo A_): o botão "Marcar como pago" da tela de Pedidos chama com
	 * a=c_up. É um WidgetGet e não um ModalBase de propósito: assim NÃO vira ação derivada em
	 * todo grid com cod_pedido; só o botão próprio da tela usa. Continua passando pelo servlet C
	 * e pelo ReqParms (recurso liberado + parâmetros obrigatórios).
	 */
	public static final WidgetGet A_PAGAR_PEDIDO = new WidgetGet("Marcar pedido como pago",
			SQL.S_PEDIDO, SQL.U_PAGAR_PEDIDO, null, null);

	/** Abre de qualquer linha com cod_cliente. */
	public static final MasterDetails MD_CLIENTE_PEDIDO = new MasterDetails("Pedidos do cliente",
			SQL.S_CLIENTE, G_PEDIDO_CLIENTE, C_PEDIDO);

	public static final ModalCreate C_PEDIDO_ITEM = new ModalCreate("Adicionar item ao pedido",
			SQL.S_PEDIDO_ITEM_DEF, SQL.I_PEDIDO_ITEM, new Combos(COMBO_PRODUTO));
	public static final ModalUpdate U_PEDIDO_ITEM = new ModalUpdate("Editar item",
			SQL.S_PEDIDO_ITEM, SQL.U_PEDIDO_ITEM);

	/** Abre de qualquer linha com cod_pedido. */
	public static final MasterDetails MD_PEDIDO_ITEM = new MasterDetails("Itens do pedido",
			SQL.S_PEDIDO_RESUMO, G_PEDIDO_ITEM, C_PEDIDO_ITEM);

	// ================================================================== LOJA

	public static final ModalCreate C_LOJA = new ModalCreate("Nova loja",
			SQL.S_LOJA_DEF, SQL.I_LOJA);
	public static final ModalUpdate U_LOJA = new ModalUpdate("Editar loja",
			SQL.S_LOJA, SQL.U_LOJA);

	/** Abre de qualquer linha com cod_loja: monta o sortimento da loja. */
	public static final DoubleGrid DG_LOJA_PRODUTO = new DoubleGrid("Produtos da loja",
			SQL.S_LOJA, G_DB_PRODUTO_N_LOJA, G_DB_PRODUTO_LOJA, SQL.DELETE_LOJA_PRODUTO, SQL.I_LOJA_PRODUTO);

	// ================================================================== telas do menu (MD sem cabeçalho)

	public static final MasterDetails MD_CATEGORIA = new MasterDetails("Categorias", G_CATEGORIA, C_CATEGORIA);
	public static final MasterDetails MD_PRODUTO = new MasterDetails("Produtos", G_PRODUTO, C_PRODUTO);
	public static final MasterDetails MD_CLIENTE = new MasterDetails("Clientes", G_CLIENTE, C_CLIENTE);
	public static final MasterDetails MD_PEDIDO = new MasterDetails("Pedidos", G_PEDIDO, C_PEDIDO);
	public static final MasterDetails MD_LOJA = new MasterDetails("Lojas", G_LOJA, C_LOJA);

	static {
		// Exclusão só onde for pendurada explicitamente (nunca por coincidência de coluna).
		G_CATEGORIA.withExplicitDerived(D_CATEGORIA);
		G_PRODUTO.withExplicitDerived(D_PRODUTO);
		G_PRODUTO_CATEGORIA.withExplicitDerived(D_PRODUTO);

		// Dá a cada componente o nome do seu campo e registra no Man.
		FIELD.boot();
		Refl.staticNameThing(COMPONENTS.class, WidgetGet.class, Man.i().getWidgetGetMan());
	}

	/**
	 * Força a carga desta classe na subida. Sem isso o registro só aconteceria quando alguém
	 * encostasse em COMPONENTS.
	 */
	public static void boot() {
		// o bloco static acima já rodou
	}

	public static int count() {
		return Man.i().getWidgetGetMan().getMap().size();
	}
}
