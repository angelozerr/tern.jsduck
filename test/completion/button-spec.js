var
  path = require('path'),
  chai = require('chai'),
  chaiSubset = require('chai-subset'),
  testUtil = require('../lib/util.js'),
  completionFor = testUtil.completionObjectFor.bind(null, 'extjs'),
  expect = chai.expect,
  fileToComplete = path.join(__dirname, 'fixtures/button.js'),
  completor = new testUtil.Completor(fileToComplete, { "extjs_5.1.1": {} });

// Use containSubset because of possible "guess" property (we don't care) in completion results.
chai.use(chaiSubset);

describe('Ext.button.Button completion', function () {
  describe('for configs', function () {
    it('should complete auto->autoEl', function () {
      expect(completor.completeAt('autoElInConfig'))
        .to.containSubset([completionFor('autoEl', 'string')]);
    });

    it('should complete component->[componentCls,componentString]', function () {
      expect(completor.completeAt('componentInConfig'))
        .to.containSubset([
            completionFor('componentCls', 'string'),
            completionFor('componentLayout', 'string')
        ]);
    });
    it('should complete constrainT->constrainTo', function () {
      expect(completor.completeAt('constrainToInConfig'))
        .to.containSubset([
            // fails to get the right type
            completionFor('constrainTo'/*, '+Ext.util.Region'*/)
        ]);
    });
  });

  describe('for properties', function () {
    it('should complete btn.contentPa->contentPadding', function () {
      expect(completor.completeAt('contentPaddingProperty'))
        .to.containSubset([
            completionFor('contentPaddingProperty', 'string')
        ]);
    });
    it('should complete btn.menu.pl->plain (Ext.menu.Menu property)', function () {
      expect(completor.completeAt('menuPlainProperty'))
        .to.containSubset([
            completionFor('plain', 'bool')
        ]);
    });
  });

  describe('for functions', function () {
    // xxxFlorent: Why doesn't it work??
    it.skip('should complete _btn.->[addCls(cls), setText(text)]', function () {
      expect(completor.completeAt('btnInHandler'))
        .to.containSubset([
            completionFor('addCls', 'fn(cls: string|[string]) -> Ext.Component'),
            completionFor('setText', 'fn(text: string)')
        ]);
    });

    it.skip('should complete e.->[getKey()]', function () {
      expect(completor.completeAt('eventInHandler'))
        .to.containSubset([
            completionFor('getKey', 'fn() -> number')
        ]);
    });
  });
});
