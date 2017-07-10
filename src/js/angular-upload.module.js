/*
 * Angular-upload 1.0.4
 * @author TMJP Engineers | Rej Mediodia
 * @copyright 2017
 */

(function() {
    'use strict';
    var UPLOAD_CONFIG = require('./constants/upload.constant');
    var upload = require('./directives/upload.directive');
    var fileHandle = require('./directives/file-handle.directive');
    var $upload = require('./providers/upload.provider');
    var $file = require('./factory/file-reader.factory');
    var uploadContainer = require('./templates/upload-container.run');
    var uploadMultipleContainer = require('./templates/upload-multiple-container.run');

    angular.module('tmjUpload', [])
        .constant('UPLOAD_CONFIG', UPLOAD_CONFIG)
        .directive('upload', upload)
        .directive('fileHandle', fileHandle)
        .provider('$upload', $upload)
        .factory('$file', $file)
        .run(uploadContainer)
        .run(uploadMultipleContainer);
})();
