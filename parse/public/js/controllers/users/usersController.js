//Users Controller
var UsersCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("UsersCtrl");
        $scope.getUsers();
    },


    //Get Users
    $scope.getUsers = function(){
        ParseService.getUsers(function(results){
            console.log(results);
            $scope.users = results;
            $scope.$apply();
            $scope.setUpUsers();
        });
    };

    //Set up Users
    $scope.setUpUsers = function(){
        $scope.users.forEach(function(user){
            $scope.getUserRoutes(user);

        });
    };

    //Get a User's Routes
    $scope.getUserRoutes = function(user){
        ParseService.getRoutesByUser(user, function(results){
            user.attributes.routes = results;
            $scope.$apply();
            $scope.generateStats(user);
        });
    };

    /**** Statistics Methods ****/

    //Generate Statistics
    $scope.generateStats = function(user){
        var colors = [];
        var grades = [];
        var themes = [];
        user.attributes.routes.forEach(function(route){
            switch(route.attributes.color){
            case "gray":
                colors.push("gray");
                break;
            case "yellow":
                colors.push("yellow");
                break;
            case "green":
                colors.push("green");
                break;
            case "red":
                colors.push("red");
                break;
            case "blue":
                colors.push("blue");
                break;
            case "orange":
                colors.push("orange");
                break;
            case "purple":
                colors.push("purple");
                break;
            case "black":
                colors.push("black");
                break;
            };

            grades.push(route.attributes.grade);
            themes.push(route.attributes.theme);
        });

        user.attributes.mostColor = $scope.modeString(colors);
        user.attributes.mostTheme = $scope.modeString(themes);
        user.attributes.mostGrade = $scope.modeString(grades);
    };

    //Mode of String Array
    $scope.modeString = function(array){
        if (array.length == 0)
            return null;

        var modeMap = {},
            maxEl = array[0],
            maxCount = 1;

        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];

            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;

            if (modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    };


    //Add User
    $scope.addUser = function(){
        $location.path("/users/create");
    };

    //View User
    $scope.viewUser = function(user){
        $location.path("/users/" + user.id);
    };

    //Delete User
    $scope.deleteUser = function(user){
        /*
        ParseService.deleteUser(user, function(results){

        });
         */
    };


    $scope.init();
};
