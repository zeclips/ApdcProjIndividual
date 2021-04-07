function login(){
    document.getElementById("lgnbtn").style.cursor = "wait";
    var username = document.getElementById("username_field").value;
    var userPass = document.getElementById("password_field").value;
    
    //firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    frontend.login(username,userPass).then((user) => {
  
    // Signed in
    // ...
    document.getElementById("lgnbtn").style.cursor = "pointer";
    location.href='/';
  })
  .catch((error) => {
    //var errorCode = error.code;
    var errorMessage = error.message;

    document.getElementById("lgnbtn").style.cursor = "pointer";
    
   window.alert("Error: " +errorMessage);
    // ..
    
  });
    
   
}