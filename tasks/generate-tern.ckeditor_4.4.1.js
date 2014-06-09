"use strict";

/**
 * Create grunt target template to generate tern plugin for CKEditor 4.4.1 in the
 * file plugin/ckeditor_4.4.1.js
 */

var templateUtil = require('./template-util');

function getData() {
  return templateUtil.createData("ckeditor", "4.4.1");
}

templateUtil.addTargetTemplate({
  'generate-tern.ckeditor_4.4.1' : {
    'options' : {
      'data' : getData
    },
    'files' : {
      'plugin/ckeditor_4.4.1.js' : [ 'generator/ckeditor.js.tpl' ]
    }
  }
});