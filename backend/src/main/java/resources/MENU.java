package resources;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.sql.component.WidgetGet;

/**
 * Menu lateral: as 5 entidades do painel. Cada item só aponta para um MasterDetails do
 * COMPONENTS; a tela inteira (grid, adicionar, ações de linha) sai do componente.
 * O nome é lido na hora (getNm), porque o Refl só nomeia os componentes no boot.
 */
public final class MENU {

	private MENU() {
	}

	public record Item(WidgetGet component, String icon, String descricao, List<String> destaques) {
		public JSONObject toJSON() {
			return new JSONObject()
					.put("nm_resource", component.getNm())
					.put("nm_friendly", component.getNmFriendly())
					.put("type", component.getClass().getSimpleName())
					.put("icon", icon)
					.put("tx_descricao", descricao)
					.put("destaques", new JSONArray(destaques));
		}
	}

	public static final List<Item> ITENS = List.of(
			new Item(COMPONENTS.MD_CATEGORIA, "Tag",
					"Organize os produtos por categoria.",
					List.of("Grid", "ModalCreate", "ModalUpdate", "ModalDelete", "MasterDetails")),
			new Item(COMPONENTS.MD_PRODUTO, "Package",
					"Preço, estoque e categoria de cada produto.",
					List.of("Grid", "ModalCreate", "ModalUpdate", "ModalDelete", "Combo")),
			new Item(COMPONENTS.MD_CLIENTE, "Users",
					"Contatos dos clientes e o histórico de pedidos de cada um.",
					List.of("Grid", "ModalCreate", "ModalUpdate", "MasterDetails")),
			new Item(COMPONENTS.MD_PEDIDO, "Receipt",
					"Acompanhe os pedidos e seus itens. Selecione um pedido Aberto para marcar como pago.",
					List.of("Grid", "ModalCreate", "ModalUpdate", "MasterDetails", "Combo", "FetchModal")),
			new Item(COMPONENTS.MD_LOJA, "Storefront",
					"As lojas e os produtos vendidos em cada uma.",
					List.of("Grid", "ModalCreate", "ModalUpdate", "DoubleGrid")));
}
