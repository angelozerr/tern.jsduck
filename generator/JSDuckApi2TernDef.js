(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
  if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
  mod(root.JSDuckApi2TernDef || (root.JSDuckApi2TernDef = {})); // Plain browser env
})(this, function(exports) {
  "use strict";

  var defaultOptions = {
      doc : true
  }
  
  exports.createDef = function(name) {
    return {
      "!name": name,
      "!define": {}
    };
  }

  exports.addApi = function(jsduckApi, ternDef, options) {
    if (!options) options = defaultOptions;
    visitApi(jsduckApi, ternDef, options);
  };
  
  /**
   * Visit JSDuck Api to fill the given Tern JSON Type Definition.
   */
  function visitApi(jsduckApi, ternDef, options) {
    // 
    var name = jsduckApi.name;
    if (name) {
      var jsduckClass = getTernOwner(name, ternDef);
      if (options.doc && jsduckApi.doc) {
        jsduckClass["!doc"] = jsduckApi.doc;
      }
    }
    
    // visit members.
    visitMembers(jsduckApi, ternDef, options);
  }

  // -------------- Visit Members
  
  /**
   * Visit members.
   */
  function visitMembers(jsduckApi, ternDef, options) {
    var members = jsduckApi.members;
    if (members) {
      for (var i = 0; i < members.length; i++) {
        var member = members[i];
        visitMember(member, jsduckApi, ternDef);
      }
    }
  }
  
  /**
   * Visit member.
   */
  function visitMember(member, jsduckApi, ternDef) {
    var ternOwner = getTernOwner(member.owner, ternDef);
  }
  
  function getTernOwner(owner, ternDef) {
    var ternOwner = ternDef;
    var names = owner.split('.');
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!ternOwner[name]) {
        ternOwner[name] = {};
      }
      ternOwner = ternOwner[name];      
    }
    return ternOwner;
  }

});