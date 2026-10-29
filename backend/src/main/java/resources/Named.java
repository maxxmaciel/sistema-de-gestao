package resources;

public class Named implements INamed {

	protected String nm;

	public Named(String nm) {
		this.nm = nm == null ? S.EMPTY : nm;
	}

	@Override
	public String getNm() {
		return nm;
	}

	@Override
	public void setNm(String nm) {
		this.nm = nm;
	}
}
