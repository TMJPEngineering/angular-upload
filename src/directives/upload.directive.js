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
        .directive('upload', upload);

    upload.$inject = ['$compile'];
    /* @ngInject */
    function upload($compile) {
        var directive = {
            restrict: 'E',
            scope: {
                fileChange: '&',
                fileModel: '=',
                target: '@',
                url: '@' // if want to override the template
            },
            link: linkFunc,
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            generateInputFile();
            
            el.bind('click', onClick);

            function onClick($event) {
                el[0].lastChild.click();
            }

            function generateInputFile() {
                var multiple = (attr.multiple != undefined) ? 'multiple': '';
                var html = (
                    '<input type="file" '+multiple+' style = "display:none" change-file>'
                );

                html = angular.element(html);
                html = $compile(html)(scope);
                el.append(html);
            }
        }

    }
})();
