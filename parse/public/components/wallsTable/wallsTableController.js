//Walls Table Controller
var WallsTableCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("WallsTableCtrl");
        $scope.currentUser = ParseService.getCurrentUser();
        $scope.predicate = 'attributes.name';
        $scope.getWalls();
    },

    //Get Walls
    $scope.getWalls = function(){
        ParseService.getWallsByGym($scope.currentUser.attributes.currentGym, function(results){
            $scope.walls = results;
            $scope.$apply();
        });
    };


    //Remove Wall From Gym
    $scope.removeWallFromGym = function(wall){
        alert("Contact Dylan to Complete this dangerous action");
    };

    $scope.init();
};
