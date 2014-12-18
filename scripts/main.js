;(function() {
  "use strict";

  angular.module("myApp", [ "uiGmapgoogle-maps" ] )
    .controller("MapController", function($http, $scope) {
      var vm = this;
      $http.get("https://holidayhome.firebaseio.com/HomeMarker/.json")
      .success(function(data) {
        vm.HomeMarker = data;
        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })

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

      $scope.markerList = [
        { id: 1, latitude: 37, longitude: -83, message: "Location1" },
        { id: 2, latitude: 38, longitude: -84, message: "Location2" },
        { id: 3, latitude: 39, longitude: -85, message: "Location3" },
        { id: 4, latitude: 40, longitude: -86, message: "Location4" }
      ]

    });
}());
