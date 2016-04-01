Ext.def<complete:define>
Ext.define('MyGrid', {
  extend: 'Ext.grid.Panel',
  <complete:allForGrid>
  sto<complete:storeForGrid>,
  rowLin<complete:rowLinesForGrid>,
  bodyStyle: function () {
    <complete:namesInFunction>
  },
  foo: sto<complete:propertyValue>
});
