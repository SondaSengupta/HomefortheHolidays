;(function(){
  'use strict';

  angular.module('myApp', [])
    .controller('MapController', function($http){
      var vm = this;
      $http.get("https://holidayhome.firebaseio.com/HomeMarker/.json")
      .success(function(data){
        vm.HomeMarker = data;
        console.log("it works!");
      })
      .error(function(err){
        console.log(err);
      })

    });

}());
