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

    angular.module('tmjUpload', [])
        .constant('UPLOAD_CONFIG', uploadConfig())
        .directive('changeFile', changeFile)
        .directive('upload', upload)
        .factory('$file', $file)
        .provider('$upload', $upload)
        .run(uploadContainerTemplate);

    upload.$inject = ['$compile'];
    $file.$inject = ['$q'];
    $upload.$inject = [];
    uploadContainerTemplate.$inject = ['$templateCache'];

    function uploadConfig() {
        var config = {
            TEMPLATE: 'tmj-upload/default/upload-container.html'
        };
        return config;
    }

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

    function changeFile() {
        var directive = {
            restrict: 'A',
            scope: {
            },
            link: linkFunc,
            controller: TMJUploadController,
            controllerAs: 'uc'
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            ctrl.url = scope.$parent.url || ''; // set url given by parent
            var targetElem;
            var uploadFunc = {
                'false': ctrl.upload,
                'true': ctrl.uploadMultiple
            };

            initTargetContainer();

            el.on('change', onChange);

            function onChange(event) {
                var files = event.target.files;

                init();

                function init() {
                    runFunction();
                    showToTarget();
                }

                function assignToModel() {
                    if(!scope.$parent.fileModel) return;

                    scope.$parent.fileModel = files;
                }

                function runFunction() {
                    if(!scope.$parent.fileChange) return;
                    // return the files to the function
                    scope.$parent.fileChange(files);
                }

                function showToTarget() {
                    if(!scope.$parent.target) return assignToModel();

                    if(!scope.$parent.fileModel) return console.error('Please specify file-model to handle the files in target');
                    // !! means make it boolean
                    return uploadFunc[!!attr.multiple](files, targetElem);
                }
            }

            function initTargetContainer() {
                if(!scope.$parent.target) return;
                // set the target element
                targetElem = ctrl.checkTargetElem(scope.$parent.target);
                // means the target element is an not an img element, generate the template
                if(targetElem.attr('src') == undefined)
                    ctrl.generateTemplate(targetElem);

                // inform the container if multiple to show the button
                ctrl.multiple = !!attr.multiple;
            }
        }
    }

    function $file($q) {
        var service = {
            read: read
        };

        return service;

        function read(file, obj) {
            var deferred = $q.defer();

            var reader = getReader(deferred, obj);
            reader.readAsDataURL(file);

            return deferred.promise;
        }

        function getReader(deferred, obj) {
            var reader = new FileReader();

            reader.onload = onLoad(reader, deferred, obj);
            reader.onerror = onError(reader, deferred, obj);
            reader.onprogress = onProgress(reader, obj);

            return reader;
        }

        function onLoad(reader, deferred, obj) {
            return run;

            function run() {
                if(obj && !obj.src) obj.src = reader.result;

                return deferred.resolve(reader.result);
            }
        }

        function onError(reader, deferred, obj) {
            return run;

            function run() {
                if(obj) obj.error = reader.result;

                deferred.reject(reader.result);
            }
        }

        function onProgress(reader, obj) {
            return run;

            function run(event) {
                if(!obj) return;
                obj.total = event.total;
                obj.loaded = event.loaded;
                obj.progress = (event.loaded / event.total) * 100;
            }
        }
    }

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

    TMJUploadController.$inject = [
        '$file',
        '$upload',
        '$http',
        '$compile',
        '$scope',
        '$templateCache',
        'UPLOAD_CONFIG'
    ];

    /* @ngInject */
    function TMJUploadController($file, $upload, $http, $compile, $scope, $templateCache,
        UPLOAD_CONFIG) {

        var vm = this;
        var imageTypes = [
            'image/png', 'image/jpeg', 'image/pjpeg', 'image/pjpeg', 'image/jpeg',
            'image/gif', 'image/bmp', 'image/x-windows-bmp'
        ];

        vm.files = [];
        var fileList = {},
        fileCtr = 0;

        // functions
        vm.upload = upload;
        vm.uploadMultiple = uploadMultiple;
        vm.removePic = removePic;

        vm.setFileImageSrc = setFileImageSrc;
        vm.checkTargetElem = checkTargetElem
        vm.generateTemplate = generateTemplate;

        /**
         * Single upload
         */
        function upload(files, elem) {
            var file = files[0];

            $scope.$parent.fileModel = files;

            // if the target is an image element change the element
            if(elem.attr('src') != undefined) {
                setFileImageSrc(file, targetElem);
            }

            //else the target is div or other container
            vm.files[0] = {};
            vm.files[0].name = file.name;
            $file.read(file, vm.files[0]).then(function(img) {
                //done
            });
        }

        /**
         * Multiple upload
         */
        function uploadMultiple(files, elem) {
            // console.log(files);
            for(var key in files) {
                var file = files[key];
                // use to prevent prototypes to be included in loop (eg. obj.length)
                if(!files.hasOwnProperty(key))
                    continue;

                var fileObj = {};
                fileObj.name = file.name;
                fileObj.ctr = fileCtr; // to identify what object count to delete
                $file.read(file, fileObj).then(function(result){

                });
                vm.files.push(fileObj);

                fileList[fileCtr] = file;
                fileCtr++;
            }
            syncToModel();
        }

        function removePic(index, ctr) {
            if(!confirm('Are you sure you want to remove this?'))
				return;

            vm.files.splice(index,1);
            delete fileList[ctr];
            syncToModel();
        }

        function syncToModel() {
            $scope.$parent.fileModel = fileList;
        }

        function checkTargetElem(target) {
            var targetElem = document.querySelector(target);
            if(!targetElem) return console.error('target element', target, 'cannot be found');

            return angular.element(targetElem);
        }

        function setFileImageSrc(file, elem) {
            // for image
            $file.read(file).then(function(img) {
                elem.attr('src', img);
            });
            // to do for other files
        }

        function generateTemplate(elem) {
            vm.url = vm.url || $upload.getTemplateUrl;

            if(vm.url) {
                return requestTemplate(elem);
            }
            var template = $templateCache.get(UPLOAD_CONFIG.TEMPLATE);
            appendTemplate(elem, template);
        }

        function requestTemplate(elem) {
            return $http.get(vm.url).then(function(template){
                appendTemplate(elem, template);
            });
        }

        function appendTemplate(elem, template) {
            template = $compile(template)($scope);
            elem.append(template);
        }
    }

})();
