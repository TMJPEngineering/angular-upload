
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
