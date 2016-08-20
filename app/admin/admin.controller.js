(function () {

    angular.module("app")
        .controller("adminController", adminController);

    adminController.$inject = ["dataService", "highlightService", "searchService"];

    function adminController(dataService, highlightService, searchService) {
        var vm = this;
        vm.data = {};
        vm.details = {};
        vm.query = '';
        vm.title = "MakerLabs";
        vm.lastSelected = null;

        // functions
        vm.clear = clear;
        vm.filter = filter;
        vm.querySelect = querySelect;
        vm.search = search;
        vm.select = select;

        var hdn = "hidden";

        activate();

        //////////////////////////////
        function activate() {
            dataService.get().then(saveData);

            function saveData(data) {
                console.log(data);
                vm.data = data;
                return vm.data;
            }
        }

        function clear() {
            vm.query = '';
        }

        function filter(attr, value) {
            return !(attr === 'locx' ||
            attr === 'locy' ||
            attr === 'floor' ||
            attr === 'metadata' ||
            attr === 'key' ||
            attr === 'link');
        }

        function select(key) {
            var entry = vm.data.all[key];
            vm.title = entry.name;
            vm.details = entry;

            // highlight
            highlightService.highlight(entry.key, entry.type, vm.lastSelected);
            vm.lastSelected = key;
        }

        function querySelect(key) {
            var entry = vm.data.all[key];
            var qkey = "q-" + entry.key;
            vm.title = entry.name;
            vm.details = entry;

            highlightService.highlight(qkey, entry.type, vm.lastSelected);
            vm.lastSelected = qkey;
        }

        function search(entry) {
            if (vm.query.length >= 2) {
                return searchService.search(vm.query, entry);
            } else {
                $("#q-" + entry.key).addClass("search-pad");
                return entry.name;
            }
        }


    }

})();