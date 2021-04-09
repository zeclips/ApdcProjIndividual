function checklogtest(){
    frontend.checkLogged();
}

function LogOut(){
    // frontend.LogOut();
    myStorage.setItem('loginToken',JSON.stringify(""));
    location.href = '/';
}

function toggleActive(){
    console.log("Toggle Active");
    var usernameToToggle = document.getElementById("userToToggle").value;
    frontend.toggleActive(usernameToToggle);
}

function updateRole(){
    console.log("Update Role");
    var usernameToRole = document.getElementById("userToUpdateRole").value;
    var roleToChange = document.getElementById("roleToUpdateTo").value;
    frontend.updateRole(usernameToRole,roleToChange);
}

function updateUser(){
    console.log("Update User");
    var mailUpdate = document.getElementById("emailToUpdate").value;
    var nameUpdate = document.getElementById("nameToUpdate").value;
    var profileUpdate = document.getElementById("profileToUpdate").value;
    var adressUpdate = document.getElementById("adressToUpdate").value;
    var secAdressUpdate = document.getElementById("secondAdressToUpdate").value;
    var localUpdate = document.getElementById("LocalToUpdate").value;
    var postalUpdate = document.getElementById("postalToUpdate").value;
    var phoneUpdate = document.getElementById("phoneToUpdate").value;
    var tlmUpdate = document.getElementById("cellphoneToUpdate").value;
    frontend.updateUser(mailUpdate,nameUpdate,profileUpdate,adressUpdate,secAdressUpdate,localUpdate,postalUpdate,phoneUpdate,tlmUpdate);
}

function deleteUser(){
    console.log("Delete User");
    var userDelete = document.getElementById("searchDelete").value;
    frontend.deleteUser(userDelete);
}

function changePassword(){
    console.log("Change Password");
    var oldPass = document.getElementById("oldPassword").value;
    var newPass = document.getElementById("newPassword").value;
    var newPassConfirm = document.getElementById("newPasswordConfirm").value;
    frontend.changePassword(oldPass,newPass,newPassConfirm);

}

function getUser(){
    console.log("Get User");
    var userGet = document.getElementById("searchUser").value;
    frontend.getUser(userGet);
}

function showActive(toActivate){
    $( ".active" ).removeClass();
    $( "#"+toActivate ).addClass( "active" );
}