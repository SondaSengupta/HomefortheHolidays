(function() {
  "use strict";

  angular.module("myApp")
    .config(function($routeProvider) {
      $routeProvider
      .when('/', {
        templateUrl: "views/landing_page.html",
        controller: "MapController",
        controllerAs: "mc"
      })
      .when('/map', {
        templateUrl: "views/map.html",
        controller: "MapController",
        controllerAs: "mc"
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
     .otherwise({redirectTo: '/'});
   })
}());
