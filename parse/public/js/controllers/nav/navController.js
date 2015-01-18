//Nav Controller
var NavCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("NavCtrl");
        $scope.currentPath = $location.path();
        $scope.currentUser = ParseService.getCurrentUser();
    };

    $scope.logout = function(){
        ParseService.logout();
        var newPath = "/";
        $location.path(newPath);
    };

    $scope.onRouteChange = function(){
        $scope.currentPath = $location.path();
        $scope.currentUser = ParseService.getCurrentUser();
    };

    $scope.isRoute = function(route){
        if($scope.currentPath.indexOf(route) == 0){
            return true;
        } else {
            return false;
        }
    };

    $scope.$on('$routeChangeSuccess', function(next, current) {
        $scope.onRouteChange();
    });

    $scope.init();
};
