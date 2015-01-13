(function() {
  "use strict";
  angular.module("myApp")

  .factory("mapFactory", function($http, $location) {
    function getAllMarkers(cb) {
      var url = "https://holidayhome.firebaseio.com/.json";

      $http.get(url)
      .success(function(data) {
        cb(data);
        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })
    }

    function getAddress(address, cb) {
      var geocoder = new google.maps.Geocoder();
      console.log(address);
      geocoder.geocode( { "address": address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var addressCoordsLat = results[0].geometry.location.k,
          addressCoordsLng = results[0].geometry.location.D;
          console.log("Lat is " + addressCoordsLat + " and Long is " + addressCoordsLng);
          cb(address, addressCoordsLat, addressCoordsLng);

        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

    function clearForm() {
      $("input#addressform").val("").trigger("input");
      $("input#latitude").val("").trigger("input");
      $("input#longitude").val("").trigger("input");
      $("input#message").val("").trigger("input");
    }

    return {
      getAllMarkers: getAllMarkers,
      getAddress: getAddress,
      clearForm: clearForm

    }

  })
}());
