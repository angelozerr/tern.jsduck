"use strict";

/**
 * Create grunt target template to generate tern plugin for ExtJS 5.1.1 in the
 * file plugin/extjs_5.1.1.js
 */

var templateUtil = require('./template-util');

function getData() {
  return templateUtil.createData("extjs", "5.1.1");
}

templateUtil.addTargetTemplate({
  'generate-tern.extjs_5.1.1' : {
    'options' : {
      'data' : getData
    },
    'files' : {
      'plugin/extjs_5.1.1.js' : [ 'generator/extjs.js.tpl' ]
    }
  }
});
