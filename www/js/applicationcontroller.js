(function() {

    angular
        .module('iffy_app')
        .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['$http', '$stateParams', '$cordovaGeolocation', 'ApiEndpoint', '$scope'];

    function ApplicationController($http, $stateParams, $cordovaGeolocation, ApiEndpoint, $scope) {

        var self = this;
        var testCanvas = document.getElementById("testCanvas");
        var postData = {};
        // Geolocation for user
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };

        self.restaurants = [];
        self.singleRestaurant = [];

        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {

                self.lat = position.coords.latitude;
                self.long = position.coords.longitude;
                postData = {
                    "ll": self.lat + ', ' + self.long,
                    "terms": "fast"
                };

                postFoursq(postData);
                console.log(self.lat + " " + self.long);

            }, function(err) {
                console.log("error getting location")
            });

        // takes updates results pulled from yelp
        $scope.filterFoursq = function(data) {

            postData = {
                "ll": self.lat + ', ' + self.long,
                "terms": data
            };
            postFoursq(postData);
        }

        function postFoursq(postData) {
            // post data for foursquare search
            $http.post(ApiEndpoint.url, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .success(function(data) {
                    console.log("====SUCCESS=====");
                    // console.log(data.groups[0]['items'].length);
                    for (var i = 0; i < data.groups[0]['items'].length; i++) {
                        var all = data.groups[0]['items'][0].venue.url;
                        self.restaurants[i] = {
                            name: data.groups[0]['items'][i].venue.name,
                            phone: data.groups[0]['items'][i].venue.contact.formattedPhone,
                            url: data.groups[0]['items'][i].venue.url,
                            rating: data.groups[0]['items'][i].venue.rating,
                            location: data.groups[0]['items'][i].venue.location.formattedAddress.join(),
                            photo: data.groups[0]['items'][i].venue.categories[0].icon.prefix + data.groups[0]['items'][i].venue.categories[0].icon.suffix
                                // items.first.prefix + data.groups[0]['items'][i].venue.featuredPhones.items[0].suffix

                        };
                        // self.singleRestaurant[0] = {
                        //     name: data.groups[0]['items'][0].venue.name,
                        //     phone: data.groups[0]['items'][0].venue.contact.formattedPhone,
                        //     url: data.groups[0]['items'][0].venue.url,
                        //     rating: data.groups[0]['items'][0].venue.rating,
                        //     location: data.groups[0]['items'][0].venue.location.formattedAddress.join(),
                        //     photo: data.groups[0]['items'][0].venue.categories[0].icon.prefix + '88' + data.groups[0]['items'][i].venue.categories[0].icon.suffix
                        // }
                    }

                    initWheel();
                    createSections(self.restaurants);
                })
                .error(function(data) {
                    console.log("====ERROR=====");
                });
        }

    }
})();
