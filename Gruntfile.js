/*
 * grunt-clear-css
 * https://github.com/pf12345/grunt-clear-css
 *
 * Copyright (c) 2014 payne
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    clear_css: {
      custom_options: {
        options: {
          outFile: true
        },
        files: {
          'css': ['test/fixtures/test1.css'],
          'html': ['test/fixtures']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
//  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'clear_css']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint','test']);

};
