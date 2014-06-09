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

          exports.createDef = function(name) {
            return {
              "!name" : name,
              "!define" : {}
            };
          }

          exports.addApi = function(jsduckApi, ternDef, options) {
            if (!options)
              options = defaultOptions;
            visitApi(jsduckApi, ternDef, options);
          };

          /**
                     * Visit JSDuck Api to fill the given Tern JSON Type
                     * Definition.
                     */
          function visitApi(jsduckApi, ternDef, options) {
            // 
            var name = jsduckApi.name;
            if (name) {
              var ternClass = getTernClass(name, ternDef);
              addDocIfNeeded(jsduckApi, ternClass, options);
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
                if (!isMemberPrivate(member) || options["private"]) {
                  var ternMember = visitMember(member, jsduckApi, ternDef);
                  if (ternMember)
                    addDocIfNeeded(member, ternMember, options);
                }
              }
            }
          }

          /**
                     * Visit member.
                     */
          function visitMember(member, jsduckApi, ternDef) {
            var ternClass = getTernClassOrPrototype(member, ternDef);
            switch (member.tagname) {
            case 'property':
              var ternProperty = {};
              ternClass[member.name] = ternProperty;
              var ternType = getTernType(member.type);
              if (ternType)
                ternProperty["!type"] = ternType;
              return ternProperty;
            case 'method':
              var ternMethod = {};
              ternClass[member.name] = ternMethod;
              var ternType = getTernType(null, member.params);
              if (ternType)
                ternMethod["!type"] = ternType;
              return ternMethod;
              break;
            case 'event':
              break;
            case 'cfg':
              break;
            default:
              console.log(member.tagname)
            }
          }

          function isMemberPrivate(member) {
            return getMemberProperty(member, "private");
          }

          function isMemberStatic(member) {
            return getMemberProperty(member, "static");
          }

          function getMemberProperty(member, name) {
            if (member[name])
              return member[name];
            if (member.autodetected && member.autodetected[name])
              return member.autodetected[name];
          }

          function getTernType(memberType, memberParams) {
            if (!memberType) {
              if (memberParams) {
                var fnType = 'fn(';
                // it's a function with parameters
                for (var i = 0; i < memberParams.length; i++) {
                  var param = memberParams[i], name = param.name, optional = param.optional, type = getTernType(
                      param.type, null)
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
                fnType += ')'
                return fnType;
              }
              return null;
            }
            switch (memberType) {
            case 'String':
              return 'string';
            case 'Boolean':
              return 'bool';
            case 'Number':
              return 'number';
            }
            console.log(memberType)
          }

          function getTernClassOrPrototype(member, ternDef) {
            var ternClass = getTernClass(member.owner, ternDef);
            if (isMemberStatic(member))
              return ternClass;
            if (!ternClass.prototype)
              ternClass.prototype = {};
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
            if (options.doc && jsduckItem.doc) {
              ternItem["!doc"] = jsduckItem.doc;
            }
          }

        });