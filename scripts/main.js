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
      var addressCoords = results[0].geometry.location;
      console.log(addressCoords);

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
    }

    navigator.geolocation.getCurrentPosition(function(location) {
      $scope.lat = location.coords.latitude,
      $scope.lng = location.coords.longitude;
      $scope.$apply();
    });

    console.log($scope.lat);

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
