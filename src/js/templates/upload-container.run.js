'use strict';

uploadProgressContainer.$inject = ['$templateCache'];

function uploadProgressContainer($templateCache) {
    $templateCache.put('tmj-upload/default/upload-container.html', template());

    function template() {
        return (
            '<div class ="row" >' +
                '<div class = "col-lg-12 col-md-12 col-sm-12 col-xs-12 single-image-container-panel" ng-class="{\'noprocess\': !fhc.showProgress }" ng-repeat = "file in fhc.files">' +
                    '<div class = "col-lg-3 col-md-3 col-sm-3 col-xs-3">' +
                        '<div class = "row">' +
                            '<img class = "img-thumbnail pic-img img-responsive center {{::file.iconClass}}" ng-src="{{::file.src}}">' +
                        '</div>' +
                        '<div class = "row">' +
                            '<span ng-bind="::file.name" class="pic-label"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class = "col-lg-9 col-md-9 col-sm-9 col-xs-9 progress-container">' +
                        '<div class = "row">' +
                            '<span ng-bind="::file.name" class="pic-name"></span>' +
                        '</div>' +
                        '<div class = "progress">' +
                            '<div class="progress-bar" role="progressbar" aria-valuenow="{{fhc.progress}}" aria-valuemin="0" ' +
                            'aria-valuemax="100" style="width:{{fhc.progress}}%">{{fhc.progress}}%</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
}

module.exports = uploadProgressContainer;
