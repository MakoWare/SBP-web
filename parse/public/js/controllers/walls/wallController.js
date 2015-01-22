//Wall Controller
var WallCtrl = function($scope, $location, $modal, ParseService, GlobalService){
    $scope.init = function(){
        console.log("WallCtrl");

        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.title = "New Wall";
            $scope.createWall();
        } else {
            $scope.getWall(last);
        }
    },

    //Create Wall
    $scope.createWall = function(){
        $scope.wall = ParseService.createWall();
        $scope.setUpWall();
    };

    //Get Wall
    $scope.getWall = function(id){
        ParseService.getWallById(id, function(results){
            $scope.wall = results;
            $scope.title = results.get("name");
            console.log(results);
            $scope.$apply();
        });
    };

    //Setup Wall
    $scope.setUpWall = function(){

    };


    //Create Modal
    $scope.createModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'partials/routes/routesTable.html',
            controller: 'RoutesTableCtrl',
            size: "lg",
            resolve: {
                currentRoutes: function () {
                    return $scope.wall.attributes.routes;
                }
            }
        });
        modalInstance.result.then(function(routes){
            console.log(routes);
        }, function () {
            console.log("modal closed");
        });
    };

    //Remove Route From Wall
    $scope.removeRouteFromWall = function(route){
        for(var i = 0; i < $scope.wall.attributes.routes.length; i++){
            var currentRoute = $scope.wall.attributes.routes[i];
            if(currentRoute.id == route.id){
                $scope.wall.attributes.routes.splice(i, 1);
            }
        }
    };

    //View Route
    $scope.viewRoute = function(route){
        $location.path("routes/" + route.id);
    };


    //Save Wall
    $scope.saveWall = function(){
        GlobalService.showSpinner();
        var wall = $scope.wall;
        console.log($scope.wall);
        wall.set("name", wall.attributes.name);
        wall.set("routes", wall.attributes.routes);
        wall.save({
            success: function(wall){
                GlobalService.dismissSpinner();
                $location.path("/walls");
                $scope.$apply();
            },
            error: function(wall, error){
                alert(GlobalService.errorMessage + error.message);
            }
        });

    };

    $scope.init();
};
