(function() {

  angular
    .module('iffy_app')
    .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['$http', '$stateParams', '$cordovaGeolocation', 'ApiEndpoint'];

    function ApplicationController($http, $stateParams, $cordovaGeolocation, ApiEndpoint) {

      var self = this; 
 

      var testCanvas = document.getElementById("testCanvas");

      // Geolocation for user
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
        
           self.lat = position.coords.latitude;
           self.long = position.coords.longitude;
          // console.log(lat + " " + long)
          // return lat;
        }, function(err) {
          console.log("error getting location")
        });

       
      // // Test for integrating three.js
      // var scene = new THREE.Scene();
      // var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

      // var renderer = new THREE.WebGLRenderer();
      // renderer.setSize( window.innerWidth, window.innerHeight );
      // testCanvas.appendChild( renderer.domElement );

      // var material = new THREE.MeshBasicMaterial({
      //   color: 0x0000ff,
      //   wireframe: true
      // });

      // var radius = 1;
      // var segments = 32;

      // var circleGeometry = new THREE.CircleGeometry( radius, segments );        
      // var circle = new THREE.Mesh( circleGeometry, material );

      // scene.add( circle );

      

      // camera.position.z = 5;

      // var render = function () {
      //   requestAnimationFrame( render );

      //   circle.rotation.x += 0.1;
      //   circle.rotation.y += 0.1;

      //   renderer.render(scene, camera);
      // };

      // render();
 self.restaurants = [];
 self.singleRestaurant = [];
      // get restaurant results from foursquare api
      $http.get(ApiEndpoint.url)
          .success(function(data){
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
              self.singleRestaurant[0] = {
                  name: data.groups[0]['items'][0].venue.name,
                  phone: data.groups[0]['items'][0].venue.contact.formattedPhone,
                  url: data.groups[0]['items'][0].venue.url,
                  rating: data.groups[0]['items'][0].venue.rating,
                  location: data.groups[0]['items'][0].venue.location.formattedAddress.join(),
                  photo: data.groups[0]['items'][0].venue.categories[0].icon.prefix + '88' + data.groups[0]['items'][i].venue.categories[0].icon.suffix}
  console.log(all);
            } 
               
          });

      var postData = {
        // ll: lat + ", " + long,
        terms: 'coffee, fast, cheap'
      };
      
    
    }

})();
