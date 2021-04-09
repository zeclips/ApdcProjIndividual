const url = 'https://avaliacaoindividualapdc.appspot.com/rest';





let data = {
  name: 'Sara'
}

var request = new Request(url, {
    method: 'POST',
    body: data,
    headers: new Headers()
});

fetch(request)
.then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error ', err);
  }).the;






  
  xmlhttp = new XMLHttpRequest();
let url = "https://avaliacaoindividualapdc.appspot.com"

var myStorage = window.sessionStorage;
myStorage.setItem('loginToken',JSON.stringify(""));

var promise;

xmlhttp.onreadystatechange = function(resolve, reject) {
    if (xmlhttp.readyState == 4){
        if(xmlhttp.status == 200) { 
            var token = xmlhttp.responseText;
            promise.resolve(token);
        } else  { if(xmlhttp.status == 511){   
         
         
            promise.reject('Login Confirmation failed');
            location.href='/';
        } else {
            promise.reject('Something went wrong');
        }

        }
    }
}

class Front{
    constructor(){
        
    }

    login(username,password){
        let u = username;
        let p = password;
        return promise = new Promise( function(){
            var obj = {
                "username":u,
                "password":p
            };
    
            var loginCredentialsJSON = JSON.stringify(obj);
            myStorage.setItem('loginToken',loginCredentialsJSON);
            xmlhttp.open("POST",url+"/rest/login/" ,true);
            xmlhttp.setRequestHeader("Accept", "application/json");
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send(loginCredentialsJSON); 
        });
    }

    regist(username,email,password){
        let u = username;
        let m = email;
        let p = password;
        return new Promise( function(){
            var registCredentialsJSON = {
                "username":u,
                "email":m,
                "password":p
            };
            
            xmlhttp.open("POST",url+"/rest/register/" ,true);
            xmlhttp.setRequestHeader("Accept", "application/json");
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            xmlhttp.send(registCredentialsJSON); 
        });
    }


    checkLogged(){
        xmlhttp.open("POST",url+"/rest/manage/checklogged/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.send(JSON.parse(myStorage.getItem('loginToken')));
    }

    toggleActive(userAffected){
        xmlhttp.open("PUT",url+"/rest/manage/state/"+userAffected ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(myStorage.getItem('loginToken')); 
    }

    updateRole(targetUser,newRole){
        var updateDataJSON = {
            "userData": {
                        "username":targetUser,
                        "role" : newRole
                        },
            "authToken":myStorage.getItem('loginToken')
        }

        xmlhttp.open("PUT",url+"/rest/manage/role/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(updateDataJSON); 
    }

    updateUser(updateDataJSON){
        xmlhttp.open("POST",url+"/rest/manage/update/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(updateDataJSON); 
    }

    deleteUser(userToDelete){
        xmlhttp.open("DELETE",url+"/rest/manage/delete/"+userToDelete ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(myStorage.getItem('loginToken')); 
    }

    logOut(){
        xmlhttp.open("POST",url+"/rest/manage/logout/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(myStorage.getItem('loginToken')); 
    }

    changePassword(oldPass, newPass, newPassConfirm){
        var updateDataJSON = {
            "userData": {
                "oldPassword":oldPass,
                "password" : newPass,
                "passwordconfirm" : newPassConfirm 
            },
            "authToken": myStorage.getItem('loginToken')
        };
        xmlhttp.open("PUT",url+"/rest/manage/password/" ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(updateDataJSON); 
    }

    getUser(userGet){
        xmlhttp.open("GET",url+"/rest/manage/getuser/"+userGet ,true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(myStorage.getItem('loginToken')); 
    }
}

var frontend = new Front();
console.log("frontendlink created");
















/*
var frontend = {    
    login: new Promise( function(username,password){
        var obj = {
            "username":username,
            "password":password
        };

        var loginCredentialsJSON = JSON.stringify(obj);

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
}*/
 
