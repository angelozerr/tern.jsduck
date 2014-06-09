var templateUtil = require('../tasks/template-util'), assert = require('assert');

exports['test One Ext Type'] = function() {
    var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
    assert.equal(ternDef['XXX'], undefined);
    // check tern def has Ext
    assert.notEqual(ternDef['Ext'], undefined);
}

exports['test Two Ext Type'] = function() {
    var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", [ 'Ext.json',
	    'Ext.Action.json' ]);
    assert.equal(ternDef['XXX'], undefined);
    // check tern def has Ext
    assert.notEqual(ternDef['Ext'], undefined);
    // check tern def has Ext.Action
    assert.notEqual(ternDef['Ext']['Action'], undefined);
}

exports['test Ext bool Property'] = function() {
    var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
    var enableFx = ternDef['Ext']['enableFx'];
    assert.notEqual(enableFx, undefined);
    assert.equal(enableFx['!type'], 'bool');
    assert.notEqual(enableFx['!doc'], undefined);
}

exports['test Ext string Function'] = function() {
    var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');
    var isString = ternDef['Ext']['isString'];
    assert.notEqual(isString, undefined);
    assert.equal(isString['!type'], 'fn(value: ?) -> bool');
    assert.notEqual(isString['!doc'], undefined);
}

if (module == require.main)
    require('test').run(exports)