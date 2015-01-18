'use strict';

//Gym Controller
var GymCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("GymCtrl");

        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.title = "New Gym";
            $scope.createGym();
        } else {
            $scope.getGym(last);
        }
    };

    //Create Gym
    $scope.createGym = function(){
        $scope.gym = ParseService.createGym();
        console.log($scope.gym);
    };


    //Get Gym
    $scope.getGym = function(id){
        ParseService.getGymById(id, function(results){
            $scope.gym = results;
            $scope.title = "Update " +  results.get('name');
        });
    };

    //Save Gym
    $scope.saveGym = function(){
        GlobalService.showSpinner();

        $scope.gym.set("name", $scope.gym.attributes.name);
        $scope.gym.save({
            success: function(gym){
                GlobalService.dismissSpinner();
                $location.path("/gyms");
            },
            error: function(gym, error){

            }
        });

    };



    $scope.init();
};
