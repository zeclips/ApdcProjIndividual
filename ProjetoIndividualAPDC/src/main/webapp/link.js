const url = 'https://avaliacaoindividualapdc.appspot.com/rest';

const restLogin = '/login';
const restLogout = '/register';
const restRegist = '/manage/logout';
const restCheckLogin = '/manage/checklogged';
const restUpdateUser = '/manage/role';
const restUpdateRole = '/manage/update';
const restChangePw = '/manage/password';
const restDelete = '/manage/delete/';
const restToggleActive = '/manage/state/';
const restGetUser = '/manage/getuser/';

var myStorage = window.sessionStorage;

if(myStorage.getItem('loginToken') == null){
    myStorage.setItem('loginToken',JSON.stringify(""));
}

class Front{
    constructor(){
        
    }

    login(username,password){
        
        var loginCredentials = {
            username:username,
            password:password
        };

   /*     var request = new Request(url+restLogin, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginCredentials)
        });*/

        return fetch(url+restLogin, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginCredentials)
        })
        .then(
            function(response) {
              if (response.status == 511) {
                console.log('Looks like there was a problem loggin in. Status Code: ' + response.status);
                return;
              }
        
              // Examine the text in the response
               return response.json().then(function(token) {
                    
                    myStorage.setItem('loginToken',JSON.stringify(token));
                    location.href = '/home.html'
              });
            }
          )
          .catch(function(err) {
            console.log('Fetch Error ', err);
          });
     
    }

    checkLogged(){
        var token = JSON.parse(myStorage.getItem('loginToken'));

        fetch(url+restCheckLogin,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(token)
        })
        .then(
            function(response) {
              if (response.status !== 200) {
                if (response.status == 511) {
                    console.log('Not Logged In');
                    location.href = '/'
                }else{
                    console.log('Looks like there was a problem checking LoggedIn. Status Code: ' + response.status);
                    return;
                }
              }
        
              // Examine the text in the response
              return response.text().then(function(data) {
                console.log(data);
              });
            }
          )
          .catch(function(err) {
            console.log('Fetch Error ', err);
          });
    }
 /* 
    regist(username,email,pass,passconfirm,name,adress,secAdress,local,postal,phone,cell){
        var registCredentialsJSON = {
            "username" : username,
            "password": email,
            "email" : pass,
            "passwordconfirm" : passconfirm,
            "name" : name,
            "morada" : adress,
            "moradaComp" : secAdress,
            "localidade" : local,
            "codigoPost" : postal,
            "nFixo" : phone,
            "nTlm" : cell
        };
        
     //  var request = new Request(url+restCheckLogin, {
      //      method: 'POST',
      //      body: JSON.stringify(registCredentialsJSON),
      //      headers: {
      //          'Accept': 'application/json',
       //         'Content-Type': 'application/json'
      //      }
      //  });
        
        return fetch(url+restRegist, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registCredentialsJSON)
        })
        .then(
            function(response) {
                if (response.status !== 200) {
                    if (response.status == 511) {
                        console.log('Not Logged In');
                        //location.href = '/'
                    }else{
                        console.log('Looks like there was a problem registing. Status Code: ' + response.status);
                        return;
                    }
                }
            }
            )
            .catch(function(err) {
            console.log('Fetch Error ', err);
            });

    }
*/
    toggleActive(userAffected){
        var token = JSON.parse(myStorage.getItem('loginToken'));        
        
        return fetch(url+restToggleActive+userAffected, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(token)
        })
        .then(
            function(response) {
                if (response.status !== 200) {
                    if (response.status == 511) {
                        console.log('Not Logged In');
                        location.href = '/'
                    }else{
                        console.log('Looks like there was a problem toggling user. Status Code: ' + response.status);
                        return;
                    }
                }
            }
            )
            .catch(function(err) {
            console.log('Fetch Error ', err);
            });
    }

    updateRole(targetUser,newRole){
        var token = JSON.parse(myStorage.getItem('loginToken'));  
        
    //    var updateDataJSON = {
    //        userData: {
     //                   username:targetUser,
     //                   role : newRole
     //                   },
     //       authToken:JSON.stringify(token)
      //  }
    
      //   return new Promise( function(){
       //               
       //    var request = new Request(url+restUpdateRole, {
       //         method: 'PUT',
      //          body: JSON.stringify(updateDataJSON),
        //        headers: {
       //             'Accept': 'application/json',
        //            'Content-Type': 'application/json'
       //         }
       //     });
            
        return fetch(url+restUpdateRole, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userData: {
                            username:targetUser,
                            role : newRole
                            },
                authToken:token
            }),
        })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        if (response.status == 511) {
                            console.log('Not Logged In');
                            //location.href = '/'
                        }else{
                            console.log('Looks like there was a problem updating role. Status Code: ' + response.status);
                            return;
                        }
                    }
                }
              )
              .catch(function(err) {
                console.log('Fetch Error ', err);
              });
        
    }/**/
 
    updateUser(uEmail,uname,uprofile,uadress,usecAdress,ulocal,upostal,uphone,ucell){
        var token = JSON.parse(myStorage.getItem('loginToken'));

   //     var updateDataJSON = {
    //        "userData": {
    //                    "email":email,
     //                   "name":name,
      //                  "profile":profile,
     //                   "morada":adress,
      //                  "moradaComp":secAdress,
     //                   "localidade":local,
     /////                   "codigoPost":postal,
      //                  "nFixo":phone,
     //                   "nTlm" : cell
      //                  },
     //      "authToken":token
      //  }
    
      // return new Promise( function(){
      //                
       //     var request = new Request(url+restUpdateUser, {
       //         method: 'POST',
       //         body: JSON.stringify(updateDataJSON),
       //         headers: {
        //            'Accept': 'application/json',
      //              'Content-Type': 'application/json'
      //          }
       //     });
            
            fetch(url+restUpdateUser, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userData: {
                                email:uEmail,
                                name:uname,
                                profile:uprofile,
                                morada:uadress,
                                moradaComp:usecAdress,
                                localidade:ulocal,
                                codigoPost:upostal,
                                nFixo:uphone,
                                nTlm :ucell
                                },
                    authToken:token
                }),
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        if (response.status == 511) {
                            console.log('Not Logged In');
                            //location.href = '/'
                        }else{
                            console.log('Looks like there was a problem updating user. Status Code: ' + response.status);
                            return;
                        }
                    }
                }
              )
              .catch(function(err) {
                console.log('Fetch Error ', err);
              });
       
    }
      
    deleteUser(userToDelete){
        var token = JSON.parse(myStorage.getItem('loginToken'));
            
            fetch(url+restDelete+userToDelete, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(token),
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        if (response.status == 511) {
                            console.log('Not Logged In');
                            location.href = '/'
                        }else{
                            console.log('Looks like there was a problem deliting user. Status Code: ' + response.status);
                            return;
                        }
                    }
                }
              )
              .catch(function(err) {
                console.log('Fetch Error ', err);
              });
      
    }
    
/*     logOut(){
      //return new Promise( function(){
      //                
      //      var request = new Request(url+restLogout, {
       //         method: 'POST',
      //          body: JSON.stringify(myStorage.getItem('loginToken')),
       //         headers: {
       //             'Accept': 'application/json',
       //             'Content-Type': 'application/json'
       //         }
       //     });
            
            fetch(url+restLogout, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myStorage.getItem('loginToken'))
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        if (response.status == 511) {
                            console.log('Not Logged In');
                            //location.href = '/'
                        }else{
                            console.log('Looks like there was a problem login out. Status Code: ' + response.status);
                            return;
                        }
                    }
                }
              )
              .catch(function(err) {
                console.log('Fetch Error ', err);
              });
        
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
            
            //return new Promise( function(){
                      
           //     var request = new Request(url+restChangePw, {
           //         method: 'PUT',
            //        body: JSON.stringify(updateDataJSON),
           //         headers: {
            //            'Accept': 'application/json',
           //             'Content-Type': 'application/json'
           //         }
          //      });
                
                fetch(url+restChangePw, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateDataJSON)
                })
                .then(
                    function(response) {
                        if (response.status !== 200) {
                            if (response.status == 511) {
                                console.log('Not Logged In');
                                //location.href = '/'
                            }else{
                                console.log('Looks like there was a problem changing password. Status Code: ' + response.status);
                                return;
                            }
                        }
                    }
                  )
                  .catch(function(err) {
                    console.log('Fetch Error ', err);
                  });
           
        }
*/        
        getUser(userGet){
            var token = JSON.parse(myStorage.getItem('loginToken'));
                
                fetch(url+restGetUser+userGet, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(token)
                })
                .then(
                    function(response) {
                        if (response.status !== 200) {
                            if (response.status == 511) {
                                console.log('Not Logged In');
                                location.href = '/'
                            }else{
                                console.log('Looks like there was a problem getting user. Status Code: ' + response.status);
                                return;
                            }
                        }
                        return response.text().then(function(data) {
                            alert(data);
                          }); 
                    }
                  )
                  .catch(function(err) {
                    console.log('Fetch Error ', err);
                  });
            
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
 
