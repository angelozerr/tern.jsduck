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
        "!define" : {},
        "!data": {
          aliases: {}
        }
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
      var config, hasConfig = false;
      if (members) {
        var constructorMember = getConstructorMember(members);
        if (constructorMember) {
          // Adding expando properties
          constructorMember._isConstructor = true;
          constructorMember._className = jsduckApi.name;
          constructorMember._extends = jsduckApi.extends;

          var ternMember = getTernClass(jsduckApi.name, ternDef);
          var ternType = getTernType(constructorMember);
          if (ternType)
            ternMember["!type"] = ternType;
          hasConfig = constructorMember._hasConfig;
          if (hasConfig) {
            var configName = getConfigNameForClass(jsduckApi.name);
            ternDef['!define'][configName] = config = {};
          }
          if (jsduckApi.aliases) {
            addAliases(jsduckApi.name, jsduckApi.aliases, ternDef['!data'].aliases);
          }
          ternMember.prototype = {};
          addParentClassPrototype(ternMember, config, constructorMember);
        }
        for (var i = 0; i < members.length; i++) {
          var member = members[i];
          if (isOwnPropertyMember(member, jsduckApi) &&
              (!isMemberPrivate(member) || options["private"])) {
            var ternMember = visitMember(member,
                jsduckApi, ternDef);
            if (ternMember) {
              addDocIfNeeded(member, ternMember,
                  options);
              if (hasConfig && member.tagname === 'cfg') {
                config[member.name] = ternMember;
              }
            }
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

    function getConfigNameForClass(className) {
      return className.replace(/\./g, '_') + '_cfg';
    }

    function addAliases(className, aliases, ternAliases) {
      for (var aliasType in aliases) {
        if (aliases.hasOwnProperty(aliasType)) {
          ternAliases[aliasType] = ternAliases[aliasType] || {};
          aliases[aliasType].forEach(function (alias) {
            ternAliases[aliasType][alias] = className;
          });
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

    function addParentClassPrototype(ternMember, config, jsdConstructorMember) {
      var parentClass = jsdConstructorMember._extends;
      if (parentClass && parentClass !== jsdConstructorMember._className) {
        ternMember.prototype['!proto'] = parentClass + '.prototype';
        if (config) {
          config['!proto'] = getConfigNameForClass(parentClass);
        }
      }
    }

    function isOwnPropertyMember(member, jsduckApi) {
      return [jsduckApi.name].concat(jsduckApi.mixins).indexOf(member.owner) !== -1;
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

    function getTernType(member) {
      var
        memberType = member.type,
        isProbablyFunction = !memberType && (member.return || member.params);

      if (memberType === 'Function' || isProbablyFunction) {
        return getFunctionDefinition(member);
      } else if (memberType) {
        return getTernTypesFromString(member);
      }
      return null;
    }

    function getFunctionDefinition(member) {
      var fnType = 'fn(', memberParams = member.params, memberReturn = member.return;
      // it's a function with parameters
      if (memberParams) {
        for (var i = 0; i < memberParams.length; i++) {
          var param = memberParams[i], name = param.name, optional = param.optional, type;
          // give a hint so that we can bind the Object type to the config properties of the class
          // in getTernTypesFromString
          if (member._isConstructor) {
            param._constructorParamFor = member._className;
          }
          type = getTernType(param);
          member._hasConfig = member._hasConfig || param._isConfig;
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
      if (!member._isConstructor) {
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


    function getTernTypesFromString(member) {
      var ternType = null, types = member.type.split("/");
      for (var i = 0; i < types.length; i++) {
        var t = getTernTypeFromString(types[i], member);
        if (t) {
          // Be a bit more clever than JSDuck and guess when a config
          // object is passed and when so, bind it to the configuration
          // structure associated to the class.
          if (t === '?' && member.name === 'config' && member._constructorParamFor) {
            t = getConfigNameForClass(member._constructorParamFor);
            member._isConfig = true;
          }
          var startsWithFn = /^fn\(/.test(ternType);
          if (!ternType) ternType = t;
          // by waiting ternjs fix https://github.com/ternjs/tern/pull/734/files
          else if (/^fn\(/.test(ternType)) {ternType = t + "|" + ternType} else {ternType = ternType + "|" + t}
        }
      }
      return ternType;
    }

    function getTernTypeFromString(type, member) {
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
          return member ? getFunctionDefinition(member): 'fn()';
        default:
          if (["'", '"'].indexOf(type.charAt(0)) !== -1) return "string";
          if (type.indexOf('...', type.length - 3) !== -1)
            return getTernTypeFromString(type.slice(0, -3));
          // Transposing Type[] into [Type]
          if (type.length > 2 && type.slice(-2) == "[]")
            return "[" + getTernTypeFromString(type.slice(0, -2), member) + "]";
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
