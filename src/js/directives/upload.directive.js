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
