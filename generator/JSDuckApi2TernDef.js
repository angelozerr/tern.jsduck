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

		    /**
		     * Visit member.
		     */
		    function visitMember(member, jsduckApi, ternDef) {
			var ternClass = getTernClassOrPrototype(member, jsduckApi, ternDef);
			/*
			 * switch (member.tagname) { case 'property': var
			 * ternProperty = {}; ternClass[member.name] =
			 * ternProperty; var ternType = getTernType(member); if
			 * (ternType) ternProperty["!type"] = ternType; return
			 * ternProperty; case 'method': var ternMethod = {};
			 * ternClass[member.name] = ternMethod; var ternType =
			 * getTernType(null, member.params); if (ternType)
			 * ternMethod["!type"] = ternType; return ternMethod;
			 * break; case 'event': break; case 'cfg': break; }
			 */
			var ternMember = {};
			    ternClass[member.name] = ternMember;
			    var ternType = getTernType(member);
			    if (ternType)
				ternMember["!type"] = ternType;
			    return ternMember;
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

		    function getTernType(member) {
			var memberType = member.type, memberParams = member.params, memberReturn = member.return;
			if (!memberType) {
			    if (memberParams || memberReturn) {
				var fnType = 'fn(';
				// it's a function with parameters
				if (memberParams) {
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
				}
				fnType += ')';
				    if (memberReturn) {
					var returnType = getTernType(memberReturn);
					if (!returnType) returnType = '?';
					fnType += ' -> ';
					fnType += returnType;
				    }
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
			// console.log(memberType)
		    }

		    function getTernClassOrPrototype(member, jsduckApi, ternDef) {
			var ternClass = getTernClass(member.owner, ternDef);
			if (jsduckApi.singleton) {
			    return ternClass;
			}
			/*
			 * if (isMemberStatic(member)) return ternClass;
			 */
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
			if (options.doc && jsduckItem.doc && jsduckItem.doc != '\n') {
			    ternItem["!doc"] = jsduckItem.doc;
			}
		    }

		});