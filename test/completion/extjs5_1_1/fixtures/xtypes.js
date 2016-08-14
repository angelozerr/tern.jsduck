Ext.create('Ext.grid.Panel', {
  columns: [{
    xtype: "actionco<complete:xtypeString>"
  }, {
    xtype: "checkcolumn",
    st<complete:stForCheckColumn>
    foo: function () {
      var o = {
        st<complete:namesInFunction>
      };
    }
  }]
});
Foo.Bar('Foo', function () {
  Ext.define('Foo.bar', {
    extend: 'Ext.grid.Panel',
    columns: [{
      xtype: 'check<complete:xtypeString2>',
    }, {
      xtype: 'checkcolumn',
      td<complete:tdForCheckColumn>,
      hidd<complete:hiddenForCheckColumn>
      tb<complete:tbarForCheckColumnShouldNotBeCompleted>
    }]
  });
});
