'use strict';

angular.module('sbp', [
    'navigation',
    'parseService',
    'globalService',
    'ui.bootstrap',
    'ngRoute'
  ])
  .config(function ($routeProvider, $controllerProvider) {
    $routeProvider
//Login
      .when('/', {
        templateUrl: 'components/login/login.html',
        controller: 'LoginCtrl'
      })
//Gyms
      .when('/gyms', {
        templateUrl: 'components/pages/gyms/gyms.html',
        controller: 'GymsCtrl'
      })
      .when('/gyms/:id', {
        templateUrl: 'components/pages/gym/gym.html',
        controller: 'GymCtrl'
      })
//Walls
      .when('/walls', {
        templateUrl: 'components/pages/walls/walls.html',
        controller: 'WallsCtrl'
      })
      .when('/walls/:id', {
        templateUrl: 'components/pages/wall/wall.html',
        controller: 'WallCtrl'
      })
//Routes
      .when('/routes', {
        templateUrl: 'components/pages/routes/routes.html',
        controller: 'RoutesCtrl'
      })
      .when('/routes/:id', {
        templateUrl: 'components/pages/route/route.html',
        controller: 'RouteCtrl'
      })
//Holds
      .when('/holds', {
        templateUrl: 'components/pages/holds/holds.html',
        controller: 'HoldsCtrl'
      })
      .when('/holds/:id', {
        templateUrl: 'components/pages/hold/hold.html',
        controller: 'HoldCtrl'
      })
//Users
      .when('/users', {
        templateUrl: 'components/pages/users/users.html',
        controller: 'UsersCtrl'
      })
      .when('/users/:id', {
        templateUrl: 'components/pages/user/user.html',
        controller: 'UserCtrl'
      })
//Otherwise
      .otherwise({
        redirectTo: '/'
      });
      $controllerProvider.allowGlobals();
  });
