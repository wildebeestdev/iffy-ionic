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
          console.log(self.lat + " " + self.long)
        }, function(err) {
          console.log("error getting location")
        });

      // Test for integrating three.js
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      testCanvas.appendChild( renderer.domElement );

      var material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true
      });

      var radius = 1;
      var segments = 32;

      var circleGeometry = new THREE.CircleGeometry( radius, segments );        
      var circle = new THREE.Mesh( circleGeometry, material );

      scene.add( circle );

      

      camera.position.z = 5;

      var render = function () {
        requestAnimationFrame( render );

        circle.rotation.x += 0.1;
        circle.rotation.y += 0.1;

        renderer.render(scene, camera);
      };

      render();

      // get restaurant results from foursquare api
      $http.get(ApiEndpoint.url)
          .success(function(data){
            console.log(data);
            for (var i = 0; i < data.length; i++) {
              self.restaurants[i] = {
                name: data[i].hash.name,
                phone: data[i].hash.phone,
                rating: data[i].hash.rating,
                locationLine1: data[i].hash.location.display_address[0],
                locationLine2: data[i].hash.location.display_address[2],
                id: data[i].hash.id
              };
            }          
          });

      var postData = {
        ll: '33.9716350,-118.4499780',
        terms: 'coffee, fast, cheap'
      };

      // $http.post(ApiEndpoint.url + '/restaurants', postData)
      //     .success(function(data){
      //           console.log(data);
      //     });
    
    }

})();
