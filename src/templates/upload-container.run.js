/**
*
* Angular Upload Library
* @author TMJ Engineering.
*
* Created a default upload approach
* @copyright TMJ Philippines BPO Services Inc. 2016
*/

(function() {
    'use strict';

    angular
        .module('tmjUpload')
        .run(uploadContainerTemplate);

    uploadContainerTemplate.$inject = ['$templateCache'];

    function uploadContainerTemplate($templateCache) {
        $templateCache.put('tmj-upload/default/upload-container.html', template());

        function template() {
            return (
                '<div class = "pic-container" ng-repeat = "file in uc.files">' +
                    '<button type="button" class="close pull pic-container-close" ng-if="uc.multiple" ' +
        			'ng-click="uc.removePic($index, file.ctr)">&times;' +
                    '</button>' +
                    '<div class = "col-lg-3 col-md-3 col-sm-3 col-xs-3">'+
                        '<img class = "pic-container-img img-responsive" ng-src="{{::file.src}}">' +
                    '</div>' +
                    '<div class = "col-lg-9 col-md-9 col-sm-9 col-xs-9 pic-container-right">' +
                        '<span ng-bind="::file.name"></span>' +
                        '<div class = "progress">' +
                            '<div class="progress-bar" role="progressbar" aria-valuenow="{{::file.progress}}" aria-valuemin="0" '+
                            'aria-valuemax="100" style="width:{{::file.progress}}%">{{::file.progress}}%</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }
    }
})();
