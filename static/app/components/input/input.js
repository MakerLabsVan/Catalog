var inputApp = angular.module('inputApp', ['indexApp']);

inputApp.controller("inputCtrl", ["$scope", "$http", "mapService", "highlightService", "adminHttpRequests", function ($scope, $http, mapService, highlightService, adminHttpRequests) {

    adminHttpRequests.auth().then(function (code) {
        console.log(code);
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

        // removed 2 frozen rows
        var shiftedData = $scope.data;

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
    });

    $scope.authCode = '';
    $scope.sendCode = function () {
        adminHttpRequests.sendCode($scope.authCode).then(function (result) {
            $scope.authCode = '';
            location.reload();
            console.log(result);
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

    $scope.clearSearch = function () {
        $scope.inputQuery = '';
    };

    $scope.insert = function (row) {
        // get type from radio buttons
        $scope.form.type = $("input[name=typeOptions]:checked").val();
        if ($scope.form.type == undefined || $scope.form.type == null) {
            alert("Type has not been set!");
        } else {

            // make array to pass in
            var values = [];
            for (var i in $scope.dataLabels) {
                values.push($scope.form[$scope.dataLabels[i]]);
            }

            // make key
            values[values.length - 1] = 'A' + String($scope.dataLength + 1);
            $scope.form.key = 'A' + String($scope.dataLength + 1);

            adminHttpRequests.insert(values, row).then(function (result) {
                console.log(result);
                $scope.dataLength++;

                // populate local database with new entry
                // also edits if entry exists
                $scope.entries[$scope.form.key] = $scope.form;

                $scope.form = {};
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
        console.log(index);
        // old method that did not account for unorganized rows
        // var index = parseInt(keyString.slice(1, keyString.length)) - offset;
        return index;
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
    $scope.edit = function () {
        const negativeOffset = 1;
        // find index of selected
        var index = findIndex() - negativeOffset;
        $scope.insert(index);
    };

    $scope.confirmDelete = function () {
        $('#confirmDel').removeClass('hidden');
        $('#deleteBtn').addClass('hidden');
    };

    $scope.cancelDelete = function () {
        $('#confirmDel').addClass('hidden');
        $('#deleteBtn').removeClass('hidden');
    };

    // delete an entry
    $scope.delete = function () {
        // to account for frozen rows on database
        // TODO: automate in get response
        const offset = 2;

        var index = findIndex() + offset;
        adminHttpRequests.delete([index]).then(function (result) {
            $scope.newForm();
            console.log(result);

            // delete local entry
            delete $scope.entries[$scope.selectedEntry.key];
            console.log($scope.entries[$scope.selectedEntry.key]);

            $scope.dataLength--;
            $scope.form = {};
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
        $scope.selectedEntry = entry;
        $scope.newSelect();
        $scope.changeSendBtnColor(entry.type);

        $scope.highlightItem('admin_' + entry.key, entry.type);
        $('#deleteBtn').removeClass('hidden');
        $('#editBtn').removeClass('hidden');
        $('#submitBtn').addClass('hidden');

        // fill form (convert string numbers to numbers)
        for (var i in entry) {
            if (i === 'width' ||
                i === 'length' ||
                i === 'height' ||
                i === 'quantity' ||
                i === 'weight') {
                $scope.form[i] = Number(entry[i]);
            } else {
                $scope.form[i] = entry[i];
            }
        }

        var btnGroup = $('#buttonGroup');

        // inactive div
        btnGroup.find('div.active').removeClass('active');
        // unchecked btn
        btnGroup.find('input[name=typeOptions]:checked').prop('checked', false);
        // active div

        switch (entry.type) {
            case 'Studio':
                btnGroup.find('#stdTypeDiv').addClass('active');
                break;
            case 'Material':
                btnGroup.find('#matTypeDiv').addClass('active');
                break;
            case 'Tool':
                btnGroup.find('#toolTypeDiv').addClass('active');
                break;
            case 'Consumable':
                btnGroup.find('#conTypeDiv').addClass('active');
        }
    };


    $scope.newForm = function () {
        $scope.form = {};
        $('#buttonGroup').find('.active').removeClass('active');
        $('#submitBtn').removeClass('hidden');
        $('#deleteBtn').addClass('hidden');
        $('#confirmDel').addClass('hidden');
        $('#editBtn').addClass('hidden');
        $('#confirmEdit').addClass('hidden');
        $('#uploadIcon').css('color', 'black');
    };

    $scope.newSelect = function () {
        $('#confirmDel').addClass('hidden');
        $('#confirmEdit').addClass('hidden');
    };

    // highlight selected entry
    $scope.highlightItem = highlightService.highlight;

    $scope.map = mapService.initMap('firstFloor', 1);
    $scope.map.markers.onClick();
    $scope.deleteAllMarker = function () {
        $scope.map.markers.deleteAll();
    };
    $scope.deleteLastMarker = function () {
        $scope.map.markers.deleteLast()
    };

    $('#firstFloor').click(function () {
        console.log($scope.map.getMarkerLocation());
    })


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
