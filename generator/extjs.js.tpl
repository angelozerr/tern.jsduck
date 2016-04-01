(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("tern/lib/infer"), require("tern/lib/tern"));
  if (typeof define == "function" && define.amd) // AMD
    return define([ "tern/lib/infer", "tern/lib/tern" ], mod);
  mod(tern, tern);
})(function(infer, tern) {
  "use strict";

  tern.registerPlugin("extjs_<%= version %>", function(server, options) {
    postDefine();
    server.on("completion", findCompletions);
    server.addDefs(defs);
  });

  function findCompletions(file, query) {
    var wordEnd = tern.resolvePos(file, query.end);
    var expressionsAround = {
      expr: infer.findExpressionAround(file.ast, null, wordEnd, file.scope),
      callExpr: infer.findExpressionAround(file.ast, null, wordEnd, file.scope, 'CallExpression'),
      propExpr: infer.findExpressionAround(file.ast, null, wordEnd, file.scope, 'Property')
    };
    // probably worth to make modules at some point
    return (
      findCompletionsForXtypeStrings(file, query, wordEnd, expressionsAround) ||
      findCompletionsForXtypeObjectProperties(file, query, wordEnd, expressionsAround) ||
      findCompletionsForExtDefine(file, query, wordEnd, expressionsAround)
    );
  }

  // **************************************************
  // Utils
  // **************************************************

  function getPropertyNameToComplete(propExpr) {
    return propExpr ? propExpr.node.key.name : '';
  }

  function extractPropertyValue(objExpr, propName) {
    var className;
    var properties = objExpr.node.properties;
    if (!properties) {
      return;
    }
    properties.some(function (node) {
      if (node.key.name === propName) {
        var val = node.value;
        if (val.type === 'Literal' && val.value) {
          className = val.value;
        }
        return true;
      }
      return false;
    });
    return className;
  }

  function getConfigDefForClass(className) {
    var classConfigDef;
    var cx = infer.cx();
    if (className) {
      var parentDefinitionName = className.replace(/\./g, '_') + '_cfg';
      classConfigDef = cx.definitions.extjs[parentDefinitionName];
    } else {
      configDef = cx.definitions.Ext_cfg;
    }
    return classConfigDef;
  }

  function getConfigCompletionsFor(query, propNameToComplete, curProto) {
    var completions = [];
    var depth = 0;
    for (; curProto; curProto = curProto.proto) {
      for (var name in curProto.props) {
        if (name.lastIndexOf(propNameToComplete, 0) === 0) {
          tern.addCompletion(query, completions, name, curProto.props[name], depth);
        }
      }
      depth++;
    }
    return completions;
  }

  function isObjParentOf(parentExpr, childExpr) {
    var properties = parentExpr.node.properties;
    return properties && properties.indexOf(childExpr.node) !== -1;
  }

  function getAliases() {
    var extDefs = null;
    infer.cx().parent.defs.some(function (curDefs) {
      if (curDefs['!name'] === 'extjs') {
        extDefs = curDefs;
        return true;
      }
    });
    return extDefs && extDefs['!data'] && extDefs['!data'].aliases;
  }


  // **************************************************
  // xtypes
  // **************************************************

  function findCompletionsForXtypeObjectProperties(file, query, wordEnd, expressionsAround) {
    var objExpr = expressionsAround.expr;
    var propExpr = expressionsAround.propExpr;
    if (!objExpr || !objExpr.node.type === 'ObjectExpression' || !propExpr) {
      return;
    }
    if (!isObjParentOf(objExpr, propExpr)) {
      return;
    }
    var propNode = propExpr.node;

    var xtype = extractPropertyValue(objExpr, 'xtype');
    if (!xtype) {
      return;
    }
    var classDef = getConfigClassDefForXtype(xtype, propExpr);
    var propNameToComplete = getPropertyNameToComplete(propExpr);
    var completions = getConfigCompletionsFor(query, propNameToComplete, classDef);

    var propNode = propExpr && propExpr.node;
    var start = propNode ? propNode.start : wordEnd;
    var end = propNode ? propNode.end : wordEnd;
    return {
      start: tern.outputPos(query, file, start),
      end: tern.outputPos(query, file, end),
      isProperty: true,
      isObjectKey: true,
      completions: completions
    };
  }

  function findCompletionsForXtypeStrings(file, query, wordEnd, expressionsAround) {
    var thisExpr = expressionsAround.expr;
    var propExpr = expressionsAround.propExpr;
    if (thisExpr.node.type !== 'Literal' || !propExpr ) {
      return;
    }
    var propNode = propExpr.node;
    if (propNode.value !== thisExpr.node || propNode.key.name !== 'xtype') {
      return;
    }
    var aliases = getAliases();
    if (!aliases || !aliases.widget) {
      return;
    }
    var start = thisExpr.start;
    var end = thisExpr.end;
    return {
      start: tern.outputPos(query, file, start),
      end: tern.outputPos(query, file, end),
      isProperty: false,
      isObjectKey: false,
      completions: Object.keys(aliases.widget).reduce(function (completions, xtype) {
        if (xtype.lastIndexOf(thisExpr.node.value, 0) === 0) {
          completions.push({
            origin: 'extjs',
            name: xtype
          });
        }
        return completions;
      }, [])
    };

  }

  function getConfigClassDefForXtype(xtype, propExpr) {
    var aliases = getAliases();
    if (!aliases || !aliases.widget) {
      return;
    }
    var widgets = aliases.widget;
    var className = widgets[xtype];
    if (!className) {
      return;
    }
    return getConfigDefForClass(className);
  }

  // **************************************************
  // Ext.define
  // **************************************************

  function findCompletionsForExtDefine(file, query, wordEnd, expressionsAround) {
    var callExpr = expressionsAround.callExpr;
    var objExpr = expressionsAround.expr;
    if (!objExpr || !objExpr.node.type === 'ObjectExpression') {
      return;
    }
    var propExpr = expressionsAround.propExpr;
    if (!isExtDefineCallExpression(callExpr, objExpr)) {
      return;
    }

    // Is the object expression the parent of the property being auto-completed?
    if (propExpr && !isObjParentOf(objExpr, propExpr)) {
      return;
    }

    var parentDef = getParentClassConfigDefinition(objExpr);
    var propNameToComplete = getPropertyNameToComplete(propExpr);
    var completions = getConfigCompletionsFor(query, propNameToComplete, parentDef);

    var propNode = propExpr && propExpr.node;
    var start = propNode ? propNode.start : wordEnd;
    var end = propNode ? propNode.end : wordEnd;
    return {
      start: tern.outputPos(query, file, start),
      end: tern.outputPos(query, file, end),
      isProperty: true,
      isObjectKey: true,
      completions: completions
    };
  }

  function getParentClassConfigDefinition(objExpr) {
    var parentClass = extractPropertyValue(objExpr, 'extend');
    return getConfigDefForClass(parentClass);
  }

  function isExtDefineCallExpression(callExpr, objExpr) {
    // check we're going to autocomplete direct properties
    if (!callExpr) {
      return false;
    }
    var callee = callExpr.node.callee;
    if (!callee || !callee.object.name === 'Ext' || !callee.property.name === 'define') {
      return false;
    }
    if (callExpr.node.arguments[1] !== objExpr.node) {
      return false;
    }
    return true;
  }

  function postDefine() {
    if (!defs.Ext.define) {
      defs.Ext.define = {
        '!type': "fn(className: string, data: ?, createdFn: fn()) -> +Ext.Base",
        '!doc': 'Defines a class or override.'
      };
    }
    for (var cfgName in defs['!define']) {
      var def = defs['!define'][cfgName];
      console.log(cfgName);
      if (def.reference) {
        console.log(def.reference);
      }
    }
  }

  var defs = <%= defs %>;
});
