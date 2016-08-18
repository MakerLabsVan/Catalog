var inputApp = angular.module('inputApp', ['indexApp']);

inputApp.controller("inputCtrl", ["$scope", "$http", "mapService", "highlightService", "adminHttpRequests", function ($scope, $http, mapService, highlightService, adminHttpRequests) {

    adminHttpRequests.auth().then(function (code) {
        $('#auth').attr('href', code);
    });

    adminHttpRequests.admin_getCatalog().then(function (data) {
        $scope.data = data;

        // labels to use for object
        $scope.dataLabels = data[1];

        // key index
        var keyIndex = $scope.dataLabels.indexOf('key');

        // labels to display
        $scope.entryProperties = data[0];
        // entryProperty object (testing)
        $scope.entryPropertiesObj = {};
        for (var i in $scope.entryProperties) {
            $scope.entryPropertiesObj[$scope.dataLabels[i]] = $scope.entryProperties[i];
        }

        // shift data
        $scope.data.shift();
        $scope.data.shift();
        $scope.dataLength = data.length;
        $scope.fixedForKey = data.length;

        // removed 2 frozen rows
        var shiftedData = $scope.data;
        $scope.forKeyUseOnly = shiftedData;

        // object entries
        $scope.entries = {};
        // use loop to make the object
        for (var i in shiftedData) {
            var object = {};
            for (var j in $scope.dataLabels) {
                // ex. object.name.label
                object[$scope.dataLabels[j]] = shiftedData[i][j];
            }
            // number could change
            $scope.entries[shiftedData[i][keyIndex]] = object;
        }

        // make category data
        $scope.studioEntries = {};
        $scope.materialEntries = {};
        $scope.toolEntries = {};
        $scope.consumableEntries = {};

        for (var key in $scope.entries) {
            switch ($scope.entries[key].type) {
                case 'Studio':
                    $scope.studioEntries[key] = $scope.entries[key];
                    break;
                case 'Material':
                    $scope.materialEntries[key] = $scope.entries[key];
                    break;
                case 'Tool':
                    $scope.toolEntries[key] = $scope.entries[key];
                    break;
                case 'Consumable':
                    $scope.consumableEntries[key] = $scope.entries[key];
            }
        }
        console.log($scope.entries);
    });

    $scope.authCode = '';
    $scope.sendCode = function () {
        adminHttpRequests.sendCode($scope.authCode).then(function (result) {
            $scope.authCode = '';
            location.reload();
        })
    };

    $scope.inputQuery = '';
    // repeated functions in index
    var isIndexOf = function (property) {
        if (property == undefined) {
            return false;
        } else if (property.toLowerCase().indexOf($scope.inputQuery.toLowerCase()) != -1) {
            return true;
        }
    };

    var isIndexOfSet = function (entry) {
        if (isIndexOf(entry.name) ||
            isIndexOf(entry.type) ||
            isIndexOf(entry.subtype) ||
            isIndexOf(entry.keywords)) {
            return true;
        }
    };

    $scope.filterSearch = function (entry) {
        if ($scope.inputQuery.length >= 2) {
            if (isIndexOfSet(entry)) {
                $('#admin_' + entry.key).removeClass('hidden');
                return entry.name;
            } else {
                $('#admin_' + entry.key).addClass('hidden');
            }
        } else if ($scope.inputQuery.length == 0 || $scope.inputQuery.length == 1) {
            $('#admin_' + entry.key).removeClass('hidden');
            return entry.name;
        }
    };

    // make a new entry
    $scope.form = {};
    $scope.form.units = 'Units';
    $scope.form.weightUnits = 'Units';
    $scope.form.image = "Image name";

    $scope.clearSearch = function () {
        $scope.inputQuery = '';
    };

    var metaObj = [];

    $scope.insert = function (row, status) {

        metaObj = $scope.map.getMarkerLocation();
        console.log(metaObj);

        // get type from radio buttons
        $scope.form.type = $("input[name=typeOptions]:checked").val();
        if ($scope.form.type == undefined || $scope.form.type == null) {
            alert("Type has not been set!");
        } else {
            // parse metadata from $scope.metaObj

            $scope.form.metadata = JSON.stringify({
                'points': metaObj
            });

            $scope.form.floor = $scope.map.currentFloor;

            // make array to pass in
            var values = [];
            for (var i in $scope.dataLabels) {
                values.push($scope.form[$scope.dataLabels[i]]);
            }

            // make key new or existing
            if ($scope.form.key != undefined) {
                values[values.length - 1] = $scope.form.key;
            } else {
                // KEYGEN (takes last key for new keygen (can cause gaps)
                var tempkey = $scope.forKeyUseOnly[$scope.fixedForKey - 1][21];
                var slice = tempkey.slice(1, tempkey.length);
                // TODO: change A to increment
                var newKey = 'A' + (Number(slice) + 1);

                values[values.length - 1] = String(newKey);
                $scope.form.key = String(newKey);
            }
            // upload image when selected
            fileHandler();

            adminHttpRequests.insert(values, row).then(function (result) {
                if (status === 'new') {
                    // fix local length and keys
                    $scope.dataLength++;
                    $scope.fixedForKey++;
                    $scope.forKeyUseOnly.push(values);
                }

                // populate local database with new entry
                // also edits if entry exists
                $scope.entries[$scope.form.key] = $scope.form;

                if (status === "new") {
                    $scope.form = {};
                    $scope.form.units = 'Units';
                    $scope.form.weightUnits = 'Units';
                    $scope.deleteAllMarker();
                }
            });
        }
    };

    var findIndex = function () {
        // find index of selected
        var keyString = $scope.selectedEntry.key;
        // offset to account for frozen rows and the parse function in serverOps
        var index = 0;
        // search for key and count rows
        for (var i in $scope.entries) {
            if (i === keyString) {
                break;
            }
            index++;
        }
        return index;
    };

    // TODO: Expand into other numerical properties
    $scope.increase = function (prop) {
        console.log($scope.form[prop]);
        var cur = 0;
        if ($scope.form[prop] == undefined) {
            cur += 1;
            console.log("undef: " + cur);
        } else {
            cur = Number($scope.form[prop]);
            cur += 1;
            console.log("!undef: " + cur);

        }
        $scope.form[prop] = cur;
    };

    $scope.decrease = function (prop) {
        console.log($scope.form[prop]);
        var cur = 0;
        if ($scope.form[prop] == undefined) {
            console.log("undef: " + cur);
        } else {
            cur = Number($scope.form[prop]);
            if (cur > 0) {
                cur -= 1;
                console.log("!undef: " + cur);
            }
        }
        $scope.form[prop] = cur;
    };

    $scope.confirmEdit = function () {
        $('#confirmEdit').removeClass('hidden');
        $('#editBtn').addClass('hidden');

    };

    $scope.cancelEdit = function () {
        $('#confirmEdit').addClass('hidden');
        $('#editBtn').removeClass('hidden');
    };

    // edit an entry
    $scope.edit = function (status) {
        // find index of selected
        var index = findIndex();
        $scope.insert(index, status);
        $scope.cancelEdit();
    };

    $scope.confirmDelete = function () {
        $('#confirmDel').removeClass('hidden');
        $('#deleteBtn').addClass('hidden');

    };

    $scope.cancelDelete = function () {
        $('#confirmDel').addClass('hidden');
        $('#deleteBtn').removeClass('hidden');
    };

    $scope.freeStudio = function () {
        $scope.form.name = "Available Studio";
        $scope.form.type = "Studio";
        $scope.form.subtype = "Available";
        $scope.form.keywords = "";
        $scope.form.description = "";
        $scope.form.image = "";

        $scope.edit("edit");
        $scope.cancelFree();
    };

    $scope.confirmFree = function () {
        $("#free-studio-btn").addClass("hidden");
        $("#confirm-free").removeClass("hidden");
    };

    $scope.cancelFree = function () {
        $("#free-studio-btn").removeClass("hidden");
        $("#confirm-free").addClass("hidden");
    };

    // delete an entry
    $scope.delete = function () {
        // to account for frozen rows on database
        // TODO: automate in get response
        const offset = 2;

        var index = findIndex() + offset;
        adminHttpRequests.delete([index]).then(function (result) {
            $scope.newForm();

            // delete local entry
            delete $scope.entries[$scope.selectedEntry.key];

            $scope.dataLength--;
            $scope.form = {};
            $scope.form.units = 'Units';
            $scope.form.weightUnits = 'Units';
            $scope.cancelDelete();
        });

    };

    $scope.changeSendBtnColor = function (type) {
        var uploadIcon = $('#uploadIcon');
        var editIcon = $('#editIcon');
        switch (type) {
            case 'Studio':
                uploadIcon.css('color', '#F14A29');
                editIcon.css('color', '#F14A29');
                break;
            case 'Tool':
                uploadIcon.css('color', '#107CC2');
                editIcon.css('color', '#107CC2');
                break;
            case 'Consumable':
                uploadIcon.css('color', '#2BAC69');
                editIcon.css('color', '#2BAC69');
                break;
            case 'Material':
                uploadIcon.css('color', '#F3902C');
                editIcon.css('color', '#F3902C');

        }
    };

    $scope.selectEntry = function (entry) {
        $scope.showLoc(entry);
        $scope.map.markers.onDrag();
        $scope.selectedEntry = entry;
        $scope.newSelect();
        $scope.changeSendBtnColor(entry.type);

        $scope.highlightItem('admin_' + entry.key, entry.type);
        $('#deleteBtn').removeClass('hidden');
        $('#editBtn').removeClass('hidden');
        $('#submitBtn').addClass('hidden');

        // show free-studio btn
        if (entry.type === "Studio") {
            $('#free-studio-btn').removeClass("hidden");
        } else {
            $('#free-studio-btn').addClass("hidden");
        }


        // fill form (convert string numbers to numbers)
        for (var i in entry) {
            console.log(entry[i]);
            if (i === 'width' ||
                i === 'length' ||
                i === 'height' ||
                i === 'quantity' ||
                i === 'weight') {
                if (entry[i] !== "") {
                    $scope.form[i] = Number(entry[i]);
                }
            } else {
                $scope.form[i] = entry[i];
            }
        }

        // parse string to json
        $scope.form.metadata["points"] = entry.metadata["points"];
        var btnGroup = $('#buttonGroup');

        // inactive div
        btnGroup.find('div.active').removeClass('active');
        // unchecked btn
        btnGroup.find('input[name=typeOptions]:checked').prop('checked', false);
        // active div
        switch (entry.type) {
            case 'Studio':
                btnGroup.find('#stdTypeDiv').addClass('active');
                $('input#radiostudio').prop('checked', true);
                break;
            case 'Material':
                btnGroup.find('#matTypeDiv').addClass('active');
                $('input#radioMaterial').prop('checked', true);
                break;
            case 'Tool':
                btnGroup.find('#toolTypeDiv').addClass('active');
                $('input#radioTool').prop('checked', true);
                break;
            case 'Consumable':
                btnGroup.find('#conTypeDiv').addClass('active');
                $('input#radioConsumable').prop('checked', true);

        }
    };


    $scope.newForm = function () {
        $scope.form = {};
        $scope.form.units = 'Units';
        $scope.form.weightUnits = 'Units';
        $scope.deleteAllMarker();
        $('#buttonGroup').find('.active').removeClass('active');
        $('#submitBtn').removeClass('hidden');
        $('#deleteBtn').addClass('hidden');
        $('#confirmDel').addClass('hidden');
        $('#editBtn').addClass('hidden');
        $('#confirmEdit').addClass('hidden');
        $('#free-studio-btn').addClass('hidden');
        $('#uploadIcon').css('color', 'black');
    };

    $scope.newSelect = function () {
        $('#confirmDel').addClass('hidden');
        $('#confirmEdit').addClass('hidden');
    };

    // highlight selected entry
    $scope.highlightItem = highlightService.highlight;

    $scope.map = mapService.initMap('firstFloor', 1);
    $scope.map.resize();
    $scope.map.markers.onClick();
    $scope.deleteAllMarker = function () {
        metaObj = [];
        $scope.map.markers.deleteAll();

    };
    $scope.deleteLastMarker = function () {
        metaObj.pop();
        $scope.map.markers.deleteLast()
    };
    $scope.changeFloor = function () {
        $scope.map.nextFloor();
        $scope.map.resize();
        $scope.map.markers.deleteAll();
    };

    var lastItem = null;
    //Highlight the studio given the name of the studio as a param
    $scope.showLoc = function (entry) {

        removeLast(lastItem);
        lastItem = entry;

        if (entry.type == 'Studio') {
            $scope.map.studio.highlight(entry.key);
        } else {
            $scope.map.markers.draw($scope.map.width(), JSON.parse(entry.metadata));
            //TODO:MARKER DISPLAY
        }
        $scope.map.selectFloor(Number(entry.floor));
    };

    var removeLast = function (lastItem) {
        $scope.map.markers.hide();
        if (lastItem != undefined) {
            $scope.map.studio.dehighlight(lastItem.key);
        }
    };

    // TODO: ? = () => i think this is a shorthand function decl?
    (function () {
        document.getElementById("file-input").onchange = () => {
            const files = document.getElementById('file-input').files;
            const file = files[0];
            if (file != null) {
                $scope.form.image = file.name;
                $scope.$apply();
            } else {
                console.log("file not uploaded");
            }
        }
    })();

    // default from heroku s3 direct upload docs for nodejs
    var fileHandler = function () {
        const files = document.getElementById('file-input').files;
        const file = files[0];
        if (file == null) {
            console.log("No file was selected");
            return;
        }
        getSignedRequest(file);
    };

    function getSignedRequest(file) {
        // make path to upload to
        var folder = $("input[name=typeOptions]:checked").val();
        if (folder == undefined) {
            alert("Please select a type!");
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}&folder=${folder}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    uploadFile(file, response.signedRequest, response.url);
                }
                else {
                    alert('Could not get signed URL.');
                }
            }
        };
        xhr.send();
    }

    function uploadFile(file, signedRequest, url) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // display file name

                    console.log(url);
                }
                else {
                    alert('Could not upload file.');
                }
            }
        };
        xhr.send(file);
    }

}]);

inputApp.factory('adminHttpRequests', function ($http) {
    return {
        auth: function () {
            return $http.get('authCode')
                .then(function (result) {
                    return result.data;
                })
        },
        sendCode: function (code) {
            return $http.post('sendCode', [code])
                .then(function (result) {
                    return result.data;
                })
        },
        admin_getCatalog: function () {
            return $http.get('getCatalog')
                .then(function (result) {
                    return result.data;
                })
        },
        insert: function (entry, row) {
            return $http.post('new', [entry, row])
                .then(function (result) {
                    return result.data;
                })
        },
        delete: function (index) {
            return $http.post('delete', [index])
                .then(function (result) {
                    return result.data;
                })
        }
    }
});
