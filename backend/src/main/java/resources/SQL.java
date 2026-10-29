package resources;

import framework.sql.CallUpdate;
import framework.sql.Delete;
import framework.sql.Select;
import framework.sql.SelectWithMessage;

/**
 * Todo SQL do sistema, com parâmetros NOMEADOS (?cod_x). Convenção de nomes:
 *   S_X      select (S_X_DEF = registro padrão do "Adicionar", S_D_X = resumo da exclusão)
 *   I_X/U_X/D_X  CALL das SPs de incluir / alterar / apagar
 *   NOT_EXISTS_X  validações de integridade (SelectWithMessage)
 */
public final class SQL {

	private SQL() {
	}

	// ================================================================== CATEGORIA

	public static final Select S_CATEGORIAS = new Select("""
			SELECT c.cod_categoria, c.nm_categoria, c.tx_descricao, c.flag_ativo,
			       (SELECT COUNT(*) FROM tb_produto p WHERE p.cod_categoria = c.cod_categoria) AS qtd_produtos
			  FROM tb_categoria c
			 ORDER BY c.nm_categoria""");

	public static final Select S_CATEGORIAS_COMBO = new Select("""
			SELECT cod_categoria, nm_categoria
			  FROM tb_categoria
			 WHERE flag_ativo = 1
			 ORDER BY nm_categoria""");

	public static final Select S_CATEGORIA = new Select("""
			SELECT cod_categoria, nm_categoria, tx_descricao, flag_ativo
			  FROM tb_categoria
			 WHERE cod_categoria = ?cod_categoria""");

	public static final Select S_CATEGORIA_DEF = new Select(
			"SELECT '' AS nm_categoria, '' AS tx_descricao, 1 AS flag_ativo");

	public static final Select S_D_CATEGORIA = new Select("""
			SELECT c.cod_categoria, c.nm_categoria,
			       (SELECT COUNT(*) FROM tb_produto p WHERE p.cod_categoria = c.cod_categoria) AS qtd_produtos
			  FROM tb_categoria c
			 WHERE c.cod_categoria = ?cod_categoria""");

	public static final CallUpdate I_CATEGORIA = new CallUpdate(
			"CALL sp_criar_categoria(?nm_categoria, ?tx_descricao, ?flag_ativo)");
	public static final CallUpdate U_CATEGORIA = new CallUpdate(
			"CALL sp_alterar_categoria(?cod_categoria, ?nm_categoria, ?tx_descricao, ?flag_ativo)");
	public static final CallUpdate D_CATEGORIA = new CallUpdate(
			"CALL sp_apagar_categoria(?cod_categoria)");

	public static final SelectWithMessage NOT_EXISTS_CATEGORIA = new SelectWithMessage("""
			SELECT CASE WHEN EXISTS (SELECT 1 FROM tb_categoria
			                          WHERE LOWER(nm_categoria) = LOWER(TRIM(?nm_categoria)))
			            THEN 0 ELSE 1 END AS resultado""",
			"Já existe uma categoria com esse nome");

	public static final SelectWithMessage NOT_EXISTS_CATEGORIA_EXCLUDING_COD = new SelectWithMessage("""
			SELECT CASE WHEN EXISTS (SELECT 1 FROM tb_categoria
			                          WHERE LOWER(nm_categoria) = LOWER(TRIM(?nm_categoria))
			                            AND cod_categoria <> ?cod_categoria)
			            THEN 0 ELSE 1 END AS resultado""",
			"Já existe outra categoria com esse nome");

	// ================================================================== PRODUTO

	private static final String PRODUTO_GRID = """
			SELECT p.cod_produto, p.nm_produto, p.cod_categoria, c.nm_categoria, p.vl_preco, p.qt_estoque,
			       p.flag_ativo,
			       (SELECT COUNT(*) FROM tb_loja_produto lp WHERE lp.cod_produto = p.cod_produto) AS qtd_lojas
			  FROM tb_produto p
			  JOIN tb_categoria c ON c.cod_categoria = p.cod_categoria
			""";

	public static final Select S_PRODUTOS = new Select(PRODUTO_GRID + " ORDER BY p.nm_produto");

	public static final Select S_PRODUTOS_CATEGORIA = new Select(
			PRODUTO_GRID + " WHERE p.cod_categoria = ?cod_categoria ORDER BY p.nm_produto");

	public static final Select S_PRODUTOS_COMBO = new Select("""
			SELECT cod_produto, nm_produto, vl_preco
			  FROM tb_produto
			 WHERE flag_ativo = 1
			 ORDER BY nm_produto""");

	public static final Select S_PRODUTO = new Select("""
			SELECT cod_produto, nm_produto, cod_categoria, vl_preco, qt_estoque, flag_ativo
			  FROM tb_produto
			 WHERE cod_produto = ?cod_produto""");

	public static final Select S_PRODUTO_DEF = new Select("""
			SELECT '' AS nm_produto, CAST(NULL AS INT) AS cod_categoria, CAST(0 AS DECIMAL(10,2)) AS vl_preco,
			       0 AS qt_estoque, 1 AS flag_ativo""");

	public static final Select S_D_PRODUTO = new Select("""
			SELECT p.cod_produto, p.nm_produto, c.nm_categoria, p.vl_preco,
			       (SELECT COUNT(*) FROM tb_pedido_item i WHERE i.cod_produto = p.cod_produto) AS qtd_pedidos
			  FROM tb_produto p
			  JOIN tb_categoria c ON c.cod_categoria = p.cod_categoria
			 WHERE p.cod_produto = ?cod_produto""");

	public static final CallUpdate I_PRODUTO = new CallUpdate(
			"CALL sp_criar_produto(?nm_produto, ?cod_categoria, ?vl_preco, ?qt_estoque, ?flag_ativo)");
	public static final CallUpdate U_PRODUTO = new CallUpdate(
			"CALL sp_alterar_produto(?cod_produto, ?nm_produto, ?cod_categoria, ?vl_preco, ?qt_estoque, ?flag_ativo)");
	public static final CallUpdate D_PRODUTO = new CallUpdate(
			"CALL sp_apagar_produto(?cod_produto)");

	// ================================================================== CLIENTE

	private static final String CLIENTE_GRID = """
			SELECT c.cod_cliente, c.nm_cliente, c.tx_email, c.tx_telefone, c.nm_cidade, c.flag_ativo,
			       (SELECT COUNT(*) FROM tb_pedido p WHERE p.cod_cliente = c.cod_cliente) AS qtd_pedidos
			  FROM tb_cliente c
			""";

	public static final Select S_CLIENTES = new Select(CLIENTE_GRID + " ORDER BY c.nm_cliente");

	public static final Select S_CLIENTES_COMBO = new Select("""
			SELECT cod_cliente, nm_cliente, nm_cidade
			  FROM tb_cliente
			 WHERE flag_ativo = 1
			 ORDER BY nm_cliente""");

	public static final Select S_CLIENTE = new Select("""
			SELECT cod_cliente, nm_cliente, tx_email, tx_telefone, nm_cidade, flag_ativo
			  FROM tb_cliente
			 WHERE cod_cliente = ?cod_cliente""");

	public static final Select S_CLIENTE_DEF = new Select(
			"SELECT '' AS nm_cliente, '' AS tx_email, '' AS tx_telefone, '' AS nm_cidade, 1 AS flag_ativo");

	public static final CallUpdate I_CLIENTE = new CallUpdate(
			"CALL sp_criar_cliente(?nm_cliente, ?tx_email, ?tx_telefone, ?nm_cidade, ?flag_ativo)");
	public static final CallUpdate U_CLIENTE = new CallUpdate(
			"CALL sp_alterar_cliente(?cod_cliente, ?nm_cliente, ?tx_email, ?tx_telefone, ?nm_cidade, ?flag_ativo)");

	// ================================================================== PEDIDO

	private static final String PEDIDO_GRID = """
			SELECT p.cod_pedido, p.dt_pedido, p.cod_cliente, c.nm_cliente, p.e_status,
			       (SELECT COUNT(*) FROM tb_pedido_item i WHERE i.cod_pedido = p.cod_pedido) AS qtd_itens,
			       (SELECT COALESCE(SUM(i.qt_item * i.vl_unitario), 0)
			          FROM tb_pedido_item i WHERE i.cod_pedido = p.cod_pedido) AS vl_total
			  FROM tb_pedido p
			  JOIN tb_cliente c ON c.cod_cliente = p.cod_cliente
			""";

	public static final Select S_PEDIDOS = new Select(PEDIDO_GRID + " ORDER BY p.dt_pedido DESC, p.cod_pedido DESC");

	public static final Select S_PEDIDOS_CLIENTE = new Select(
			PEDIDO_GRID + " WHERE p.cod_cliente = ?cod_cliente ORDER BY p.dt_pedido DESC");

	public static final Select S_PEDIDO = new Select("""
			SELECT cod_pedido, cod_cliente, dt_pedido, e_status, tx_obs
			  FROM tb_pedido
			 WHERE cod_pedido = ?cod_pedido""");

	/** Cabeçalho do MasterDetails "Itens do pedido". */
	public static final Select S_PEDIDO_RESUMO = new Select(
			PEDIDO_GRID + " WHERE p.cod_pedido = ?cod_pedido");

	public static final Select S_PEDIDO_DEF = new Select(
			"SELECT CAST(NULL AS INT) AS cod_cliente, CURRENT_DATE AS dt_pedido, 'Aberto' AS e_status, '' AS tx_obs");

	public static final CallUpdate I_PEDIDO = new CallUpdate(
			"CALL sp_criar_pedido(?cod_cliente, ?dt_pedido, ?e_status, ?tx_obs)");
	public static final CallUpdate U_PEDIDO = new CallUpdate(
			"CALL sp_alterar_pedido(?cod_pedido, ?cod_cliente, ?dt_pedido, ?e_status, ?tx_obs)");

	/** Ação própria da tela de Pedidos: devolve também vl_total e qtd_itens. */
	public static final CallUpdate U_PAGAR_PEDIDO = new CallUpdate(
			"CALL sp_pagar_pedido(?cod_pedido)");

	// ================================================================== ITEM DO PEDIDO

	public static final Select S_PEDIDO_ITENS = new Select("""
			SELECT i.cod_pedido_item, i.cod_pedido, i.cod_produto, p.nm_produto, i.qt_item, i.vl_unitario,
			       i.qt_item * i.vl_unitario AS vl_total
			  FROM tb_pedido_item i
			  JOIN tb_produto p ON p.cod_produto = i.cod_produto
			 WHERE i.cod_pedido = ?cod_pedido
			 ORDER BY i.cod_pedido_item""");

	public static final Select S_PEDIDO_ITEM = new Select("""
			SELECT i.cod_pedido_item, i.cod_pedido, i.cod_produto, p.nm_produto, i.qt_item, i.vl_unitario
			  FROM tb_pedido_item i
			  JOIN tb_produto p ON p.cod_produto = i.cod_produto
			 WHERE i.cod_pedido_item = ?cod_pedido_item""");

	/** Registro padrão do item: já nasce com o pedido de onde foi aberto. */
	public static final Select S_PEDIDO_ITEM_DEF = new Select(
			"SELECT CAST(?cod_pedido AS INT) AS cod_pedido, CAST(NULL AS INT) AS cod_produto, 1 AS qt_item");

	public static final CallUpdate I_PEDIDO_ITEM = new CallUpdate(
			"CALL sp_criar_pedido_item(?cod_pedido, ?cod_produto, ?qt_item)");
	public static final CallUpdate U_PEDIDO_ITEM = new CallUpdate(
			"CALL sp_alterar_pedido_item(?cod_pedido_item, ?qt_item, ?vl_unitario)");

	// ================================================================== LOJA

	public static final Select S_LOJAS = new Select("""
			SELECT l.cod_loja, l.nm_loja, l.nm_cidade, l.tx_endereco, l.flag_ativo,
			       (SELECT COUNT(*) FROM tb_loja_produto lp WHERE lp.cod_loja = l.cod_loja) AS qtd_produtos
			  FROM tb_loja l
			 ORDER BY l.nm_loja""");

	public static final Select S_LOJA = new Select("""
			SELECT cod_loja, nm_loja, nm_cidade, tx_endereco, flag_ativo
			  FROM tb_loja
			 WHERE cod_loja = ?cod_loja""");

	public static final Select S_LOJA_DEF = new Select(
			"SELECT '' AS nm_loja, '' AS nm_cidade, '' AS tx_endereco, 1 AS flag_ativo");

	public static final CallUpdate I_LOJA = new CallUpdate(
			"CALL sp_criar_loja(?nm_loja, ?nm_cidade, ?tx_endereco, ?flag_ativo)");
	public static final CallUpdate U_LOJA = new CallUpdate(
			"CALL sp_alterar_loja(?cod_loja, ?nm_loja, ?nm_cidade, ?tx_endereco, ?flag_ativo)");

	// ---- DoubleGrid "Produtos da loja"

	/** Lado esquerdo: produtos ativos que a loja ainda NÃO vende. */
	public static final Select S_DB_PRODUTO_N_LOJA = new Select("""
			SELECT p.cod_produto, p.nm_produto, c.nm_categoria, p.vl_preco
			  FROM tb_produto p
			  JOIN tb_categoria c ON c.cod_categoria = p.cod_categoria
			 WHERE p.flag_ativo = 1
			   AND NOT EXISTS (SELECT 1 FROM tb_loja_produto lp
			                    WHERE lp.cod_loja = ?cod_loja AND lp.cod_produto = p.cod_produto)
			 ORDER BY p.nm_produto""");

	/** Lado direito: produtos que a loja vende. */
	public static final Select S_DB_PRODUTO_LOJA = new Select("""
			SELECT p.cod_produto, p.nm_produto, c.nm_categoria, p.vl_preco
			  FROM tb_loja_produto lp
			  JOIN tb_produto p ON p.cod_produto = lp.cod_produto
			  JOIN tb_categoria c ON c.cod_categoria = p.cod_categoria
			 WHERE lp.cod_loja = ?cod_loja
			 ORDER BY p.nm_produto""");

	public static final Delete DELETE_LOJA_PRODUTO = new Delete(
			"DELETE FROM tb_loja_produto WHERE cod_loja = ?cod_loja");

	public static final CallUpdate I_LOJA_PRODUTO = new CallUpdate(
			"CALL sp_vincular_loja_produto(?cod_loja, ?cod_produto)");
}
