//Routes Controller
var RoutesCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RoutesCtrl");
        $scope.predicate = "attributes.grade";
        GlobalService.showSpinner();
        $scope.getRoutes();
    },

    //Get Routes
    $scope.getRoutes = function(){
        ParseService.getRoutes(function(results){
            GlobalService.dismissSpinner();
            $scope.routes = results;
            console.log(results);
            $scope.$apply();
            $scope.getSetters();
        });
    };

    //Get Setters
    $scope.getSetters = function(){
        var currentUser = ParseService.getCurrentUser();
        ParseService.getUsersByGym(currentUser.get("currentGym"), function(results){
            $scope.setters = results;
            $scope.routes.forEach(function(route){
                var currentSetter = route.attributes.setter;
                results.forEach(function(setter){
                    if(currentSetter && currentSetter.id == setter.id){
                        route.attributes.setter = setter;
                    }
                });
            });
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
        GlobalService.showSpinner();
        route.set("status", route.attributes.status);
        route.set("setter", route.attributes.setter);
        route.save({
            success: function(route){
                GlobalService.dismissSpinner();
            },
            error: function(route, error){
                console.log(error);
            }
        });
    };



    $scope.init();
};
