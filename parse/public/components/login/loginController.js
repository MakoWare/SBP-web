//Walls Controller
var LoginCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("LoginCtrl");

        $scope.username = "";
        $scope.password = "";
        $scope.currentUser = ParseService.getCurrentUser();
        if($scope.currentUser){
            var newPath = "/gyms";
            $location.path(newPath);
        }
    },

    $scope.login = function(){
        GlobalService.showSpinner();
        ParseService.login($scope.username, $scope.password, function(results){
            GlobalService.dismissSpinner();
            if(results.id){
                var newPath = "/gyms";
                $location.path(newPath);
                $scope.$apply();
            } else {
                alert("Login Failed");
                $scope.username = "";
                $scope.password = "";
                $scope.$apply();
            }
        });
    };


    $scope.init();
};
