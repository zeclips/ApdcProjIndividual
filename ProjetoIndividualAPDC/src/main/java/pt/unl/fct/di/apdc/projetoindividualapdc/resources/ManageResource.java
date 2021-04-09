package pt.unl.fct.di.apdc.projetoindividualapdc.resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;

import com.google.api.client.json.Json;
import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.gson.Gson;

import pt.unl.fct.di.apdc.projetoindividualapdc.util.AuthToken;
//import pt.unl.fct.di.apdc.projetoindividualapdc.util.LoginData;
//import pt.unl.fct.di.apdc.projetoindividualapdc.util.UserData;
import pt.unl.fct.di.apdc.projetoindividualapdc.util.UpdateData;
import pt.unl.fct.di.apdc.projetoindividualapdc.util.UserData;

@Path("/manage")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class ManageResource {
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private static final Logger LOG = Logger.getLogger(RegisterResource.class.getName());
	private final Gson g = new Gson();
	
	public ManageResource() { }
	
	@DELETE
	@Path("/delete/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteUser(@PathParam("username") String username,AuthToken at) {
		LOG.fine("Attempt to delete user: " + username);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(at.tokenID);			
		
		Transaction txn = datastore.newTransaction();
		try {
			Entity token = txn.get(tokenKey);
			
			
			if(!tokenVerified(token,at)) {
				LOG.fine("Failed to delete user: " + username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}

			Key userKey = datastore.newKeyFactory().setKind("User").newKey(username);			
			Entity userToDelete = txn.get(userKey);

			if(userToDelete == null) {
				LOG.fine("Failed to delete user: " + username + " - User not found");
				txn.rollback();
				return Response.status(Status.BAD_REQUEST).build();	
			}
			if( Role.Clearance(at.role) > Role.Clearance(userToDelete.getString("role")) || at.username.equals(username)){
				txn.delete(userKey);

				Query<Entity> query = Query.newEntityQueryBuilder()
						.setKind("Tokens").setFilter(PropertyFilter.eq("username", username))
						.build();
				QueryResults<Entity> tasks = datastore.run(query);
				tasks.forEachRemaining(tokenToRemove -> {
					txn.delete(tokenToRemove.getKey());
				});
				
				LOG.fine("Successfully deleted user: " + username);
				txn.commit();
				return Response.ok().build();
			} else {
				LOG.fine("Failed to delete user: " + username + " - Not enought permission");
				txn.rollback();
				return Response.status(Status.FORBIDDEN).build();
			}
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
	
	@POST
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateUser(UpdateData data) {
		LOG.fine("Attempt to update user: " + data.authToken.username);

		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(data.authToken.tokenID);
		
		Transaction txn = datastore.newTransaction();
		try {
			Entity token = txn.get(tokenKey);
			if(!tokenVerified(token, data.authToken)) {
				LOG.fine("Failed to update user: " + data.authToken.username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}
			
			Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.authToken.username);
			Entity userToUpdate = txn.get(userKey);
			
			if(userToUpdate == null) {
				LOG.fine("Failed to update user: " + data.authToken.username + " - User not found");
				txn.rollback();
				return Response.status(Status.BAD_REQUEST).build();	
			}
			
			changeWrittenFields(userToUpdate,data.userData);
			if(!data.userData.email.matches(RegisterResource.EMAIL_REGEX)) {
				LOG.fine("Failed to update user: " + data.authToken.username + " - Email format is not accepted.");
				txn.rollback();
				return Response.status(Status.FORBIDDEN).build();
				}
			
				Entity newEntity = Entity.newBuilder(userKey)
						.set("email", data.userData.email)
						.set("password", userToUpdate.getString("password"))
						.set("name", data.userData.name)
						.set("profile", data.userData.profile)
						.set("morada", data.userData.morada)
						.set("moradaComplementar", data.userData.moradaComp)
						.set("localidade", data.userData.localidade)
						.set("codigoPostal", data.userData.codigoPost)
						.set("telefoneFixo", data.userData.nFixo)
						.set("telemovel", data.userData.nTlm)
						.set("role", userToUpdate.getString("role"))
						.set("state",userToUpdate.getString("state"))
						.build();
				
				
				txn.put(newEntity);
				LOG.fine("Successfully updated user: " + data.authToken.username);
				txn.commit();
				return Response.ok().build();
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
	
	private void changeWrittenFields(Entity userToUpdate, UserData user) {
		if(!(user.email != null && !user.email.isEmpty())) user.email = userToUpdate.getString("email");
		if(!(user.name != null && !user.name.isEmpty())) user.name = userToUpdate.getString("name");
		if(!(user.profile != null && !user.profile.isEmpty())) user.profile = userToUpdate.getString("profile");
		if(!(user.morada != null && !user.morada.isEmpty())) user.morada = userToUpdate.getString("morada");
		if(!(user.moradaComp != null && !user.moradaComp.isEmpty())) user.moradaComp = userToUpdate.getString("moradaComplementar");
		if(!(user.localidade != null && !user.localidade.isEmpty())) user.localidade = userToUpdate.getString("localidade");
		if(!(user.codigoPost != null && !user.codigoPost.isEmpty())) user.codigoPost = userToUpdate.getString("codigoPostal");
		if(!(user.nFixo != null && !user.nFixo.isEmpty())) user.nFixo = userToUpdate.getString("telefoneFixo");
		if(!(user.nTlm != null && !user.nTlm.isEmpty())) user.nTlm = userToUpdate.getString("telemovel");	
	}

	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response logOutUser(AuthToken at) {
		LOG.fine("Attempt to logOut user: " + at.username);
		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(at.tokenID);

		Transaction txn = datastore.newTransaction();
		try {
			Entity token = txn.get(tokenKey);
			
			if(!tokenVerified(token,at)) {
				LOG.fine("Failed to logOut user: " + at.username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}
			
			txn.delete(tokenKey);
			
			LOG.fine("Logged out user: " + at.username);
			txn.commit();
			return Response.ok().build();
			
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
/*	
	@PUT
	@Path("/password")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeUserPassword(AuthToken at) {
		LOG.fine("Attempt to change password of user: " + at.username);
		if(!tokenVerified(at)) {
			LOG.fine("Failed to change password of user: " + at.username + " - Autentication failed");
			return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
		}
		
		return Response.ok().build();
	}*/
	
	@PUT
	@Path("/role")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeUserRole(UpdateData data) {
		LOG.fine("Attempt to change password of user: " + data.userData.username);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(data.authToken.tokenID);

		Transaction txn = datastore.newTransaction();
		
		try {
			Entity token = txn.get(tokenKey);
			
			if(!tokenVerified(token,data.authToken)) {
				LOG.fine("Failed to change password of user: " + data.authToken.username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}

			Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.userData.username);	
			Entity userToRole = txn.get(userKey);
			
			if(userToRole == null) {
				LOG.fine("Failed to change role of user: " + data.userData.username + " - User not found");
				txn.rollback();
				return Response.status(Status.BAD_REQUEST).build();	
			}
			
			
			if( Role.Clearance(data.authToken.role) > Role.Clearance(userToRole.getString("role")) && Role.Clearance(data.authToken.role) > Role.Clearance(data.userData.role)){
				Entity newEntity = Entity.newBuilder(userKey)
						.set("email", userToRole.getString("email"))
						.set("password", userToRole.getString("password"))
						.set("name", userToRole.getString("name"))
						.set("profile", userToRole.getString("profile"))
						.set("morada", userToRole.getString("morada"))
						.set("moradaComplementar", userToRole.getString("moradaComplementar"))
						.set("localidade", userToRole.getString("localidade"))
						.set("codigoPostal", userToRole.getString("codigoPostal"))
						.set("telefoneFixo", userToRole.getString("telefoneFixo"))
						.set("telemovel", userToRole.getString("telemovel"))
						.set("role", data.userData.role)
						.set("state",userToRole.getString("state"))
						.build();
				
				
				txn.put(newEntity);
				LoginResource.tokens.remove(data.userData.username);
				LOG.fine("Successfully changed role of user: " + data.userData.username);
				txn.commit();
				return Response.ok().build();
			} else {
				LOG.fine("Failed to change role of user: " + data.userData.username + " - Not enought permission");
				txn.rollback();
				return Response.status(Status.FORBIDDEN).build();
			}
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
		
	@PUT
	@Path("/password")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeUserPassword(UpdateData data) {
		LOG.fine("Attempt to change password of user: " + data.authToken.username);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(data.authToken.tokenID);

		Transaction txn = datastore.newTransaction();
		
		try {
			Entity token = txn.get(tokenKey);
			
			if(!tokenVerified(token, data.authToken)) {
				LOG.fine("Failed to change password of user: " + data.authToken.username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}
			if(data.userData.password.length()<6) {return Response.status(Status.BAD_REQUEST).entity("Password is too short.").build();}
			
			data.userData.password = DigestUtils.sha512Hex(data.userData.password);
			data.userData.passwordconfirm = DigestUtils.sha512Hex(data.userData.passwordconfirm);
			
			if(!data.userData.password.equals(data.userData.passwordconfirm)) {return Response.status(Status.FORBIDDEN).entity("Passwords dont match.").build();}
			
			Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.authToken.username);			
			Entity userToChangePW = txn.get(userKey);

			if(userToChangePW == null) {
				LOG.fine("Failed to change password of user: " + data.authToken.username + " - User not found");
				txn.rollback();
				return Response.status(Status.BAD_REQUEST).build();	
			}
			
			String hashedPWD = userToChangePW.getString("password");
			if(!hashedPWD.equals(DigestUtils.sha512Hex(data.userData.oldPassword))) {
				LOG.fine("Failed to change password of user: " + data.authToken + " - Wrong Password");
				txn.rollback();
				return Response.status(Status.FORBIDDEN).build();
			}
		
				Entity newEntity = Entity.newBuilder(userKey)
						.set("email", userToChangePW.getString("email"))
						.set("password", data.userData.password)
						.set("name", userToChangePW.getString("name"))
						.set("profile", userToChangePW.getString("profile"))
						.set("morada", userToChangePW.getString("morada"))
						.set("moradaComplementar", userToChangePW.getString("moradaComplementar"))
						.set("localidade", userToChangePW.getString("localidade"))
						.set("codigoPostal", userToChangePW.getString("codigoPostal"))
						.set("telefoneFixo", userToChangePW.getString("telefoneFixo"))
						.set("telemovel", userToChangePW.getString("telemovel"))
						.set("role", userToChangePW.getString("role"))
						.set("state",userToChangePW.getString("state"))
						.build();
				
				
				txn.put(newEntity);
				LoginResource.tokens.remove(data.authToken.username);
				LOG.fine("Successfully changed password of user: " + data.authToken);
				txn.commit();
				return Response.ok().build();
			
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
	
	@PUT
	@Path("/state/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeUserState(@PathParam("username") String username, AuthToken at) {
		LOG.fine("Attempt to change state of user: " + username);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(at.tokenID);
		
		Transaction txn = datastore.newTransaction();
		try {
			Entity token = txn.get(tokenKey);
			
			if(!tokenVerified(token, at)) {
				LOG.fine("Failed to change state of user: " + username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).entity(LoginResource.tokens.toString()).build();	
			}
			
			Key userKey = datastore.newKeyFactory().setKind("User").newKey(username);			
			Entity userToState = txn.get(userKey);
			
			if(userToState == null) {
				LOG.fine("Failed to change state of user: " + username + " - User not found");
				txn.rollback();
				return Response.status(Status.BAD_REQUEST).build();	
			}
			
			String changeTo = LoginResource.ENABLED;
			if(userToState.getString("state").equals(LoginResource.ENABLED)) {
				changeTo = LoginResource.DISABLED;
			} 
			
			if( Role.Clearance(at.role) > Role.Clearance(userToState.getString("role"))){
				Entity newEntity = Entity.newBuilder(userKey)
						.set("email", userToState.getString("email"))
						.set("password", userToState.getString("password"))
						.set("name", userToState.getString("name"))
						.set("profile", userToState.getString("profile"))
						.set("morada", userToState.getString("morada"))
						.set("moradaComplementar", userToState.getString("moradaComplementar"))
						.set("localidade", userToState.getString("localidade"))
						.set("codigoPostal", userToState.getString("codigoPostal"))
						.set("telefoneFixo", userToState.getString("telefoneFixo"))
						.set("telemovel", userToState.getString("telemovel"))
						.set("role", userToState.getString("role"))
						.set("state",changeTo)
						.build();
				
				
				txn.put(newEntity);
				LoginResource.tokens.remove(username);
				LOG.fine("Successfully changed state of user: " + username);
				txn.commit();
				return Response.ok().build();
			} else {
				LOG.fine("Failed to change state of user: " + username + " - Not enought permission");
				txn.rollback();
				return Response.status(Status.FORBIDDEN).build();
			}
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
	

	@POST
	@Path("/getuser/{username}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getUser(@PathParam("username") String username, AuthToken at) {
		LOG.fine("Attempt to search user: " + username);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(at.tokenID);
		
		Transaction txn = datastore.newTransaction();
		try {
			Entity token = txn.get(tokenKey);
			
			if(!tokenVerified(token, at)) {
				LOG.fine("Failed to search user: " + username + " - Autentication failed");
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}
			
			if(Role.Clearance(at.role)>0) {
				Key userKey = datastore.newKeyFactory().setKind("User").newKey(username);			
				Entity user = datastore.get(userKey);
				if(user == null) {
					LOG.fine("Failed to search user: " + username + " - User not found");
					txn.rollback();
					return Response.status(Status.GONE).entity("Failed to search user: " + username + " - User not found").build();	
				}
				
				LOG.fine("Successfully searched user: " + username);
				txn.commit();
				return Response.ok(g.toJson(user.getProperties())).build();
			} else {
				LOG.fine("Failed to search user: " + at.username + " - Not enought permission");
				txn.rollback();
				return Response.status(Status.FORBIDDEN).build();	
			}
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	
	}
	
	//for tests only
	@POST
	@Path("/checklogged")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response checkUserLogged(AuthToken at) {
		LOG.fine("Check login session of user: " + at.username);

		Key tokenKey = datastore.newKeyFactory().setKind("Token").newKey(at.tokenID);
		
		Transaction txn = datastore.newTransaction();
		try {
			Entity token = txn.get(tokenKey);
			
			if(!tokenVerified(token, at)) {
				LOG.fine("No session in place for: " + at.username);
				txn.rollback();
				return Response.status(Status.NETWORK_AUTHENTICATION_REQUIRED).build();	
			}
			
			LOG.fine("Session confirmed for: " + at.username);
			txn.commit();
			return Response.ok().build();
			
		} catch (Exception e) {
			txn.rollback();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		} finally {
			if(txn.isActive()) {
				txn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Transaction did not commit").build();
			}
		}
	}
	
	private boolean tokenVerified(Entity at,AuthToken recievedToken) {
		return(at!=null && recievedToken != null && at.getKey().getName().equals(recievedToken.tokenID) && at.getString("username").equals(recievedToken.username) && recievedToken.expirationData > System.currentTimeMillis());
			
	}
}