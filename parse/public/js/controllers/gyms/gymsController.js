//Gyms Controller
var GymsCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("GymsCtrl");
        $scope.getGyms();
    };


    $scope.addGym = function(){
        var newPath = "/gyms/create";
        $location.path(newPath);
    };


    $scope.getGyms = function(){
        ParseService.getGyms(function(results){
            $scope.gyms = results;
            $scope.$apply();
            console.log(results);
        });
    };

    $scope.setGym = function(gym){
        GlobalService.showSpinner();
        ParseService.setCurrentGym(gym, function(results){
            GlobalService.dismissSpinner();
            console.log(results);
        });
    };


    $scope.init();
};
