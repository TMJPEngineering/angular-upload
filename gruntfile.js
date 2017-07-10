module.exports = init;

function init(grunt) {
    var browserifyFile = 'dist/js/angular-upload.js';

    var browserify =  {
        dev: {
            src: ['src/js/angular-upload.module.js'],
            dest: browserifyFile
        }
    };

    var uglify = {
        prod: {
            options: { mangle: true, compress: true },
            src: browserifyFile,
            dest: 'dist/js/angular-upload.min.js'
        }
    };

    var less = {
        development: {
            files: {
                './dist/css/angular-upload.css': './src/less/index.less'
            }
        },
    };

    var cssmin = {
        target: {
            files: {
                './dist/css/angular-upload.min.css': ['./dist/css/angular-upload.css']
            }
        }
    }

    var watch = {
        scripts: {
            files: ['src/**'],
            tasks: ['browserify'],
            option: {
                spawn: false
            }
        }
    };

    grunt.initConfig({
        browserify: browserify,
        uglify: uglify,
        less: less,
        cssmin: cssmin,
        watch: watch
    });


    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['browserify', 'uglify', 'less', 'cssmin']);
}
