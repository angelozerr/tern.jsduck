var
  templateUtil = require('../../tasks/template-util'),
  expect = require('chai').expect;

describe('template util for Ext', function () {
  var ternDef = templateUtil.generateTernDef('extjs', "5.0.0", 'Ext.json');

  it('should have one Ext type', function () {
    expect(ternDef).to.not.include.keys('XXX');
    expect(ternDef.Ext).to.be.ok;
  });

  it('should have two Ext types', function () {
    var multipleTernDef = templateUtil.generateTernDef('extjs', "5.0.0", [ 'Ext.json',
        'Ext.Action.json' ]);
    expect(multipleTernDef).to.not.include.keys('XXX');
    expect(multipleTernDef.Ext).to.be.ok;
    expect(multipleTernDef.Ext.Action).to.be.ok;
  });

  it('should generate "Ext.enableFx" property definitions with !type and !doc properties', function () {
    var enableFx = ternDef['Ext']['enableFx'];
    expect(enableFx).to.deep.equal({
      '!type': 'bool',
      '!doc': '<p>True if the <a href=\"#!/api/Ext.fx.Anim\" rel=\"Ext.fx.Anim\" class=\"docClass\">Ext.fx.Anim</a> Class is available.</p>\n'
    });
  });

  it('should generate "Ext.isString" function definition', function () {
    var isString = ternDef['Ext']['isString'];
    expect(isString).to.deep.equal({
      '!type': 'fn(value: ?) -> bool',
      '!doc': '<p>Returns <code>true</code>if the passed value is a string.</p>\n'
    });
  });

  describe('for Ext classes', function () {
    var tableTernDef = templateUtil.generateTernDef('extjs', '5.1.1',
        'Ext.panel.Table.json');

    it('should generate definition for Ext.panel.Table', function () {
      expect(tableTernDef).to.have.deep.property('Ext.panel.Table')
        .that.is.an('object');
    });

    it('should generate !type property', function () {
      expect(tableTernDef.Ext.panel.Table).to.have.property('!type',
          'fn(config: +Ext.dom.Element|string|Ext_panel_Table_cfg)');
    });

    it('should generate !proto property', function () {
      expect(tableTernDef.Ext.panel.Table.prototype)
        .to.have.property('!proto', 'Ext.panel.Panel.prototype');
    });
  });

  describe('for !define', function () {
    describe('configs', function () {
      var tableTernDef = templateUtil.generateTernDef('extjs', '5.1.1',
        'Ext.panel.Table.json');

      it('should generate the _*cfg object in !define', function () {
        expect(tableTernDef['!define']).to.have.property('Ext_panel_Table_cfg')
          .that.is.an('object')
          .and.that.has.property('disableSelection');
      });

      it('should generate the *_cfg object in !define for the configuration coming from mixins',
          function () {
        expect(tableTernDef['!define'].Ext_panel_Table_cfg)
          .to.have.property('lockedGridConfig'); // From Ext.grid.locking.Lockable
      });

      it('should generate complete config definitions in !define', function () {
        expect(Object.keys(tableTernDef['!define'].Ext_panel_Table_cfg))
          .to.have.length(46);
      });
    });

  });

  describe('for !data', function () {
    describe('aliases', function () {
      var fileUploadTernDef = templateUtil.generateTernDef('extjs', '5.1.1',
        'Ext.form.field.File.json');

      it('should generate the aliases definitions', function () {
        expect(fileUploadTernDef['!data']).to.have.property('aliases')
          .that.is.an('object')
          .and.that.has.property('widget')
          .that.deep.equals({
              'filefield': 'Ext.form.field.File',
              'fileuploadfield': 'Ext.form.field.File'
          });
      });
    });

  });

  describe('for types', function () {
    var buttonTernDef = templateUtil.generateTernDef('extjs', '5.1.1',
        'Ext.button.Button.json');
    it('should generate union types correctly with functions and their parameters', function () {
      expect(buttonTernDef.Ext.button.Button.prototype)
        .to.have.property('handler')
        .that.has.property('!type',
            'string|fn(button: +Ext.button.Button, e: +Ext.event.Event)');
    });
  });

  describe('issue11', function () {
    var extDef = templateUtil.generateTernDef('extjs', '4.2.1',
        'Ext.json');
    it('should generate correct definition for Ext.destroy', function () {
      expect(extDef.Ext)
        .to.have.property('destroy')
        .that.has.property('!type', 'fn(args: +Ext.dom.Element|+Ext.util.Observable|[+Ext.dom.Element]|[+Ext.util.Observable]) -> !this');
    });
  });
});
