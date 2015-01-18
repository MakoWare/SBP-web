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
            $scope.$apply();
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
            console.log(holds);
        }, function () {
            console.log("modal closed");
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
        $(".pick-a-color").pickAColor({
            showSpectrum            : false,
            showSavedColors         : false,
            saveColorsPerElement    : false,
            fadeMenuToggle          : true,
            showHexInput            : false,
            showAdvanced            : true,
            showBasicColors         : true,
            allowBlank              : false,
            inlineDropdown          : true
        });
    };


    $scope.init();
};
