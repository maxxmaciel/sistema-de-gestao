-- "Stored procedures" da demonstração: cada uma é um método Java de framework.mock.Procedures.
-- O framework chama igual chamaria no MySQL: CALL sp_criar_categoria(?, ?, ?).

CREATE ALIAS sp_criar_categoria        FOR "framework.mock.Procedures.spCriarCategoria";
CREATE ALIAS sp_alterar_categoria      FOR "framework.mock.Procedures.spAlterarCategoria";
CREATE ALIAS sp_apagar_categoria       FOR "framework.mock.Procedures.spApagarCategoria";

CREATE ALIAS sp_criar_produto          FOR "framework.mock.Procedures.spCriarProduto";
CREATE ALIAS sp_alterar_produto        FOR "framework.mock.Procedures.spAlterarProduto";
CREATE ALIAS sp_apagar_produto         FOR "framework.mock.Procedures.spApagarProduto";

CREATE ALIAS sp_criar_cliente          FOR "framework.mock.Procedures.spCriarCliente";
CREATE ALIAS sp_alterar_cliente        FOR "framework.mock.Procedures.spAlterarCliente";

CREATE ALIAS sp_criar_pedido           FOR "framework.mock.Procedures.spCriarPedido";
CREATE ALIAS sp_alterar_pedido         FOR "framework.mock.Procedures.spAlterarPedido";
CREATE ALIAS sp_pagar_pedido           FOR "framework.mock.Procedures.spPagarPedido";
CREATE ALIAS sp_criar_pedido_item      FOR "framework.mock.Procedures.spCriarPedidoItem";
CREATE ALIAS sp_alterar_pedido_item    FOR "framework.mock.Procedures.spAlterarPedidoItem";

CREATE ALIAS sp_criar_loja             FOR "framework.mock.Procedures.spCriarLoja";
CREATE ALIAS sp_alterar_loja           FOR "framework.mock.Procedures.spAlterarLoja";
CREATE ALIAS sp_vincular_loja_produto  FOR "framework.mock.Procedures.spVincularLojaProduto";
