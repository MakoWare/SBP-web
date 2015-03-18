//Routes Modal Controller
var RoutesModalCtrl = function($scope, $location, $modalInstance, ParseService, GlobalService, currentWall, backUpRoutes){

    $scope.init = function(){
        console.log("RoutesTableCtrl");
        $scope.routesToAdd = [];
        $scope.setters = [];
        $scope.spinning = false;
        $scope.routesToGenerate = 0;
        $scope.getSetters();
        $scope.predicate = "attributes.order";
        $scope.secondary = "attributes.grade";

        //$scope.setTableHeight();
        $(window).resize(function(){
            $scope.setTableHeight();
        });

    },

    //Set Table Height
    $scope.setTableHeight = function(){
        var windowHeight = $(window).height();
        var tableOffsetTop = $('#tableModalContainer').offset().top;
        var margin = .75;
        var tableHeight = (windowHeight - tableOffsetTop) * margin;

        $('#tableModalContainer').height(tableHeight + "px");
    };


    $scope.getSetters = function(){
        var currentUser = ParseService.getCurrentUser();
        ParseService.getUsersByGym(currentUser.get('currentGym'), function(results){
            $scope.setters = results;
            $scope.setTableHeight();
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

    $scope.autoGenRoutes = function(){
        ParseService.autoGenRoutes(currentWall.attributes.gym, $scope.routesToGenerate, function(results){
            console.log(results);
            $scope.routesToAdd = results;
        });
    };

    $scope.saveRoutes = function(){
        GlobalService.showSpinner();
        var routes = $scope.routesToAdd;


        var routePromises = [];
        routes.forEach(function(route){
            for(var attr in route.attributes) {
                route.set(attr, route.attributes[attr]);
            }
            routePromises.push(ParseService.saveRoute(route, function(){
                GlobalService.dismissSpinner();
                console.log("done saving route");
            }));
        });

        Parse.Promise.when(routePromises).then(function(){
            $modalInstance.close(routes);
        });
    };


    //Generate Same Routes
    $scope.genSameRoutes = function(){
        console.log("genSameRoutes");
        console.log(backUpRoutes);
        backUpRoutes.forEach(function(route){
            var newRoute = ParseService.createRoute();
            newRoute.set("wall", currentWall);
            newRoute.set("color", route.attributes.color);
            newRoute.set("grade", route.attributes.grade);
            newRoute.set("order", route.attributes.order);
            $scope.routesToAdd.push(newRoute);
        });
    };


    $scope.ok = function () {
        $scope.saveRoutes();
        $modalInstance.close($scope.routesToAdd);
        //$modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init();
};
