angular.module('example', [
	'common.fabric'
	, 'common.fabric.utilities'
	, 'common.fabric.constants'
    , 'colorpicker.module'
    , 'ngMaterial'
    , 'ngAnimate'
    , 'ngAria'
    , 'ngMessages'
]).config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]).controller('ExampleCtrl', ['$scope', 'Fabric', 'FabricConstants', 'Keypress', '$http', '$location', '$mdDialog', function ($scope, Fabric, FabricConstants, Keypress, $http, $location, $mdDialog) {
    $scope.fabric = {};
    $scope.FabricConstants = FabricConstants;
    $scope.stateList = [];
    //
    // Saving Canvas Objects
    // ================================================================
    $scope.saveClick = function () {
        var json = JSON.stringify($scope.fabric.getJSON());
        $http({
            method: "POST"
            , url: "/api/saveCanvas"
            , data: $scope.fabric.getJSON()
        }).then(function mySuccess(response) {
            // a string, or an object, carrying the response from the server.
            $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(false).title('Save Succesful!').textContent("Please use the following link to load this project again:\nhttp://localhost:3000/Design?id=" + response.data).ariaLabel('Save Succesful!').ok('Got it!'));
            $scope.fabric.setDirty(false);
            $scope.statuscode = response.status;
        }, function myError(response) {
            $scope.myRes = response.statusText;
        });
    };
    //
    // Creating Canvas Objects
    // ================================================================
    $scope.uploadFile = function (files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            $scope.fabric.addImage(this.result);
            $scope.saveState('Added Image');
        }, false);
        reader.readAsDataURL(files[0]);
    };
    //
    // Editing Canvas Size
    // ================================================================
    $scope.selectCanvas = function () {
        $scope.canvasCopy = {
            width: $scope.fabric.canvasOriginalWidth
            , height: $scope.fabric.canvasOriginalHeight
        };
    };
    $scope.setCanvasSize = function () {
        $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
        $scope.fabric.setDirty(true);
        delete $scope.canvasCopy;
    };
    //
    // Init
    // ================================================================
    $scope.init = function () {
        $scope.fabric = new Fabric({
            JSONExportProperties: FabricConstants.JSONExportProperties
            , textDefaults: FabricConstants.textDefaults
            , shapeDefaults: FabricConstants.shapeDefaults
            , json: {}
        });
    };
    $scope.$on('canvas:created', $scope.init);
    Keypress.onSave(function () {
        $scope.updatePage();
    });
    //
    // History
    // ================================================================
    $scope.saveState = function (state) {
        $scope.stateList.push({
            State: state
            , JSON: $scope.fabric.getJSON()
        });
    }
    $scope.removeRow = function (index) {
            var length = $scope.stateList.length;
            for (var i = 0; i < index + 1; i++) {
                console.log("Popping: " + $scope.stateList[$scope.stateList.length - 1].State)
                $scope.stateList.pop();
            }
            $scope.fabric.loadJSON($scope.stateList[$scope.stateList.length - 1].JSON);
        }
        //
        // Open from db
        // ================================================================
    $scope.load = function () {
        // check if there is query in url
        // and fire search in case its value is not empty
        var id = $location.search().id;
        if (id) {
            $http({
                method: "GET"
                , url: "/api/getCanvas?id=" + id
                , params: {}
            }).then(function mySuccess(response) {
                var data = JSON.parse(response.data[0].JSON);
                $scope.fabric.loadJSON(data);
                $scope.stateList.push({
                    State: "Initial State"
                    , JSON: data
                });
            }, function myError(response) {});
        }
        else {
            var data = {
                "width": 300
                , "height": 300
                , "objects": []
                , "background": "#ffffff"
                , "originalWidth": 300
                , "originalHeight": 300
            };
            $scope.stateList.push({
                State: "Initial State"
                , JSON: data
            });
        }
    };
}]);