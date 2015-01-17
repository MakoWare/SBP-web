//Nav Controller
var NavCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        $scope.currentPath = $location.path();
        console.log("NavCtrl");
    };

    $scope.onRouteChange = function(){
        $scope.currentPath = $location.path();
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
