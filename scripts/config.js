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
      .when('/:id/edit', {
        templateUrl: 'views/edit.html',
        controller: 'EditController',
        controllerAs: 'editc'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
       .when('/logout', {
        template: '',
        controller: 'LogoutController'
      })
      .when('/changepassword', {
        templateUrl: 'views/changepassword.html',
        controller: 'ChangePasswordController',
        controllerAs: 'changepw'
      })
       .otherwise({redirectTo: '/'});
   })
}());
