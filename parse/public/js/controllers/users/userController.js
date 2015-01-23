//User Controller
var UserCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){

        $scope.tab = "general";




        console.log("UserCtrl");

        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.title = "New User";
            $scope.createUser();
        } else {
            $scope.getUser(last);
        }
    },

    //Create User
    $scope.createUser = function(){
        $scope.user = ParseService.createUser();
        $scope.setUpUser();
    };

    //Get User
    $scope.getUser = function(id){
        ParseService.getUserById(id, function(results){
            $scope.user = results;
            $scope.title = results.attributes.username;
            $scope.setUpUser();
            $scope.$apply();
        });
    };

    //Set up User
    $scope.setUpUser = function(){
        $scope.getUserRoutes();

    },


    //Get User's Routes
    $scope.getUserRoutes = function(){
        ParseService.getRoutesByUser($scope.user, function(results){
            $scope.user.attributes.routes = results;
            $scope.generateStats();
        });
    };


    //Generate Stats
    $scope.generateStats = function(){
        $scope.generateRoutesGraph();
    };

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

        var routes = $scope.user.attributes.routes;
        routes.forEach(function(route){
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
        new Chartist.Bar("#general", data, options).on('draw', function(data) {
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


    $scope.tabClicked = function(tab){
        console.log(tab);
        if(tab == "general"){
            $scope.tab = "general";
        } else if(tab == "routes"){
            $scope.generateRoutesGraph();
            $scope.tab = "routes";
        } else if(tab == "holds"){
            $scope.tab = "holds";
        }
    };


    //Save User
    $scope.saveUser = function(){

    };

    $scope.init();
};
