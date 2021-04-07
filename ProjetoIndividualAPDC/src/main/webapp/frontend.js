xmlhttp = new XMLHttpRequest();
let url = "https://avaliacaoindividualapdc.appspot.com"

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4){
        if(xmlhttp.status == 200) { 
           var text = JSON.parse(xmlhttp.responseText);
            setCookie("loginToken", text, 1);
            var cookie = document.cookie;
            var role = cookie.split(",")[1].trim();
        } else  {
            alert("Login Confirmation failed")
        }
    }
}


var frontend = {    
    login: new Promise( function(username,password){
        var loginCredentialsJSON = {
            "username":username,
            "password":password
        };

        xmlhttp.open("POST",url+"/rest/login/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(loginCredentialsJSON); 
    }),
    register: function(registCredentialsJSON){
        xmlhttp.open("POST",url+"/rest/register/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(registCredentialsJSON); 
    },
    checkLocked: function(authTokenJSON){
        xmlhttp.open("POST",url+"/rest/manage/checklogged/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(authTokenJSON); 
    },
    toggleActive: function(authTokenJSON,userAffected){
        xmlhttp.open("PUT",url+"/rest/manage/state/"+userAffected ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(authTokenJSON); 
    },
    updateRole: function(updateDataJSON){
        xmlhttp.open("PUT",url+"/rest/manage/role/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(updateDataJSON); 
    },
    updateUser: function(updateDataJSON){
        xmlhttp.open("POST",url+"/rest/manage/update/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(updateDataJSON); 
    },
    deleteUser: function(authTokenJSON,userToDelete){
        xmlhttp.open("DELETE",url+"/rest/manage/delete/"+userToDelete ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(authTokenJSON); 
    },
    logOut: function(authTokenJSON){
        xmlhttp.open("POST",url+"/rest/manage/logout/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(authTokenJSON); 
    },
    changePassword: function(updateDataJSON){
        xmlhttp.open("PUT",url+"/rest/manage/password/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(updateDataJSON); 
    },
    getUser: function(authTokenJSON,userGet){
        xmlhttp.open("GET",url+"/rest/manage/getuser/"+userGet ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(authTokenJSON); 
    }
}
 
