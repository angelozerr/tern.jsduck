tern.jsduck
===========

[![Build Status](https://secure.travis-ci.org/angelozerr/tern.jsduck.png)](http://travis-ci.org/angelozerr/tern.jsduck)

Generates [Tern plugin](http://ternjs.net/doc/manual.html#plugins) for [Extjs](http://www.sencha.com/products/extjs/) from their Javascript sources by using Api Ext*.json.

## Demo

You can see demo :

 
## How it works? 

### Ext*.json

Generate Ext*.json from extjs sources by using [jsduck](https://github.com/senchalabs/jsduck)

	jsduck --verbose --output ext-5.0.0-json/ ext-5.0.0/src --ignore-global --export=full --encoding=iso-8859-1

## Structure

The basic structure of the project is given in the following way:

