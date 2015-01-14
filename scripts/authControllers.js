(function() {
  "use strict";
  angular.module("myApp")

    .controller('ChangePasswordController', function($scope, $location, authFactory){
     var vm = this;
     var ref = new Firebase('https://holidayhome.firebaseio.com');

     vm.changePassword = function(){
       authFactory.changePassword(vm.email, vm.password, function(){
         $location.path('/map');
         $scope.$apply();
       });
       }

     })

    .controller('LogoutController', function($scope, $location, authFactory){
     var ref = new Firebase('https://holidayhome.firebaseio.com');
     authFactory.logout( function(){
       $location.path('/');
       $scope.$apply();
       console.log("User logged in is " + ref.getAuth());
     });
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
       authFactory.forgotPassword(vm.email);
     }


    })

}());
