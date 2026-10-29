package framework.sql.component;

import org.json.JSONObject;

import framework.man.Man;
import framework.man.NamedFriendly;
import resources.PARM;
import resources.S;
import util.Util;

/**
 * Definição de um campo (o "dicionário" do FIELD). Declarado uma vez, vale para todo SELECT que
 * devolver uma coluna com esse nome: nome amigável, se é chave, tipo de exibição e validação.
 */
public class Col extends NamedFriendly {

	public enum Type {
		MONETARIO(PARM.MONETARIO), BOOLEAN(PARM.BOOLEAN), DATE(PARM.DATE), DATETIME(PARM.DATETIME),
		EMAIL(PARM.EMAIL), TELEFONE(PARM.TELEFONE), OBS(PARM.OBS), ENUM(PARM.ENUM);

		private final String value;

		Type(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}
	}

	private final Type type;
	public final boolean pk;
	protected final Validator validator;
	protected String helper = S.EMPTY;

	public Col(String nmField, String nmFriendly) {
		this(nmField, nmFriendly, null, false, null, true);
	}

	public Col(String nmField, String nmFriendly, boolean pk) {
		this(nmField, nmFriendly, null, pk, null, true);
	}

	public Col(String nmField, String nmFriendly, Type type) {
		this(nmField, nmFriendly, type, false, null, true);
	}

	public Col(String nmField, String nmFriendly, Validator validator) {
		this(nmField, nmFriendly, null, false, validator, true);
	}

	public Col(String nmField, String nmFriendly, Type type, Validator validator) {
		this(nmField, nmFriendly, type, false, validator, true);
	}

	protected Col(String nmField, String nmFriendly, Type type, boolean pk, Validator validator, boolean addToColMan) {
		super(nmField, nmFriendly);
		this.type = type;
		this.pk = pk;
		this.validator = validator;
		if (addToColMan) {
			Man.i().getColMan().add(this);
		}
	}

	/** Col "anônimo": parâmetro de SQL ou coluna sem definição no FIELD. Não entra no dicionário. */
	public static Col internal(String nmField) {
		return new Col(nmField, Util.properCase(nmField), null, false, null, false);
	}

	public Col withHelper(String helper) {
		this.helper = helper;
		return this;
	}

	public Type getType() {
		return type;
	}

	public String getHelper() {
		return helper;
	}

	public JSONObject buildInfoCol(JSONObject json) {
		json.put(PARM.FIELD, getNm());
		json.put(PARM.HEADERNAME, getNmFriendly());
		json.put(PARM.PK, pk);
		json.put(PARM.HELPER, helper);
		json.put(PARM.SHOWFILTER, true);

		if (type != null) {
			json.put(PARM.TYPE, type.getValue());
		}
		if (validator != null) {
			json.put(PARM.VALIDATOR, validator.buildJson());
		}
		return json;
	}
}
