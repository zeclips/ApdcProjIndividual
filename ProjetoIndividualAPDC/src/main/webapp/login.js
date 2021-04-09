function login(){
    document.getElementById("lgnbtn").style.cursor = "wait";
    var username = document.getElementById("login_username_field").value;
    var userPass = document.getElementById("login_password_field").value;
    
    frontend.login(username,userPass).then((user) => {
  
    // Signed in
    // ...
    document.getElementById("lgnbtn").style.cursor = "pointer";
    location.href='/home.html';
  })
  .catch((error) => {
    //var errorCode = error.code;
    var errorMessage = error.message;

    document.getElementById("lgnbtn").style.cursor = "pointer";
    
   window.alert("Error: " +errorMessage);
    // ..
    
  });
    
   
}

function regist(){
    document.getElementById("lgnbtn").style.cursor = "wait";
    var username = document.getElementById("login_username_field").value;
    var userPass = document.getElementById("login_password_field").value;
    var userPassConfirm = document.getElementById("regist_passwordConfirm_field").value;
    var userName = document.getElementById("regist_name_field").value;
    var userAdress = document.getElementById("regist_adress_field").value;
    var userSecondAdress = document.getElementById("regist_secadress_field").value;
    var userLocal = document.getElementById("regist_local_field").value;
    var userPostal = document.getElementById("regist_postal_field").value;
    var userPhone = document.getElementById("regist_phone_field").value;
    var userCell = document.getElementById("regist_cellPhone_field").value;
    
    frontend.regist(username,userEmail,userPass,userPassConfirm,userName,userAdress,userSecondAdress,userLocal,userPostal,userPhone,userCell).then((user) => {
  
    // Signed in
    // ...
    console.log(user);
    document.getElementById("lgnbtn").style.cursor = "pointer";
    $( ".regist" ).css( "display", "none" );
  })
  .catch((error) => {
    //var errorCode = error.code;
    var errorMessage = error.message;

    document.getElementById("lgnbtn").style.cursor = "pointer";
    
   window.alert("Error: " +errorMessage);
    // ..
    
  });
    
   
}