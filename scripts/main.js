;(function() {
  "use strict";

  angular.module("myApp", [ "uiGmapgoogle-maps" ] )
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

    vm.getAddress = function(){
      var address = document.getElementById('address').value;
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var addressCoordsLat = results[0].geometry.location.k;
          var addressCoordsLng = results[0].geometry.location.D;
          console.log("Lat is " + addressCoordsLat + " and Long is " + addressCoordsLng);

          $("input#latitude").val(addressCoordsLat).trigger("input");
          $("input#longitude").val(addressCoordsLng).trigger("input");
          $("input#address").val('');

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

    vm.clearForm = function(){
      $("input#latitude").val('').trigger("input");
      $("input#longitude").val('').trigger("input");
      $("input#message").val('').trigger("input");
    }

    $scope.map = {
      center: { latitude: 36, longitude: -87 },
      zoom: 5
    }

      $scope.marker = {
        id: 0,
        message: "Current Location",
        options: { animation: google.maps.Animation.DROP },
        icon: 'https://cdn3.iconfinder.com/data/icons/internet-and-web-4/78/internt_web_technology-08-24.png',
        coords: {
          latitude: 36,
          longitude: -87
        }
      }

      $scope.markerList = vm.Marker;

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

    });
}());
