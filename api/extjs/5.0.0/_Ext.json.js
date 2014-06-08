var ExtApi = {
 "tagname": "class",
 "name": "Ext",
 "doc": "\n",
 "alternateClassNames": [
  
 ],
 "members": [
  {
   "tagname": "property",
   "name": "enableFx",
   "autodetected": {
    "inheritdoc": true,
    "static": true,
    "private": true,
    "inheritable": true,
    "linenr": true,
    "default": true,
    "readonly": true
   },
   "files": [
    {
     "filename": "D:/_Projects/Personal/ExtJS/ext-5.0.0/src/fx/Anim.js",
     "linenr": 506
    }
   ],
   "doc": "<p>True if the <a href=\"#!/api/Ext.fx.Anim\" rel=\"Ext.fx.Anim\" class=\"docClass\">Ext.fx.Anim</a> Class is available.</p>\n",
   "owner": "Ext",
   "type": "Boolean",
   "default": "true",
   "properties": null,
   "inheritdoc": null,
   "static": null,
   "private": null,
   "inheritable": null,
   "linenr": null,
   "readonly": null,
   "id": "property-enableFx",
   "short_doc": "True if the Ext.fx.Anim Class is available. ...",
   "html_type": "Boolean"
  },
  {
   "tagname": "method",
   "name": "batchLayouts",
   "autodetected": {
    "inheritdoc": true,
    "static": true,
    "private": true,
    "inheritable": true,
    "linenr": true,
    "chainable": true,
    "fires": true,
    "method_calls": true
   },
   "files": [
    {
     "filename": "D:/_Projects/Personal/ExtJS/ext-5.0.0/src/Component.js",
     "linenr": 6136
    }
   ],
   "doc": "<p>Utility wrapper that suspends layouts of all components for the duration of a given\nfunction.</p>\n",
   "params": [
    {
     "tagname": "params",
     "type": "Function",
     "name": "fn",
     "doc": "<p>The function to execute.</p>\n",
     "html_type": "Function"
    },
    {
     "tagname": "params",
     "type": "Object",
     "name": "scope",
     "optional": true,
     "doc": "<p>The scope (<code>this</code> reference) in which the specified function\nis executed.</p>\n",
     "html_type": "Object"
    }
   ],
   "owner": "Ext",
   "inheritdoc": null,
   "static": null,
   "private": null,
   "inheritable": null,
   "linenr": null,
   "chainable": false,
   "fires": null,
   "method_calls": null,
   "id": "method-batchLayouts",
   "short_doc": "Utility wrapper that suspends layouts of all components for the duration of a given\nfunction. ..."
  },
  {
   "tagname": "method",
   "name": "resumeLayouts",
   "autodetected": {
    "static": true,
    "private": true,
    "inheritable": true,
    "linenr": true,
    "params": true,
    "chainable": true,
    "fires": true,
    "method_calls": true
   },
   "files": [
    {
     "filename": "D:/_Projects/Personal/ExtJS/ext-5.0.0/src/Component.js",
     "linenr": 6118
    }
   ],
   "doc": "<p>Resumes layout activity in the whole framework.</p>\n\n<p><a href=\"#!/api/Ext-method-suspendLayouts\" rel=\"Ext-method-suspendLayouts\" class=\"docClass\">suspendLayouts</a> is alias of <a href=\"#!/api/Ext.Component-method-suspendLayouts\" rel=\"Ext.Component-method-suspendLayouts\" class=\"docClass\">Ext.Component.suspendLayouts</a>.</p>\n",
   "inheritdoc": null,
   "owner": "Ext",
   "static": null,
   "private": null,
   "inheritable": null,
   "linenr": null,
   "params": [
    {
     "tagname": "params",
     "type": "Boolean",
     "name": "flush",
     "default": "false",
     "optional": true,
     "doc": "<p><code>true</code> to perform all the pending layouts. This can also be\nachieved by calling <a href=\"#!/api/Ext.Component-static-method-flushLayouts\" rel=\"Ext.Component-static-method-flushLayouts\" class=\"docClass\">flushLayouts</a> directly.</p>\n\n",
     "html_type": "Boolean"
    }
   ],
   "chainable": false,
   "fires": null,
   "method_calls": null,
   "id": "method-resumeLayouts",
   "return": null,
   "throws": null,
   "properties": null,
   "type": null,
   "short_doc": "Resumes layout activity in the whole framework. ..."
  },
  {
   "tagname": "method",
   "name": "setGlyphFontFamily",
   "autodetected": {
    "inheritdoc": true,
    "static": true,
    "private": true,
    "inheritable": true,
    "linenr": true,
    "chainable": true,
    "fires": true,
    "method_calls": true
   },
   "files": [
    {
     "filename": "D:/_Projects/Personal/ExtJS/ext-5.0.0/src/Component.js",
     "linenr": 6151
    }
   ],
   "doc": "<p>Sets the default font-family to use for components that support a <code>glyph</code> config.</p>\n",
   "params": [
    {
     "tagname": "params",
     "type": "String",
     "name": "fontFamily",
     "doc": "<p>The name of the font-family</p>\n",
     "html_type": "String"
    }
   ],
   "owner": "Ext",
   "inheritdoc": null,
   "static": null,
   "private": null,
   "inheritable": null,
   "linenr": null,
   "chainable": false,
   "fires": null,
   "method_calls": null,
   "id": "method-setGlyphFontFamily",
   "short_doc": "Sets the default font-family to use for components that support a glyph config. ..."
  },
  {
   "tagname": "method",
   "name": "suspendLayouts",
   "autodetected": {
    "static": true,
    "private": true,
    "inheritable": true,
    "linenr": true,
    "params": true,
    "chainable": true,
    "fires": true,
    "method_calls": true
   },
   "files": [
    {
     "filename": "D:/_Projects/Personal/ExtJS/ext-5.0.0/src/Component.js",
     "linenr": 6127
    }
   ],
   "doc": "<p>Stops layouts from happening in the whole framework.</p>\n\n<p>It's useful to suspend the layout activity while updating multiple components and\ncontainers:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-suspendLayouts\" rel=\"Ext-method-suspendLayouts\" class=\"docClass\">Ext.suspendLayouts</a>();\n// batch of updates...\n<a href=\"#!/api/Ext-method-resumeLayouts\" rel=\"Ext-method-resumeLayouts\" class=\"docClass\">Ext.resumeLayouts</a>(true);\n</code></pre>\n\n<p><a href=\"#!/api/Ext-method-suspendLayouts\" rel=\"Ext-method-suspendLayouts\" class=\"docClass\">suspendLayouts</a> is alias of <a href=\"#!/api/Ext.Component-method-suspendLayouts\" rel=\"Ext.Component-method-suspendLayouts\" class=\"docClass\">Ext.Component.suspendLayouts</a>.</p>\n\n<p>See also <a href=\"#!/api/Ext-method-batchLayouts\" rel=\"Ext-method-batchLayouts\" class=\"docClass\">batchLayouts</a> for more abstract way of doing this.</p>\n",
   "inheritdoc": null,
   "owner": "Ext",
   "static": null,
   "private": null,
   "inheritable": null,
   "linenr": null,
   "params": [
    
   ],
   "chainable": false,
   "fires": null,
   "method_calls": null,
   "id": "method-suspendLayouts",
   "return": null,
   "throws": null,
   "properties": null,
   "type": null,
   "short_doc": "Stops layouts from happening in the whole framework. ..."
  }
 ],
 "aliases": {
  
 },
 "files": [
  {
   "filename": "",
   "linenr": 0,
   "href": ""
  }
 ]
}