"use strict";

/**
 * Create grunt target template to generate tern plugin for ExtJS 4.2.1 in the
 * file plugin/extjs_4.2.1.js
 */

var templateUtil = require('./template-util');

function getData() {
  return templateUtil.createData("extjs", "4.2.1");
}

templateUtil.addTargetTemplate({
  'generate-tern.extjs_4.2.1' : {
    'options' : {
      'data' : getData
    },
    'files' : {
      'plugin/extjs_4.2.1.js' : [ 'generator/extjs.js.tpl' ]
    }
  }
});