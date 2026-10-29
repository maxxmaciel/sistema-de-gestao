# Framework genérico: demonstração

Projeto de demonstração do framework de componentes genéricos: telas de cadastro inteiras
(grid, incluir, alterar, excluir, mestre-detalhe e vínculo N:N) declaradas em **uma linha de Java
cada** e desenhadas por **componentes React genéricos** que só interpretam o JSON do backend.

- **Back:** Java 17, servlets (Tomcat embutido) e uma hierarquia de componentes genéricos.
- **Front:** React 19 + TypeScript + MUI + TanStack Table.
- **Dados:** mockados. Não há banco instalado: um H2 **em memória** sobe com os dados de
  `backend/src/main/resources/mock` a cada start e some ao parar. As "stored procedures" são métodos
  Java (`framework.mock.Procedures`).
- **Login:** aberto. Qualquer usuário e senha entram (a senha não é validada); em branco entra como
  "Visitante".

---

## Como rodar

| O quê | Comando | Endereço |
|---|---|---|
| Back em modo dev | `dev-back.cmd` | http://localhost:8080 (API em `/api`) |
| Front em modo dev | `dev-front.cmd` | **http://localhost:5173** |
| Build completo (front dentro do jar) | `build.cmd` | gera `backend\target\framework-generico.jar` |
| Rodar o pacote | `start.cmd` | **http://localhost:8080** |

Em dev, rode os dois `dev-*.cmd` (cada um no seu terminal). O Vite manda `/api` para o backend.
Os scripts acham o Maven no PATH ou o que já existe em `%USERPROFILE%\.m2\wrapper`.

> As versões do Vite (6.4.3) e do Rollup (4.60.2) estão fixadas: em máquinas com o Windows
> Application Control ligado, binários nativos novos do Rollup podem ser bloqueados, e essas versões
> já são aceitas.

---

## Roteiro sugerido para a demonstração

1. **Painel**: as 5 entidades. Rodando em modo dev (`dev-front.cmd`), abra o **Inspetor de API**
   (canto superior direito) e deixe aberto ao lado: cada clique mostra o JSON que montou a tela. No
   build publicado o Inspetor não aparece, e as telas não mostram nomes técnicos (só a URL usa
   `/r/md_produto`).
2. **Categorias → Adicionar** com o nome "Bebidas": o backend recusa (`IntegrityValidator`). Salve
   vazio: o front recusa (regras do `FIELD` viradas em Zod).
3. **Categorias → ⋮ numa linha**: as ações aparecem sozinhas. "Produtos da categoria" é um
   `MasterDetails`; o "Editar categoria" do cabeçalho também foi derivado.
4. **Categorias → ⋮ → Excluir** em "Bebidas": a SP recusa ("a categoria tem produtos").
5. **Produtos → ⋮ → Editar produto**: combo de categoria (as opções vêm de outro grid).
6. **Pedidos → ⋮**: cinco ações sem nenhuma configuração na tela (editar cliente, editar pedido,
   pedidos do cliente, itens do pedido, adicionar item). Abra "Itens do pedido" e adicione um item.
7. **Lojas → ⋮ → Produtos da loja**: `DoubleGrid`. Mova produtos entre as listas e salve.
8. **Pedidos → clique num pedido Aberto**: aparece o botão "Marcar pedido N como pago", a ação
   própria com `FetchModal`. Crie um pedido sem itens e tente pagar: a SP recusa e a tela trata.
9. Mostre que existe **uma página** para os 5 cadastros: `frontend/src/pages/GenericGrid/index.tsx`.

---

## Mapa do código

### Back-end (`backend/src/main/java`)

**Declaração (é aqui que uma tela nasce):**

| Arquivo | Papel |
|---|---|
| `resources/FIELD.java` | Dicionário de campos: nome amigável, chave, tipo e validação de cada coluna, **uma vez** |
| `resources/SQL.java` | Todo SQL, com parâmetros nomeados (`?cod_categoria`) |
| `resources/COMPONENTS.java` | Todas as telas. Uma linha por componente; o **nome do campo** é o nome do componente |
| `resources/MENU.java` | As 5 entradas do menu (cada uma aponta para um `MasterDetails`) |

**Framework (`framework/sql/component`): a herança**

```
Component                                   nome + nome amigável + parâmetros
├── Statement ─┬─ Select ── SelectWithMessage
│              └─ StatementSet ─┬─ CallUpdate    (CALL sp_x(...))
│                               └─ Delete        (SQL direto)
└── Widget ─┬─ Combo / Combos / IntegrityValidator
            └─ WidgetGet                       select + set + colunas + DERIVAÇÃO
               ├── Grid
               └── ModalBase                   + combos (só ModalBase vira ação de linha)
                   ├── ModalCreate
                   ├── ModalUpdate
                   ├── ModalDelete             (só por withExplicitDerived)
                   ├── MasterDetails           cabeçalho + Grid + ModalCreate
                   └── DoubleGrid              cabeçalho + 2 Grids + setDelete/setInsert
```

| Peça | Onde | O que mostrar |
|---|---|---|
| Registro por reflexão | `framework/refl/Refl.java` | O nome do campo static vira o nome do componente; não existe tabela de rotas |
| Servlet único | `framework/servlet/C.java` | `a=component` lê, `a=c_up` grava, para QUALQUER componente |
| Despacho por ação | `framework/servlet/helper/ServletBase.java` | Tabela de ações; `cod_projeto` sempre vem da sessão, nunca da request |
| Conferência da chamada | `framework/servlet/helper/ReqParms.java` | Recurso liberado para o usuário? Veio todo parâmetro que o SQL pede? |
| Derivação automática | `WidgetGet.buildDerived` | Componente cujos parâmetros existem nas colunas do grid vira ação de linha |
| JDBC | `framework/sql/Command.java` | Único ponto que toca o banco; metadata do SELECT + FIELD viram o JSON das colunas |
| Mocks | `framework/mock/*`, `resources/mock/*.sql` | Dados fictícios e as SPs em Java |

### Front-end (`frontend/src`)

| Arquivo | Papel |
|---|---|
| `hooks/useFetchData.ts` | `useFetchData`, `axiosGet`, `axiosPost` e os interceptors. O topo do arquivo explica **quando usar cada um** |
| `components/Components/index.tsx` | Kit genérico: `Modal`, `FormData`, `ModalFormData`, `ModalFormDataFetch`, `FetchModal`, `FieldSet`, `ButtonListModal`, `PromiseErrorModal` |
| `lib/std.ts` | `Std`: formatação e utilidades sem framework (moeda, datas, busca sem acento) |
| `lib/utils.ts` | Utils **do framework**: `ensureFields` (colunas → formulário), `ensureComponent`, `ensureAllPk`, `parseUpdateResponse` |
| `components/Zod/index.ts` | Regras do `Validator` Java → schema Zod |
| `contexts/ModalContext/*` | Pilha de modais + as modais genéricas `ModalCreate`, `ModalUpdate`, `ModalDelete`, `MasterDetails`, `DoubleGrid` |
| `components/Modais/index.ts` | Registro: o `type` que o Java manda (`getClass().getSimpleName()`) escolhe o componente React |
| `components/ModalDerivation/index.ts` | Ação escolhida na linha → `Modais.<Tipo>.open(...)` com as chaves da linha |
| `components/DerivableGridSection` | Grid + Adicionar + ações de linha (a mesma peça na tela e dentro do MasterDetails) |
| `components/Grid/*` | Grid (TanStack) e a fábrica de colunas por tipo |
| `pages/GenericGrid/index.tsx` | **A única página de cadastro** dos 5 menus |
| `components/ApiInspector` | Inspetor de API (cada request com o que foi enviado e o JSON que voltou) |

---

## O caminho de um clique ("Editar produto")

```
Grid de Produtos (G_PRODUTO) veio com derived: [{ name: "U_PRODUTO", type: "ModalUpdate", keys: ["cod_produto"] }, ...]
  └─ ⋮ na linha → openDerivation → Modais.ModalUpdate.open({ params: { cod_produto: 11 } })
       └─ ModalFormDataFetch → useFetchData → axiosGet("c", { a: "component", nm_component: "U_PRODUTO", cod_produto: 11 })
            └─ servlet C → ReqParms (recurso ok? cod_produto veio?) → ModalUpdate.exec
                 └─ SQL.S_PRODUTO + FIELD → { columns, data, caption: { parms, combos } }
       └─ ensureFields monta o formulário (combo de categoria = grid G_COMBO_CATEGORIA)
       └─ Salvar → Zod → FetchModal → axiosPost("c", { a: "c_up", nm_component: "U_PRODUTO", ... })
            └─ servlet C → ModalUpdate.execStatement → CALL sp_alterar_produto(...) → { linhas_afetadas, msg }
```

---

## Quando o genérico não basta: ação própria com FetchModal

Exemplo em Pedidos, o botão **"Marcar pedido N como pago"**:

| Camada | Arquivo | O que faz |
|---|---|---|
| SP (mock) | `Procedures.spPagarPedido` + `procedures.sql` | Só paga pedido Aberto e com itens; devolve `linhas_afetadas`, `msg`, `vl_total`, `qtd_itens` |
| SQL | `SQL.U_PAGAR_PEDIDO` | `CALL sp_pagar_pedido(?cod_pedido)` |
| Componente | `COMPONENTS.A_PAGAR_PEDIDO` | `WidgetGet`, **não** `ModalBase`: não vira ação derivada, mas continua passando pelo `C`/`ReqParms` |
| Registro da tela | `components/Components/CustomizedComponents.tsx` | `GenericGridActionsBar = { MD_PEDIDO: PedidoActionsBar }` |
| Botão + FetchModal | `components/CustomActions/PedidoActionsBar.tsx` | Condição (status Aberto), parâmetros e a tratativa da resposta |

A tratativa no `onFetchSuccess` separa três casos:
1. **Erro técnico** (`success: "false"`, a SP lançou exceção): mostra como erro.
2. **Recusa de regra** (`linhas_afetadas = 0`): mostra o `msg` da SP como erro.
3. **Sucesso**: monta a mensagem com `qtd_itens` e `vl_total` (`Std.formatToBRL`) e marca para
   dar refetch no grid ao fechar.

A página continua genérica: o `GenericGridMenu` só procura se a tela tem barra própria
(`GenericGridActionsBar[nm_resource]`) e a encaixa ao lado do "Adicionar".

---

## Criar uma tela nova

1. `FIELD`: os campos novos (se houver).
2. `SQL`: `S_X`, `S_X_DEF`, `I_X`/`U_X` e a SP (aqui: um método em `Procedures` + `CREATE ALIAS`).
3. `COMPONENTS`: `G_X`, `C_X`, `U_X` e `MD_X`. Para virar menu, uma linha no `MENU`.

No front não muda nada.
