(function() {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = [];

    /* @ngInject */
    function AppController() {
        var vm = this;
        vm.test = {};
        vm.test2 = {};
        vm.try = tryThis;
        activate();

        function activate() {

        }
        function tryThis(evt, files) {
            console.log('trying this');

            console.log(vm.test2);
            console.log(evt);
            console.log(files);
            return 'eyayt';
        }
    }
})();
