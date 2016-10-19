
(function() {
    'use strict';

    angular
        .module('tmjUpload').constant('UPLOAD_CONFIG', uploadConfig());

    function uploadConfig() {
        var config = {
            TEMPLATE: 'tmj-upload/default/upload-container.html'
        };
        return config;
    }
})();
