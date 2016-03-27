"use strict";

var fs = require("fs"), path = require("path"), tern = require("tern"), assert = require('assert');

var defaultQueryOptions = {
  types: true,
  docs: false,
  urls: false,
  origins: true
}

function createServer(defs) {
  var plugins = {
    'extjs_5.1.1': {}
  };
  var server = new tern.Server({
    plugins : plugins
  });
  return server;
}

exports.assertCompletion = function(text, expected, queryOptions, pluginOptions, name) {
  if (!queryOptions) queryOptions = defaultQueryOptions;

  var server = createServer(defs, pluginOptions);
  server.addFile("test1.js", text);
  server.request({
    query : {
      type: "completions",
      file: "test1.js",
      end: text.length,
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
    var actualMessages = resp.messages;
    var expectedMessages = expected.messages;

    if (name) {
      var actualItem = {};
      var completions = resp["completions"];
      if (completions) {
        completions.forEach(function (item) {
          if (item['name'] === name) actualItem = item;
        });
      }
      assert.equal(JSON.stringify(actualItem), JSON.stringify(expected));
    } else {
      assert.equal(JSON.stringify(resp), JSON.stringify(expected));
    }
  });
};
