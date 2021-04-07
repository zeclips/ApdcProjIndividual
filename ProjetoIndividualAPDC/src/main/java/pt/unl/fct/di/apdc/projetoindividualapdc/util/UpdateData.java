package pt.unl.fct.di.apdc.projetoindividualapdc.util;

public class UpdateData {
	
	public AuthToken authToken;
	public UserData userData;
	
	public UpdateData() {}
	
	public UpdateData(AuthToken at, UserData uData) {
		authToken = at;
		userData = uData;
		
	}
}
