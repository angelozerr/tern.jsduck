(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object")
    return mod(exports); // CommonJS
  if (typeof define == "function" && define.amd)
    return define([ "exports" ], mod); // AMD
  mod(root.JSDuckApi2TernDef || (root.JSDuckApi2TernDef = {})); // Plain
  // browser
  // env
})
(
  this,
  function(exports) {
    "use strict";

    var defaultOptions = {
      doc : true,
      private : true
    }

    var Generator = exports.Generator = function(name, options) {
      this.options = options || defaultOptions;
      this.ternDef = createDef(name);
    };

    function createDef(name) {
      return {
        "!name" : name,
        "!define" : {}
      };
    }

    Generator.prototype.addApi = function(jsduckApi) {
      var name = jsduckApi.name;
      if (name) {
        var ternClass = getTernClass(name, this.ternDef);
        addDocIfNeeded(jsduckApi, ternClass, this.options);
      }
      // visit members.
      visitMembers(jsduckApi, this.ternDef, this.options);
    };

    // -------------- Visit Members

    /**
     * Visit members.
     */
    function visitMembers(jsduckApi, ternDef, options) {
      var members = jsduckApi.members;
      if (members) {
        var constructorMember = getConstructorMember(members);
        if (constructorMember) {
          var ternMember = getTernClass(jsduckApi.name, ternDef);
          var ternType = getTernType(constructorMember, true);
          if (ternType)
            ternMember["!type"] = ternType;
          ternMember = ternMember.prototype = {};
        }
        for (var i = 0; i < members.length; i++) {
          var member = members[i];
          if (!isMemberPrivate(member)
              || options["private"]) {
            var ternMember = visitMember(member,
                jsduckApi, ternDef);
            if (ternMember)
              addDocIfNeeded(member, ternMember,
                  options);
          }
        }
      }
    }

    function getConstructorMember(members) {
      for (var i = 0; i < members.length; i++) {
        var member = members[i];
        if (member.name === 'constructor') {
          return member;
        }
      }
    }

    /**
     * Visit member.
     */
    function visitMember(member, jsduckApi, ternDef) {
      if (member.name != 'constructor') {
        var ternClass = getTernClassOrPrototype(member, jsduckApi, ternDef);
        var ternMember = {};
        ternClass[member.name] = ternMember;
        var ternType = getTernType(member);
        if (ternType)
          ternMember["!type"] = ternType;
        return ternMember;
      }
    }

    function isMemberChainable(member) {
      return getMemberProperty(member, "chainable");
    }

    function isMemberPrivate(member) {
      return getMemberProperty(member, "private");
    }

    function isMemberStatic(member, jsduckApi) {
      if (member["static"] == true) return true;
      if (member["static"] != false) return jsduckApi.singleton;
      return false;
    }

    function getMemberProperty(member, name) {
      if (member[name])
        return member[name];
      if (member.autodetected && member.autodetected[name])
        return member.autodetected[name];
    }

    function getTernType(member, isConstructor) {
      var memberType = member.type, memberParams = member.params, memberReturn = member.return;
      if (!memberType) {
        if (memberParams || memberReturn) {
          var fnType = 'fn(';
              // it's a function with parameters
              if (memberParams) {
                for (var i = 0; i < memberParams.length; i++) {
                  var param = memberParams[i], name = param.name, optional = param.optional, type = getTernType(
                      param, null)
                    if (i > 0)
                      fnType += ', ';
                  fnType += name;
                  if (optional)
                    fnType += '?';
                  fnType += ': ';
                  if (type) {
                    fnType += type;
                  } else {
                    fnType += '?';
                  }
                }
              }
              fnType += ')';
              if (!isConstructor) {
                if (memberReturn) {
                  var returnType = getTernType(memberReturn);
                  if (!returnType) returnType = '?';
                  fnType += ' -> ';
                  fnType += returnType;
                } else if (isMemberChainable(member)) {
                  fnType += ' -> !this';
                }
              }
              return fnType;
        }
        return null;
      }
      return getTernTypesFromString(memberType);
    }

    function getTernTypesFromString(type) {
      var ternType = null, types = type.split("/");
      for (var i = 0; i < types.length; i++) {
        var t = getTernTypeFromString(types[i]);
        if (t) {
          if (ternType) {ternType+="|"} else {ternType = "";}
          ternType+=t;
        }
      }
      return ternType;
    }

    function getTernTypeFromString(type) {
      switch (type.toLowerCase().trim()) {
        case 'string':
          return 'string';
        case 'boolean':
          return 'bool';
        case 'number':
          return 'number';
        case 'object':
          return '?';
        case 'array':
          return '[?]';
        case 'function':
          return 'fn()';
        default:
          if (type.charAt(0) == "'") return "string";
          if (type.length > 2 && type.substring(type.length -2, type.length) == "[]") return "[" + getTernTypeFromString(type.substring(0, type.length -2)) + "]";
          return "+" + type;
      }
    }

    function getTernClassOrPrototype(member, jsduckApi, ternDef) {
      var ternClass = getTernClass(member.owner, ternDef);
      if (isMemberStatic(member, jsduckApi)) return ternClass;
      if (!ternClass.prototype) ternClass.prototype = {};
      return ternClass.prototype;
    }

    function getTernClass(owner, ternDef) {
      var ternClass = ternDef;
      var names = owner.split('.');
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (!ternClass[name]) {
          ternClass[name] = {};
        }
        ternClass = ternClass[name];
      }
      return ternClass;
    }

    function addDocIfNeeded(jsduckItem, ternItem, options) {
      if (options.doc && jsduckItem.doc && jsduckItem.doc != '\n') {
        ternItem["!doc"] = jsduckItem.doc;
      }
    }

  });
