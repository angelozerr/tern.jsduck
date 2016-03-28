var
  templateUtil = require('../../tasks/template-util'),
  expect = require('chai').expect;

describe('template util for CKEDITOR', function () {
  describe('for Event', function () {
    var eventDef = templateUtil.generateTernDef('ckeditor', "4.4.7", "CKEDITOR.event.json");

    it('should generate definition for CKEDITOR.event', function () {
      expect(eventDef).to.have.deep.property('CKEDITOR.event')
        .that.is.an('object');
    });

    it('should generate definition for CKEDITOR.event.removeListener', function () {
      expect(eventDef.CKEDITOR.event.prototype)
        .to.have.property('removeListener')
        .that.has.property('!type',
          'fn(eventName: string, listenerFunction: fn()) -> !this');
    });
  });
});
