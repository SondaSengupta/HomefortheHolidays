;(function() {
  "use strict";

  angular.module("myApp", [ "ngRoute","uiGmapgoogle-maps", "smoothScroll", "ngProgress" ] )

  .run(function($rootScope, $location, $anchorScroll, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      $location.hash($routeParams.scrollTo);
      $anchorScroll();
    });
  })

}()); //end of of iife
