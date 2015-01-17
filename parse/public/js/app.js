'use strict';

angular.module('sbp', [
    'navigation',
    'parseService',
    'globalService',
    'ui.bootstrap',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
//Login
      .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      })
//Gyms
      .when('/gyms', {
        templateUrl: 'partials/gyms/gyms.html',
        controller: 'GymsCtrl'
      })
      .when('/gyms/:id', {
        templateUrl: 'partials/gyms/gym.html',
        controller: 'GymCtrl'
      })
//Walls
      .when('/walls', {
        templateUrl: 'partials/walls/walls.html',
        controller: 'WallsCtrl'
      })
      .when('/walls/:id', {
        templateUrl: 'partials/walls/wall.html',
        controller: 'WallCtrl'
      })
//Routes
      .when('/routes', {
        templateUrl: 'partials/routes/routes.html',
        controller: 'RoutesCtrl'
      })
      .when('/routes/:id', {
        templateUrl: 'partials/routes/route.html',
        controller: 'RouteCtrl'
      })
//Holds
      .when('/holds', {
        templateUrl: 'partials/walls/walls.html',
        controller: 'WallsCtrl'
      })
      .when('/walls/:id', {
        templateUrl: 'partials/walls/wall.html',
        controller: 'WallCtrl'
      })
//Otherwise
      .otherwise({
        redirectTo: '/'
      });
  });
