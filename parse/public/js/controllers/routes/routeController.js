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

    //Save Route
    $scope.saveRoute = function(){
        GlobalService.showSpinner();

        var route = $scope.route;

        route.set("name", route.attributes.name);
        route.set("description", route.attributes.description);
        route.set("difficulty", route.attributes.difficulty);
        route.set("holds", route.attributes.holds);

        //Get Color
        var hex = $("#colorPicker").val();
        route.set("colorHex", hex);

        switch(hex){
        case "000000":
            route.set("colorName", "black");
            break;
        case "ffffff":
            route.set("colorName", "white");
            break;
        case "ff0000":
            route.set("colorName", "red");
            break;
        case "ffff00":
            route.set("colorName", "yellow");
            break;
        case "008000":
            route.set("colorName", "green");
            break;
        case "0000ff":
            route.set("colorName", "blue");
            break;
        case "800080":
            route.set("colorName", "purple");
            break;
        case "ff6600":
            route.set("colorName", "orange");
            break;
        }

        if(route.attributes.colorName == ""){
            route.set("colorName", "grey");
        }

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
