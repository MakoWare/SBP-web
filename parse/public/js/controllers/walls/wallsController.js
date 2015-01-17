//Walls Controller
var WallsCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("WallsCtrl");

        $scope.currentUser = ParseService.getCurrentUser();
    },

    $scope.getWallsByGym = function(){
        var gym = $scope.currentUser.get("currentGym");
        ParseService.getWallsByGym(gym, function(results){
            $scope.walls = results;
            $scope.$apply();
        });
    };


    $scope.init();
};
