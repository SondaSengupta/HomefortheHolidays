;(function() {
  "use strict";

  angular.module("myApp", [ "uiGmapgoogle-maps" ] )
    .controller("MapController", function($http, $scope) {
      var vm = this;
      $http.get("https://holidayhome.firebaseio.com/.json")
      .success(function(data) {
        // for (var key in data) {
        //   data[key].latLong = data[key].latitude + ',' + data[key].longitude;
        // }
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


      $scope.markerList = vm.HomeMarker;


    });
}());
