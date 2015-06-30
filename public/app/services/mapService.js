angular.module('mapService', []) 

.factory('Map', function() {
  
	var mapFactory = {};

	mapFactory.initialize = function(center, zoom){

		var mapOptions = {
        center: center,
        zoom: zoom,
        scrollwheel: false
      	};
      	
      	var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

	}
	
	return mapFactory; 
});