//Routes Table Controller
var RoutesTableCtrl = function($scope, $location, $modalInstance, ParseService, GlobalService, currentRoutes){

    $scope.init = function(){
        console.log("RoutesTableCtrl");
        console.log(currentRoutes);
        $scope.getRoutes();
        $scope.setUpDatePicker();
    },

    //Get Routes
    $scope.getRoutes = function(){
        GlobalService.showSpinner();
        ParseService.getRoutes(function(results){
            $scope.routes = results;
            $scope.getSetters();
            $scope.routes.forEach(function(route){
                route.attributes.add = false;
                currentRoutes.forEach(function(currentRoute){
                    if(route.id == currentRoute.id){
                        route.attributes.add = true;
                    }
                });
            });
            GlobalService.dismissSpinner();
            $scope.$apply();
        });
    };

    //Search Routes
    $scope.searchRoutes = function(){
        if($scope.dt){
            var query = new Parse.Query("Route");

            var beginDate = new Date($scope.dt);
            beginDate.setHours(0, 0, 0, 0);

            var endDate = new Date($scope.dt);
            endDate.setHours(23,59,59,999);

            query.greaterThan("createdAt", beginDate);
            query.lessThan("createdAt", endDate);

            query.find({
                success: function(results){
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
            $scope.dt = null;
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



    //Row Clicked
    $scope.rowClicked = function(route){
        route.attributes.add = !route.attributes.add;
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
