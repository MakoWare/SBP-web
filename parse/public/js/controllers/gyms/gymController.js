'use strict';

//Gym Controller
var GymCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("GymCtrl");
        $scope.tab = "routeDistribution";

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
            console.log(results);
            $scope.gym = results;
            $scope.title = results.get('name');
            $scope.$apply();
        });
    };

    //Tab Clicked
    $scope.tabClicked = function(tab){
        if(tab == "routeDistribution"){
            $scope.generateRoutesGraph();
            $scope.tab = "routeDistribution";
        } else if(tab == "routes"){
            $scope.tab = "routes";
        } else if(tab == "holdDistribution"){
            $scope.generateHoldsDistroGraph();
            $scope.tab = "holdDistribution";
        } else if(tab == "holds"){
            $scope.tab = "holds";
        }
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
