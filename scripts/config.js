(function() {
  "use strict";

  angular.module("myApp")
    .config(function($routeProvider){
      $routeProvider
      .when('/', {
        templateUrl: "views/landing_page.html",
        controller: "MapController",
        controllerAs: "mc"
      })
      .when('/new', {
        templateUrl: "views/map.html",
        controller: "MapController",
        controllerAs: "mc"
      })
    })

}());
