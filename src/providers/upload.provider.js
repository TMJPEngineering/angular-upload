/**
*
* Angular Upload Library
* @author TMJ Engineering.
*
* Created a default upload approach
* @copyright TMJ Philippines BPO Services Inc. 2016
*/

(function () {
    'use strict';

    angular
        .module('tmjUpload')
        .provider('$upload', $upload);

    $upload.$inject = [];

    function $upload() {
        var templateUrl;

        return {
            config: config,
            $get: [factory]
        };

        /**
         * Sets default template url to be used
         */
        function config(options) {
            options = options || {};
            templateUrl = options.templateUrl;
        }

        function factory() {
            var service = {
                getTemplateUrl : templateUrl
            };

            return service;

        }
    }
})();
