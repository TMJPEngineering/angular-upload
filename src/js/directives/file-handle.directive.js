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
        el.on('click', onClick);
        el.on('change', onChange);
        scope.$on('$destroy', ctrl.destroyScopes)
        // check and initialize the target container
        ctrl.initTargetContainer(attrs);

        function onChange(evt) {
            var files = evt.target.files;
            //on change show the files in the target
            ctrl.identifyTarget(attrs, scope, files, evt);
        }

        function onClick(evt) {
            if (attrs.allowSameFile == "true")
                evt.target.value = null;
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
    '$rootScope',
    '$timeout'
];

function FileHandleController($http, $upload, $compile, $scope, $parse, $file,
    UPLOAD_CONFIG, $rootScope, $timeout) {
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

        //added timeout to wait for others to take effect before getting the element
        $timeout(function() {
            vm.targetElem = $upload.getAndInitTargetElem(attrs, $scope);
            initProgressListener(attrs);
        }, 0, false)
    }

    function runFunction(attrs, scope, evt, files) {
        if (!attrs.fileChange) return;

        scope.fileChange({$event: evt, $files: files, $fileRead: vm.files});
    }

    function assignToModel(attrs, scope, files) {
        // if there is no file model specified skip
        if (!attrs.fileModel) return;

        // if single
        if (!vm.multiple) return scope.fileModel = files[0];

        scope.fileModel = files;
    }

    function identifyTarget(attrs, scope, files, evt) {
        vm.progress = 0;

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
        scope.$evalAsync(function() {
            assignToModel(attrs, scope, files);
            // after assigning to model run the function
            runFunction(attrs, scope, evt, files);
        });
    }

    function showToTarget(multiple, files) {
        // if there is a target identify if multiple or single
        vm.multiple = multiple;

        for (var key in files) {
            // use to prevent prototypes to be included in loop (eg. obj.length)
            if (!files.hasOwnProperty(key))
                continue;
            var file = files[key];

            // insert file in list object for sync to work on single file
            insertInList(file);

            // process each file
            processFile(file);
        }
    }

    function insertInList(file) {
        if (!vm.multiple)
            vm.lists[0] = file;
        else
            // to be inserted in model
            vm.lists.push(file);
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
        });
    }

    function show(file, fileObj, img) {
        // if target is an img put it in the image element
        if (vm.targetElem.attr('src') != undefined)
            vm.targetElem.attr('src', img);

        //else add it in array files to see in default template or provided
        vm.files[0] = fileObj;
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
        // if user added an attribute to show the progress check if it has an id
        if (!id) return console.error('Please enter an id to identify the progress');
        // before creating a rootscope we should identify it individually by id
        vm.uploadListener = $rootScope.$on('$upload-listen-' + id, function(event, data) {
            vm.progress = ((data.loaded / data.total) * 100)
        });
    }

    function destroyScopes() {
        // remove the listener
        if (vm.uploadListener)
            vm.uploadListener();
    }
}

module.exports = fileHandle;
