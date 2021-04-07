package pt.unl.fct.di.apdc.projetoindividualapdc.resources;
import com.google.cloud.datastore.*;

import pt.unl.fct.di.apdc.projetoindividualapdc.util.UserData;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;




@Path("/register")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RegisterResource {
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	public static final String EMAIL_REGEX = "^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
	private static final Logger LOG = Logger.getLogger(RegisterResource.class.getName());
	
	public RegisterResource() {}

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registUserv3 (UserData data) {	
		LOG.fine("Attempt to register user: " + data.username);
		if(!data.password.equals(data.passwordconfirm)) {return Response.status(Status.FORBIDDEN).entity("Passwords dont match.").build();}
		if(data.password.length()<6) {return Response.status(Status.FORBIDDEN).entity("Password is too short.").build();}
		
		if(!data.email.matches(EMAIL_REGEX)) {return Response.status(Status.FORBIDDEN).entity("Email format is not accepted.").build();}
		
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);		
		Transaction txn = datastore.newTransaction();
		try {
			
			Entity user = txn.get(userKey);
			if(user != null) {
				txn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User already exists.").build();
			}
			
			user = Entity.newBuilder(userKey)
					.set("email", data.email)
					.set("password", DigestUtils.sha512Hex(data.password))
					.set("name", data.name)
					.set("profile", "Público")
					.set("morada", data.morada)
					.set("moradaComplementar", data.moradaComp)
					.set("localidade", data.localidade)
					.set("codigoPostal", data.codigoPost)
					.set("telefoneFixo", data.nFixo)
					.set("telemovel", data.nTlm)
					.set("role", "USER")
					.set("state",LoginResource.ENABLED)
					.build();
			
			txn.add(user);
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

	
	
}
	

