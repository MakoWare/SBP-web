//Routes Controller
var RoutesCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RoutesCtrl");
        GlobalService.showSpinner();
        $scope.getRoutes();
        $scope.predicate = "attributes.grade";
    },

    //Get Routes
    $scope.getRoutes = function(){
        ParseService.getRoutes(function(results){
            GlobalService.dismissSpinner();
            $scope.routes = results;
            console.log(results);
            $scope.$apply();
        });
    };

    //Add Route
    $scope.addRoute = function(){
        $location.path("/routes/create");
    };

    //Edit Route
    $scope.editRoute = function(route){
        $location.path("/routes/" + route.id);
    };

    //Delete Route
    $scope.deleteRoute = function(route){
        GlobalService.showSpinner();
        ParseService.deleteRoute(route, function(results){
            $scope.getRoutes();

            $scope.$apply();
        });
    };

    //Save Route
    $scope.saveRoute = function(route){



    };



    $scope.init();
};
