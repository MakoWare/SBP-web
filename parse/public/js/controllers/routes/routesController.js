//Routes Controller
var RoutesCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RoutesCtrl");

        $scope.getRoutes();
    },

    //Get Routes
    $scope.getRoutes = function(){
        ParseService.getRoutes(function(results){
            $scope.routes = results;
            $scope.$apply();
        });
    };

    //Add Route
    $scope.addRoute = function(){
        $location.path("/routes/create");
        //$scope.$apply();
    };

    //Delete Route
    $scope.deleteRoute = function(route){
        ParseService.deleteRoute(route, function(results){

        });
    };



    $scope.init();
};
