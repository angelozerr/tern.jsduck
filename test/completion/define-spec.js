var
  path = require('path'),
  chai = require('chai'),
  chaiSubset = require('chai-subset'),
  testUtil = require('../lib/util.js'),
  completionFor = testUtil.completionObjectFor.bind(null, 'extjs'),
  expect = chai.expect,
  fileToComplete = path.join(__dirname, 'fixtures/define.js'),
  completor = new testUtil.Completor(fileToComplete, { "extjs_5.1.1": {} });

// Use containSubset because of possible "guess" property (we don't care) in completion results.
chai.use(chaiSubset);

describe('Ext.define completion', function () {
  it('should complete Ext.def->define', function () {
    expect(completor.completeAt('define'))
      .to.containSubset([completionFor('define', 'fn(className: string, data: ?, createdFn: fn())')]);
  });
  it('should list all properties', function () {
    expect(completor.completeAt('allForGrid'))
      .to.have.length.above(10);
  });
  it('should not complete with config properties on dummy object in function', function () {
    expect(completor.completeAt('propertyInFunction'))
      .to.have.length(0);
  });
  it('should complete sto->store', function () {
    expect(completor.completeAt('storeForGrid'))
      .to.containSubset([
          // fails to get the right type
          completionFor('store'/*, '+Ext.data.Store|string|?'*/)
      ]);
  });

  it('should complete rowLin->rowLines', function () {
    // console.log(completor.completeAt('rowLinesForGrid'));
    expect(completor.completeAt('rowLinesForGrid'))
      .to.containSubset([completionFor('rowLines', 'bool')]);
  });
});
