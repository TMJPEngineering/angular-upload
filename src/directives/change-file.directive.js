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
        .directive('changeFile', changeFile);

    /* @ngInject */
    function changeFile() {
        var directive = {
            restrict: 'A',
            scope: {
            },
            link: linkFunc,
            controller: TMJUploadController,
            controllerAs: 'uc',
            // bindToController: true
            // require: '^upload'
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
                setFileImage(file, fileObj);
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

        function setFileImage(file, fileObj) {
            // it means image
            if(imageTypes.indexOf(file.type) > 0) return readFileImage(file, fileObj);
            fileObj.src = file.src
        }

        function readFileImage(file, fileObj) {
            $file.read(file).then(function(img) {

            });
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
