;(function() {
  "use strict";

  angular.module("myApp", [ "ngRoute","uiGmapgoogle-maps" ] )

    // .constant('FIREBASE_URL', "https://holidayhome.firebaseio.com")

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
            console.log("Password reset email sent successfully");
          } else {
            console.log("Error sending password reset email:", error);
            alert(error.message);
          }
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
      var address = document.getElementById('address').value;
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

    vm.getLocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(location) {
          $scope.lat = location.coords.latitude,
          $scope.lng = location.coords.longitude;
          $scope.$apply();

          $("input#latitude").val($scope.lat).trigger("input");
          $("input#longitude").val($scope.lng).trigger("input");
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

  }); //end of controller

}()); //end of of iife
