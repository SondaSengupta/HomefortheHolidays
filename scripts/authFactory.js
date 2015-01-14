(function() {
  "use strict";
  angular.module("myApp")

  .factory('authFactory', function($location){
    var ref = new Firebase('https://holidayhome.firebaseio.com');

    function login(useremail, userpassword, cb){
      ref.authWithPassword({
        email    : useremail,
        password : userpassword
      }, function(error, authData) {
        if (error === null) {
          console.log("User logged in successfully", authData);
          cb();
        } else {
          console.log("Error logging in this user:", error);
          alert(error.message);
        }
      });
    }

    function register(useremail, userpassword, cb){
      ref.createUser({
        email    : useremail,
        password : userpassword
      }, function(error, authData) {
        if (error === null) {
          console.log("User created successfully", authData);
          alert("You have created an account successfully. You will be redirected to the member's map.")
          cb();
        } else {
          console.log("Error creating user:", error);
          alert(error.message);
        }
      });

    }

    function forgotPassword(useremail){
      ref.resetPassword({
        email : useremail
      }, function(error) {
        if (error === null) {
          alert("Password reset email sent successfully");
        } else {
          console.log("Error sending password reset email:", error);
          alert(error.message);
        }
      });
    };

    function changePassword(userOldPassword, userNewPassword, cb){
      ref.changePassword({
        email       : ref.getAuth().password.email,
        oldPassword : userOldPassword,
        newPassword : userNewPassword,
      }, function(error) {
        if (error === null) {
          console.log('Password changed successfully');
          cb();
        } else {
          console.log('Error changing password:', error);
        }
      }
    )};

    function logout(cb){
      ref.unauth(function(){
        cb();
      });
    }

    return {
      login: login,
      register: register,
      forgotPassword: forgotPassword,
      changePassword: changePassword,
      logout: logout
    }

  })

}());
