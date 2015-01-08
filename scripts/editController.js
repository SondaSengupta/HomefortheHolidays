(function() {
  "use strict";
  angular.module("myApp")
  .controller('EditController', function($http, $routeParams, $location){
    var vm = this;
    var id = $routeParams.id;
    var url = 'https://holidayhome.firebaseio.com/' + id + '.json'
    $http.get(url)
    .success(function(data){
      vm.newMarker = data;
    })
    .error(function(err){
      console.log(err);
    });

    vm.addNewMarker = function(){
      $http.put(url, vm.newMarker)
      .success(function(data){
        $location.path('/map')
      })
      .error(function(err){
        console.log(err);
      });
    };

    vm.editUsername = function() {
      var ref = new Firebase('https://holidayhome.firebaseio.com');

      if (ref.getAuth()) {
        var email = ref.getAuth().password.email;
        var endSlicePosition = email.indexOf("@");
        var username = email.slice(0, endSlicePosition);
        $("input#editusername").val("Last edited by " + username).trigger("input");

      } else {
        $("input#editusername").val("Last edited by by Anonymous").trigger("input");
      }
    }

    vm.deleteEditMarker = function() {
      var ref = new Firebase('https://holidayhome.firebaseio.com');
      console.log(id);
      console.log(ref.getAuth().password.email);
      console.log(vm.newMarker.email);
      if(ref.getAuth().password.email === vm.newMarker.email){
        var url = "https://holidayhome.firebaseio.com/" + id + ".json";
        $http.delete(url)
        .success(function() {
          $location.path('/map')
          alert("Your marker has been deleted. You will be returned to the Maps Page.")
        })
        .error(function(err) {
          console.log(err);
        })
      } else {
        alert("You are not authorized to delete this marker.");
      }
    }

  })
}());
