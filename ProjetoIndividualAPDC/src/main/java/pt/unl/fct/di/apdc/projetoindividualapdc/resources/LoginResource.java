package pt.unl.fct.di.apdc.projetoindividualapdc.resources;
import com.google.cloud.datastore.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
//import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
//import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;

import com.google.gson.Gson;

import pt.unl.fct.di.apdc.projetoindividualapdc.util.AuthToken;
import pt.unl.fct.di.apdc.projetoindividualapdc.util.LoginData;

//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import javax.ws.rs.core.HttpHeaders;




@Path("/login")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class LoginResource {
	public static final String ENABLED = "ENABLED";
	public static final String DISABLED = "DISABLED";
	
	
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	private static final Logger LOG = Logger.getLogger(LoginResource.class.getName());
	
	static Map<String, AuthToken> tokens = new HashMap<String, AuthToken>();
	
	private final Gson g = new Gson();
	
	public LoginResource() {}

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response loginUser(LoginData data) {
		LOG.fine("Attempt to login user: " + data.username);
		
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);			
		Entity user = datastore.get(userKey);
		if(user != null) {
			String hashedPWD = user.getString("password");
			if(hashedPWD.equals(DigestUtils.sha512Hex(data.password))) {
				if(user.getString("state").equals(ENABLED)) {
					AuthToken at = new AuthToken(data.username,user.getString("role"));
					
					tokens.put(data.username, at);
					LOG.fine("Success login user: " + data.username);
					return Response.ok(g.toJson(at)).build();
				} else {
					LOG.fine("Attempt to log disabled user: " + data.username);
					return Response.status(Status.FORBIDDEN).build();
				}
			} else {
				LOG.fine("Wrong password in login user: " + data.username);
				return Response.status(Status.FORBIDDEN).build();
			}
			
		}else {
			LOG.fine("Failed login attempt, cant find username: " + data.username);
			return Response.status(Status.FORBIDDEN).build();
		}
	}

}
