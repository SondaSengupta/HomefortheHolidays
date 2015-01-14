(function() {
  "use strict";
  angular.module("myApp")

    .controller('ChangePasswordController', function($scope, $location){
     var vm = this;
     var ref = new Firebase('https://holidayhome.firebaseio.com');

     vm.changePassword = function(){
       ref.changePassword({
           email       : ref.getAuth().password.email,
           oldPassword : vm.oldPassword,
           newPassword : vm.newPassword,
         }, function(error) {
           if (error === null) {
             console.log('Password changed successfully');
             cb();
           } else {
             console.log('Error changing password:', error);
           }
         }
       );
         $location.path('/map');
         $scope.$apply();
       }
     }
    )

    .controller('LogoutController', function($scope, $location){
     var ref = new Firebase('https://holidayhome.firebaseio.com');
     ref.unauth(function(){
       $location.path('/');
       $scope.$apply();
     });
    })

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

      return {
        login: login,
        register: register
      }


    })

    .controller('LoginController', function($location, $scope, authFactory){
     var vm = this;
     var ref = new Firebase('https://holidayhome.firebaseio.com');

     vm.login = function(){
       authFactory.login(vm.email, vm.password, function(){
         $location.path('/map');
         $scope.$apply();
       });
     };


      vm.register = function(){
        authFactory.register(vm.email, vm.password, function(){
          vm.login();
        })
     }

      vm.forgotPassword = function(){
       ref.resetPassword({
           email : vm.email
         }, function(error) {
         if (error === null) {
           alert("Password reset email sent successfully");
         } else {
           console.log("Error sending password reset email:", error);
           alert(error.message);
         }
       });
     };

    })

}());
