//Routes Table Controller
var RoutesTableCtrl = function($scope, $location, $modalInstance, ParseService, GlobalService, currentRoutes){

    $scope.init = function(){
        console.log("RoutesTableCtrl");
        console.log(currentRoutes);
        $scope.getRoutes();
    },

    //Get Routes
    $scope.getRoutes = function(){
        ParseService.getRoutes(function(results){
            $scope.routes = results;

            $scope.routes.forEach(function(route){
                currentRoutes.forEach(function(currentRoute){
                    if(route.id == route.id){
                        route.attributes.add = true;
                    }
                });
            });
            $scope.$apply();
        });
    };

    //Add Route
    $scope.addRoute = function(route){
        if(route.attributes.add){
            var hasRoute = false;
            currentRoutes.forEach(function(currentRoute){
                if(currentRoute.id == route.id){
                    hasRoute = true;
                }
            });
            if(!hasRoute){
                currentRoutes.push(route);
            }
        } else {
            for(var i = 0; i < currentRoutes.length; i++){
                var currentRoute = currentRoutes[i];
                if(currentRoute.id == route.id){
                    currentRoutes.splice(i, 1);
                }
            }
        }
    };

    $scope.ok = function () {
        console.log(currentRoutes);
        $modalInstance.close(currentRoutes);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init();
};
