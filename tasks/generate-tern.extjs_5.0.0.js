"use strict";

/**
 * Create grunt target template to generate tern plugin for ExtJS 5.0.0 in the
 * file plugin/extjs_5.0.0.js
 */

var templateUtil = require('./template-util');

function getData() {
  return templateUtil.createData("extjs", "5.0.0");
}

templateUtil.addTargetTemplate({
  'generate-tern.extjs_5.0.0' : {
    'options' : {
      'data' : getData
    },
    'files' : {
      'plugin/extjs_5.0.0.js' : [ 'generator/extjs.js.tpl' ]
    }
  }
});