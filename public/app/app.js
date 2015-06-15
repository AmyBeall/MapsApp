angular.module('userApp', ['ngAnimate', 'app.routes', 'mainCtrl', 'userCtrl', 'authService', 'userService'])
.config(function($httpProvider) {

// attach our auth interceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');
});