//Wall Controller
var WallCtrl = function($scope, $location, $modal, ParseService, GlobalService){
    $scope.init = function(){
        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.tab = "wallInfo";
            $scope.title = "New Wall";
            $scope.createWall();
        } else {
            $scope.tab = "routes";
            $scope.getWall();
        }
    },

    //Create Wall
    $scope.createWall = function(){
        $scope.wall = ParseService.createWall();

    };

    //Get Wall
    $scope.getWall = function(){
        GlobalService.showSpinner();
        var id = $location.url().split("/")[$location.url().split("/").length -1];
        ParseService.getWallById(id, function(results){
            GlobalService.dismissSpinner();
            $scope.wall = results;
            $scope.title = results.get("name");
            console.log(results);
            $scope.$apply();
            $scope.setUpWall();
        });
    };

    //Setup Wall
    $scope.setUpWall = function(){
        $scope.setUpDatePicker();
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
            query.equalTo("wall", $scope.wall);
            console.log(query);
            query.find({
                success: function(results){
                    GlobalService.dismissSpinner();
                    console.log(results);
                    $scope.wall.attributes.routes = results;
                    $scope.$apply();
                },
                error: function(error){
                    console.log(error);
                }
            });
        } else {
            $scope.getWall();
        }
    };

    //Create Modal
    $scope.createModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'partials/routes/routesTable.html',
            controller: 'RoutesTableCtrl',
            size: "lg",
            resolve: {
                currentRoutes: function () {
                    return $scope.wall.attributes.routes;
                }
            }
        });
        modalInstance.result.then(function(routes){
            console.log(routes);
        }, function () {
            console.log("modal closed");
        });
    };

    //Remove Route From Wall
    $scope.removeRouteFromWall = function(route){
        for(var i = 0; i < $scope.wall.attributes.routes.length; i++){
            var currentRoute = $scope.wall.attributes.routes[i];
            if(currentRoute.id == route.id){
                $scope.wall.attributes.routes.splice(i, 1);
            }
        }
    };

    //View Route
    $scope.viewRoute = function(route){
        $location.path("routes/" + route.id);
    };

    //Tab Clicked
    $scope.tabClicked = function(tab){
        if(tab == "routeDistribution"){
            $scope.generateRoutesGraph();
            $scope.tab = "routeDistribution";
        } else if(tab == "routes"){
            $scope.tab = "routes";
        } else if(tab == "holdDistribution"){
            $scope.generateHoldsDistroGraph();
            $scope.tab = "holdDistribution";
        } else if(tab == "wallInfo"){
            $scope.tab = "wallInfo";
        }
    };


    //Save Wall
    $scope.saveWall = function(){
        GlobalService.showSpinner();
        var wall = $scope.wall;
        console.log($scope.wall);
        wall.set("name", wall.attributes.name);
        wall.set("routes", wall.attributes.routes);

        //First Save each Route to the Wall
        var routePromises = [];
        wall.attributes.routes.forEach(function(route){
            route.set("wall", $scope.wall);
            routePromises.push(route.save());
        });

        Parse.Promise.when(routePromises).then(function(){
            wall.save({
                success: function(wall){
                    GlobalService.dismissSpinner();
                    $location.path("/walls");
                    $scope.$apply();
                },
                error: function(wall, error){
                    alert(GlobalService.errorMessage + error.message);
                }
            });
        });
    };

    //Take Down Routes
    $scope.takeDownRoutes = function(){
        GlobalService.showSpinner();
        var wall = $scope.wall;

        //First Give each Route a Taken Down Date.
        var routePromises = [];
        wall.attributes.routes.forEach(function(route){
            var today = new Date();
            route.set("takenDown", today);
            routePromises.push(route.save());
        });

        Parse.Promise.when(routePromises).then(function(){
            wall.set("routes", []);
            wall.save({
                success: function(wall){
                    GlobalService.dismissSpinner();
                    $location.path("/walls");
                    $scope.$apply();
                },
                error: function(wall, error){
                    alert(GlobalService.errorMessage + error.message);
                }
            });
        });
    };



    //Routes Distro Graph
    //Generate Routes Graph
    $scope.generateRoutesGraph = function(){
        var v0 = {}; v0.gray = 0; v0.yellow = 0;
        var v1 = {}; v1.yellow = 0;
        var v2 = {}; v2.yellow = 0; v2.green = 0;
        var v3 = {}; v3.green = 0; v3.red = 0;
        var v4 = {}; v4.green = 0; v4.red = 0; v4.blue = 0;
        var v5 = {}; v5.red = 0; v5.blue = 0; v5.orange = 0;
        var v6 = {}; v6.blue = 0; v6.orange = 0; v6.purple = 0;
        var v7 = {}; v7.orange = 0; v7.purple = 0;
        var v8 = {}; v8.purple = 0; v8.black = 0;
        var v9 = {}; v9.black = 0;
        var v10 = {}; v10.black = 0;
        var v11 = {}; v11.black = 0;
        var v12 = {}; v12.black = 0;
        var v13 = {}; v13.black = 0;
        var v14 = {}; v14.black = 0;
        var v15 = {}; v15.black = 0;

        var routes = $scope.wall.attributes.routes;
        routes.forEach(function(route){
            if(route){
                switch(route.attributes.grade){
                case "0":
                    if(route.attributes.color == "gray"){
                        v0.gray++;
                    } else if(route.attributes.color == "yellow"){
                        v0.yellow++;
                    }
                    break;
                case "1":
                    v1.yellow++;
                    break;
                case "2":
                    if(route.attributes.color == "yellow"){
                        v2.yellow++;
                    } else if(route.attributes.rolor == "green"){
                        v2.green++;
                    }
                    break;
                case "3":
                    if(route.attributes.color == "yellow"){
                        v3.yellow++;
                    } else if(route.attributes.color == "green") {
                        v3.green++;
                    } else if(route.attributes.color == "red") {
                        v3.red++;
                    }
                    break;
                case "4":
                    if(route.attributes.color == "blue"){
                        v4.blue++;
                    } else if(route.attributes.color == "green") {
                        v4.green++;
                    } else if(route.attributes.color == "red") {
                        v4.red++;
                    }
                    break;
                case "5":
                    if(route.attributes.color == "blue"){
                        v5.blue++;
                    } else if(route.attributes.color == "orange") {
                        v5.orange++;
                    } else if(route.attributes.color == "red") {
                        v5.red++;
                    }
                    break;
                case "6":
                    if(route.attributes.color == "blue"){
                        v6.blue++;
                    } else if(route.attributes.color == "orange") {
                        v6.orange++;
                    } else if(route.attributes.color == "purple") {
                        v6.purple++;
                    }
                    break;
                case "7":
                    if(route.attributes.color == "purple"){
                        v7.purple++;
                    } else if(route.attributes.color == "orange") {
                        v7.orange++;
                    }
                    break;
                case "8":
                    if(route.attributes.color == "purple"){
                        v8.purple++;
                    } else if(route.attributes.color == "black") {
                        v8.black++;
                    }
                    break;
                case "9":
                    v9.black++;
                    break;
                case "10":
                    v10.black++;
                    break;
                case "11":
                    v11.black++;
                    break;
                case "12":
                    v12.black++;
                    break;
                case "13":
                    v13.black++;
                    break;
                case "14":
                    v14.black++;
                    break;
                case "15":
                    v15.black++;
                    break;
                };
            }
        });

        var data = {
            labels: ['v0','v1', 'v2', 'v3', 'V4', 'v5','v6', 'v7', 'v8', 'V9', 'v10','v11', 'v12', 'v13', 'V14', 'v15'],
            series: [
                [v0.gray, v1.yellow, v2.yellow, v3.green, v4.green, v5.red, v6.blue, v7.orange, v8.purple, v9.black, v10.black, v11.black, v12.black, v13.black, v14.black, v15.black],
                [0, 0, v2.green, v3.red, v4.red, v5.blue, v6.orange, v7.purple, v8.black, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, v4.blue, v5.orange, v6.purple, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        };

        var options = {
            stackBars: true,
            axisY: {
                labelInterpolationFnc: function(value) {
                    return ( value % 1 === 0 ) ? value : '';
                }
            }
        };

        var i = 0;
        new Chartist.Bar("#routeDistribution", data, options).on('draw', function(data) {
            var style = "";
            if(data.type == "bar"){
                switch(data.index){
                case 0:
                    style = "stroke: gray; fill: gray; stroke-width: 30px";
                    break;
                case 1:
                    style = "stroke: yellow; fill: yellow; stroke-width: 30px";
                    break;
                case 2:
                    if(i == 0){
                        style = "stroke: yellow; fill: yellow; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: green; fill: green; stroke-width: 30px";
                    }
                    break;
                case 3:
                    if(i == 0){
                        style = "stroke: green; fill: green; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: red; fill: green; stroke-width: 30px";
                    }
                    break;
                case 4:
                    if(i == 0){
                        style = "stroke: green; fill: green; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: red; fill: green; stroke-width: 30px";
                    } else if(i == 2){
                        style = "stroke: blue; fill: green; stroke-width: 30px";
                    }
                    break;
                case 5:
                    if(i == 0){
                        style = "stroke: red; fill: green; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: blue; fill: green; stroke-width: 30px";
                    } else if(i == 2){
                        style = "stroke: orange; fill: green; stroke-width: 30px";
                    }
                    break;
                case 6:
                    if(i == 0){
                        style = "stroke: blue; fill: green; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: orange; fill: green; stroke-width: 30px";
                    } else if(i == 2){
                        style = "stroke: purple; fill: green; stroke-width: 30px";
                    }
                    break;
                case 7:
                    if(i == 0){
                        style = "stroke: orange; fill: green; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: purple; fill: green; stroke-width: 30px";
                    }
                    break;
                case 8:
                    if(i == 0){
                        style = "stroke: purple; fill: green; stroke-width: 30px";
                    } else if(i == 1){
                        style = "stroke: black; fill: green; stroke-width: 30px";
                    }
                    break;
                case 9:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                case 10:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                case 11:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                case 12:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                case 13:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                case 14:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                case 15:
                    style = "stroke: black; fill: green; stroke-width: 30px";
                    break;
                };
                data.element.attr({
                    style: style
                });

                if(data.index == 15){
                    i++;
                }
            }
        });
    };


    //Holds Distro Graph
    $scope.generateHoldsDistroGraph = function(){
        var gray = {}; gray.crimp = 0; gray.pinch = 0; gray.jug = 0; gray.edge = 0; gray.sloper = 0;
        var yellow = {}; yellow.crimp = 0; yellow.pinch = 0; yellow.jug = 0; yellow.edge = 0; yellow.sloper = 0;
        var green = {}; green.crimp = 0; green.pinch = 0; green.jug = 0; green.edge = 0; green.sloper = 0;
        var red = {}; red.crimp = 0; red.pinch = 0; red.jug = 0; red.edge = 0; red.sloper = 0;
        var blue = {}; blue.crimp = 0; blue.pinch = 0; blue.jug = 0; blue.edge = 0; blue.sloper = 0;
        var orange = {}; orange.crimp = 0; orange.pinch = 0; orange.jug = 0; orange.edge = 0; orange.sloper = 0;
        var purple = {}; purple.crimp = 0; purple.pinch = 0; purple.jug = 0; purple.edge = 0; purple.sloper = 0;
        var black = {}; black.crimp = 0; black.pinch = 0; black.jug = 0; black.edge = 0; black.sloper = 0;

        var routes = $scope.wall.attributes.routes;
        routes.forEach(function(route){
            if(route){
                switch(route.attributes.color){
                case "gray":
                    gray.crimp += parseInt(route.attributes.crimps);
                    gray.pinch += parseInt(route.attributes.pinches);
                    gray.jug += parseInt(route.attributes.jugs);
                    gray.edge += parseInt(route.attributes.edges);
                    gray.sloper += parseInt(route.attributes.slopers);
                    break;
                case "yellow":
                    yellow.crimp += parseInt(route.attributes.crimps);
                    yellow.pinch += parseInt(route.attributes.pinches);
                    yellow.jug += parseInt(route.attributes.jugs);
                    yellow.edge += parseInt(route.attributes.edges);
                    yellow.sloper += parseInt(route.attributes.slopers);
                    break;
                case "green":
                    green.crimp += parseInt(route.attributes.crimps);
                    green.pinch += parseInt(route.attributes.pinches);
                    green.jug += parseInt(route.attributes.jugs);
                    green.edge += parseInt(route.attributes.edges);
                    green.sloper += parseInt(route.attributes.slopers);
                    break;
                case "red":
                    red.crimp += parseInt(route.attributes.crimps);
                    red.pinch += parseInt(route.attributes.pinches);
                    red.jug += parseInt(route.attributes.jugs);
                    red.edge += parseInt(route.attributes.edges);
                    red.sloper += parseInt(route.attributes.slopers);
                    break;
                case "blue":
                    blue.crimp += parseInt(route.attributes.crimps);
                    blue.pinch += parseInt(route.attributes.pinches);
                    blue.jug += parseInt(route.attributes.jugs);
                    blue.edge += parseInt(route.attributes.edges);
                    blue.sloper += parseInt(route.attributes.slopers);
                    break;
                case "orange":
                    orange.crimp += parseInt(route.attributes.crimps);
                    orange.pinch += parseInt(route.attributes.pinches);
                    orange.jug += parseInt(route.attributes.jugs);
                    orange.edge += parseInt(route.attributes.edges);
                    orange.sloper += parseInt(route.attributes.slopers);
                    break;
                case "purple":
                    purple.crimp += parseInt(route.attributes.crimps);
                    purple.pinch += parseInt(route.attributes.pinches);
                    purple.jug += parseInt(route.attributes.jugs);
                    purple.edge += parseInt(route.attributes.edges);
                    purple.sloper += parseInt(route.attributes.slopers);
                    break;
                case "black":
                    black.crimp += parseInt(route.attributes.crimps);
                    black.pinch += parseInt(route.attributes.pinches);
                    black.jug += parseInt(route.attributes.jugs);
                    black.edge += parseInt(route.attributes.edges);
                    black.sloper += parseInt(route.attributes.slopers);
                    break;
                };
            }
        });

        console.log(blue);
        console.log(green);
        var data = {
            labels: ['Crimps','Pinches', 'Jugs', 'Edges', 'Slopers'],
            series: [
                [gray.crimp, gray.pinch, gray.jug, gray.edge, gray.sloper],
                [yellow.crimp, yellow.pinch, yellow.jug, yellow.edge, yellow.sloper],
                [green.crimp, green.pinch, green.jug, green.edge, green.sloper],
                [red.crimp, red.pinch, red.jug, red.edge, red.sloper],
                [blue.crimp, blue.pinch, blue.jug, blue.edge, blue.sloper],
                [orange.crimp, orange.pinch, orange.jug, orange.edge, orange.sloper],
                [purple.crimp, purple.pinch, purple.jug, purple.edge, purple.sloper],
                [black.crimp, black.pinch, black.jug, black.edge, black.sloper]
            ]
        };

        var options = {
            showLine: false,
            axisY: {
                labelInterpolationFnc: function(value) {
                    return ( value % 1 === 0 ) ? value : '';
                }
            }
        };

        var i = 0;
        new Chartist.Line("#holdDistribution", data, options).on('draw', function(data) {
            var style = "";
            if(data.type == "point"){
                switch(i){
                case 0:
                    style = "stroke: gray; fill: gray; stroke-width: 20px";
                    break;
                case 1:
                    style = "stroke: yellow; fill: yellow; stroke-width: 20px";
                    break;
                case 2:
                    style = "stroke: green; fill: green; stroke-width: 20px";
                    break;
                case 3:
                    style = "stroke: red; fill: red; stroke-width: 20px";
                    break;
                case 4:
                    style = "stroke: blue; fill: blue; stroke-width: 20px";
                    break;
                case 5:
                    style = "stroke: orange; fill: orange; stroke-width: 20px";
                    break;
                case 6:
                    style = "stroke: purple; fill: purple; stroke-width: 20px";
                    break;
                case 7:
                    style = "stroke: black; fill: black; stroke-width: 20px";
                    break;
                };
                data.element.attr({
                    style: style
                });

                if(data.index == 4){
                    i++;
                }
            }
        });
    };




    $scope.init();
};
