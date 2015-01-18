//Holds Controller
var HoldsTableCtrl = function($scope, $location, $modalInstance, ParseService, GlobalService, currentHolds){


    $scope.init = function(){
        console.log("HoldsTableCtrl");
        console.log(currentHolds);
        $scope.getHolds();
    },


    //Get Holds
    $scope.getHolds = function(){
        ParseService.getHolds(function(results){
            $scope.holds = results;

            $scope.holds.forEach(function(hold){
                currentHolds.forEach(function(currentHold){
                    if(hold.id == currentHold.id){
                        hold.attributes.add = true;
                    }
                });
            });
            $scope.$apply();
        });
    };

    //Add Hold
    $scope.addHold = function(hold){
        if(hold.attributes.add){
            var hasHold = false;
            currentHolds.forEach(function(currentHold){
                if(currentHold.id == hold){
                    hasHold = true;
                }
            });
            if(!hasHold){
                console.log("adding  hold");
                currentHolds.push(hold);
            }
        } else {
            for(var i = 0; i < currentHolds.length; i++){
                var currentHold = currentHolds[i];
                if(currentHold.id == hold.id){
                    currentHolds.splice(i, 1);
                }
            }
        }
    };

    $scope.ok = function () {
        console.log(currentHolds);
        $modalInstance.close(currentHolds);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init();
};
