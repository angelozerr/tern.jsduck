"use strict";

/**
 * Grunt template utilities for generate ExtJS Tern plugin by using jsduck API
 * json.
 */

var fs = require("fs"), path = require("path"), JSDuckApi2TernDef = require("../generator/JSDuckApi2TernDef");

/**
 * Create ExtJS data waited by the grunt template.
 * 
 * @param type
 *        of the Api (ex : extjs)
 * @param version
 *        version of the Api.
 * @param formatJSON
 *        true if tern defs must be formated.
 */
exports.createData = function(type, version, formatJSON) {
  var options = {
    version : version
  };
  var generator = new JSDuckApi2TernDef.Generator(type), ternDef = generator.ternDef;
  // loop for Ext*.json
  var basedir = getApiBaseDir(type, version);
  var filenames = fs.readdirSync(basedir);
  updateTernDef(generator, type, version, filenames);
  var defs = formatJSON ? JSON.stringify(ternDef, null, ' ') : JSON.stringify(ternDef);
  return {
    'version' : version,
    'defs' : defs
  }
}

var template = {};

/**
 * Add JSDuck target template.
 * 
 * @param the
 *        grunt target template.
 */
exports.addTargetTemplate = function(target) {
  for ( var name in target) {
    template[name] = target[name];
  }
}

/**
 * Returns the JSDuck grunt template which contains the list of JSDuck target
 * template.
 * 
 * @return the JSDuck grunt template which contains the list of JSDuck target
 *         template.
 */
exports.getTemplate = function() {
  return template;
}

exports.generateTernDef = generateTernDef;

//----------- private function

function generateTernDef(type, version, filenames) {
  var generator = new JSDuckApi2TernDef.Generator(type);
  updateTernDef(generator, type, version, filenames);
  return generator.ternDef;
}

function updateTernDef(generator, type, version, filenames) {
  if (filenames instanceof Array) {
    filenames.forEach(function(filename) {
      updateTernDef(generator, type, version, filename);
    });
  } else {
    if (endsWith(filenames, '.json')) {
      var jsduckApi = loadJSDuckApi(type, version, filenames);
      generator.addApi(jsduckApi);
    }
  }
}

function loadJSDuckApi(type, version, filename) {
  var basedir = getApiBaseDir(type, version);
  return JSON.parse(fs.readFileSync(path.join(basedir, filename), "utf8"));
}

function getApiBaseDir(type, version) {
  var basedir = path.resolve("./api/", type + '/' + version);
  if (!fs.existsSync(basedir)) {
    // case when test is run
    basedir = path.resolve("../api/", type + '/' + version);
  }
  return basedir;
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}