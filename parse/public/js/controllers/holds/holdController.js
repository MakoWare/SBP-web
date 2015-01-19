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
            $(".pick-a-color").pickAColor({
                showSpectrum            : false,
                showSavedColors         : false,
                saveColorsPerElement    : false,
                fadeMenuToggle          : true,
                showHexInput            : false,
                showAdvanced            : true,
                showBasicColors         : true,
                allowBlank              : false,
                inlineDropdown          : true
            });
            $('#holdPicture').attr('src', "images/defaultRock.jpg");
        } else {
            $scope.getHold(last);
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

    //Create Hold
    $scope.createHold = function(){
        $scope.hold = ParseService.createHold();
        console.log($scope.hold);
    };

    //Get Hold
    $scope.getHold = function(id){
        ParseService.getHoldById(id, function(results){
            $scope.hold = results;

            $scope.title = "Update " +  results.get('name');

            $(".pick-a-color").val($scope.hold.get('colorHex'));

            $(".pick-a-color").pickAColor({
                showSpectrum            : false,
                showSavedColors         : false,
                saveColorsPerElement    : false,
                fadeMenuToggle          : true,
                showHexInput            : false,
                showAdvanced            : false,
                showBasicColors         : true,
                allowBlank              : false,
                inlineDropdown          : true
            });

            var url = results.get('holdPicture').url();
            $('#holdPicture').attr('src', url);
            $scope.$apply();
        });
    };

    //Save Hold
    $scope.saveHold = function(){
        GlobalService.showSpinner();

        var user = ParseService.getCurrentUser();
        var hold = $scope.hold;
        hold.set("name", hold.attributes.name);
        hold.set("description", hold.attributes.description);
        hold.set("type", hold.attributes.type);
        hold.set("size", hold.attributes.size);
        hold.set("createdBy", user);
        hold.set("gymCreatedAt", user.get('currentGym'));

        //Save Picture
        var fileUploadControl = $("#holdFile")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = file.name;
            var parseFile = new Parse.File(name, file);

            hold.set("holdPicture", parseFile);
        }

        //Get Color
        var hex = $("#colorPicker").val();
        hold.set("colorHex", hex);

        switch(hex){
        case "000000":
            hold.set("colorName", "black");
            break;
        case "ffffff":
            hold.set("colorName", "white");
            break;
        case "ff0000":
            hold.set("colorName", "red");
            break;
        case "ffff00":
            hold.set("colorName", "yellow");
            break;
        case "008000":
            hold.set("colorName", "green");
            break;
        case "0000ff":
            hold.set("colorName", "blue");
            break;
        case "800080":
            hold.set("colorName", "purple");
            break;
        case "ff6600":
            hold.set("colorName", "orange");
            break;
        }

        if(hold.attributes.colorName == ""){
            hold.set("colorName", "grey");
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
