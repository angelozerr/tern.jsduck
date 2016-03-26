module.exports = function(grunt) {

  // ExtJS
  require("./tasks/generate-tern.extjs_4.2.1");
  require("./tasks/generate-tern.extjs_5.0.0");
  require("./tasks/generate-tern.extjs_5.1.1");
  // CKEditor
  require("./tasks/generate-tern.ckeditor_4.4.7");
  
  var templateUtil = require("./tasks/template-util");

  var template = templateUtil.getTemplate();
  grunt.initConfig({
    'template' : template
  });

  grunt.loadNpmTasks('grunt-template');
  grunt.registerTask('default', [ 'template' ]);

};
