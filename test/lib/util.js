"use strict";

var fs = require("fs"), path = require("path"), tern = require("tern"), assert = require('assert');

// Register all the plugins
['../../plugin/ckeditor_4.4.1', '../../plugin/extjs_4.2.1', '../../plugin/extjs_5.0.0', '../../plugin/extjs_5.1.1']
  .forEach(require);

var defaultQueryOptions = {
  types: true,
  docs: false,
  urls: false,
  origins: true
}

function createServer(defs, plugins) {
  var server = new tern.Server({
    defs: defs,
    plugins : plugins,
    async: false
  });
  return server;
}

function parseFileToComplete(path) {
  var content = fs.readFileSync(path, 'utf-8');
  var split = content.split(/<complete:/);
  var result = { text: '', completionLocations: {} };
  return split.reduce(function (result, chunk) {
    var name = chunk.match(/^(.*?)>/);
    if (!name) {
      result.text += chunk;
    } else {
      result.completionLocations[name[1]] = result.text.length;
      result.text += chunk.slice(name[0].length);
    }
    return result;
  }, result);
}

var Completor = exports.Completor = function (file, pluginOptions, defs) {
  var parsedFileForCompletion = parseFileToComplete(file);
  defs = defs || ['ecma5', 'browser'];
  this.text = parsedFileForCompletion.text;
  this.completionLocations = parsedFileForCompletion.completionLocations;
  this.server = createServer(defs, pluginOptions);
  this.server.addFile('test.js', this.text);
};

Completor.prototype.completeAt = function (locationName, queryOptions) {
  var location = this.completionLocations[locationName];
  var result;
  if (!queryOptions) queryOptions = defaultQueryOptions;

  this.server.request({
    query : {
      type: "completions",
      file: "test.js",
      end: location,
      types: queryOptions.types,
      docs: queryOptions.docs,
      urls: queryOptions.urls,
      origins: queryOptions.origins,
      caseInsensitive: true,
      lineCharPositions: true,
      expandWordForward: false
    }
  }, function(err, resp) {
    if (err)
      throw err;
    result = resp.completions;
  });
  return result;
};

exports.completionObjectFor = function (origin, name, type) {
  return {
    origin: origin,
    name: name,
    type: type
  };
};
