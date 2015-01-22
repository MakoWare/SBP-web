//Walls Controller
var WallsCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("WallsCtrl");
        GlobalService.showSpinner();
        $scope.currentUser = ParseService.getCurrentUser();
        $scope.getWallsByGym();
    },

    //Get Walls By Gym
    $scope.getWallsByGym = function(){
        var gym = $scope.currentUser.get("currentGym");
        ParseService.getWallsByGym(gym, function(results){
            GlobalService.dismissSpinner();
            console.log(results);
            $scope.walls = results;
            $scope.$apply();
        });
    };

    //Add Wall
    $scope.addWall = function(){
        $location.path("/walls/create");
    };

    //Edit Wall
    $scope.viewWall = function(wall){
        $location.path("/walls/" + wall.id);
    };

    //Delete Wall
    $scope.deleteWall = function(wall){

    };

    $scope.init();
};
