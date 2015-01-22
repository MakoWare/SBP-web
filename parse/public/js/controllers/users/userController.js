//User Controller
var UserCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){


        var data = {
            // A labels array that can contain any sort of values
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [5, 2, 4, 2, 0]
            ]
        };

        // As options we currently only set a static size of 300x200 px. We can also omit this and use aspect ratio containers
        // as you saw in the previous example
        var options = {
            width: 300,
            height: 200
        };

        // Create a new line chart object where as first parameter we pass in a selector
        // that is resolving to our chart container element. The Second parameter
        // is the actual data object. As a third parameter we pass in our custom options.
        new Chartist.Bar('.ct-chart', data, options);


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

    //Get User's Routes
    $scope.getUserRoutes = function(){
        ParseService.getRoutesByUser($scope.user, function(results){
            $scope.user.attributes.routes = results;
            $scope.generateStats();
        });
    };


    //Generate Stats
    $scope.generateStats = function(){
        $scope.user.attributes.routes.forEach(function(route){

        });

    };



    //Set up User
    $scope.setUpUser = function(){


    },

    //Save User
    $scope.saveUser = function(){

    };

    $scope.init();
};
