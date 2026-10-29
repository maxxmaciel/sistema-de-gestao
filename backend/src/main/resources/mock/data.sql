-- Dados mockados. Os códigos (AUTO_INCREMENT) saem na ordem dos INSERTs: 1, 2, 3...

-- Categorias (1..6)
INSERT INTO tb_categoria (nm_categoria, tx_descricao, flag_ativo) VALUES
  ('Bebidas',     'Refrigerantes, sucos e águas',          1),
  ('Mercearia',   'Grãos, massas, óleos e enlatados',      1),
  ('Hortifrúti',  'Frutas, verduras e legumes',            1),
  ('Padaria',     'Pães, bolos e confeitaria',             1),
  ('Limpeza',     'Produtos de limpeza doméstica',         1),
  ('Higiene',     'Cuidados pessoais (linha descontinuada)', 0);

-- Produtos (1..17)
INSERT INTO tb_produto (cod_categoria, nm_produto, vl_preco, qt_estoque, flag_ativo) VALUES
  (1, 'Água mineral 500 ml',          2.50, 120, 1),
  (1, 'Refrigerante cola 2 L',        9.90,  80, 1),
  (1, 'Suco de laranja integral 1 L', 8.50,  45, 1),
  (2, 'Arroz branco tipo 1 5 kg',    27.90,  60, 1),
  (2, 'Feijão carioca 1 kg',          8.99,  75, 1),
  (2, 'Macarrão espaguete 500 g',     4.79,  90, 1),
  (2, 'Café torrado e moído 500 g',  18.90,  40, 1),
  (2, 'Azeite extra virgem 500 ml',  34.90,  25, 1),
  (3, 'Banana prata (kg)',            6.99,  50, 1),
  (3, 'Tomate italiano (kg)',         8.49,  40, 1),
  (3, 'Alface crespa (un)',           3.29,  30, 1),
  (4, 'Pão francês (kg)',            16.90,  20, 1),
  (4, 'Bolo de cenoura com chocolate', 19.90, 8, 1),
  (5, 'Detergente neutro 500 ml',     2.79, 100, 1),
  (5, 'Sabão em pó 1 kg',            15.90,  35, 1),
  (5, 'Desinfetante lavanda 2 L',    12.49,   0, 0),
  (6, 'Sabonete 90 g',                2.49, 150, 0);

-- Clientes (1..8)
INSERT INTO tb_cliente (nm_cliente, tx_email, tx_telefone, nm_cidade, flag_ativo) VALUES
  ('Ana Souza',       'ana.souza@exemplo.com',       '(11) 98765-4321', 'São Paulo',      1),
  ('Bruno Lima',      'bruno.lima@exemplo.com',      '(19) 99876-1234', 'Campinas',       1),
  ('Carla Mendes',    'carla.mendes@exemplo.com',    '(21) 97654-3210', 'Rio de Janeiro', 1),
  ('Diego Ferreira',  'diego.ferreira@exemplo.com',  '(31) 98888-7777', 'Belo Horizonte', 1),
  ('Eduarda Rocha',   'eduarda.rocha@exemplo.com',   '(41) 99999-1111', 'Curitiba',       1),
  ('Fábio Nunes',     'fabio.nunes@exemplo.com',     '(51) 98123-4567', 'Porto Alegre',   1),
  ('Gabriela Alves',  'gabriela.alves@exemplo.com',  '(71) 99234-5678', 'Salvador',       1),
  ('Henrique Costa',  NULL,                          '(81) 98345-6789', 'Recife',         0);

-- Pedidos (1..10)
INSERT INTO tb_pedido (cod_cliente, dt_pedido, e_status, tx_obs) VALUES
  (1, DATE '2026-10-01', 'Enviado',   'Entregar na portaria'),
  (2, DATE '2026-10-03', 'Pago',      NULL),
  (1, DATE '2026-10-08', 'Pago',      'Cliente recorrente'),
  (3, DATE '2026-10-12', 'Enviado',   NULL),
  (4, DATE '2026-10-15', 'Cancelado', 'Desistiu da compra'),
  (5, DATE '2026-10-18', 'Aberto',    NULL),
  (6, DATE '2026-10-21', 'Pago',      NULL),
  (7, DATE '2026-10-24', 'Aberto',    'Retirar na loja'),
  (2, DATE '2026-10-27', 'Aberto',    NULL),
  (3, DATE '2026-10-28', 'Pago',      NULL);

-- Itens dos pedidos (valor unitário = preço do produto na venda)
INSERT INTO tb_pedido_item (cod_pedido, cod_produto, qt_item, vl_unitario) VALUES
  (1, 4, 1, 27.90), (1, 5, 2, 8.99), (1, 7, 1, 18.90),
  (2, 2, 3, 9.90),  (2, 1, 6, 2.50),
  (3, 12, 1, 16.90), (3, 13, 1, 19.90), (3, 7, 2, 18.90),
  (4, 8, 1, 34.90), (4, 6, 4, 4.79),
  (5, 15, 1, 15.90),
  (6, 9, 2, 6.99), (6, 10, 1, 8.49), (6, 11, 2, 3.29),
  (7, 3, 2, 8.50), (7, 14, 3, 2.79),
  (8, 4, 2, 27.90), (8, 5, 3, 8.99), (8, 6, 2, 4.79), (8, 2, 1, 9.90),
  (9, 1, 12, 2.50),
  (10, 7, 1, 18.90), (10, 12, 1, 16.90);

-- Lojas (1..4)
INSERT INTO tb_loja (nm_loja, nm_cidade, tx_endereco, flag_ativo) VALUES
  ('Loja Centro',        'São Paulo', 'Av. Central, 1000',        1),
  ('Loja Shopping Norte','São Paulo', 'Shopping Norte, piso L1',  1),
  ('Loja Campinas',      'Campinas',  'Rua das Palmeiras, 250',   1),
  ('Loja Online',        'São Paulo', 'Venda pela internet',      1);

-- Sortimento de cada loja (é o que o DoubleGrid "Produtos da loja" edita)
INSERT INTO tb_loja_produto (cod_loja, cod_produto) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 9), (1, 10), (1, 12),
  (2, 1), (2, 2), (2, 3), (2, 7), (2, 13),
  (3, 4), (3, 5), (3, 6), (3, 8), (3, 14), (3, 15),
  (4, 2), (4, 4), (4, 7), (4, 8);
