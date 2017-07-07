'use strict';

function $upload() {

    return {
        $get: ['$http', '$rootScope', '$compile', 'UPLOAD_CONFIG', '$templateCache', factory]
    };

    function factory($http, $rootScope, $compile, UPLOAD_CONFIG, $templateCache) {

        var service = {
            getAndInitTargetElem: getAndInitTargetElem
        };

        return service;

        function getAndInitTargetElem(attrs, scope) {
            var targetElem = attrs.target;
            // if target element is empty
            if (!targetElem) return;

            // get first the dom of the target
            var elem = document.querySelector(targetElem);

            // check if valid element
            if (!elem) return console.error('target element', targetElem, 'cannot be found');
            // and convert it to angular element
            var angularElement = angular.element(elem);

            // if the target element has src it means it is an image
            if (angularElement.attr('src') == undefined) {
                var url = (attrs.multiple == undefined) ? UPLOAD_CONFIG.TEMPLATE.DEFAULT
                    : UPLOAD_CONFIG.TEMPLATE.MULTIPLE;
                generateTemplate(angularElement, url, scope);
            }

            return angularElement;
        }

        function generateTemplate(angularElement, url, scope) {
            // try first if it is in template cache
            var template = $templateCache.get(url);

            if (template)
                return appendTemplate(angularElement, template, scope);

            // if not request it in server
            $http.get(url).then(function(result) {
                template = result.data;
                appendTemplate(angularElement, template, scope);
            });
        }


        function appendTemplate(angularElement, template, scope) {
            template = $compile(template)(scope);
            angularElement.append(template);
        }
    }
}

module.exports = $upload;
