package framework.mock;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import org.h2.tools.SimpleResultSet;

/**
 * Mock das stored procedures. No sistema real são SPs no MySQL; aqui são métodos Java que o H2
 * expõe com o mesmo nome (procedures.sql: CREATE ALIAS sp_x FOR "...Procedures.spX").
 * Para o framework não muda nada: o CallUpdate continua mandando "CALL sp_x(?, ?)".
 *
 * Contrato (igual ao das SPs reais): a última consulta devolve linhas_afetadas e msg.
 * linhas_afetadas = 0 -> recusado, motivo em msg.
 *
 * Detalhe do H2: para descobrir as colunas do resultado ele chama o método uma vez com uma
 * conexão "columnlist" antes da chamada de verdade. Nessa hora não pode gravar nada, por isso
 * todo método começa com "if (isColumnList(c)) return colunas();".
 */
public final class Procedures {
	private static final String COLUMN_LIST_URL = "jdbc:columnlist:connection";

	private Procedures() {
	}

	// ------------------------------------------------------------------ categoria

	public static ResultSet spCriarCategoria(Connection c, String nmCategoria, String txDescricao, Integer flagAtivo)
			throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "INSERT INTO tb_categoria (nm_categoria, tx_descricao, flag_ativo) VALUES (?, ?, ?)",
				nmCategoria, txDescricao, flag(flagAtivo));
		return resultado(n, "Categoria criada com sucesso");
	}

	public static ResultSet spAlterarCategoria(Connection c, Integer codCategoria, String nmCategoria,
			String txDescricao, Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "UPDATE tb_categoria SET nm_categoria = ?, tx_descricao = ?, flag_ativo = ? WHERE cod_categoria = ?",
				nmCategoria, txDescricao, flag(flagAtivo), codCategoria);
		return resultado(n, n > 0 ? "Categoria alterada com sucesso" : "Categoria não encontrada");
	}

	public static ResultSet spApagarCategoria(Connection c, Integer codCategoria) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		if (exists(c, "SELECT 1 FROM tb_produto WHERE cod_categoria = ?", codCategoria)) {
			return resultado(0, "A categoria tem produtos. Mova ou exclua os produtos antes.");
		}
		int n = exec(c, "DELETE FROM tb_categoria WHERE cod_categoria = ?", codCategoria);
		return resultado(n, n > 0 ? "Categoria excluída" : "Categoria não encontrada");
	}

	// ------------------------------------------------------------------ produto

	public static ResultSet spCriarProduto(Connection c, String nmProduto, Integer codCategoria, BigDecimal vlPreco,
			Integer qtEstoque, Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "INSERT INTO tb_produto (nm_produto, cod_categoria, vl_preco, qt_estoque, flag_ativo) VALUES (?, ?, ?, ?, ?)",
				nmProduto, codCategoria, vlPreco, qtEstoque, flag(flagAtivo));
		return resultado(n, "Produto criado com sucesso");
	}

	public static ResultSet spAlterarProduto(Connection c, Integer codProduto, String nmProduto, Integer codCategoria,
			BigDecimal vlPreco, Integer qtEstoque, Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "UPDATE tb_produto SET nm_produto = ?, cod_categoria = ?, vl_preco = ?, qt_estoque = ?, flag_ativo = ? WHERE cod_produto = ?",
				nmProduto, codCategoria, vlPreco, qtEstoque, flag(flagAtivo), codProduto);
		return resultado(n, n > 0 ? "Produto alterado com sucesso" : "Produto não encontrado");
	}

	public static ResultSet spApagarProduto(Connection c, Integer codProduto) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		if (exists(c, "SELECT 1 FROM tb_pedido_item WHERE cod_produto = ?", codProduto)) {
			return resultado(0, "O produto já foi vendido em pedidos e não pode ser excluído. Desative-o.");
		}
		exec(c, "DELETE FROM tb_loja_produto WHERE cod_produto = ?", codProduto);
		int n = exec(c, "DELETE FROM tb_produto WHERE cod_produto = ?", codProduto);
		return resultado(n, n > 0 ? "Produto excluído" : "Produto não encontrado");
	}

	// ------------------------------------------------------------------ cliente

	public static ResultSet spCriarCliente(Connection c, String nmCliente, String txEmail, String txTelefone,
			String nmCidade, Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "INSERT INTO tb_cliente (nm_cliente, tx_email, tx_telefone, nm_cidade, flag_ativo) VALUES (?, ?, ?, ?, ?)",
				nmCliente, txEmail, txTelefone, nmCidade, flag(flagAtivo));
		return resultado(n, "Cliente criado com sucesso");
	}

	public static ResultSet spAlterarCliente(Connection c, Integer codCliente, String nmCliente, String txEmail,
			String txTelefone, String nmCidade, Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "UPDATE tb_cliente SET nm_cliente = ?, tx_email = ?, tx_telefone = ?, nm_cidade = ?, flag_ativo = ? WHERE cod_cliente = ?",
				nmCliente, txEmail, txTelefone, nmCidade, flag(flagAtivo), codCliente);
		return resultado(n, n > 0 ? "Cliente alterado com sucesso" : "Cliente não encontrado");
	}

	// ------------------------------------------------------------------ pedido

	public static ResultSet spCriarPedido(Connection c, Integer codCliente, Date dtPedido, String eStatus, String txObs)
			throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "INSERT INTO tb_pedido (cod_cliente, dt_pedido, e_status, tx_obs) VALUES (?, ?, ?, ?)",
				codCliente, dtPedido, eStatus, txObs);
		return resultado(n, "Pedido criado. Use \"Itens do pedido\" para incluir os produtos.");
	}

	public static ResultSet spAlterarPedido(Connection c, Integer codPedido, Integer codCliente, Date dtPedido,
			String eStatus, String txObs) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "UPDATE tb_pedido SET cod_cliente = ?, dt_pedido = ?, e_status = ?, tx_obs = ? WHERE cod_pedido = ?",
				codCliente, dtPedido, eStatus, txObs, codPedido);
		return resultado(n, n > 0 ? "Pedido alterado com sucesso" : "Pedido não encontrado");
	}

	/**
	 * Ação própria da tela de Pedidos (botão "Marcar como pago"). Além de linhas_afetadas e msg,
	 * devolve o total e a quantidade de itens: o front usa isso para montar a mensagem.
	 */
	public static ResultSet spPagarPedido(Connection c, Integer codPedido) throws SQLException {
		if (isColumnList(c)) {
			return colunasPagamento();
		}

		String status = null;
		int qtdItens = 0;
		BigDecimal total = null;
		try (PreparedStatement ps = c.prepareStatement("""
				SELECT p.e_status,
				       (SELECT COUNT(*) FROM tb_pedido_item i WHERE i.cod_pedido = p.cod_pedido) AS qtd_itens,
				       (SELECT COALESCE(SUM(i.qt_item * i.vl_unitario), 0)
				          FROM tb_pedido_item i WHERE i.cod_pedido = p.cod_pedido) AS vl_total
				  FROM tb_pedido p
				 WHERE p.cod_pedido = ?""")) {
			ps.setObject(1, codPedido);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					status = rs.getString("e_status");
					qtdItens = rs.getInt("qtd_itens");
					total = rs.getBigDecimal("vl_total");
				}
			}
		}

		if (status == null) {
			return resultadoPagamento(0, "Pedido não encontrado", null, null);
		}
		if (!"Aberto".equals(status)) {
			return resultadoPagamento(0, "Só pedido Aberto pode ser pago (este está " + status + ")", total, qtdItens);
		}
		if (qtdItens == 0) {
			return resultadoPagamento(0, "Pedido sem itens não pode ser pago. Inclua os produtos em \"Itens do pedido\".", total, qtdItens);
		}

		int n = exec(c, "UPDATE tb_pedido SET e_status = 'Pago' WHERE cod_pedido = ? AND e_status = 'Aberto'", codPedido);
		return resultadoPagamento(n, "Pedido " + codPedido + " marcado como pago", total, qtdItens);
	}

	public static ResultSet spCriarPedidoItem(Connection c, Integer codPedido, Integer codProduto, Integer qtItem)
			throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		if (exists(c, "SELECT 1 FROM tb_pedido WHERE cod_pedido = ? AND e_status = 'Cancelado'", codPedido)) {
			return resultado(0, "Pedido cancelado não recebe itens");
		}
		// O preço do item é o preço do produto no momento da venda.
		int n = exec(c, "INSERT INTO tb_pedido_item (cod_pedido, cod_produto, qt_item, vl_unitario) "
				+ "SELECT ?, cod_produto, ?, vl_preco FROM tb_produto WHERE cod_produto = ?",
				codPedido, qtItem, codProduto);
		return resultado(n, n > 0 ? "Item incluído no pedido" : "Produto não encontrado");
	}

	public static ResultSet spAlterarPedidoItem(Connection c, Integer codPedidoItem, Integer qtItem,
			BigDecimal vlUnitario) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "UPDATE tb_pedido_item SET qt_item = ?, vl_unitario = ? WHERE cod_pedido_item = ?",
				qtItem, vlUnitario, codPedidoItem);
		return resultado(n, n > 0 ? "Item alterado com sucesso" : "Item não encontrado");
	}

	// ------------------------------------------------------------------ loja

	public static ResultSet spCriarLoja(Connection c, String nmLoja, String nmCidade, String txEndereco,
			Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "INSERT INTO tb_loja (nm_loja, nm_cidade, tx_endereco, flag_ativo) VALUES (?, ?, ?, ?)",
				nmLoja, nmCidade, txEndereco, flag(flagAtivo));
		return resultado(n, "Loja criada. Use \"Produtos da loja\" para montar o sortimento.");
	}

	public static ResultSet spAlterarLoja(Connection c, Integer codLoja, String nmLoja, String nmCidade,
			String txEndereco, Integer flagAtivo) throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "UPDATE tb_loja SET nm_loja = ?, nm_cidade = ?, tx_endereco = ?, flag_ativo = ? WHERE cod_loja = ?",
				nmLoja, nmCidade, txEndereco, flag(flagAtivo), codLoja);
		return resultado(n, n > 0 ? "Loja alterada com sucesso" : "Loja não encontrada");
	}

	public static ResultSet spVincularLojaProduto(Connection c, Integer codLoja, Integer codProduto)
			throws SQLException {
		if (isColumnList(c)) {
			return colunas();
		}
		int n = exec(c, "INSERT INTO tb_loja_produto (cod_loja, cod_produto) VALUES (?, ?)", codLoja, codProduto);
		return resultado(n, "Produto vinculado");
	}

	// ------------------------------------------------------------------ apoio

	private static boolean isColumnList(Connection c) throws SQLException {
		return COLUMN_LIST_URL.equals(c.getMetaData().getURL());
	}

	private static SimpleResultSet colunas() {
		var rs = new SimpleResultSet();
		rs.addColumn("linhas_afetadas", Types.INTEGER, 10, 0);
		rs.addColumn("msg", Types.VARCHAR, 255, 0);
		return rs;
	}

	private static SimpleResultSet colunasPagamento() {
		var rs = colunas();
		rs.addColumn("vl_total", Types.DECIMAL, 12, 2);
		rs.addColumn("qtd_itens", Types.INTEGER, 10, 0);
		return rs;
	}

	private static SimpleResultSet resultadoPagamento(int linhasAfetadas, String msg, BigDecimal total, Integer qtdItens) {
		var rs = colunasPagamento();
		rs.addRow(linhasAfetadas, msg, total, qtdItens);
		return rs;
	}

	private static SimpleResultSet resultado(int linhasAfetadas, String msg) {
		var rs = colunas();
		rs.addRow(linhasAfetadas, msg);
		return rs;
	}

	private static int flag(Integer value) {
		return value != null && value != 0 ? 1 : 0;
	}

	private static int exec(Connection c, String sql, Object... args) throws SQLException {
		try (PreparedStatement ps = c.prepareStatement(sql)) {
			for (int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			return ps.executeUpdate();
		}
	}

	private static boolean exists(Connection c, String sql, Object... args) throws SQLException {
		try (PreparedStatement ps = c.prepareStatement(sql)) {
			for (int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			try (ResultSet rs = ps.executeQuery()) {
				return rs.next();
			}
		}
	}
}
