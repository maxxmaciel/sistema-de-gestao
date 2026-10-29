package util;

import java.sql.Types;

import resources.PARM;
import resources.S;

public final class Util {

	private Util() {
	}

	/** nm_categoria -> "Nm Categoria". Nome amigável de reserva para coluna sem Col no FIELD. */
	public static String properCase(String s) {
		if (s == null || s.isBlank()) {
			return S.EMPTY;
		}
		var sb = new StringBuilder();
		for (String part : s.split("_")) {
			if (part.isEmpty()) {
				continue;
			}
			if (sb.length() > 0) {
				sb.append(' ');
			}
			sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1).toLowerCase());
		}
		return sb.toString();
	}

	/** Tipo JDBC -> tipo que o front entende. O Col do FIELD pode sobrescrever (ex.: monetario). */
	public static String SQLTypename(int columnType) {
		if (isSQLIntType(columnType)) {
			return PARM.INT;
		} else if (isSQLDoubleType(columnType)) {
			return PARM.DOUBLE;
		} else if (columnType == Types.TIMESTAMP || columnType == Types.TIMESTAMP_WITH_TIMEZONE) {
			return PARM.DATETIME;
		} else if (columnType == Types.TIME) {
			return PARM.TIME;
		} else if (columnType == Types.DATE) {
			return PARM.DATE;
		} else if (columnType == Types.BOOLEAN || columnType == Types.BIT) {
			return PARM.BOOLEAN;
		}
		return S.EMPTY;
	}

	public static boolean isSQLIntType(int t) {
		return t == Types.INTEGER || t == Types.SMALLINT || t == Types.TINYINT || t == Types.BIGINT;
	}

	public static boolean isSQLDoubleType(int t) {
		return t == Types.DECIMAL || t == Types.NUMERIC || t == Types.DOUBLE || t == Types.FLOAT || t == Types.REAL;
	}
}
