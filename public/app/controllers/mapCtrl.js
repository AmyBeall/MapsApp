angular.module('mapCtrl', [])

.controller('mapController', function($scope) {

	var ctrl = this;
	ctrl.processing = true;

	function initialize() {
      var mapOptions = {
        center: { lat:37.7906212, lng:-122.4347935 },
        zoom: 14,
        scrollwheel: false,
        panControl: true,
        zoomControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
      };
      document.getElementById('map-canvas').className="map1";
      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
    }

  initialize();
});