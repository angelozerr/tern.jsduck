var templateUtil = require('../tasks/template-util'), assert = require('assert');

exports['test One Ext Type'] = function() {
  var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
  assert.equal(undefined, ternDef['XXX']);
  // check tern def has Ext
  assert.notEqual(undefined, ternDef['Ext']);
}

exports['test Two Ext Type'] = function() {
  var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", [ 'Ext.json', 'Ext.Action.json' ]);
  assert.equal(undefined, ternDef['XXX']);
  // check tern def has Ext
  assert.notEqual(undefined, ternDef['Ext']);
  // check tern def has Ext.Action
  assert.notEqual(undefined, ternDef['Ext']['Action']);
}

exports['test Ext bool Property'] = function() {
  var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
  var enableFx =  ternDef['Ext']['enableFx'];
  assert.notEqual(undefined, enableFx);
  assert.equal('bool', enableFx['!type']);
  assert.notEqual(undefined, enableFx['!doc']);
}

exports['test Ext string Function'] = function() {
    var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
    var isString =  ternDef['Ext']['isString'];
    assert.notEqual(undefined, isString);
    assert.equal('fn(value: ?) -> bool', isString['!type']);
    assert.notEqual(undefined, isString['!doc']);
  }

if (module == require.main)
  require('test').run(exports)