(function() {
  "use strict";

  angular.module("myApp")

  .factory("mapFactory", function($http, $location) {
    function getAllMarkers(cb) {
      var url = "https://holidayhome.firebaseio.com/.json";

      $http.get(url)
      .success(function(data) {
        cb(data);
        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })
    }

    function getAddress(address, cb) {
      var geocoder = new google.maps.Geocoder();
      console.log(address);
      geocoder.geocode( { "address": address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var addressCoordsLat = results[0].geometry.location.k,
          addressCoordsLng = results[0].geometry.location.D;
          console.log("Lat is " + addressCoordsLat + " and Long is " + addressCoordsLng);
          cb(address, addressCoordsLat, addressCoordsLng);

        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    function clearForm() {
      $("input#addressform").val("").trigger("input");
      $("input#latitude").val("").trigger("input");
      $("input#longitude").val("").trigger("input");
      $("input#message").val("").trigger("input");
    }

    return {
      getAllMarkers: getAllMarkers,
      getAddress: getAddress,
      clearForm: clearForm

    }

  })

  .controller("MapController", function($http, $scope, $location, mapFactory) {
    var vm = this;
    vm.newMarker = {};

    mapFactory.getAllMarkers(function(data) {
      vm.Marker = data;
    })

    var ref = new Firebase('https://holidayhome.firebaseio.com');

    if (ref.getAuth()) {
      var email = ref.getAuth().password.email;
      var endSlicePosition = email.indexOf("@");
      var username = email.slice(0, endSlicePosition);
      vm.newMarker.email = email;
      vm.newMarker.username = username
      $("input#username").val("Created by " + username).trigger("input");
      $("input#email").val(email).trigger("input");
    } else {
      $("input#username").val("Created by Anonymous").trigger("input");
    }


    $scope.map = {
      control: {},
      center: { latitude: 36, longitude: -87 },
      zoom: 5
    }

    $scope.options = {scrollwheel: false};

    $scope.marker = {
      bulbicon: 'http://icons.iconarchive.com/icons/gpritiranjan/simple-christmas/32/bulb-icon.png',
      coords: {
        latitude: 36,
        longitude: -87
      }
    }

    $scope.markerList = vm.Marker;

    vm.getAddress = function() {
      var address = document.getElementById("address-marker").value;
      mapFactory.getAddress(address, function(address, addressCoordsLat, addressCoordsLng) {
        $("input#latitude").val(addressCoordsLat).trigger("input");
        $("input#longitude").val(addressCoordsLng).trigger("input");
        $("input#address").val("");
        $("input#addressform").val(address).trigger("input");
      })
    };

    vm.centerbyAddress = function() {
      var address = document.getElementById("address").value;
      mapFactory.getAddress(address, function(address, addressCoordsLat, addressCoordsLng) {
        $scope.map.control.refresh({ latitude: addressCoordsLat, longitude: addressCoordsLng });
        $scope.map.control.getGMap().setZoom(10);
      })
    };

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
      $scope.setProgress
      if (navigator.geolocation) {
        $scope.setProgress = 25;
        navigator.geolocation.getCurrentPosition(function(location) {
          $scope.setProgress = 90;
          var lat = location.coords.latitude;
          var lng = location.coords.longitude;
          $scope.setProgress = 100;
          $scope.map.control.refresh({ latitude: lat, longitude: lng });
          $scope.map.control.getGMap().setZoom(10);
          return;


        });
      } else {
        alert("Geolocation is not supported. Please type address or coordinates manually");
      }
    }

    vm.clearForm = function() {
      mapFactory.clearForm();
    }


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
        vm.newMarker = {};
        vm.newMarker.email = email;
        vm.newMarker.username = username;


        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })
    }

  }); //end of controller

}());
