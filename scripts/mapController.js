(function() {
  "use strict";

  angular.module("myApp")

  .controller("MapController", function($http, $scope, $location, $timeout, ngProgress, mapFactory, authFactory) {

// ----- WEBSITE PROGRESS BAR -----
    ngProgress.start();
    ngProgress.color('lightblue');
    ngProgress.height('10px');
    $timeout( function(){ ngProgress.set(25) }, 200);
    $timeout( function(){ ngProgress.complete() }, 2000);


// ----- FIREBASE CHAT -----
    var myDataRef = new Firebase('https://holidayhome.firebaseio.com/Chat');
    $('#messageInput').keypress(function (e) {
      if (e.keyCode == 13) {
        var name = $('#nameInput').val();
        var text = $('#messageInput').val();
        myDataRef.push({name: name, text: text});
        $('#messageInput').val('');
      }
    });
    myDataRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
    });
    function displayChatMessage(name, text) {
      $('<div/>').text(text).prepend($('<strong/>').text(name+': ')).appendTo($('#messagesDiv'));
      $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    };

// ----- FIREBASE MARKER UPLOAD AND RETRIEVAL-----
    var vm = this;
    vm.newMarker = {};

    mapFactory.getAllMarkers(function(data) {
      vm.Marker = data;
    })

    var ref = new Firebase('https://holidayhome.firebaseio.com/ChristmasMarkers');

    if (ref.getAuth()) {
      var email = ref.getAuth().password.email;
      var endSlicePosition = email.indexOf("@");
      var username = email.slice(0, endSlicePosition);
      vm.newMarker.email = email;
      vm.newMarker.username = username
      $("input#username").val("Created by " + username).trigger("input");
      $("input#email").val(email).trigger("input");
    } else {
      $("input#username").val("Created by Anonymous").trigger("input");
    }

    $scope.markerList = vm.Marker;

  // ----- ANGULAR GOOGLE MAPS -----
    $scope.map = {
      control: {},
      center: { latitude: 36.137778, longitude: -86.8235419 },
      zoom: 10
    }

    $scope.options = {scrollwheel: false};

    $scope.marker = {
      options: { animation: google.maps.Animation.DROP },
      bulbicon: 'http://icons.iconarchive.com/icons/gpritiranjan/simple-christmas/32/bulb-icon.png',
      coords: { latitude: 36.137778, longitude: -86.8235419 }
    }

// ----- PAGE FUNCTIONALITY -----

    vm.getAddress = function() {
      var address = document.getElementById("address-marker").value;
      mapFactory.getAddress(address, function(address, addressCoordsLat, addressCoordsLng) {
        $("input#latitude").val(addressCoordsLat).trigger("input");
        $("input#longitude").val(addressCoordsLng).trigger("input");
        $("input#address").val("");
        $("input#addressform").val(address).trigger("input");
      })
    };

    vm.centerbyAddress = function() {
      var address = document.getElementById("address").value;
      mapFactory.getAddress(address, function(address, addressCoordsLat, addressCoordsLng) {
        $scope.map.control.refresh({ latitude: addressCoordsLat, longitude: addressCoordsLng });
        $scope.map.control.getGMap().setZoom(10);
      })
    };

    vm.getLocation = function() {
      if (navigator.geolocation) {
        $scope.showProgress = 25;
        navigator.geolocation.getCurrentPosition(function(location) {
          $scope.showProgress = 90;
          $scope.lat = location.coords.latitude,
          $scope.lng = location.coords.longitude;
          $scope.showProgress = 100;
          $scope.$apply();

          $("input#latitude").val($scope.lat).trigger("input");
          $("input#longitude").val($scope.lng).trigger("input");
        });
      } else {
        alert("Geolocation is not supported. Please type address or coordinates manually");
      }
    }

    vm.centerbyGeolocation = function() {
      $scope.setProgress
      if (navigator.geolocation) {
        $scope.setProgress = 25;
        navigator.geolocation.getCurrentPosition(function(location) {
          $scope.setProgress = 90;
          var lat = location.coords.latitude;
          var lng = location.coords.longitude;
          $scope.setProgress = 100;
          $scope.map.control.refresh({ latitude: lat, longitude: lng });
          $scope.map.control.getGMap().setZoom(10);
          return;


        });
      } else {
        alert("Geolocation is not supported. Please type address or coordinates manually");
      }
    }

    vm.clearForm = function() {
      mapFactory.clearForm();
    }


    vm.refreshMap = function() {
      $scope.map.control.refresh({ latitude: 36, longitude: -87 });
      $scope.map.control.getGMap().setZoom(5);
      return;
    };

    vm.addNewMarker = function() {
      var url = "https://holidayhome.firebaseio.com/ChristmasMarkers/.json";
      $http.post(url, vm.newMarker)
      .success(function(data) {
        vm.Marker[data.name] = vm.newMarker;
        vm.newMarker = {};
        vm.newMarker.email = email;
        vm.newMarker.username = username;

        console.log("it works!");
      })
      .error(function(err) {
        console.log(err);
      })
    }

// ----- LOGIN FUNCTIONS -----
    vm.register = function(){
      authFactory.register(vm.email, vm.password, function(){
        vm.login();
      })
    }

    vm.login = function(){
      authFactory.login(vm.email, vm.password, function(){
        $location.path('/map');
        $scope.$apply();
      });
    };

  }); //end of controller

}());
