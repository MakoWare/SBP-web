//Routes Table Controller
var RoutesTableCtrl = function($scope, $location, $modalInstance, ParseService, GlobalService, currentWall){

    $scope.init = function(){
        console.log("RoutesTableCtrl");
        $scope.routesToAdd = [];
        $scope.setters = [];
        $scope.spinning = false;
        $scope.getSetters();
    },

    $scope.getSetters = function(){
        var currentUser = ParseService.getCurrentUser();
        ParseService.getUsersByGym(currentUser.get('currentGym'), function(results){
            $scope.setters = results;
            $scope.$apply();
        });
    };


    $scope.addRoute = function(){
        var newRoute = ParseService.createRoute();
        newRoute.set("wall", currentWall);
        newRoute.set("color", "gray");
        newRoute.set("grade", "0");
        $scope.routesToAdd.push(newRoute);
        console.log($scope.routesToAdd);
    };


    $scope.removeRoute = function(routeToRemove){
        console.log("hi");
        for(var i = 0; i < $scope.routesToAdd.length; i++){
            var currentRoute = $scope.routesToAdd[i];
            if(currentRoute.id == routeToRemove.id){
                $scope.routesToAdd.splice(i, 1);
            }
        }
    };


    //Status Changed
    $scope.changeStatus = function(route){
        var currentStatus = route.attributes.status;
        switch(currentStatus){
        case "0":
            route.attributes.status = "1";
            $("#" + route.cid).attr("src", "/images/line1.svg");
            break;
        case "1":
            route.attributes.status = "2";
            $("#" + route.cid).attr("src", "/images/line2.svg");
            break;
        case "2":
            route.attributes.status = "3";
            $("#" + route.cid).attr("src", "/images/line3.svg");
            break;
        case "3":
            route.attributes.status = "4";
            $("#" + route.cid).attr("src", "/images/line4.svg");
            break;
        case "4":
            route.attributes.status = "5";
            $("#" + route.cid).attr("src", "/images/line5.svg");
            break;
        case "5":
            route.attributes.status = "6";
            $("#" + route.cid).attr("src", "/images/line6.svg");
            break;
        case "6":
            route.attributes.status = "0";
            $("#" + route.cid).attr("src", "/images/line0.svg");
            break;
        }
    };

    $scope.saveRoutes = function(){

        var routes = $scope.routesToAdd;
        console.log(routes);

        var routePromises = [];
        routes.forEach(function(route){
            for(var attr in route.attributes) {
                route.set(attr, route.attributes[attr]);
            }
            routePromises.push(ParseService.saveRoute(route, function(){
                console.log("done saving route");
            }));
        });

        Parse.Promise.when(routePromises).then(function(){
            $modalInstance.close(routes);
        });
    };

    $scope.ok = function () {
        $scope.saveRoutes();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init();
};
