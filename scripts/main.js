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


    navigator.geolocation.getCurrentPosition(function(location) {
      var lat = location.coords.latitude,
          lng = location.coords.longitude;
          console.log(lat + "," + lng);

      $scope.$apply(function(){
        $scope.lat = lat;
        $scope.lng = lng;
      })
    });



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

    vm.addNewMarker = function(){
    var url = "https://holidayhome.firebaseio.com/.json";
    $http.post(url, vm.newMarker)
      .success(function(data){
        vm.Marker[data.name] = vm.newMarker;
        vm.newMarker = null;
        console.log("it works!");
      })
      .error(function(err){
        console.log(err);
      })
    }

     vm.deleteMarker = function(markerId){
      var url = "https://holidayhome.firebaseio.com/" + markerId + ".json";
      $http.delete(url)
      .success(function(){
        delete vm.Marker[markerId]
        console.log("it works!");
      })
      .error(function(err){
        console.log(err);
      })
    }

    });
}());
