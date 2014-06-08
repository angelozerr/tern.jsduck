module.exports = function(grunt) {

  require("./tasks/generate-tern.extjs_4.2.1");
  require("./tasks/generate-tern.extjs_5.0.0");
  
  var templateUtil = require("./tasks/template-util");

  var template = templateUtil.getTemplate();
  grunt.initConfig({
    'template' : template
  });

  grunt.loadNpmTasks('grunt-template');
  grunt.registerTask('default', [ 'template' ]);

};