//Hold Controller
var HoldCtrl = function($scope, $location, ParseService, GlobalService){
    $scope.init = function(){
        console.log("HoldCtrl");

        $("#holdFile").change(function(){
            $scope.pictureChanged(this);
        });

        var last = $location.url().split("/")[$location.url().split("/").length -1];
        if(last == "create"){
            $scope.title = "New Hold";
            $scope.createHold();
        } else {
            $scope.getHold(last);
        }
    },


    //Create Hold
    $scope.createHold = function(){
        $scope.hold = ParseService.createHold();
        $scope.setUpHold();
    };

    //Get Hold
    $scope.getHold = function(id){
        ParseService.getHoldById(id, function(results){
            $scope.hold = results;
            $scope.title = "Update " +  results.get('name');
            $scope.setUpHold();
            $scope.$apply();
        });
    };

    //Set up Hold
    $scope.setUpHold = function(){

        if($scope.hold.get('holdPicture')){
            var url = $scope.hold.get('holdPicture').url();
            $('#holdPicture').attr('src', url);
        } else {
            $('#holdPicture').attr('src', "images/defaultRock.jpg");
        }

    },


    //Hold Picture Change
    $scope.pictureChanged = function(input){
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#holdPicture').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    //Save Hold
    $scope.saveHold = function(){
        GlobalService.showSpinner();

        var user = ParseService.getCurrentUser();
        var hold = $scope.hold;

        for(var attr in hold.attributes) {
            hold.set(attr, hold.attributes[attr]);
        }

        //Save Picture
        var fileUploadControl = $("#holdFile")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = file.name;
            var parseFile = new Parse.File(name, file);

            hold.set("holdPicture", parseFile);
        }


        console.log(hold);
        $scope.hold.save({
            success: function(hold){
                GlobalService.dismissSpinner();
                $location.path("/holds");
                $scope.$apply();
            },
            error: function(hold, error){

            }
        });
    };

    $scope.init();
};
