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
            //GlobalService.dismissSpinner();
            $scope.routes = results;
            $scope.$apply();
            $scope.getSetters();
            $scope.getWalls();

            angular.forEach($scope.routes, function (route) {
                route.grade = parseFloat(route.attributes.grade);
            });
        });
    };


    //Get Setters
    $scope.getSetters = function(){
        if(!$scope.spinner){
            GlobalService.showSpinner();
            $scope.spinner = true;
        }
        var currentUser = ParseService.getCurrentUser();
        ParseService.getUsersByGym(currentUser.get("currentGym"), function(results){
            if($scope.spinner){
                GlobalService.dismissSpinner();
                $scope.spinner = false;
            }
            $scope.setters = results;
            $scope.routes.forEach(function(route){
                var currentStatus = route.attributes.status;
                switch(currentStatus){
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
            });
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
            $("#" + route.id).attr("src", "");
            break;
        }

        $scope.saveRoute(route);
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


    //Get Walls
    $scope.getWalls = function(){
        if(!$scope.spinner){
            GlobalService.showSpinner();
            $scope.spinner = true;
        }
        var currentUser = ParseService.getCurrentUser();
        ParseService.getWallsByGym(currentUser.get('currentGym'), function(results){
            if($scope.spinner){
                GlobalService.dismissSpinner();
                $scope.spinner = false;
            }
            $scope.walls = results;
            $scope.routes.forEach(function(route){
                var currentWall = route.attributes.wall;
                results.forEach(function(wall){
                    if(currentWall && currentWall.id == wall.id){
                        route.attributes.wall = wall;
                    }
                });
            });
            $scope.$apply();
        });
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
                    $scope.getWalls();
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
            GlobalService.dismissSpinner();
            $scope.getRoutes();
            $scope.$apply();
        });
    };

    //Save Route
    $scope.saveRoute = function(route){
        GlobalService.showSpinner();
        var spinning = true;
        ParseService.saveRoute(route, function(results){
            if(spinning){
                GlobalService.dismissSpinner();
                spinning = false;
            }
        });
    };


    $scope.init();
};
