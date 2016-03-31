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
    var objExpr = infer.findExpressionAround(file.ast, null, wordEnd, file.scope);
    var callExpr = infer.findExpressionAround(file.ast, null, wordEnd, file.scope, 'CallExpression');
    if (!isExtDefineCallExpression(callExpr, objExpr)) {
      return;
    }
    var parentDef = getParentClassDefinition(objExpr);
    var propNameToComplete = "";
    var propExpr = infer.findExpressionAt(file.ast, null, wordEnd, file.scope, 'Property');
    var propNode;
    if (propExpr) {
      propNode = propExpr.node;
      propNameToComplete = propNode.key.name;
    }
    var completions = getCompletionsFor(query, propNameToComplete, parentDef);

    //return null;
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

  function isExtDefineCallExpression(callExpr, objExpr) {
    // check we're going to autocomplete direct properties
    if (!callExpr) {
      return false;
    }
    var callee = callExpr.node.callee;
    if (!callee || !callee.object.name === 'Ext' || !callee.property.name === 'define') {
      return false;
    }
    if (!objExpr || !objExpr.node.type === 'ObjectExpression') {
      return false;
    }
    if (callExpr.node.arguments[1] !== objExpr.node) {
      return false;
    }
    return true;
  }

  function getParentClassDefinition(objExpr) {
    var parentClass;
    objExpr.node.properties.some(function (node) {
      if (node.key.name === 'extend') {
        var val = node.value;
        if (val.type === 'Literal' && val.value) {
          parentClass = val.value;
        }
        return true;
      }
      return false;
    });
    var cx = infer.cx();
    var parentDef;
    if (parentClass) {
      var parentDefinitionName = parentClass.replace(/\./g, '_') + '_cfg';
      parentDef = cx.definitions.extjs[parentDefinitionName];
    } else {
      parentDef = cx.definitions.Ext_cfg;
    }
    return parentDef;
  }

  function getCompletionsFor(query, propNameToComplete, curProto) {
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

  function postDefine() {
    if (!defs.Ext.define) {
      defs.Ext.define = {
        '!type': "fn(className: string, data: ?, createdFn: fn()) -> +Ext.Base",
        '!doc': 'Defines a class or override.'
      };
    }
  }

  var defs = <%= defs %>;
});
