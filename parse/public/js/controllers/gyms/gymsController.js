//Gyms Controller
var GymsCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("GymsCtrl");
        $scope.getGyms();
    };

    //Add Gyms
    $scope.addGym = function(){
        var newPath = "/gyms/create";
        $location.path(newPath);
    };

    //Get Gyms
    $scope.getGyms = function(){
        ParseService.getGyms(function(results){
            $scope.gyms = results;
            $scope.calculateRoutes();
            $scope.$apply();
            console.log(results);
        });
    };


    //Calculate Routes
    $scope.calculateRoutes = function(){
        $scope.gyms.forEach(function(gym){
            gym.attributes.routes = [];
            gym.attributes.walls.forEach(function(wall){
                wall.attributes.routes.forEach(function(route){
                    gym.attributes.routes.push(route);
                });
            });
        });
        console.log($scope.gyms);
    };

    //Set Gym
    $scope.setGym = function(gym){
        GlobalService.showSpinner();
        ParseService.setCurrentGym(gym, function(results){
            GlobalService.dismissSpinner();
            console.log(results);
        });
    };

    //View Gym
    $scope.viewGym = function(gym){
        $location.path("/gyms/" + gym.id);
    };

    $scope.init();
};
