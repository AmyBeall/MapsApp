angular.module('app.routes', ['ngRoute']) 

.config(function($routeProvider, $locationProvider) {
	
	$routeProvider
    
    	.when('/', {
    		templateUrl : 'app/views/pages/getInfo.html',
    		controller  : 'mapController',
	    	controllerAs: 'map' 
		})
		.when('/route', {
			templateUrl : 'app/views/pages/getRoute.html',
			controller  : 'routeController',
	    	controllerAs: 'route'
		})
	
	$locationProvider.html5Mode(true); 

});