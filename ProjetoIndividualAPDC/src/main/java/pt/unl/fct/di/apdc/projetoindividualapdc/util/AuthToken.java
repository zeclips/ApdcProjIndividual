package pt.unl.fct.di.apdc.projetoindividualapdc.util;

import java.util.UUID;

public class AuthToken {
	
	public static final long EXPIRATION_TIME = 1000*60*60*2; //2h
	
	public String username;
	public String tokenID;
	public String role;
	public long creationData;
	public long expirationData;
	
	public AuthToken() {}
	
	public AuthToken(String username, String role) {
		this.username = username;
		this.tokenID = UUID.randomUUID().toString();
		this.role = role;
		this.creationData = System.currentTimeMillis();
		this.expirationData = this.creationData + AuthToken.EXPIRATION_TIME;
	}
}