package framework.sql;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.time.format.DateTimeFormatter;

import org.json.JSONArray;
import org.json.JSONObject;

import framework.mock.MockDatabase;
import framework.sql.component.GridColumn;
import framework.sql.component.GridColumns;
import resources.PARM;
import util.Util;

/**
 * Único ponto do framework que encosta em JDBC. Daqui pra cima ninguém sabe se o banco é MySQL
 * (produção) ou o H2 em memória com dados mockados (esta demonstração): só muda getConnection.
 */
public final class Command {
	private static final DateTimeFormatter DATETIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	private Command() {
	}

	private static Connection getConnection() throws SQLException {
		return MockDatabase.getConnection();
	}

	/** SELECT -> { columns: [metadata + definição do FIELD], data: [linhas] }. */
	public static JSONObject execRSJsonArrayGrid(String sql, GridColumns gridColumns, Object... parms) {
		try (Connection c = getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
			bind(ps, parms);
			try (ResultSet rs = ps.executeQuery()) {
				return createJsonFromResultSetGrid(rs, gridColumns);
			}
		} catch (SQLException e) {
			throw new IllegalStateException("Erro ao executar consulta: " + e.getMessage(), e);
		}
	}

	/** CALL sp(...) -> { data: [linhas da última consulta da SP] }. */
	public static JSONObject execCallRSJsonArray(String sql, Object... parms) throws SQLException {
		try (Connection c = getConnection(); CallableStatement call = c.prepareCall(sql)) {
			bind(call, parms);
			var rows = new JSONArray();
			try (ResultSet rs = call.executeQuery()) {
				var md = rs.getMetaData();
				while (rs.next()) {
					rows.put(createJsonFromResultSetRow(rs, md));
				}
			}
			return new JSONObject().put(PARM.DATA, rows);
		}
	}

	/** DELETE/UPDATE direto -> { data: [{ linhas_afetadas }] }. */
	public static JSONObject execUpdate(String sql, Object... parms) throws SQLException {
		try (Connection c = getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
			bind(ps, parms);
			int n = ps.executeUpdate();
			var row = new JSONObject().put(PARM.LINHAS_AFETADAS, n);
			return new JSONObject().put(PARM.DATA, new JSONArray().put(row));
		}
	}

	/** Valor vazio vira NULL: o formulário manda "" para campo não preenchido. */
	static void bind(PreparedStatement ps, Object... parms) throws SQLException {
		for (int i = 0; i < parms.length; i++) {
			Object v = parms[i];
			if (v == null || (v instanceof String s && s.isBlank())) {
				ps.setNull(i + 1, Types.VARCHAR);
			} else {
				ps.setObject(i + 1, v);
			}
		}
	}

	private static JSONObject createJsonFromResultSetGrid(ResultSet rs, GridColumns gridColumns) throws SQLException {
		var md = rs.getMetaData();
		var result = new JSONObject();
		result.put(PARM.COLUMNS, getGridColumns(md, gridColumns));

		var rows = new JSONArray();
		while (rs.next()) {
			rows.put(createJsonFromResultSetRow(rs, md));
		}
		result.put(PARM.DATA, rows);
		return result;
	}

	/**
	 * Coluna do resultado + o que o FIELD diz dela (nome amigável, pk, tipo, validação).
	 * É aqui que "SELECT nm_categoria" vira { field, headerName: "Categoria", validator... }.
	 */
	private static JSONArray getGridColumns(ResultSetMetaData md, GridColumns gcs) throws SQLException {
		var result = new JSONArray();
		for (int i = 1; i <= md.getColumnCount(); ++i) {
			GridColumn gc = gcs.ensure(columnKey(md, i));
			var col = new JSONObject();
			col.put(PARM.TYPE, Util.SQLTypename(md.getColumnType(i)));
			gc.buildInfoGridColumn(col);
			result.put(col);
		}
		return result;
	}

	static JSONObject createJsonFromResultSetRow(ResultSet rs, ResultSetMetaData md) throws SQLException {
		var o = new JSONObject();
		for (int i = 1; i <= md.getColumnCount(); ++i) {
			String key = columnKey(md, i);
			int t = md.getColumnType(i);

			if (rs.getObject(i) == null) {
				// JSONObject.put(k, null) REMOVE a chave; o formulário precisa dela presente.
				o.put(key, JSONObject.NULL);
			} else if (Util.isSQLIntType(t)) {
				o.put(key, rs.getLong(i));
			} else if (Util.isSQLDoubleType(t)) {
				o.put(key, rs.getBigDecimal(i));
			} else if (t == Types.DATE) {
				o.put(key, rs.getDate(i).toString());
			} else if (t == Types.TIMESTAMP || t == Types.TIMESTAMP_WITH_TIMEZONE) {
				o.put(key, rs.getTimestamp(i).toLocalDateTime().format(DATETIME));
			} else if (t == Types.BOOLEAN || t == Types.BIT) {
				o.put(key, rs.getBoolean(i) ? 1 : 0);
			} else {
				o.put(key, rs.getString(i));
			}
		}
		return o;
	}

	private static String columnKey(ResultSetMetaData md, int i) throws SQLException {
		String label = md.getColumnLabel(i);
		return label != null && !label.isBlank() ? label : md.getColumnName(i);
	}
}
