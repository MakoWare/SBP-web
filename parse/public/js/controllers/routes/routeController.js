//Route Controller
var RouteCtrl = function($scope, $location, $modal, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RouteCtrl");

        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.title = "New Route";
            $scope.createRoute();
        } else {
            GlobalService.showSpinner();
            $scope.getRoute(last);
        }
    },

    //Create Route
    $scope.createRoute = function(){
        $scope.route = ParseService.createRoute();
        $scope.setUpRoute();
    };

    //Get Route
    $scope.getRoute = function(id){
        ParseService.getRouteById(id, function(results){
            GlobalService.dismissSpinner();
            $scope.route = results;
            $scope.title = results.attributes.name;
            $scope.$apply();
            $scope.setUpRoute();
        });
    };

    //Create Modal
    $scope.createModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'partials/holds/holdsTable.html',
            controller: 'HoldsTableCtrl',
            size: "lg",
            resolve: {
                currentHolds: function () {
                    return $scope.route.attributes.holds;
                }
            }
        });
        modalInstance.result.then(function(holds){

        }, function () {

        });
    };

    //Remove Hold
    $scope.removeHoldFromRoute = function(hold){
        for(var i = 0; i < $scope.route.attributes.holds.length; i++){
            var currentHold = $scope.route.attributes.holds[i];
            if(currentHold.id == hold.id){
                $scope.route.attributes.holds.splice(i, 1);
            }
        }
    };

    //Set Up Route
    $scope.setUpRoute = function(){
        //Get All Setters
        var user = ParseService.getCurrentUser();
        ParseService.getUsersByGym(user.get("currentGym"), function(results){
            $scope.setters = results;
            var currentSetter = $scope.route.attributes.setter;
            results.forEach(function(setter){
                if(currentSetter && currentSetter.id == setter.id){
                    $scope.route.attributes.setter = setter;
                }
            });
            $scope.$apply();
        });

    };

    //Save Route
    $scope.saveRoute = function(){
        GlobalService.showSpinner();

        var route = $scope.route;

        switch(route.attributes.color){
        case "gray":
            route.attributes.order = 0;
            break;
        case "yellow":
            route.attributes.order = 1;
            break;
        case "green":
            route.attributes.order = 2;
            break;
        case "red":
            route.attributes.order = 3;
            break;
        case "blue":
            route.attributes.order = 4;
            break;
        case "orange":
            route.attributes.order = 5;
            break;
        case "purple":
            route.attributes.order = 6;
            break;
        case "black":
            route.attributes.order = 7;
            break;
        };

        for(var attr in route.attributes) {
            route.set(attr, route.attributes[attr]);
        }


        console.log(route);
        $scope.route.save({
            success: function(route){
                GlobalService.dismissSpinner();
                $location.path("/routes");
                $scope.$apply();
            },
            error: function(route, error){

            }
        });
    };

    $scope.init();
};
