var
  path = require('path'),
  chai = require('chai'),
  chaiSubset = require('chai-subset'),
  testUtil = require('../lib/util.js'),
  completionFor = testUtil.completionObjectFor.bind(null, 'extjs'),
  expect = chai.expect,
  fileToComplete = path.join(__dirname, 'fixtures/xtypes.js'),
  completor = new testUtil.Completor(fileToComplete, { "extjs_5.1.1": {} });

// Use containSubset because of possible "guess" property (we don't care) in completion results.
chai.use(chaiSubset);

describe('Ext.button.Button completion', function () {
  it('should complete xtype string', function () {
      expect(completor.completeAt('xtypeString'))
        .to.deep.equal([completionFor('actioncolumn')]);
  });
  it('should autocomplete st->stopSelection', function () {
      expect(completor.completeAt('stForCheckColumn'))
        .to.have.length(5)
        .and.to.containSubset([completionFor('stopSelection')]);
  });

  // Is this a bug in Tern??
  it.skip('should not autocomplete with config in functions of this config', function () {
    expect(completor.completeAt('namesInFunction'))
      .to.have.length(0);
  });
});
