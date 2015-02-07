//Routes Controller
var RoutesCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RoutesCtrl");
        $scope.predicate = "attributes.order";
        $scope.secondary = "grade";
        $scope.getRoutes();
        $scope.setUpDatePicker();
    },

    //Get Routes
    $scope.getRoutes = function(){
        GlobalService.showSpinner();
        $scope.spinner = true;
        ParseService.getRoutes(function(results){
            GlobalService.dismissSpinner();
            $scope.routes = results;
            $scope.$apply();
            $scope.$broadcast('newRoutes');
        });
    };

    //Set up Date Picker
    $scope.setUpDatePicker = function(){
        $scope.today = function() {
            $scope.dt = null;
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.format = 'dd-MMMM-yyyy';
    };

    //Date Selected
    $scope.dateSelected = function(){
        $scope.$broadcast("dateSelected");
    };

    //Delete Route
    $scope.deleteRoute = function(route){
        GlobalService.showSpinner();
        ParseService.deleteRoute(route, function(results){
            GlobalService.dismissSpinner();
            $scope.getRoutes();
            $scope.$apply();
        });
    };

    $scope.init();
};
