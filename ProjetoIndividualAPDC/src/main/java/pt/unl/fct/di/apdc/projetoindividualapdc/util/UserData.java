package pt.unl.fct.di.apdc.projetoindividualapdc.util;

public class UserData {
	
	public String username; //*
	public String password; //*
	
	public String email;    // *
	public String passwordconfirm;
	
	public String name;
	public String profile;  //
	
	public String morada;   //
	public String moradaComp;//
	
	public String localidade;//
	public String codigoPost;//
	
	public String nFixo;//
	public String nTlm;//
	
	public String role;
	public String state;
	
	public String oldPassword;

	public UserData() {}

	
	//Used in: CreateUser,
	public UserData(String username, String password, String email, String passwordconfirm, String name,
			String profile, String morada, String moradaComp, String localidade, String codigoPost, String nFixo,
			String nTlm, String role, String state) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.passwordconfirm = passwordconfirm;
		this.name = name;
		this.profile = profile;
		this.morada = morada;
		this.moradaComp = moradaComp;
		this.localidade = localidade;
		this.codigoPost = codigoPost;
		this.nFixo = nFixo;
		this.nTlm = nTlm;
		this.role = role;
		this.state = state;
	}
	
	//Used in: UpdateUser,
	public UserData(String username,String email, String name,
			String profile, String morada, String moradaComp, String localidade, String codigoPost, String nFixo,
			String nTlm) {
		this.username = username;
		this.email = email;
		this.name = name;
		this.profile = profile;
		this.morada = morada;
		this.moradaComp = moradaComp;
		this.localidade = localidade;
		this.codigoPost = codigoPost;
		this.nFixo = nFixo;
		this.nTlm = nTlm;
	}
	
	//Used in: UpdatePassword,
	public UserData(String oldPassword, String password, String passwordConfirm) {
		this.oldPassword = oldPassword;
		this.password = password;
		this.passwordconfirm = passwordConfirm;
	}
	
	//Used in: UpdateRole,
	public UserData(String username, String role) {
		this.username = username;
		this.role = role;
	}
	
}
