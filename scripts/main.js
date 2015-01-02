;(function() {
  "use strict";

  angular.module("myApp", [ "ngRoute","uiGmapgoogle-maps", "smoothScroll" ] )

  .run(function($rootScope, $location, $anchorScroll, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      $location.hash($routeParams.scrollTo);
      $anchorScroll();
    });
  })


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


     .controller('EditController', function($http, $routeParams, $location){
      var vm = this;
      var id = $routeParams.id;
      var url = "https://holidayhome.firebaseio.com/"+ id + ".json"
      $http.get(url)
      .success(function(data){
        vm.newMarker = data;
      })
      .error(function(err){
        console.log(err);
      });

      vm.addNewMarker = function(){
        $http.put(url, vm.newMarker)
          .success(function(data){
            $location.path('/map')
          })
          .error(function(err){
            console.log(err);
          });
      };
    })

    .controller("MapController", function($http, $scope) {
      var vm = this;
      $http.get("https://holidayhome.firebaseio.com/.json")
      .success(function(data) {
        vm.Marker = data;
        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })

    var geocoder = new google.maps.Geocoder();

    vm.getAddress = function() {
      var address = document.getElementById('address-marker').value;
      console.log(address);
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var addressCoordsLat = results[0].geometry.location.k;
          var addressCoordsLng = results[0].geometry.location.D;
          console.log("Lat is " + addressCoordsLat + " and Long is " + addressCoordsLng);

          $("input#latitude").val(addressCoordsLat).trigger("input");
          $("input#longitude").val(addressCoordsLng).trigger("input");
          $("input#address").val("");
          $("input#addressform").val(address).trigger("input");

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    vm.centerbyAddress = function() {
      var address = document.getElementById('address').value;
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var addressCoordsLat = results[0].geometry.location.k;
          var addressCoordsLng = results[0].geometry.location.D;
          console.log("Lat is " + addressCoordsLat + " and Long is " + addressCoordsLng);

        $scope.map.control.refresh({ latitude: addressCoordsLat, longitude: addressCoordsLng });
        $scope.map.control.getGMap().setZoom(10);
        return;

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    vm.getLocation = function() {
      if (navigator.geolocation) {
        $scope.showProgress = 25;
        navigator.geolocation.getCurrentPosition(function(location) {
          $scope.showProgress = 90;
          $scope.lat = location.coords.latitude,
          $scope.lng = location.coords.longitude;
          $scope.showProgress = 100;
          $scope.$apply();

          $("input#latitude").val($scope.lat).trigger("input");
          $("input#longitude").val($scope.lng).trigger("input");
        });
      } else {
        alert("Geolocation is not supported. Please type address or coordinates manually");
      }
    }

    vm.centerbyGeolocation = function() {
      if (navigator.geolocation) {
        $scope.setProgress = 25;
        navigator.geolocation.getCurrentPosition(function(location) {
          $scope.setProgress = 90;
          $scope.lat = location.coords.latitude,
          $scope.lng = location.coords.longitude;
          $scope.$apply();
          $scope.setProgress = 100;
        $scope.map.control.refresh({ latitude: $scope.lat, longitude: $scope.lng });
        $scope.map.control.getGMap().setZoom(10);
        return;


        });
      } else {
        alert("Geolocation is not supported. Please type address or coordinates manually");
      }
    }

    vm.clearForm = function() {
      $("input#latitude").val("").trigger("input");
      $("input#longitude").val("").trigger("input");
      $("input#message").val("").trigger("input");
    }

    $scope.map = {
      control: {},
      center: { latitude: 36, longitude: -87 },
      zoom: 5
    }

    $scope.options = {scrollwheel: false};

    $scope.marker = {
      id: 0,
      message: "Current Location",
      options: { animation: google.maps.Animation.DROP },
      //icon1: default red google maps icon. As default, no need to specify//
      icon2: 'https://cdn3.iconfinder.com/data/icons/internet-and-web-4/78/internt_web_technology-08-24.png',
      coords: {
        latitude: 36,
        longitude: -87
      }
    }

    $scope.markerList = vm.Marker;

    vm.refreshMap = function() {
      $scope.map.control.refresh({ latitude: 36, longitude: -87 });
      $scope.map.control.getGMap().setZoom(5);
      return;
    };

    vm.addNewMarker = function() {
    var url = "https://holidayhome.firebaseio.com/.json";
    $http.post(url, vm.newMarker)
      .success(function(data) {
        vm.Marker[data.name] = vm.newMarker;
        vm.newMarker = null;
        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })
    }

     vm.deleteMarker = function(markerId) {
      var url = "https://holidayhome.firebaseio.com/" + markerId + ".json";
      $http.delete(url)
      .success(function() {
        delete vm.Marker[markerId]
        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })
    }

    // DREAM CODE FOR "ADD YOUR OWN RATING" BUTTON
    // vm.rating = function(){
    //   var counter = 0
    //   var numberofPeople = 1
    //   var enteredRating = ("input").click().val()
    //
    //   counter = (counter + enteredRating)/numberofPeople
    //   numberofPeople +=1
    //
    //   var url = "https://holidayhome.firebaseio.com/" + markerId + ".json";
    //   $http.put(url)
    //   .success(function() {
    //     vm.Marker[markerId].rating = counter;
    //     console.log("it works!");
    //   })
    //   .error(function(err) {
    //     console.log(err);
    //   })
    // }

  }); //end of controller

}()); //end of of iife
