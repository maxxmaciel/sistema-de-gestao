package framework.sql.component;

import java.sql.SQLException;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.servlet.helper.ReqParms;
import framework.sql.Select;
import resources.PARM;

/**
 * Mestre + detalhe: um cabeçalho (select do registro mestre, opcional), o grid de detalhe e o
 * ModalCreate do "Adicionar". Também é o componente das telas do menu: MD_CATEGORIA é um
 * MasterDetails sem cabeçalho (só o grid + o botão Adicionar).
 *
 * Parâmetros = os do cabeçalho + os do grid. Ex.: MD_PEDIDO_ITEM pede ?cod_pedido, então toda
 * linha com cod_pedido ganha a ação "Itens do pedido".
 */
public class MasterDetails extends ModalBase {
	protected final ModalCreate modalCreate;
	protected final Grid grid;

	public MasterDetails(String nmFriendly, Grid grid) {
		this(nmFriendly, null, grid, null);
	}

	public MasterDetails(String nmFriendly, Grid grid, ModalCreate modalCreate) {
		this(nmFriendly, null, grid, modalCreate);
	}

	public MasterDetails(String nmFriendly, Select select, Grid grid, ModalCreate modalCreate) {
		super(nmFriendly, select, null, new GridColumns(), null, null);
		this.grid = grid;
		this.modalCreate = modalCreate;
	}

	@Override
	public Cols getParms() {
		var result = new Cols();
		if (select != null) {
			result = result.union(select.getParms());
		}
		if (grid != null) {
			result = result.union(grid.getParms());
		}
		return result;
	}

	@Override
	public JSONObject exec(ReqParms parms) throws SQLException {
		var result = new JSONObject();
		var cps = new JSONArray();
		var resources = parms.getUser().resourcesMap;

		if (select != null) {
			cps.put(super.exec(parms)); // cabeçalho (type = "MasterDetails")
		}
		if (grid != null) {
			cps.put(grid.exec(parms)); // detalhe (type = "Grid")
		}

		if (modalCreate != null && resources.containsKey(modalCreate.getNm())) {
			var createInf = new JSONObject();
			createInf.put(PARM.NM_CREATE, modalCreate.getNm());
			createInf.put(PARM.NM_FRIENDLY_CREATE, modalCreate.getNmFriendly());
			result.put(PARM.CREATE_INF, createInf);
		}

		result.put(PARM.NAME, getNm());
		result.put(PARM.NM_FRIENDLY, getNmFriendly());
		result.put(PARM.TYPE, getClass().getSimpleName());
		result.put(PARM.COMPONENTS, cps);
		return result;
	}
}
