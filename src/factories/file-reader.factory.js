/**
* File reader function src : http://odetocode.com/blogs/scott/archive/2013/07/03/
* building-a-filereader-service-for-angularjs-the-service.aspx
* Modified by TMJP Engineering - 5/16/2016
* Allowed multiple file rendering
*/

(function() {
    'use strict';

    angular
        .module('tmjUpload')
        .factory('$file', $file);

    $file.$inject = ['$q'];

    /* @ngInject */
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
})();
