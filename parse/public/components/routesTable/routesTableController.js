//Routes Table Controller
var RoutesTableCtrl = function($scope, $location, ParseService, GlobalService){

    $scope.init = function(){
        console.log("RoutesTableCtrl");


        $scope.$on('newRoutes', function(event, args) {
            console.log("oh, new Routes");
            $scope.setupRoutes();
        });

        $scope.$on('dateSelected', function(event, args) {
            console.log("oh, new Date");
        });
    },


    $scope.setupRoutes = function(){
        angular.forEach($scope.wall.attributes.routes, function (route) {
            if(route){
                route.grade = parseFloat(route.attributes.grade);
            }
        });
        $scope.getSetters();
    };

    //Get Setters
    $scope.getSetters = function(){
        GlobalService.showSpinner();
        var currentUser = ParseService.getCurrentUser();
        ParseService.getUsersByGym(currentUser.get("currentGym"), function(results){
            $scope.setters = results;
            $scope.routes.forEach(function(route){
                if(route){
                    var currentStatus = route.attributes.status;
                    switch(currentStatus){
                    case "0":
                        $("#" + route.id).attr("src", "/images/line0.svg");
                        break;
                    case "1":
                        $("#" + route.id).attr("src", "/images/line1.svg");
                        break;
                    case "2":
                        $("#" + route.id).attr("src", "/images/line2.svg");
                        break;
                    case "3":
                        $("#" + route.id).attr("src", "/images/line3.svg");
                        break;
                    case "4":
                        $("#" + route.id).attr("src", "/images/line4.svg");
                        break;
                    case "5":
                        $("#" + route.id).attr("src", "/images/line5.svg");
                        break;
                    case "6":
                        $("#" + route.id).attr("src", "/images/line6.svg");
                        break;
                    }

                    var currentSetter = route.attributes.setter;
                    results.forEach(function(setter){
                        if(currentSetter && currentSetter.id == setter.id){
                            route.attributes.setter = setter;
                        }
                    });
                }
            });
            $scope.$apply();
            GlobalService.dismissSpinner();
        });
    };



    //Save Route
    $scope.saveRoute = function(route){
        GlobalService.showSpinner();
        ParseService.saveRoute(route, function(results){
            GlobalService.dismissSpinner();
        });
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


    //Delete Route
    $scope.deleteRoute = function(route){
        GlobalService.showSpinner();

        for(var i = 0; i < $scope.routesToAdd.length; i++){
            var currentRoute = $scope.routesToAdd[i];
            if(currentRoute.id == route.id){
                $scope.routesToAdd.splice(i, 1);
            }
        }


        ParseService.deleteRoute(route, function(results){
            GlobalService.dismissSpinner();
            $scope.getWall();
            $scope.$apply();
        });
    };


    //Status Changed
    $scope.changeStatus = function(route){
        var currentStatus = route.attributes.status;
        switch(currentStatus){
        case "0":
            route.attributes.status = "1";
            $("#" + route.id).attr("src", "/images/line1.svg");
            break;
        case "1":
            route.attributes.status = "2";
            $("#" + route.id).attr("src", "/images/line2.svg");
            break;
        case "2":
            route.attributes.status = "3";
            $("#" + route.id).attr("src", "/images/line3.svg");
            break;
        case "3":
            route.attributes.status = "4";
            $("#" + route.id).attr("src", "/images/line4.svg");
            break;
        case "4":
            route.attributes.status = "5";
            $("#" + route.id).attr("src", "/images/line5.svg");
            break;
        case "5":
            route.attributes.status = "6";
            $("#" + route.id).attr("src", "/images/line6.svg");
            break;
        case "6":
            route.attributes.status = "0";
            $("#" + route.id).attr("src", "/images/line0.svg");
            break;
        }
        $scope.saveRoute(route);
    };


    $scope.init();
};
