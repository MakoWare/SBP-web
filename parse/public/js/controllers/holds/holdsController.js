//Holds Controller
var HoldsCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("HoldsCtrl");

        $scope.getHolds();
    },


    //Get Holds
    $scope.getHolds = function(){
        ParseService.getHolds(function(results){
            $scope.holds = results;
        });
    };

    //Add Hold
    $scope.addHold = function(){
        console.log("hello?");
        $location.path("/holds/create");
    };

    //Edit Hold
    $scope.editHold = function(hold){
        $location.path("/holds/" + hold.id);
    };

    //Delete Hold
    $scope.deleteHold = function(hold){
        ParseService.deleteHold(hold, function(results){

        });
    };


    $scope.init();
};
