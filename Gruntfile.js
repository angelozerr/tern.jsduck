module.exports = function(grunt) {

  // ExtJS
  require("./tasks/generate-tern.extjs_4.2.1");
  require("./tasks/generate-tern.extjs_5.0.0");
  require("./tasks/generate-tern.extjs_5.1.1");
  // CKEditor
  require("./tasks/generate-tern.ckeditor_4.4.7");

  var templateUtil = require("./tasks/template-util");

  var template = templateUtil.getTemplate();

  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.initConfig({
    'template' : template,
    mochacli: {
      unit: {
        options: {
          files: ['test/unit/*-spec.js']
        }
      },
      completion: {
        options: {
          files: ['test/completion/*-spec.js']
        }
      }
    }
  });

  grunt.registerTask('test:unit', ['mochacli:unit']);
  grunt.registerTask('test:competion', ['mochacli:completion']);
  grunt.registerTask('test', ['mochacli:unit', 'mochacli:completion']);

  grunt.registerTask('default', [ 'template', 'test' ]);
};
