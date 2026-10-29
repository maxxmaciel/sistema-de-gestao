import { Components } from "@/components/Components"
import type { PropsGridsAction } from "@/components/Components/CustomizedComponents"
import { CustomButton } from "@/components/CustomButton"
import type { IRespUpdate } from "@/contexts/AppContext/interfaces"
import { Std } from "@/lib/std"
import { CurrencyDollar } from "@phosphor-icons/react"
import { useRef, useState } from "react"

/** Resposta da sp_pagar_pedido: além de linhas_afetadas/msg, traz o total e os itens. */
interface IRespPagarPedido extends IRespUpdate {
  data?: {
    linhas_afetadas?: number
    msg?: string
    vl_total?: number | null
    qtd_itens?: number | null
  }[]
}

/**
 * Ação NÃO genérica, só da tela de Pedidos (registrada em CustomizedComponents):
 *  1. CONDIÇÃO   o botão só aparece com um pedido "Aberto" selecionado;
 *  2. FETCHMODAL ao clicar, abre o FetchModal, que já dispara a gravação com os parâmetros;
 *  3. TRATATIVA  onFetchSuccess decide o que é erro técnico, recusa de regra e sucesso, e monta a
 *                mensagem com o que a SP devolveu (total e itens).
 */
export function PedidoActionsBar({ rowSelected, refetch }: PropsGridsAction) {
  // A linha é "congelada" no clique: se a seleção mudar com o modal aberto, os parâmetros não mudam.
  const [pedido, setPedido] = useState<Record<string, any>>()
  const pagou = useRef(false)

  const podePagar = rowSelected?.e_status === "Aberto"

  return (
    <>
      {podePagar && (
        <CustomButton
          text={`Marcar pedido ${rowSelected?.cod_pedido} como pago`}
          color="blue"
          Icon={CurrencyDollar}
          id="button_pagar_pedido"
          onClick={() => {
            pagou.current = false
            setPedido(rowSelected)
          }}
        />
      )}

      <Components.FetchModal<IRespPagarPedido>
        open={Boolean(pedido)}
        title={`Pagamento do pedido ${pedido?.cod_pedido ?? ""}`}
        url="c"
        method="post"
        params={{ a: "c_up", nm_component: "A_PAGAR_PEDIDO", cod_pedido: pedido?.cod_pedido }}
        onClose={() => {
          setPedido(undefined)
          // Só recarrega o grid se algo mudou de fato.
          if (pagou.current) refetch()
        }}
        onFetchSuccess={(fetch, setResponseFetch, _close, setResponseErrorFetch) => {
          const resp = fetch.data
          const row = resp?.data?.[0]

          // 1. Erro técnico: a SP lançou exceção (o CallUpdate devolve success "false").
          if (resp?.success === false || resp?.success === "false") {
            setResponseErrorFetch(resp.msg ?? "Não foi possível gravar")
            return
          }

          // 2. Recusa de regra de negócio: a SP respondeu, mas não alterou nada.
          if (!row || row.linhas_afetadas === 0) {
            setResponseErrorFetch(row?.msg ?? "O pedido não foi alterado")
            return
          }

          // 3. Sucesso: mensagem montada com o que a SP devolveu além do msg.
          pagou.current = true
          const itens = row.qtd_itens ?? 0
          setResponseFetch(
            `${row.msg}: ${itens} ${itens === 1 ? "item" : "itens"}, total ${Std.formatToBRL(row.vl_total)}.`
          )
        }}
      />
    </>
  )
}
