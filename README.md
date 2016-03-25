tern.jsduck
===========

[![Build Status](https://secure.travis-ci.org/angelozerr/tern.jsduck.png)](http://travis-ci.org/angelozerr/tern.jsduck)

Generates [Tern plugin](http://ternjs.net/doc/manual.html#plugins) for 

 * [Extjs](http://www.sencha.com/products/extjs/) 
 * [CKEditor](http://ckeditor.com/) 
 
from their Javascript sources by using Api Ext.json, CKEDITOR.json generated with [JSDuck](https://github.com/senchalabs/jsduck)


## What is tern plugin?

Tern is a stand-alone code-analysis engine for JavaScript. It is intended to be used with a code editor plugin (WebBrowser (CodeMirror, Ace, Orion), Vim, Emacs, Sublime, Eclipse IDE (see [tern.java](https://github.com/angelozerr/tern.java))) to enhance the editor's support for intelligent JavaScript editing.

Here screenshot with completion inside Eclipse IDE : 

 * with the ExtJS Tern plugin
 
![ExtJS](https://github.com/angelozerr/tern.jsduck/wiki/images/EclipseIDE_ExtJSCompletion.png)

 * with the CKEditor Tern plugin
 
![CKEditor](https://github.com/angelozerr/tern.jsduck/wiki/images/EclipseIDE_CKEditorCompletion.png)

## Demo

You can see online demo (CodeMirror is used):

 * with [extjs_5.0.0.js](https://github.com/angelozerr/tern.jsduck/blob/master/plugin/extjs_5.0.0.js) tern plugin [here](http://codemirror-java.opensagres.eu.cloudbees.net/codemirror-javascript/demo/extjs.html).
 * with [ckeditor_4.4.1.js](https://github.com/angelozerr/tern.jsduck/blob/master/plugin/ckeditor_4.4.1.js) tern plugin [here](http://codemirror-java.opensagres.eu.cloudbees.net/codemirror-javascript/demo/ckeditor.html).

## How it works? 

### Ext*.json

Generate Ext*.json from extjs sources by using [jsduck](https://github.com/senchalabs/jsduck)

	jsduck --verbose --output ext-5.0.0-json/ ext-5.0.0/src --ignore-global --export=full --encoding=iso-8859-1
	
### jsduck Ext*.json -> Tern defs

Once you have generated jsduck *.json files (for instance see [api/extjs/5.0.0](https://github.com/angelozerr/tern.jsduck/tree/master/api/extjs/5.0.0)) you can generate tern plugin:

 * install grunt client:

	npm install -g grunt-cli

 * go at tern.jsduck folder and do
 
	grunt
	
This command generates tern plugins:

```text
...
Running "template:generate-tern.extjs_5.0.0" (template) task
File `plugin/extjs_5.0.0.js` created.
...
```

The grunt task 	uses template [generator/extjs.js.tpl](https://github.com/angelozerr/tern.jsduck/blob/master/generator/extjs.js.tpl) and merge it with generated JSON Type definitions.

[generator/ExtJSApi2TernDef_5.0.0.html](If you wish to debug the generator with a browserFF, etc), you can open the HTML file https://github.com/angelozerr/tern.jsduck/blob/master/generator/ExtJSApi2TernDef_5.0.0.html)

## Structure

The basic structure of the project is given in the following way:

* `api/` JSDuck api.json of ExtJS, CKEditor generated from their sources with [JSDuck](https://github.com/senchalabs/jsduck).
* `demos/` demos with ExtJS, CKEditor tern plugin which use CodeMirror.
* `generator/` lib to  transform JSDuck api.json to tern def, generates JSDuck from api.json by using HTML pages.
* `plugin/` ExtJS, CKEditor tern plugin where defs was generated with lib JSDuck tern plugin. 
* `test/` contains test of JSDuck tern plugin.
