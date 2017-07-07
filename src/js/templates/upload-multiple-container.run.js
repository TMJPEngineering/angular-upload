'use strict';

uploadContainer.$inject = ['$templateCache'];

function uploadContainer($templateCache) {
    $templateCache.put('tmj-upload/default/upload-multiple-container.html', template());

    function template() {
        return (
            '<div class ="row" ng-if="fhc.files.length && fhc.showProgress">' +
                '<div class = "col-md-12 progress-container">' +
                    '<span ng-bind="::fhc.progressText"> </span>' +
                    '<div class = "progress">' +
                        '<div class="progress-bar" role="progressbar" aria-valuenow="{{fhc.progress}}" aria-valuemin="0" ' +
                        'aria-valuemax="100" style="width:{{fhc.progress}}%">{{fhc.progress}}%</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class = "row">' +
                '<div class = "col-lg-4 col-md-4 col-sm-4 col-xs-4 image-container-panel" ng-repeat = "file in fhc.files">' +
                    '<div class = "row">' +
                        '<img class = "img-thumbnail pic-img img-responsive center {{::file.iconClass}}" ng-src="{{::file.src}}">' +
                    '</div>' +
                    '<div class = "row">' +
                        '<span ng-bind="::file.name" class="pic-name"></span>' +
                    '</div>' +
                    '<div class = "row">' +
                        '<button class="btn btn-sm btn-danger" ng-click="fhc.remove($index)" ng-bind="::fhc.removeText"></button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
}

module.exports = uploadContainer;
