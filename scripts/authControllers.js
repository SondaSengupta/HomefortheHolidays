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

    .controller('LoginController', function($location, $scope){
     var vm = this;
     var ref = new Firebase('https://holidayhome.firebaseio.com');

     vm.login = function(){
       ref.authWithPassword({
         email    : vm.email,
         password : vm.password
       }, function(error, authData) {
         if (error === null) {
           console.log("User logged in successfully", authData);
           $location.path('/map');
           $scope.$apply();
         } else {
           console.log("Error logging in this user:", error);
           alert(error.message);
         }
       });
     }

      vm.register = function(){
       ref.createUser({
         email    : vm.email,
         password : vm.password
       }, function(error, authData) {
         if (error === null) {
           console.log("User created successfully", authData);
           alert("You have created an account successfully.")
           vm.login();
         } else {
           console.log("Error creating user:", error);
             alert(error.message);
         }
       });
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
