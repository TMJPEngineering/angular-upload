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
        vm.try = tryThis;
        activate();

        function activate() {

        }
        function tryThis() {
            console.log(vm.test);
        }
    }
})();
