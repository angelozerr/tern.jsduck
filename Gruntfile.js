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
  grunt.loadNpmTasks('grunt-contrib-watch');

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
    },
    watch: {
      testunit: {
        files: ['test/unit/*-spec.js', 'generator/*.{js,tpl}'],
        tasks: 'test:unit'
      },
      testcompletion: {
        files: ['test/completion/*-spec.js', 'generator/*.{js,tpl}'],
        tasks: 'test:completion'
      },
      testcompletionwithbuild: {
        files: ['test/completion/*-spec.js', 'generator/*.{js,tpl}'],
        tasks: ['template', 'test:completion']
      },
      testall: {
        files: ['test/**/*-spec.js', 'generator/*.{js,tpl}'],
        tasks: 'test'
      }
    }
  });

  grunt.registerTask('test:unit', ['mochacli:unit']);
  grunt.registerTask('test:completion', ['mochacli:completion']);
  grunt.registerTask('test', ['mochacli:unit', 'mochacli:completion']);
  grunt.registerTask('autotest:unit', ['watch:testunit']);
  grunt.registerTask('autotest:completion', ['watch:testcompletion']);
  grunt.registerTask('autotest:completionwithbuild', ['watch:testcompletionwithbuild']);
  grunt.registerTask('autotest', ['watch:testall']);

  grunt.registerTask('default', [ 'template', 'test' ]);
};
