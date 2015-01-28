//Routes Controller
var RoutesCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("RoutesCtrl");
        $scope.predicate = "attributes.grade";
        //$scope.getRoutes();

        $scope.setUpDatePicker();
        $scope.searchRoutes();
    },

    //Get Routes
    $scope.getRoutes = function(){
        GlobalService.showSpinner();
        ParseService.getRoutes(function(results){
            GlobalService.dismissSpinner();
            $scope.routes = results;
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

    $scope.setUpDatePicker = function(){
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    };

    //Search Routes
    $scope.searchRoutes = function(){
        if($scope.dt){
            GlobalService.showSpinner();
            var query = new Parse.Query("Route");

            var beginDate = new Date($scope.dt);
            beginDate.setHours(0, 0, 0, 0);

            var endDate = new Date($scope.dt);
            endDate.setHours(23,59,59,999);

            query.greaterThan("createdAt", beginDate);
            query.lessThan("createdAt", endDate);

            query.find({
                success: function(results){
                    GlobalService.dismissSpinner();
                    $scope.routes = results;
                    $scope.getSetters();
                    $scope.$apply();
                },
                error: function(error){
                    console.log(error);
                }
            });
        } else {
            $scope.getRoutes();
        }
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
        route.set("grade", route.attributes.grade);
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
