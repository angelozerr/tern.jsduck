var templateUtil = require('../tasks/template-util'), assert = require('assert');

exports['test One Ext Type'] = function() {
  var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
  assert.equal(undefined, ternDef['XXX'])
  // check tern def has Ext
  assert.notEqual(undefined, ternDef['Ext'])
}

exports['test Two Ext Type'] = function() {
  var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", [ 'Ext.json', 'Ext.Action.json' ]);
  assert.equal(undefined, ternDef['XXX'])
  // check tern def has Ext
  assert.notEqual(undefined, ternDef['Ext'])
  // check tern def has Ext.Action
  assert.notEqual(undefined, ternDef['Ext']['Action'])
}

if (module == require.main)
  require('test').run(exports)