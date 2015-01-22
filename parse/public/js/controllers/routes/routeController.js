//Route Controller
var RouteCtrl = function($scope, $location, $modal, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RouteCtrl");
        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.title = "New Route";
            $scope.createRoute();
        } else {
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
            $scope.route = results;
            console.log(results);
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
