angular.module('routeCtrl', [])

.controller('routeController', function($scope, $timeout) {

	$scope.info = {}
	var ctrl = this;

	var geocoder;
	var directionsDisplay;
	var directionsDisplay1;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var start = '';
	var selectedMode = '';
	var end = new google.maps.LatLng(37.785636,-122.397119);
	
	function initialize() {
		geocoder = new google.maps.Geocoder();
		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay1 = new google.maps.DirectionsRenderer();
	  	var mapOptions = {
	    	zoom: 17,
	    	center: end,
	    	scrollwheel: false,
	    	panControl: true,
	    	zoomControl: true,
    		panControlOptions: {
		        position: google.maps.ControlPosition.LEFT_BOTTOM
	    	},
	    	zoomControlOptions: {
		        position: google.maps.ControlPosition.LEFT_CENTER
	    	}
	  	}
	  	document.getElementById('map-canvas').className="map";
	 	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	  	service = new google.maps.places.PlacesService(map);
	  	directionsDisplay.setMap(map);
	  	directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	}
	initialize();

	function autoStart(){
		var input = document.getElementById("start");

	  	var autocomplete = new google.maps.places.Autocomplete(input);
	  	autocomplete.bindTo('bounds', map);

	  	google.maps.event.addListener(autocomplete, 'place_changed', function() {
	    	var place = autocomplete.getPlace();
		    if (!place.geometry) {
		    	window.alert("Autocomplete's returned place contains no geometry");
		      	return;
		    }

		    $scope.info.start = place.formatted_address;
		    $scope.$apply();
		    start = place.geometry.location;

		    if (place.geometry.viewport) {
		    	map.fitBounds(place.geometry.viewport);
		    } else {
		    	map.setCenter(place.geometry.location);
		    	map.setZoom(17);
		    }

		    var address = '';
		    if (place.address_components) {
		    	address = [
		        	(place.address_components[0] && place.address_components[0].short_name || ''),
		        	(place.address_components[1] && place.address_components[1].short_name || ''),
		        	(place.address_components[2] && place.address_components[2].short_name || '')
		      	].join(' ');
		    }
		});	
	}
	autoStart();

	
	var calcResponse = {};

	ctrl.calcRoute = function(mode) {

		selectedMode = mode;
	  	var request = {
	    	origin: start,
	    	destination: end,
	      	provideRouteAlternatives: true,
	      	travelMode: google.maps.TravelMode[selectedMode]
	  	}
	  	directionsService.route(request, function(response, status) {
	    	if (status == google.maps.DirectionsStatus.OK) {
	      		directionsDisplay.setDirections(response);
	      		calcResponse = response;
	      	}		
		});

	} 
	var Polylines = [];
	var waypoints = [];
	var points = [];
	ctrl.wayPts = function(query){
		if(selectedMode != 'TRANSIT'){
	     	for (var i = 0; i < calcResponse.routes.length; i++){
				Polylines.push(calcResponse.routes[i].overview_path);  
				closest_loc	= Polylines[0][0];
	  		}
	  	 } else if (selectedMode == 'TRANSIT'){
        	for( var i = 0; i < calcResponse.routes[0].legs[0].steps.length; i++){
        		if(calcResponse.routes[0].legs[0].steps[i].travel_mode == "WALKING"){
        			for(var j = 0; j < calcResponse.routes[0].legs[0].steps[i].path.length; j++){
        				Polylines.push(calcResponse.routes[0].legs[0].steps[i].path[j]);
        				closest_loc	= Polylines[0];
        			}	
        		};
        	}
        }	
	  	
	  		function getClosest(query){
				var request = {
			    	location: closest_loc,
			    	radius: '1',
			    	query: query,
			    	openNow: true
		  		};
				service.textSearch(request, callback);

				function callback(results, status) {

			  		if (status == google.maps.places.PlacesServiceStatus.OK) {
		  				place = results[0];
		  				addMarker(place.geometry.location);
		  					waypoints.push({location: place.geometry.location, stopover:true});
			      	}
	      		}
	     
	  		} 
	  		getClosest(query);
	  		function addMarker(each_place) {
		        marker = new google.maps.Marker({
		            position: each_place,
		            map: map
		        });
	       		marker.setMap(map);
	       	}
       
	};
	
	ctrl.wholeRoute = function(){
		if(selectedMode != 'TRANSIT'){
	 		$timeout(function(){
		 		var request = {
			     	origin: start,
			     	destination: end,
			     	waypoints: waypoints,
					optimizeWaypoints: true,
			       	travelMode: google.maps.TravelMode[selectedMode]
			   	};
			   	directionsService.route(request, function(response, status) {
			     	if (status == google.maps.DirectionsStatus.OK) {
			      		directionsDisplay.setDirections(response);
			      		$scope.route = response;
			 		}
			 	})
			},1000); 
		} else {
			$timeout(function(){
				points = waypoints.length
				var request = {
			     	origin: start,
			     	destination: waypoints[points-1].location,
			     	waypoints: waypoints,
			       	travelMode: google.maps.TravelMode["WALKING"]
			   	};
			   	directionsService.route(request, function(response, status) {
			   		console.log(status);
			     	if (status == google.maps.DirectionsStatus.OK) {
			      		directionsDisplay.setDirections(response);
			      		$scope.route += response;
			 		}
			 	})
			 	
				var request1 = {
			     	origin: waypoints[points-1].location,
			     	destination: end,
			       	travelMode: google.maps.TravelMode[selectedMode]
			   	};
			   	directionsService.route(request1, function(response, status) {
			   		console.log(status);
			     	if (status == google.maps.DirectionsStatus.OK) {
			      		 directionsDisplay1.setDirections(response);
			      		 directionsDisplay1.setMap(map);
  						 directionsDisplay1.setPanel(document.getElementById("directionsPanel"));
			      		$scope.route += response;
			 		}
			 	})
		 	},1000); 
		}	
	}		
});
