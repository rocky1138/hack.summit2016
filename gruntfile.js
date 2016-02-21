'use strict';

module.exports = function (grunt) {
  // Do grunt-related things in here
  grunt.initConfig({
    connect: {
      server: {
        options: {
          keepalive: true,
          port: 9001,
          base: '.'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('serve', ['connect']);
};
