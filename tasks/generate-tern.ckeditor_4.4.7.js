"use strict";

/**
 * Create grunt target template to generate tern plugin for CKEditor 4.4.7 in the
 * file plugin/ckeditor_4.4.7.js
 */

var templateUtil = require('./template-util');

function getData() {
  return templateUtil.createData("ckeditor", "4.4.7", true);
}

templateUtil.addTargetTemplate({
  'generate-tern.ckeditor_4.4.7' : {
    'options' : {
      'data' : getData
    },
    'files' : {
      'plugin/ckeditor_4.4.7.js' : [ 'generator/ckeditor.js.tpl' ]
    }
  }
});