-- Estrutura do "banco" da demonstração (H2 em memória, modo MySQL).
-- Sem FOREIGN KEY por convenção: a integridade fica nas SPs.

CREATE TABLE tb_categoria (
  cod_categoria  INT AUTO_INCREMENT PRIMARY KEY,
  nm_categoria   VARCHAR(60)  NOT NULL,
  tx_descricao   VARCHAR(255),
  flag_ativo     TINYINT      NOT NULL DEFAULT 1,
  ts_alteracao   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_produto (
  cod_produto    INT AUTO_INCREMENT PRIMARY KEY,
  cod_categoria  INT           NOT NULL,
  nm_produto     VARCHAR(80)   NOT NULL,
  vl_preco       DECIMAL(10,2) NOT NULL DEFAULT 0,
  qt_estoque     INT           NOT NULL DEFAULT 0,
  flag_ativo     TINYINT       NOT NULL DEFAULT 1,
  ts_alteracao   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_produto_categoria ON tb_produto (cod_categoria);

CREATE TABLE tb_cliente (
  cod_cliente    INT AUTO_INCREMENT PRIMARY KEY,
  nm_cliente     VARCHAR(80)  NOT NULL,
  tx_email       VARCHAR(120),
  tx_telefone    VARCHAR(20),
  nm_cidade      VARCHAR(60)  NOT NULL,
  flag_ativo     TINYINT      NOT NULL DEFAULT 1,
  ts_alteracao   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_pedido (
  cod_pedido     INT AUTO_INCREMENT PRIMARY KEY,
  cod_cliente    INT          NOT NULL,
  dt_pedido      DATE         NOT NULL,
  e_status       VARCHAR(20)  NOT NULL DEFAULT 'Aberto',
  tx_obs         VARCHAR(255),
  ts_alteracao   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ix_pedido_cliente ON tb_pedido (cod_cliente);

CREATE TABLE tb_pedido_item (
  cod_pedido_item INT AUTO_INCREMENT PRIMARY KEY,
  cod_pedido      INT           NOT NULL,
  cod_produto     INT           NOT NULL,
  qt_item         INT           NOT NULL DEFAULT 1,
  vl_unitario     DECIMAL(10,2) NOT NULL DEFAULT 0
);
CREATE INDEX ix_pedido_item_pedido ON tb_pedido_item (cod_pedido);

CREATE TABLE tb_loja (
  cod_loja       INT AUTO_INCREMENT PRIMARY KEY,
  nm_loja        VARCHAR(80)  NOT NULL,
  nm_cidade      VARCHAR(60)  NOT NULL,
  tx_endereco    VARCHAR(160),
  flag_ativo     TINYINT      NOT NULL DEFAULT 1,
  ts_alteracao   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_loja_produto (
  cod_loja       INT NOT NULL,
  cod_produto    INT NOT NULL,
  PRIMARY KEY (cod_loja, cod_produto)
);
