(function() {

  angular
    .module('iffy_app')
    .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['$http', '$stateParams', '$ionicSlideBoxDelegate'];

    function ApplicationController($http, $stateParams, $ionicSlideBoxDelegate) {

      var self = this;

      self.restaurants = [];
      self.createHistory = createHistory;

      // for testing sake hardcoded user ID
      var userID = "1";

      var UserResources = new Resources('user');

      $http.get('http://localhost:3000/api/v1/restaurants/')
          .success(function(data){
            for (var i = 0; i < data.length; i++) {
              self.restaurants[i] = {
                name: data[i].hash.name,
                rating: data[i].hash.rating,
                locationLine1: data[i].hash.location.display_address[0],
                locationLine2: data[i].hash.location.display_address[2],
                yelpID: data[i].hash.id
              };
            }
            $ionicSlideBoxDelegate.update();

            // make sure to send first loaded result (self.restaurants[0] to user history)
          
          });

      function createHistory(index) {
        var justViewed = self.restaurants[index].yelpID;
      }



    }



})();