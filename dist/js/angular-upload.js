(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Angular-upload 1.0.0
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

},{"./constants/upload.constant":2,"./directives/file-handle.directive":3,"./directives/upload.directive":4,"./factory/file-reader.factory":5,"./providers/upload.provider":6,"./templates/upload-container.run":7,"./templates/upload-multiple-container.run":8}],2:[function(require,module,exports){

var uploadConfig = {
    TEMPLATE: {
        DEFAULT: 'tmj-upload/default/upload-container.html',
        MULTIPLE: 'tmj-upload/default/upload-multiple-container.html'
    },
    CONFIRM: {
        REMOVE: 'Are you sure you want to remove this file?'
    },
    TEXT: {
        REMOVE: 'Remove',
        PROGRESS: 'Progress'
    }
};

module.exports = uploadConfig;

},{}],3:[function(require,module,exports){
'use strict';
/**
 * Input file manipulation to bind it in the specified scope.
 */

fileHandle.$inject = [];

function fileHandle() {
    var directive = {
        restrict: 'A',
        scope: {
            fileChange: '&',
            fileModel: '='
        },
        link: linkFunc,
        controller: FileHandleController,
        controllerAs: 'fhc',
    }

    return directive;

    function linkFunc(scope, el, attrs, ctrl) {
        el.on('change', onChange);
        scope.$on('$destroy', ctrl.destroyScopes)
        // check and initialize the target container
        // console.log(ctrl);
        ctrl.initTargetContainer(attrs);

        function onChange(evt) {
            var files = event.target.files;
            //on change show the files in the target
            ctrl.identifyTarget(attrs, scope, files, evt);
        }
    }
}

FileHandleController.$inject = [
    '$http',
    '$upload',
    '$compile',
    '$scope',
    '$parse',
    '$file',
    'UPLOAD_CONFIG',
    '$rootScope'
];

function FileHandleController($http, $upload, $compile, $scope, $parse, $file,
    UPLOAD_CONFIG, $rootScope) {
    var vm = this;
    vm.removeText = UPLOAD_CONFIG.TEXT.REMOVE;
    vm.progressText = UPLOAD_CONFIG.TEXT.PROGRESS;
    vm.uploadListener;
    // this will be used in template
    vm.files = [];
    // will be use to hold all files from the local
    vm.lists = [];

    vm.targetElem;
    vm.multiple;

    vm.initTargetContainer = initTargetContainer;
    vm.identifyTarget = identifyTarget;
    vm.remove = remove;
    vm.destroyScopes = destroyScopes;

    // pass the scope of the directive
    function initTargetContainer(attrs) {
        vm.targetElem = $upload.getAndInitTargetElem(attrs, $scope);
        initProgressListener(attrs);
    }

    function runFunction(attrs, scope, evt, files) {
        if (!attrs.fileChange) return;

        scope.fileChange({$event: evt, $files: files});
    }

    function assignToModel(attrs, scope, files) {
        // if there is no file model specified skip
        if (!attrs.fileModel) return;

        scope.fileModel = files;
    }

    function identifyTarget(attrs, scope, files, evt) {
        // check first if there is a target
        // if there is no target, input file act by default
        if (!attrs.target) return sync(attrs, scope, files, evt);

        if (!files || files.length == 0)
            return console.log('there is no file specified to target');

        showToTarget(attrs.multiple, files);
        //after showing to target reassign the model
        sync(attrs, scope, vm.lists, evt);
    }

    function sync(attrs, scope, files, evt) {
        assignToModel(attrs, scope, files);
        // after assigning to model run the function
        runFunction(attrs, scope, evt, files);
    }

    function showToTarget(multiple, files) {
        // if there is a target identify if multiple or single
        vm.multiple = multiple;

        for (var key in files) {
            // use to prevent prototypes to be included in loop (eg. obj.length)
            if (!files.hasOwnProperty(key))
                continue;
            var file = files[key];
            // process each file
            processFile(file);
        }
    }

    function processFile(file) {
        // to identify each file has different instance
        var fileInstance = new $file();
        fileInstance.readAsDataURL(file).then(function(img) {
            var fileObj = {
                name: file.name,
                iconClass: file.iconClass(),
                src: undefined
            };
            // if icon class is empty it means it is a image so display the src
            if (!fileObj.iconClass)
                fileObj.src = img;

            // to be sure only single file will be process
            if (!vm.multiple) return show(file, fileObj, img);

            // if multiple just push everything that it is put
            // to be shown in template
            vm.files.push(fileObj);
            // to be inserted in model
            vm.lists.push(file);
        });
    }

    function show(file, fileObj, img) {
        // if target is an img put it in the image element
        if (vm.targetElem.attr('src') != undefined)
            return vm.targetElem.attr('src', img);

        //else add it in array files to see in default template or provided
        vm.files[0] = fileObj;
        vm.lists[0] = file;
    }

    function remove(index) {
        if (!confirm(UPLOAD_CONFIG.CONFIRM.REMOVE))
            return;
        // this should also remove the file in the template
        vm.files.splice(index, 1);
        // in the model automatically
        vm.lists.splice(index, 1);
    }

    function initProgressListener(attrs) {
        // if there is no specified id don't create a listener
        var id = attrs.id;
        vm.showProgress = attrs.showProgress;
        
        if (!vm.showProgress) return;

        vm.progress = 0;
        // if user added an attribute to show the progress check if it has an id
        if (!id) return console.error('Please enter an id to identify the progress');
        // before creating a rootscope we should identify it individually by id
        vm.uploadListener = $rootScope.$on('$upload-listen-' + id, function(event, data) {
            vm.progress = ((data.loaded / data.total) * 100)
        });
    }

    function destroyScopes() {
        // remove the listener
        vm.uploadListener();
    }
}

module.exports = fileHandle;

},{}],4:[function(require,module,exports){
'use strict';
/**
 * Created a wrapper for input file since angular doesn't handle input file by
 * default.
 */
function upload() {
    var directive = {
        restrict: 'E',
        link: linkFunc,
        template: function(el, attrs) {

            var inputFile = generateInputFile(attrs);
            return ('<ng-transclude></ng-transclude>' + inputFile);
        },
        transclude: true,
    };

    return directive

    function linkFunc(scope, el, attrs, ctrl) {
        el.bind('click', function() {
            el[0].lastChild.click();
        });
    }

    function generateInputFile(attrs) {
        //  get the attr field names
        var defaultAttr = attrs.$attr;

        var inputFile = '<input style="display:none;" type="file" file-handle ';

        for (var key in defaultAttr) {
            var attrName = defaultAttr[key];
            // since the input file is hidden skip adding attribute of class
            if (attrName == 'class') continue;

            //get the value of attr
            var attrValue = attrs[key];
            // concat the attribute in input file except class
            inputFile += attrName + '= "' + attrValue + '" ';
        }
        // close the element input file
        inputFile += '>';

        return inputFile;
    }
}


module.exports = upload;

},{}],5:[function(require,module,exports){

'use strict';

$file.$inject = ['$q'];
//factory
function $file($q) {
    function $fileReader() {
        // if called as a function return as new instance
        if (!(this instanceof $fileReader)) return new $fileReader();

        this.reader = new FileReader();
    }

    $fileReader.prototype.readAsDataURL = function(file) {
        var deferred = $q.defer();
        var reader = this.reader;

        reader.readAsDataURL(file);

        reader.onload = function() {
            deferred.resolve(reader.result);
        }

        reader.onerror = function() {
            deferred.reject(reader.result);
        }

        return deferred.promise;
    }

    $fileReader.prototype.onProgress = function(callback) {
        var reader = this.reader;

        reader.onprogress = callback || angular.noop;

        return this;
    }


    return $fileReader;
}

module.exports = $file;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}]},{},[1]);
