//Walls Table Controller
var WallsTableCtrl = function($scope, $location, $modalInstance, ParseService, GlobalService, currentWalls){

    $scope.init = function(){
        $scope.currentUser = ParseService.getCurrentUser();
        console.log("WallsTableCtrl");
        console.log(currentWalls);
        $scope.getWalls();
    },

    //Get Walls
    $scope.getWalls = function(){
        ParseService.getWallsByGym($scope.currentUser.attributes.currentGym, function(results){
            $scope.walls = results;

            $scope.walls.forEach(function(wall){
                wall.attributes.add = false;
                currentWalls.forEach(function(currentWall){
                    if(wall.id == currentWall.id){
                        wall.attributes.add = true;
                    }
                });
            });
            $scope.$apply();
        });
    };

    //Row Clicked
    $scope.rowClicked = function(wall){
        wall.attributes.add = !wall.attributes.add;
        if(wall.attributes.add){
            var hasWall = false;
            currentWalls.forEach(function(currentWall){
                if(currentWall.id == wall.id){
                    hasWall = true;
                }
            });
            if(!hasWall){
                currentWalls.push(wall);
            }
        } else {
            for(var i = 0; i < currentWalls.length; i++){
                var currentWall = currentWalls[i];
                if(currentWall.id == wall.id){
                    currentWalls.splice(i, 1);
                }
            }
        }
    };

    $scope.ok = function () {
        console.log(currentWalls);
        $modalInstance.close(currentWalls);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init();
};
