var
  path = require('path'),
  chai = require('chai'),
  chaiSubset = require('chai-subset'),
  testUtil = require('../../lib/util.js'),
  completionFor = testUtil.completionObjectFor.bind(null, 'extjs'),
  expect = chai.expect,
  fileToComplete = path.join(__dirname, 'fixtures/empty.js'),
  completor = new testUtil.Completor(fileToComplete, { "extjs_5.1.1": {} });

// Use containSubset because of possible "guess" property (we don't care) in completion results.
chai.use(chaiSubset);

describe('[5.1.1] Empty file completion', function () {
  it('should not crash', function () {
    expect(completor.completeAt('startCompletionHere'))
      .to.containSubset([completionFor('Ext', 'Ext')]);
  });
});
