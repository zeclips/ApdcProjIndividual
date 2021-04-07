package pt.unl.fct.di.apdc.projetoindividualapdc.resources;

public final class Role {
//	private static final String USER = "USER";
	private static final String GBO = "GBO";
	private static final String GA = "GA";
	private static final String SU = "SU";
	
	
	static int Clearance(String role) {
		switch(role.toUpperCase()) {
			case SU: return 3;
			case GA: return 2;
			case GBO: return 1;
			default: return 0;
		}
	}
}
