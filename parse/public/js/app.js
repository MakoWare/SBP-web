'use strict';

angular.module('sbp', [
    'parseService',
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
//Walls
      .when('/walls', {
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
