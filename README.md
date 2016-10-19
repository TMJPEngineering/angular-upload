# angular-upload
TMJ default approach of uploading files using the directive

# Dependencies

- [Angular 1.5](https://angularjs.org/)

# Installation

    npm install tmj-angular-upload

# Usage

For now please see demo after you clone for usage. Please include the js/css if you want to use this as default.

## Adding dependency to your project

Be sure to add the module dependency of this library `tmjUpload`.

    angular.module('myModule', ['tmjUpload']);

## Directive

You should use the directive element `<upload>` for you to use the feature of this library.

    <upload target="#idElement" multiple file-model="controller.var" file-change="function"></upload>

Element Attributes

- multiple - to allow the multiple upload of file.
- file-model - variable to store the files.
- file-change - the function to be executed after a file selected.
- url - url returning a template to be used for the container(by default will used the template provided)

# TODO

- Test Scripts.
- Currently images are only supported: create a support to other files.

# License

[MIT](https://github.com/TMJPEngineering/angular-upload/blob/master/LICENSE)
