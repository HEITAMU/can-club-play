(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function DOMParser(options) {
  this.options = options || {
    locator: {}
  };
}
DOMParser.prototype.parseFromString = function (source, mimeType) {
  var options = this.options;
  var sax = new XMLReader();
  var domBuilder = options.domBuilder || new DOMHandler(); //contentHandler and LexicalHandler
  var errorHandler = options.errorHandler;
  var locator = options.locator;
  var defaultNSMap = options.xmlns || {};
  var isHTML = /\/x?html?$/.test(mimeType); //mimeType.toLowerCase().indexOf('html') > -1;
  var entityMap = isHTML ? htmlEntity.entityMap : {
    'lt': '<',
    'gt': '>',
    'amp': '&',
    'quot': '"',
    'apos': "'"
  };
  if (locator) {
    domBuilder.setDocumentLocator(locator);
  }
  sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
  sax.domBuilder = options.domBuilder || domBuilder;
  if (isHTML) {
    defaultNSMap[''] = 'http://www.w3.org/1999/xhtml';
  }
  defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
  if (source) {
    sax.parse(source, defaultNSMap, entityMap);
  } else {
    sax.errorHandler.error("invalid doc source");
  }
  return domBuilder.doc;
};
function buildErrorHandler(errorImpl, domBuilder, locator) {
  if (!errorImpl) {
    if (domBuilder instanceof DOMHandler) {
      return domBuilder;
    }
    errorImpl = domBuilder;
  }
  var errorHandler = {};
  var isCallback = errorImpl instanceof Function;
  locator = locator || {};
  function build(key) {
    var fn = errorImpl[key];
    if (!fn && isCallback) {
      fn = errorImpl.length == 2 ? function (msg) {
        errorImpl(key, msg);
      } : errorImpl;
    }
    errorHandler[key] = fn && function (msg) {
      fn('[xmldom ' + key + ']\t' + msg + _locator(locator));
    } || function () {};
  }
  build('warning');
  build('error');
  build('fatalError');
  return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
  this.cdata = false;
}
function position(locator, node) {
  node.lineNumber = locator.lineNumber;
  node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
  startDocument: function () {
    this.doc = new DOMImplementation().createDocument(null, null, null);
    if (this.locator) {
      this.doc.documentURI = this.locator.systemId;
    }
  },
  startElement: function (namespaceURI, localName, qName, attrs) {
    var doc = this.doc;
    var el = doc.createElementNS(namespaceURI, qName || localName);
    var len = attrs.length;
    appendElement(this, el);
    this.currentElement = el;
    this.locator && position(this.locator, el);
    for (var i = 0; i < len; i++) {
      var namespaceURI = attrs.getURI(i);
      var value = attrs.getValue(i);
      var qName = attrs.getQName(i);
      var attr = doc.createAttributeNS(namespaceURI, qName);
      this.locator && position(attrs.getLocator(i), attr);
      attr.value = attr.nodeValue = value;
      el.setAttributeNode(attr);
    }
  },
  endElement: function (namespaceURI, localName, qName) {
    var current = this.currentElement;
    var tagName = current.tagName;
    this.currentElement = current.parentNode;
  },
  startPrefixMapping: function (prefix, uri) {},
  endPrefixMapping: function (prefix) {},
  processingInstruction: function (target, data) {
    var ins = this.doc.createProcessingInstruction(target, data);
    this.locator && position(this.locator, ins);
    appendElement(this, ins);
  },
  ignorableWhitespace: function (ch, start, length) {},
  characters: function (chars, start, length) {
    chars = _toString.apply(this, arguments);
    //console.log(chars)
    if (chars) {
      if (this.cdata) {
        var charNode = this.doc.createCDATASection(chars);
      } else {
        var charNode = this.doc.createTextNode(chars);
      }
      if (this.currentElement) {
        this.currentElement.appendChild(charNode);
      } else if (/^\s*$/.test(chars)) {
        this.doc.appendChild(charNode);
        //process xml
      }

      this.locator && position(this.locator, charNode);
    }
  },
  skippedEntity: function (name) {},
  endDocument: function () {
    this.doc.normalize();
  },
  setDocumentLocator: function (locator) {
    if (this.locator = locator) {
      // && !('lineNumber' in locator)){
      locator.lineNumber = 0;
    }
  },
  //LexicalHandler
  comment: function (chars, start, length) {
    chars = _toString.apply(this, arguments);
    var comm = this.doc.createComment(chars);
    this.locator && position(this.locator, comm);
    appendElement(this, comm);
  },
  startCDATA: function () {
    //used in characters() methods
    this.cdata = true;
  },
  endCDATA: function () {
    this.cdata = false;
  },
  startDTD: function (name, publicId, systemId) {
    var impl = this.doc.implementation;
    if (impl && impl.createDocumentType) {
      var dt = impl.createDocumentType(name, publicId, systemId);
      this.locator && position(this.locator, dt);
      appendElement(this, dt);
    }
  },
  /**
   * @see org.xml.sax.ErrorHandler
   * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
   */
  warning: function (error) {
    console.warn('[xmldom warning]\t' + error, _locator(this.locator));
  },
  error: function (error) {
    console.error('[xmldom error]\t' + error, _locator(this.locator));
  },
  fatalError: function (error) {
    console.error('[xmldom fatalError]\t' + error, _locator(this.locator));
    throw error;
  }
};
function _locator(l) {
  if (l) {
    return '\n@' + (l.systemId || '') + '#[line:' + l.lineNumber + ',col:' + l.columnNumber + ']';
  }
}
function _toString(chars, start, length) {
  if (typeof chars == 'string') {
    return chars.substr(start, length);
  } else {
    //java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
    if (chars.length >= start + length || start) {
      return new java.lang.String(chars, start, length) + '';
    }
    return chars;
  }
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (key) {
  DOMHandler.prototype[key] = function () {
    return null;
  };
});

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement(hander, node) {
  if (!hander.currentElement) {
    hander.doc.appendChild(node);
  } else {
    hander.currentElement.appendChild(node);
  }
} //appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
var htmlEntity = require('./entities');
var XMLReader = require('./sax').XMLReader;
var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
exports.XMLSerializer = require('./dom').XMLSerializer;
exports.DOMParser = DOMParser;
window.DOMParser = DOMParser;
//}

},{"./dom":2,"./entities":3,"./sax":4}],2:[function(require,module,exports){
"use strict";

/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src, dest) {
  for (var p in src) {
    dest[p] = src[p];
  }
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class, Super) {
  var pt = Class.prototype;
  if (!(pt instanceof Super)) {
    function t() {}
    ;
    t.prototype = Super.prototype;
    t = new t();
    // copy(pt,t);
    for (var p in pt) {
      t[p] = pt[p];
    }
    Class.prototype = pt = t;
  }
  if (pt.constructor != Class) {
    if (typeof Class != 'function') {
      console.error("unknow Class:" + Class);
    }
    pt.constructor = Class;
  }
}
var htmlns = 'http://www.w3.org/1999/xhtml';
// Node Types
var NodeType = {};
var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
var TEXT_NODE = NodeType.TEXT_NODE = 3;
var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = NodeType.NOTATION_NODE = 12;

// ExceptionCode
var ExceptionCode = {};
var ExceptionMessage = {};
var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
//level2
var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);
function DOMException(code, message) {
  if (message instanceof Error) {
    var error = message;
  } else {
    error = this;
    Error.call(this, ExceptionMessage[code]);
    this.message = ExceptionMessage[code];
    if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
  }
  error.code = code;
  if (message) this.message = this.message + ": " + message;
  return error;
}
;
DOMException.prototype = Error.prototype;
copy(ExceptionCode, DOMException);
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {}
;
NodeList.prototype = {
  /**
   * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
   * @standard level1
   */
  length: 0,
  /**
   * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
   * @standard level1
   * @param index  unsigned long 
   *   Index into the collection.
   * @return Node
   * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
   */
  item: function (index) {
    return this[index] || null;
  },
  toString: function (isHTML, nodeFilter) {
    for (var buf = [], i = 0; i < this.length; i++) {
      serializeToString(this[i], buf, isHTML, nodeFilter);
    }
    return buf.join('');
  }
};
function LiveNodeList(node, refresh) {
  this._node = node;
  this._refresh = refresh;
  _updateLiveList(this);
}
function _updateLiveList(list) {
  var inc = list._node._inc || list._node.ownerDocument._inc;
  if (list._inc != inc) {
    var ls = list._refresh(list._node);
    //console.log(ls.length)
    __set__(list, 'length', ls.length);
    //copy(ls,list);
    for (var p in ls) {
      list[p] = ls[p];
    }
    list._inc = inc;
  }
}
LiveNodeList.prototype.item = function (i) {
  _updateLiveList(this);
  return this[i];
};
_extends(LiveNodeList, NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {}
;
function _findNodeIndex(list, node) {
  var i = list.length;
  while (i--) {
    if (list[i] === node) {
      return i;
    }
  }
}
function _addNamedNode(el, list, newAttr, oldAttr) {
  if (oldAttr) {
    list[_findNodeIndex(list, oldAttr)] = newAttr;
  } else {
    list[list.length++] = newAttr;
  }
  if (el) {
    newAttr.ownerElement = el;
    var doc = el.ownerDocument;
    if (doc) {
      oldAttr && _onRemoveAttribute(doc, el, oldAttr);
      _onAddAttribute(doc, el, newAttr);
    }
  }
}
function _removeNamedNode(el, list, attr) {
  //console.log('remove attr:'+attr)
  var i = _findNodeIndex(list, attr);
  if (i >= 0) {
    var lastIndex = list.length - 1;
    while (i < lastIndex) {
      list[i] = list[++i];
    }
    list.length = lastIndex;
    if (el) {
      var doc = el.ownerDocument;
      if (doc) {
        _onRemoveAttribute(doc, el, attr);
        attr.ownerElement = null;
      }
    }
  } else {
    throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + '@' + attr));
  }
}
NamedNodeMap.prototype = {
  length: 0,
  item: NodeList.prototype.item,
  getNamedItem: function (key) {
    //		if(key.indexOf(':')>0 || key == 'xmlns'){
    //			return null;
    //		}
    //console.log()
    var i = this.length;
    while (i--) {
      var attr = this[i];
      //console.log(attr.nodeName,key)
      if (attr.nodeName == key) {
        return attr;
      }
    }
  },
  setNamedItem: function (attr) {
    var el = attr.ownerElement;
    if (el && el != this._ownerElement) {
      throw new DOMException(INUSE_ATTRIBUTE_ERR);
    }
    var oldAttr = this.getNamedItem(attr.nodeName);
    _addNamedNode(this._ownerElement, this, attr, oldAttr);
    return oldAttr;
  },
  /* returns Node */
  setNamedItemNS: function (attr) {
    // raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
    var el = attr.ownerElement,
      oldAttr;
    if (el && el != this._ownerElement) {
      throw new DOMException(INUSE_ATTRIBUTE_ERR);
    }
    oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
    _addNamedNode(this._ownerElement, this, attr, oldAttr);
    return oldAttr;
  },
  /* returns Node */
  removeNamedItem: function (key) {
    var attr = this.getNamedItem(key);
    _removeNamedNode(this._ownerElement, this, attr);
    return attr;
  },
  // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

  //for level2
  removeNamedItemNS: function (namespaceURI, localName) {
    var attr = this.getNamedItemNS(namespaceURI, localName);
    _removeNamedNode(this._ownerElement, this, attr);
    return attr;
  },
  getNamedItemNS: function (namespaceURI, localName) {
    var i = this.length;
    while (i--) {
      var node = this[i];
      if (node.localName == localName && node.namespaceURI == namespaceURI) {
        return node;
      }
    }
    return null;
  }
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation( /* Object */features) {
  this._features = {};
  if (features) {
    for (var feature in features) {
      this._features = features[feature];
    }
  }
}
;
DOMImplementation.prototype = {
  hasFeature: function ( /* string */feature, /* string */version) {
    var versions = this._features[feature.toLowerCase()];
    if (versions && (!version || version in versions)) {
      return true;
    } else {
      return false;
    }
  },
  // Introduced in DOM Level 2:
  createDocument: function (namespaceURI, qualifiedName, doctype) {
    // raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
    var doc = new Document();
    doc.implementation = this;
    doc.childNodes = new NodeList();
    doc.doctype = doctype;
    if (doctype) {
      doc.appendChild(doctype);
    }
    if (qualifiedName) {
      var root = doc.createElementNS(namespaceURI, qualifiedName);
      doc.appendChild(root);
    }
    return doc;
  },
  // Introduced in DOM Level 2:
  createDocumentType: function (qualifiedName, publicId, systemId) {
    // raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
    var node = new DocumentType();
    node.name = qualifiedName;
    node.nodeName = qualifiedName;
    node.publicId = publicId;
    node.systemId = systemId;
    // Introduced in DOM Level 2:
    //readonly attribute DOMString        internalSubset;

    //TODO:..
    //  readonly attribute NamedNodeMap     entities;
    //  readonly attribute NamedNodeMap     notations;
    return node;
  }
};

/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {}
;
Node.prototype = {
  firstChild: null,
  lastChild: null,
  previousSibling: null,
  nextSibling: null,
  attributes: null,
  parentNode: null,
  childNodes: null,
  ownerDocument: null,
  nodeValue: null,
  namespaceURI: null,
  prefix: null,
  localName: null,
  // Modified in DOM Level 2:
  insertBefore: function (newChild, refChild) {
    //raises 
    return _insertBefore(this, newChild, refChild);
  },
  replaceChild: function (newChild, oldChild) {
    //raises 
    this.insertBefore(newChild, oldChild);
    if (oldChild) {
      this.removeChild(oldChild);
    }
  },
  removeChild: function (oldChild) {
    return _removeChild(this, oldChild);
  },
  appendChild: function (newChild) {
    return this.insertBefore(newChild, null);
  },
  hasChildNodes: function () {
    return this.firstChild != null;
  },
  cloneNode: function (deep) {
    return cloneNode(this.ownerDocument || this, this, deep);
  },
  // Modified in DOM Level 2:
  normalize: function () {
    var child = this.firstChild;
    while (child) {
      var next = child.nextSibling;
      if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
        this.removeChild(next);
        child.appendData(next.data);
      } else {
        child.normalize();
        child = next;
      }
    }
  },
  // Introduced in DOM Level 2:
  isSupported: function (feature, version) {
    return this.ownerDocument.implementation.hasFeature(feature, version);
  },
  // Introduced in DOM Level 2:
  hasAttributes: function () {
    return this.attributes.length > 0;
  },
  lookupPrefix: function (namespaceURI) {
    var el = this;
    while (el) {
      var map = el._nsMap;
      //console.dir(map)
      if (map) {
        for (var n in map) {
          if (map[n] == namespaceURI) {
            return n;
          }
        }
      }
      el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
    }
    return null;
  },
  // Introduced in DOM Level 3:
  lookupNamespaceURI: function (prefix) {
    var el = this;
    while (el) {
      var map = el._nsMap;
      //console.dir(map)
      if (map) {
        if (prefix in map) {
          return map[prefix];
        }
      }
      el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
    }
    return null;
  },
  // Introduced in DOM Level 3:
  isDefaultNamespace: function (namespaceURI) {
    var prefix = this.lookupPrefix(namespaceURI);
    return prefix == null;
  }
};
function _xmlEncoder(c) {
  return c == '<' && '&lt;' || c == '>' && '&gt;' || c == '&' && '&amp;' || c == '"' && '&quot;' || '&#' + c.charCodeAt() + ';';
}
copy(NodeType, Node);
copy(NodeType, Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node, callback) {
  if (callback(node)) {
    return true;
  }
  if (node = node.firstChild) {
    do {
      if (_visitNode(node, callback)) {
        return true;
      }
    } while (node = node.nextSibling);
  }
}
function Document() {}
function _onAddAttribute(doc, el, newAttr) {
  doc && doc._inc++;
  var ns = newAttr.namespaceURI;
  if (ns == 'http://www.w3.org/2000/xmlns/') {
    //update namespace
    el._nsMap[newAttr.prefix ? newAttr.localName : ''] = newAttr.value;
  }
}
function _onRemoveAttribute(doc, el, newAttr, remove) {
  doc && doc._inc++;
  var ns = newAttr.namespaceURI;
  if (ns == 'http://www.w3.org/2000/xmlns/') {
    //update namespace
    delete el._nsMap[newAttr.prefix ? newAttr.localName : ''];
  }
}
function _onUpdateChild(doc, el, newChild) {
  if (doc && doc._inc) {
    doc._inc++;
    //update childNodes
    var cs = el.childNodes;
    if (newChild) {
      cs[cs.length++] = newChild;
    } else {
      //console.log(1)
      var child = el.firstChild;
      var i = 0;
      while (child) {
        cs[i++] = child;
        child = child.nextSibling;
      }
      cs.length = i;
    }
  }
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode, child) {
  var previous = child.previousSibling;
  var next = child.nextSibling;
  if (previous) {
    previous.nextSibling = next;
  } else {
    parentNode.firstChild = next;
  }
  if (next) {
    next.previousSibling = previous;
  } else {
    parentNode.lastChild = previous;
  }
  _onUpdateChild(parentNode.ownerDocument, parentNode);
  return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode, newChild, nextChild) {
  var cp = newChild.parentNode;
  if (cp) {
    cp.removeChild(newChild); //remove and update
  }

  if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
    var newFirst = newChild.firstChild;
    if (newFirst == null) {
      return newChild;
    }
    var newLast = newChild.lastChild;
  } else {
    newFirst = newLast = newChild;
  }
  var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;
  newFirst.previousSibling = pre;
  newLast.nextSibling = nextChild;
  if (pre) {
    pre.nextSibling = newFirst;
  } else {
    parentNode.firstChild = newFirst;
  }
  if (nextChild == null) {
    parentNode.lastChild = newLast;
  } else {
    nextChild.previousSibling = newLast;
  }
  do {
    newFirst.parentNode = parentNode;
  } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
  _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode);
  //console.log(parentNode.lastChild.nextSibling == null)
  if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
    newChild.firstChild = newChild.lastChild = null;
  }
  return newChild;
}
function _appendSingleChild(parentNode, newChild) {
  var cp = newChild.parentNode;
  if (cp) {
    var pre = parentNode.lastChild;
    cp.removeChild(newChild); //remove and update
    var pre = parentNode.lastChild;
  }
  var pre = parentNode.lastChild;
  newChild.parentNode = parentNode;
  newChild.previousSibling = pre;
  newChild.nextSibling = null;
  if (pre) {
    pre.nextSibling = newChild;
  } else {
    parentNode.firstChild = newChild;
  }
  parentNode.lastChild = newChild;
  _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
  return newChild;
  //console.log("__aa",parentNode.lastChild.nextSibling == null)
}

Document.prototype = {
  //implementation : null,
  nodeName: '#document',
  nodeType: DOCUMENT_NODE,
  doctype: null,
  documentElement: null,
  _inc: 1,
  insertBefore: function (newChild, refChild) {
    //raises 
    if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
      var child = newChild.firstChild;
      while (child) {
        var next = child.nextSibling;
        this.insertBefore(child, refChild);
        child = next;
      }
      return newChild;
    }
    if (this.documentElement == null && newChild.nodeType == ELEMENT_NODE) {
      this.documentElement = newChild;
    }
    return _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild;
  },
  removeChild: function (oldChild) {
    if (this.documentElement == oldChild) {
      this.documentElement = null;
    }
    return _removeChild(this, oldChild);
  },
  // Introduced in DOM Level 2:
  importNode: function (importedNode, deep) {
    return importNode(this, importedNode, deep);
  },
  // Introduced in DOM Level 2:
  getElementById: function (id) {
    var rtv = null;
    _visitNode(this.documentElement, function (node) {
      if (node.nodeType == ELEMENT_NODE) {
        if (node.getAttribute('id') == id) {
          rtv = node;
          return true;
        }
      }
    });
    return rtv;
  },
  //document factory method:
  createElement: function (tagName) {
    var node = new Element();
    node.ownerDocument = this;
    node.nodeName = tagName;
    node.tagName = tagName;
    node.childNodes = new NodeList();
    var attrs = node.attributes = new NamedNodeMap();
    attrs._ownerElement = node;
    return node;
  },
  createDocumentFragment: function () {
    var node = new DocumentFragment();
    node.ownerDocument = this;
    node.childNodes = new NodeList();
    return node;
  },
  createTextNode: function (data) {
    var node = new Text();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createComment: function (data) {
    var node = new Comment();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createCDATASection: function (data) {
    var node = new CDATASection();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createProcessingInstruction: function (target, data) {
    var node = new ProcessingInstruction();
    node.ownerDocument = this;
    node.tagName = node.target = target;
    node.nodeValue = node.data = data;
    return node;
  },
  createAttribute: function (name) {
    var node = new Attr();
    node.ownerDocument = this;
    node.name = name;
    node.nodeName = name;
    node.localName = name;
    node.specified = true;
    return node;
  },
  createEntityReference: function (name) {
    var node = new EntityReference();
    node.ownerDocument = this;
    node.nodeName = name;
    return node;
  },
  // Introduced in DOM Level 2:
  createElementNS: function (namespaceURI, qualifiedName) {
    var node = new Element();
    var pl = qualifiedName.split(':');
    var attrs = node.attributes = new NamedNodeMap();
    node.childNodes = new NodeList();
    node.ownerDocument = this;
    node.nodeName = qualifiedName;
    node.tagName = qualifiedName;
    node.namespaceURI = namespaceURI;
    if (pl.length == 2) {
      node.prefix = pl[0];
      node.localName = pl[1];
    } else {
      //el.prefix = null;
      node.localName = qualifiedName;
    }
    attrs._ownerElement = node;
    return node;
  },
  // Introduced in DOM Level 2:
  createAttributeNS: function (namespaceURI, qualifiedName) {
    var node = new Attr();
    var pl = qualifiedName.split(':');
    node.ownerDocument = this;
    node.nodeName = qualifiedName;
    node.name = qualifiedName;
    node.namespaceURI = namespaceURI;
    node.specified = true;
    if (pl.length == 2) {
      node.prefix = pl[0];
      node.localName = pl[1];
    } else {
      //el.prefix = null;
      node.localName = qualifiedName;
    }
    return node;
  }
};
_extends(Document, Node);
function Element() {
  this._nsMap = {};
}
;
Element.prototype = {
  nodeType: ELEMENT_NODE,
  hasAttribute: function (name) {
    return this.getAttributeNode(name) != null;
  },
  getAttribute: function (name) {
    var attr = this.getAttributeNode(name);
    return attr && attr.value || '';
  },
  getAttributeNode: function (name) {
    return this.attributes.getNamedItem(name);
  },
  setAttribute: function (name, value) {
    var attr = this.ownerDocument.createAttribute(name);
    attr.value = attr.nodeValue = "" + value;
    this.setAttributeNode(attr);
  },
  removeAttribute: function (name) {
    var attr = this.getAttributeNode(name);
    attr && this.removeAttributeNode(attr);
  },
  //four real opeartion method
  appendChild: function (newChild) {
    if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return this.insertBefore(newChild, null);
    } else {
      return _appendSingleChild(this, newChild);
    }
  },
  setAttributeNode: function (newAttr) {
    return this.attributes.setNamedItem(newAttr);
  },
  setAttributeNodeNS: function (newAttr) {
    return this.attributes.setNamedItemNS(newAttr);
  },
  removeAttributeNode: function (oldAttr) {
    //console.log(this == oldAttr.ownerElement)
    return this.attributes.removeNamedItem(oldAttr.nodeName);
  },
  //get real attribute name,and remove it by removeAttributeNode
  removeAttributeNS: function (namespaceURI, localName) {
    var old = this.getAttributeNodeNS(namespaceURI, localName);
    old && this.removeAttributeNode(old);
  },
  hasAttributeNS: function (namespaceURI, localName) {
    return this.getAttributeNodeNS(namespaceURI, localName) != null;
  },
  getAttributeNS: function (namespaceURI, localName) {
    var attr = this.getAttributeNodeNS(namespaceURI, localName);
    return attr && attr.value || '';
  },
  setAttributeNS: function (namespaceURI, qualifiedName, value) {
    var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
    attr.value = attr.nodeValue = "" + value;
    this.setAttributeNode(attr);
  },
  getAttributeNodeNS: function (namespaceURI, localName) {
    return this.attributes.getNamedItemNS(namespaceURI, localName);
  },
  getElementsByTagName: function (tagName) {
    return new LiveNodeList(this, function (base) {
      var ls = [];
      _visitNode(base, function (node) {
        if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)) {
          ls.push(node);
        }
      });
      return ls;
    });
  },
  getElementsByTagNameNS: function (namespaceURI, localName) {
    return new LiveNodeList(this, function (base) {
      var ls = [];
      _visitNode(base, function (node) {
        if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)) {
          ls.push(node);
        }
      });
      return ls;
    });
  }
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
_extends(Element, Node);
function Attr() {}
;
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr, Node);
function CharacterData() {}
;
CharacterData.prototype = {
  data: '',
  substringData: function (offset, count) {
    return this.data.substring(offset, offset + count);
  },
  appendData: function (text) {
    text = this.data + text;
    this.nodeValue = this.data = text;
    this.length = text.length;
  },
  insertData: function (offset, text) {
    this.replaceData(offset, 0, text);
  },
  appendChild: function (newChild) {
    throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
  },
  deleteData: function (offset, count) {
    this.replaceData(offset, count, "");
  },
  replaceData: function (offset, count, text) {
    var start = this.data.substring(0, offset);
    var end = this.data.substring(offset + count);
    text = start + text + end;
    this.nodeValue = this.data = text;
    this.length = text.length;
  }
};
_extends(CharacterData, Node);
function Text() {}
;
Text.prototype = {
  nodeName: "#text",
  nodeType: TEXT_NODE,
  splitText: function (offset) {
    var text = this.data;
    var newText = text.substring(offset);
    text = text.substring(0, offset);
    this.data = this.nodeValue = text;
    this.length = text.length;
    var newNode = this.ownerDocument.createTextNode(newText);
    if (this.parentNode) {
      this.parentNode.insertBefore(newNode, this.nextSibling);
    }
    return newNode;
  }
};
_extends(Text, CharacterData);
function Comment() {}
;
Comment.prototype = {
  nodeName: "#comment",
  nodeType: COMMENT_NODE
};
_extends(Comment, CharacterData);
function CDATASection() {}
;
CDATASection.prototype = {
  nodeName: "#cdata-section",
  nodeType: CDATA_SECTION_NODE
};
_extends(CDATASection, CharacterData);
function DocumentType() {}
;
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType, Node);
function Notation() {}
;
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation, Node);
function Entity() {}
;
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity, Node);
function EntityReference() {}
;
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference, Node);
function DocumentFragment() {}
;
DocumentFragment.prototype.nodeName = "#document-fragment";
DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment, Node);
function ProcessingInstruction() {}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction, Node);
function XMLSerializer() {}
XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) {
  return nodeSerializeToString.call(node, isHtml, nodeFilter);
};
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml, nodeFilter) {
  var buf = [];
  var refNode = this.nodeType == 9 && this.documentElement || this;
  var prefix = refNode.prefix;
  var uri = refNode.namespaceURI;
  if (uri && prefix == null) {
    //console.log(prefix)
    var prefix = refNode.lookupPrefix(uri);
    if (prefix == null) {
      //isHTML = true;
      var visibleNamespaces = [{
        namespace: uri,
        prefix: null
      }
      //{namespace:uri,prefix:''}
      ];
    }
  }

  serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
  //console.log('###',this.nodeType,uri,prefix,buf.join(''))
  return buf.join('');
}
function needNamespaceDefine(node, isHTML, visibleNamespaces) {
  var prefix = node.prefix || '';
  var uri = node.namespaceURI;
  if (!prefix && !uri) {
    return false;
  }
  if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" || uri == 'http://www.w3.org/2000/xmlns/') {
    return false;
  }
  var i = visibleNamespaces.length;
  //console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
  while (i--) {
    var ns = visibleNamespaces[i];
    // get namespace prefix
    //console.log(node.nodeType,node.tagName,ns.prefix,prefix)
    if (ns.prefix == prefix) {
      return ns.namespace != uri;
    }
  }
  //console.log(isHTML,uri,prefix=='')
  //if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
  //	return false;
  //}
  //node.flag = '11111'
  //console.error(3,true,node.flag,node.prefix,node.namespaceURI)
  return true;
}
function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
  if (nodeFilter) {
    node = nodeFilter(node);
    if (node) {
      if (typeof node == 'string') {
        buf.push(node);
        return;
      }
    } else {
      return;
    }
    //buf.sort.apply(attrs, attributeSorter);
  }

  switch (node.nodeType) {
    case ELEMENT_NODE:
      if (!visibleNamespaces) visibleNamespaces = [];
      var startVisibleNamespaces = visibleNamespaces.length;
      var attrs = node.attributes;
      var len = attrs.length;
      var child = node.firstChild;
      var nodeName = node.tagName;
      isHTML = htmlns === node.namespaceURI || isHTML;
      buf.push('<', nodeName);
      for (var i = 0; i < len; i++) {
        // add namespaces for attributes
        var attr = attrs.item(i);
        if (attr.prefix == 'xmlns') {
          visibleNamespaces.push({
            prefix: attr.localName,
            namespace: attr.value
          });
        } else if (attr.nodeName == 'xmlns') {
          visibleNamespaces.push({
            prefix: '',
            namespace: attr.value
          });
        }
      }
      for (var i = 0; i < len; i++) {
        var attr = attrs.item(i);
        if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
          var prefix = attr.prefix || '';
          var uri = attr.namespaceURI;
          var ns = prefix ? ' xmlns:' + prefix : " xmlns";
          buf.push(ns, '="', uri, '"');
          visibleNamespaces.push({
            prefix: prefix,
            namespace: uri
          });
        }
        serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
      }
      // add namespace for current node		
      if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
        var prefix = node.prefix || '';
        var uri = node.namespaceURI;
        var ns = prefix ? ' xmlns:' + prefix : " xmlns";
        buf.push(ns, '="', uri, '"');
        visibleNamespaces.push({
          prefix: prefix,
          namespace: uri
        });
      }
      if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
        buf.push('>');
        //if is cdata child node
        if (isHTML && /^script$/i.test(nodeName)) {
          while (child) {
            if (child.data) {
              buf.push(child.data);
            } else {
              serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
            }
            child = child.nextSibling;
          }
        } else {
          while (child) {
            serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
            child = child.nextSibling;
          }
        }
        buf.push('</', nodeName, '>');
      } else {
        buf.push('/>');
      }
      // remove added visible namespaces
      //visibleNamespaces.length = startVisibleNamespaces;
      return;
    case DOCUMENT_NODE:
    case DOCUMENT_FRAGMENT_NODE:
      var child = node.firstChild;
      while (child) {
        serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
        child = child.nextSibling;
      }
      return;
    case ATTRIBUTE_NODE:
      return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"');
    case TEXT_NODE:
      return buf.push(node.data.replace(/[<&]/g, _xmlEncoder));
    case CDATA_SECTION_NODE:
      return buf.push('<![CDATA[', node.data, ']]>');
    case COMMENT_NODE:
      return buf.push("<!--", node.data, "-->");
    case DOCUMENT_TYPE_NODE:
      var pubid = node.publicId;
      var sysid = node.systemId;
      buf.push('<!DOCTYPE ', node.name);
      if (pubid) {
        buf.push(' PUBLIC "', pubid);
        if (sysid && sysid != '.') {
          buf.push('" "', sysid);
        }
        buf.push('">');
      } else if (sysid && sysid != '.') {
        buf.push(' SYSTEM "', sysid, '">');
      } else {
        var sub = node.internalSubset;
        if (sub) {
          buf.push(" [", sub, "]");
        }
        buf.push(">");
      }
      return;
    case PROCESSING_INSTRUCTION_NODE:
      return buf.push("<?", node.target, " ", node.data, "?>");
    case ENTITY_REFERENCE_NODE:
      return buf.push('&', node.nodeName, ';');
    //case ENTITY_NODE:
    //case NOTATION_NODE:
    default:
      buf.push('??', node.nodeName);
  }
}
function importNode(doc, node, deep) {
  var node2;
  switch (node.nodeType) {
    case ELEMENT_NODE:
      node2 = node.cloneNode(false);
      node2.ownerDocument = doc;
    //var attrs = node2.attributes;
    //var len = attrs.length;
    //for(var i=0;i<len;i++){
    //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
    //}
    case DOCUMENT_FRAGMENT_NODE:
      break;
    case ATTRIBUTE_NODE:
      deep = true;
      break;
    //case ENTITY_REFERENCE_NODE:
    //case PROCESSING_INSTRUCTION_NODE:
    ////case TEXT_NODE:
    //case CDATA_SECTION_NODE:
    //case COMMENT_NODE:
    //	deep = false;
    //	break;
    //case DOCUMENT_NODE:
    //case DOCUMENT_TYPE_NODE:
    //cannot be imported.
    //case ENTITY_NODE:
    //case NOTATION_NODE：
    //can not hit in level3
    //default:throw e;
  }

  if (!node2) {
    node2 = node.cloneNode(false); //false
  }

  node2.ownerDocument = doc;
  node2.parentNode = null;
  if (deep) {
    var child = node.firstChild;
    while (child) {
      node2.appendChild(importNode(doc, child, deep));
      child = child.nextSibling;
    }
  }
  return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc, node, deep) {
  var node2 = new node.constructor();
  for (var n in node) {
    var v = node[n];
    if (typeof v != 'object') {
      if (v != node2[n]) {
        node2[n] = v;
      }
    }
  }
  if (node.childNodes) {
    node2.childNodes = new NodeList();
  }
  node2.ownerDocument = doc;
  switch (node2.nodeType) {
    case ELEMENT_NODE:
      var attrs = node.attributes;
      var attrs2 = node2.attributes = new NamedNodeMap();
      var len = attrs.length;
      attrs2._ownerElement = node2;
      for (var i = 0; i < len; i++) {
        node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
      }
      break;
      ;
    case ATTRIBUTE_NODE:
      deep = true;
  }
  if (deep) {
    var child = node.firstChild;
    while (child) {
      node2.appendChild(cloneNode(doc, child, deep));
      child = child.nextSibling;
    }
  }
  return node2;
}
function __set__(object, key, value) {
  object[key] = value;
}
//do dynamic
try {
  if (Object.defineProperty) {
    Object.defineProperty(LiveNodeList.prototype, 'length', {
      get: function () {
        _updateLiveList(this);
        return this.$$length;
      }
    });
    Object.defineProperty(Node.prototype, 'textContent', {
      get: function () {
        return getTextContent(this);
      },
      set: function (data) {
        switch (this.nodeType) {
          case ELEMENT_NODE:
          case DOCUMENT_FRAGMENT_NODE:
            while (this.firstChild) {
              this.removeChild(this.firstChild);
            }
            if (data || String(data)) {
              this.appendChild(this.ownerDocument.createTextNode(data));
            }
            break;
          default:
            //TODO:
            this.data = data;
            this.value = data;
            this.nodeValue = data;
        }
      }
    });
    function getTextContent(node) {
      switch (node.nodeType) {
        case ELEMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE:
          var buf = [];
          node = node.firstChild;
          while (node) {
            if (node.nodeType !== 7 && node.nodeType !== 8) {
              buf.push(getTextContent(node));
            }
            node = node.nextSibling;
          }
          return buf.join('');
        default:
          return node.nodeValue;
      }
    }
    __set__ = function (object, key, value) {
      //console.log(value)
      object['$$' + key] = value;
    };
  }
} catch (e) {//ie8
}

//if(typeof require == 'function'){
exports.DOMImplementation = DOMImplementation;
exports.XMLSerializer = XMLSerializer;
//}

},{}],3:[function(require,module,exports){
"use strict";

exports.entityMap = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
  Agrave: "À",
  Aacute: "Á",
  Acirc: "Â",
  Atilde: "Ã",
  Auml: "Ä",
  Aring: "Å",
  AElig: "Æ",
  Ccedil: "Ç",
  Egrave: "È",
  Eacute: "É",
  Ecirc: "Ê",
  Euml: "Ë",
  Igrave: "Ì",
  Iacute: "Í",
  Icirc: "Î",
  Iuml: "Ï",
  ETH: "Ð",
  Ntilde: "Ñ",
  Ograve: "Ò",
  Oacute: "Ó",
  Ocirc: "Ô",
  Otilde: "Õ",
  Ouml: "Ö",
  Oslash: "Ø",
  Ugrave: "Ù",
  Uacute: "Ú",
  Ucirc: "Û",
  Uuml: "Ü",
  Yacute: "Ý",
  THORN: "Þ",
  szlig: "ß",
  agrave: "à",
  aacute: "á",
  acirc: "â",
  atilde: "ã",
  auml: "ä",
  aring: "å",
  aelig: "æ",
  ccedil: "ç",
  egrave: "è",
  eacute: "é",
  ecirc: "ê",
  euml: "ë",
  igrave: "ì",
  iacute: "í",
  icirc: "î",
  iuml: "ï",
  eth: "ð",
  ntilde: "ñ",
  ograve: "ò",
  oacute: "ó",
  ocirc: "ô",
  otilde: "õ",
  ouml: "ö",
  oslash: "ø",
  ugrave: "ù",
  uacute: "ú",
  ucirc: "û",
  uuml: "ü",
  yacute: "ý",
  thorn: "þ",
  yuml: "ÿ",
  nbsp: " ",
  iexcl: "¡",
  cent: "¢",
  pound: "£",
  curren: "¤",
  yen: "¥",
  brvbar: "¦",
  sect: "§",
  uml: "¨",
  copy: "©",
  ordf: "ª",
  laquo: "«",
  not: "¬",
  shy: "­­",
  reg: "®",
  macr: "¯",
  deg: "°",
  plusmn: "±",
  sup2: "²",
  sup3: "³",
  acute: "´",
  micro: "µ",
  para: "¶",
  middot: "·",
  cedil: "¸",
  sup1: "¹",
  ordm: "º",
  raquo: "»",
  frac14: "¼",
  frac12: "½",
  frac34: "¾",
  iquest: "¿",
  times: "×",
  divide: "÷",
  forall: "∀",
  part: "∂",
  exist: "∃",
  empty: "∅",
  nabla: "∇",
  isin: "∈",
  notin: "∉",
  ni: "∋",
  prod: "∏",
  sum: "∑",
  minus: "−",
  lowast: "∗",
  radic: "√",
  prop: "∝",
  infin: "∞",
  ang: "∠",
  and: "∧",
  or: "∨",
  cap: "∩",
  cup: "∪",
  'int': "∫",
  there4: "∴",
  sim: "∼",
  cong: "≅",
  asymp: "≈",
  ne: "≠",
  equiv: "≡",
  le: "≤",
  ge: "≥",
  sub: "⊂",
  sup: "⊃",
  nsub: "⊄",
  sube: "⊆",
  supe: "⊇",
  oplus: "⊕",
  otimes: "⊗",
  perp: "⊥",
  sdot: "⋅",
  Alpha: "Α",
  Beta: "Β",
  Gamma: "Γ",
  Delta: "Δ",
  Epsilon: "Ε",
  Zeta: "Ζ",
  Eta: "Η",
  Theta: "Θ",
  Iota: "Ι",
  Kappa: "Κ",
  Lambda: "Λ",
  Mu: "Μ",
  Nu: "Ν",
  Xi: "Ξ",
  Omicron: "Ο",
  Pi: "Π",
  Rho: "Ρ",
  Sigma: "Σ",
  Tau: "Τ",
  Upsilon: "Υ",
  Phi: "Φ",
  Chi: "Χ",
  Psi: "Ψ",
  Omega: "Ω",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  omicron: "ο",
  pi: "π",
  rho: "ρ",
  sigmaf: "ς",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  thetasym: "ϑ",
  upsih: "ϒ",
  piv: "ϖ",
  OElig: "Œ",
  oelig: "œ",
  Scaron: "Š",
  scaron: "š",
  Yuml: "Ÿ",
  fnof: "ƒ",
  circ: "ˆ",
  tilde: "˜",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  zwnj: "‌",
  zwj: "‍",
  lrm: "‎",
  rlm: "‏",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  dagger: "†",
  Dagger: "‡",
  bull: "•",
  hellip: "…",
  permil: "‰",
  prime: "′",
  Prime: "″",
  lsaquo: "‹",
  rsaquo: "›",
  oline: "‾",
  euro: "€",
  trade: "™",
  larr: "←",
  uarr: "↑",
  rarr: "→",
  darr: "↓",
  harr: "↔",
  crarr: "↵",
  lceil: "⌈",
  rceil: "⌉",
  lfloor: "⌊",
  rfloor: "⌋",
  loz: "◊",
  spades: "♠",
  clubs: "♣",
  hearts: "♥",
  diams: "♦"
};
//for(var  n in exports.entityMap){console.log(exports.entityMap[n].charCodeAt())}

},{}],4:[function(require,module,exports){
"use strict";

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/; //\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?:\:' + nameStartChar.source + nameChar.source + '*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0; //tag name offerring
var S_ATTR = 1; //attr name offerring 
var S_ATTR_SPACE = 2; //attr name end and space offer
var S_EQ = 3; //=space?
var S_ATTR_NOQUOT_VALUE = 4; //attr value(no quot value only)
var S_ATTR_END = 5; //attr value end and no space(quot end)
var S_TAG_SPACE = 6; //(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7; //closed el<el />

function XMLReader() {}
XMLReader.prototype = {
  parse: function (source, defaultNSMap, entityMap) {
    var domBuilder = this.domBuilder;
    domBuilder.startDocument();
    _copy(defaultNSMap, defaultNSMap = {});
    parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
    domBuilder.endDocument();
  }
};
function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
  function fixedFromCharCode(code) {
    // String.prototype.fromCharCode does not supports
    // > 2 bytes unicode chars directly
    if (code > 0xffff) {
      code -= 0x10000;
      var surrogate1 = 0xd800 + (code >> 10),
        surrogate2 = 0xdc00 + (code & 0x3ff);
      return String.fromCharCode(surrogate1, surrogate2);
    } else {
      return String.fromCharCode(code);
    }
  }
  function entityReplacer(a) {
    var k = a.slice(1, -1);
    if (k in entityMap) {
      return entityMap[k];
    } else if (k.charAt(0) === '#') {
      return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')));
    } else {
      errorHandler.error('entity not found:' + a);
      return a;
    }
  }
  function appendText(end) {
    //has some bugs
    if (end > start) {
      var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
      locator && position(start);
      domBuilder.characters(xt, 0, end - start);
      start = end;
    }
  }
  function position(p, m) {
    while (p >= lineEnd && (m = linePattern.exec(source))) {
      lineStart = m.index;
      lineEnd = lineStart + m[0].length;
      locator.lineNumber++;
      //console.log('line++:',locator,startPos,endPos)
    }

    locator.columnNumber = p - lineStart + 1;
  }
  var lineStart = 0;
  var lineEnd = 0;
  var linePattern = /.*(?:\r\n?|\n)|.*$/g;
  var locator = domBuilder.locator;
  var parseStack = [{
    currentNSMap: defaultNSMapCopy
  }];
  var closeMap = {};
  var start = 0;
  while (true) {
    try {
      var tagStart = source.indexOf('<', start);
      if (tagStart < 0) {
        if (!source.substr(start).match(/^\s*$/)) {
          var doc = domBuilder.doc;
          var text = doc.createTextNode(source.substr(start));
          doc.appendChild(text);
          domBuilder.currentElement = text;
        }
        return;
      }
      if (tagStart > start) {
        appendText(tagStart);
      }
      switch (source.charAt(tagStart + 1)) {
        case '/':
          var end = source.indexOf('>', tagStart + 3);
          var tagName = source.substring(tagStart + 2, end);
          var config = parseStack.pop();
          if (end < 0) {
            tagName = source.substring(tagStart + 2).replace(/[\s<].*/, '');
            //console.error('#@@@@@@'+tagName)
            errorHandler.error("end tag name: " + tagName + ' is not complete:' + config.tagName);
            end = tagStart + 1 + tagName.length;
          } else if (tagName.match(/\s</)) {
            tagName = tagName.replace(/[\s<].*/, '');
            errorHandler.error("end tag name: " + tagName + ' maybe not complete');
            end = tagStart + 1 + tagName.length;
          }
          //console.error(parseStack.length,parseStack)
          //console.error(config);
          var localNSMap = config.localNSMap;
          var endMatch = config.tagName == tagName;
          var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
          if (endIgnoreCaseMach) {
            domBuilder.endElement(config.uri, config.localName, tagName);
            if (localNSMap) {
              for (var prefix in localNSMap) {
                domBuilder.endPrefixMapping(prefix);
              }
            }
            if (!endMatch) {
              errorHandler.fatalError("end tag name: " + tagName + ' is not match the current start tagName:' + config.tagName);
            }
          } else {
            parseStack.push(config);
          }
          end++;
          break;
        // end elment
        case '?':
          // <?...?>
          locator && position(tagStart);
          end = parseInstruction(source, tagStart, domBuilder);
          break;
        case '!':
          // <!doctype,<![CDATA,<!--
          locator && position(tagStart);
          end = parseDCC(source, tagStart, domBuilder, errorHandler);
          break;
        default:
          locator && position(tagStart);
          var el = new ElementAttributes();
          var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
          //elStartEnd
          var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
          var len = el.length;
          if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
            el.closed = true;
            if (!entityMap.nbsp) {
              errorHandler.warning('unclosed xml attribute');
            }
          }
          if (locator && len) {
            var locator2 = copyLocator(locator, {});
            //try{//attribute position fixed
            for (var i = 0; i < len; i++) {
              var a = el[i];
              position(a.offset);
              a.locator = copyLocator(locator, {});
            }
            //}catch(e){console.error('@@@@@'+e)}
            domBuilder.locator = locator2;
            if (appendElement(el, domBuilder, currentNSMap)) {
              parseStack.push(el);
            }
            domBuilder.locator = locator;
          } else {
            if (appendElement(el, domBuilder, currentNSMap)) {
              parseStack.push(el);
            }
          }
          if (el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed) {
            end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
          } else {
            end++;
          }
      }
    } catch (e) {
      errorHandler.error('element parse error: ' + e);
      //errorHandler.error('element parse error: '+e);
      end = -1;
      //throw e;
    }

    if (end > start) {
      start = end;
    } else {
      //TODO: 这里有可能sax回退，有位置错误风险
      appendText(Math.max(tagStart, start) + 1);
    }
  }
}
function copyLocator(f, t) {
  t.lineNumber = f.lineNumber;
  t.columnNumber = f.columnNumber;
  return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
  var attrName;
  var value;
  var p = ++start;
  var s = S_TAG; //status
  while (true) {
    var c = source.charAt(p);
    switch (c) {
      case '=':
        if (s === S_ATTR) {
          //attrName
          attrName = source.slice(start, p);
          s = S_EQ;
        } else if (s === S_ATTR_SPACE) {
          s = S_EQ;
        } else {
          //fatalError: equal must after attrName or space after attrName
          throw new Error('attribute equal must after attrName');
        }
        break;
      case '\'':
      case '"':
        if (s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
        ) {
          //equal
          if (s === S_ATTR) {
            errorHandler.warning('attribute value must after "="');
            attrName = source.slice(start, p);
          }
          start = p + 1;
          p = source.indexOf(c, start);
          if (p > 0) {
            value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
            el.add(attrName, value, start - 1);
            s = S_ATTR_END;
          } else {
            //fatalError: no end quot match
            throw new Error('attribute value no end \'' + c + '\' match');
          }
        } else if (s == S_ATTR_NOQUOT_VALUE) {
          value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
          //console.log(attrName,value,start,p)
          el.add(attrName, value, start);
          //console.dir(el)
          errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ')!!');
          start = p + 1;
          s = S_ATTR_END;
        } else {
          //fatalError: no equal before
          throw new Error('attribute value must after "="');
        }
        break;
      case '/':
        switch (s) {
          case S_TAG:
            el.setTagName(source.slice(start, p));
          case S_ATTR_END:
          case S_TAG_SPACE:
          case S_TAG_CLOSE:
            s = S_TAG_CLOSE;
            el.closed = true;
          case S_ATTR_NOQUOT_VALUE:
          case S_ATTR:
          case S_ATTR_SPACE:
            break;
          //case S_EQ:
          default:
            throw new Error("attribute invalid close char('/')");
        }
        break;
      case '':
        //end document
        //throw new Error('unexpected end of input')
        errorHandler.error('unexpected end of input');
        if (s == S_TAG) {
          el.setTagName(source.slice(start, p));
        }
        return p;
      case '>':
        switch (s) {
          case S_TAG:
            el.setTagName(source.slice(start, p));
          case S_ATTR_END:
          case S_TAG_SPACE:
          case S_TAG_CLOSE:
            break;
          //normal
          case S_ATTR_NOQUOT_VALUE: //Compatible state
          case S_ATTR:
            value = source.slice(start, p);
            if (value.slice(-1) === '/') {
              el.closed = true;
              value = value.slice(0, -1);
            }
          case S_ATTR_SPACE:
            if (s === S_ATTR_SPACE) {
              value = attrName;
            }
            if (s == S_ATTR_NOQUOT_VALUE) {
              errorHandler.warning('attribute "' + value + '" missed quot(")!!');
              el.add(attrName, value.replace(/&#?\w+;/g, entityReplacer), start);
            } else {
              if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)) {
                errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
              }
              el.add(value, value, start);
            }
            break;
          case S_EQ:
            throw new Error('attribute value missed!!');
        }
        //			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
        return p;
      /*xml space '\x20' | #x9 | #xD | #xA; */
      case '\u0080':
        c = ' ';
      default:
        if (c <= ' ') {
          //space
          switch (s) {
            case S_TAG:
              el.setTagName(source.slice(start, p)); //tagName
              s = S_TAG_SPACE;
              break;
            case S_ATTR:
              attrName = source.slice(start, p);
              s = S_ATTR_SPACE;
              break;
            case S_ATTR_NOQUOT_VALUE:
              var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
              errorHandler.warning('attribute "' + value + '" missed quot(")!!');
              el.add(attrName, value, start);
            case S_ATTR_END:
              s = S_TAG_SPACE;
              break;
            //case S_TAG_SPACE:
            //case S_EQ:
            //case S_ATTR_SPACE:
            //	void();break;
            //case S_TAG_CLOSE:
            //ignore warning
          }
        } else {
          //not space
          //S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
          //S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
          switch (s) {
            //case S_TAG:void();break;
            //case S_ATTR:void();break;
            //case S_ATTR_NOQUOT_VALUE:void();break;
            case S_ATTR_SPACE:
              var tagName = el.tagName;
              if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
              }
              el.add(attrName, attrName, start);
              start = p;
              s = S_ATTR;
              break;
            case S_ATTR_END:
              errorHandler.warning('attribute space is required"' + attrName + '"!!');
            case S_TAG_SPACE:
              s = S_ATTR;
              start = p;
              break;
            case S_EQ:
              s = S_ATTR_NOQUOT_VALUE;
              start = p;
              break;
            case S_TAG_CLOSE:
              throw new Error("elements closed character '/' and '>' must be connected to");
          }
        }
    } //end outer switch
    //console.log('p++',p)
    p++;
  }
}
/**
 * @return true if has new namespace define
 */
function appendElement(el, domBuilder, currentNSMap) {
  var tagName = el.tagName;
  var localNSMap = null;
  //var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
  var i = el.length;
  while (i--) {
    var a = el[i];
    var qName = a.qName;
    var value = a.value;
    var nsp = qName.indexOf(':');
    if (nsp > 0) {
      var prefix = a.prefix = qName.slice(0, nsp);
      var localName = qName.slice(nsp + 1);
      var nsPrefix = prefix === 'xmlns' && localName;
    } else {
      localName = qName;
      prefix = null;
      nsPrefix = qName === 'xmlns' && '';
    }
    //can not set prefix,because prefix !== ''
    a.localName = localName;
    //prefix == null for no ns prefix attribute 
    if (nsPrefix !== false) {
      //hack!!
      if (localNSMap == null) {
        localNSMap = {};
        //console.log(currentNSMap,0)
        _copy(currentNSMap, currentNSMap = {});
        //console.log(currentNSMap,1)
      }

      currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
      a.uri = 'http://www.w3.org/2000/xmlns/';
      domBuilder.startPrefixMapping(nsPrefix, value);
    }
  }
  var i = el.length;
  while (i--) {
    a = el[i];
    var prefix = a.prefix;
    if (prefix) {
      //no prefix attribute has no namespace
      if (prefix === 'xml') {
        a.uri = 'http://www.w3.org/XML/1998/namespace';
      }
      if (prefix !== 'xmlns') {
        a.uri = currentNSMap[prefix || ''];

        //{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
      }
    }
  }

  var nsp = tagName.indexOf(':');
  if (nsp > 0) {
    prefix = el.prefix = tagName.slice(0, nsp);
    localName = el.localName = tagName.slice(nsp + 1);
  } else {
    prefix = null; //important!!
    localName = el.localName = tagName;
  }
  //no prefix element has default namespace
  var ns = el.uri = currentNSMap[prefix || ''];
  domBuilder.startElement(ns, localName, tagName, el);
  //endPrefixMapping and startPrefixMapping have not any help for dom builder
  //localNSMap = null
  if (el.closed) {
    domBuilder.endElement(ns, localName, tagName);
    if (localNSMap) {
      for (prefix in localNSMap) {
        domBuilder.endPrefixMapping(prefix);
      }
    }
  } else {
    el.currentNSMap = currentNSMap;
    el.localNSMap = localNSMap;
    //parseStack.push(el);
    return true;
  }
}
function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
  if (/^(?:script|textarea)$/i.test(tagName)) {
    var elEndStart = source.indexOf('</' + tagName + '>', elStartEnd);
    var text = source.substring(elStartEnd + 1, elEndStart);
    if (/[&<]/.test(text)) {
      if (/^script$/i.test(tagName)) {
        //if(!/\]\]>/.test(text)){
        //lexHandler.startCDATA();
        domBuilder.characters(text, 0, text.length);
        //lexHandler.endCDATA();
        return elEndStart;
        //}
      } //}else{//text area
      text = text.replace(/&#?\w+;/g, entityReplacer);
      domBuilder.characters(text, 0, text.length);
      return elEndStart;
      //}
    }
  }

  return elStartEnd + 1;
}
function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
  //if(tagName in closeMap){
  var pos = closeMap[tagName];
  if (pos == null) {
    //console.log(tagName)
    pos = source.lastIndexOf('</' + tagName + '>');
    if (pos < elStartEnd) {
      //忘记闭合
      pos = source.lastIndexOf('</' + tagName);
    }
    closeMap[tagName] = pos;
  }
  return pos < elStartEnd;
  //} 
}

function _copy(source, target) {
  for (var n in source) {
    target[n] = source[n];
  }
}
function parseDCC(source, start, domBuilder, errorHandler) {
  //sure start with '<!'
  var next = source.charAt(start + 2);
  switch (next) {
    case '-':
      if (source.charAt(start + 3) === '-') {
        var end = source.indexOf('-->', start + 4);
        //append comment source.substring(4,end)//<!--
        if (end > start) {
          domBuilder.comment(source, start + 4, end - start - 4);
          return end + 3;
        } else {
          errorHandler.error("Unclosed comment");
          return -1;
        }
      } else {
        //error
        return -1;
      }
    default:
      if (source.substr(start + 3, 6) == 'CDATA[') {
        var end = source.indexOf(']]>', start + 9);
        domBuilder.startCDATA();
        domBuilder.characters(source, start + 9, end - start - 9);
        domBuilder.endCDATA();
        return end + 3;
      }
      //<!DOCTYPE
      //startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
      var matchs = split(source, start);
      var len = matchs.length;
      if (len > 1 && /!doctype/i.test(matchs[0][0])) {
        var name = matchs[1][0];
        var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0];
        var sysid = len > 4 && matchs[4][0];
        var lastMatch = matchs[len - 1];
        domBuilder.startDTD(name, pubid && pubid.replace(/^(['"])(.*?)\1$/, '$2'), sysid && sysid.replace(/^(['"])(.*?)\1$/, '$2'));
        domBuilder.endDTD();
        return lastMatch.index + lastMatch[0].length;
      }
  }
  return -1;
}
function parseInstruction(source, start, domBuilder) {
  var end = source.indexOf('?>', start);
  if (end) {
    var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
    if (match) {
      var len = match[0].length;
      domBuilder.processingInstruction(match[1], match[2]);
      return end + 2;
    } else {
      //error
      return -1;
    }
  }
  return -1;
}

/**
 * @param source
 */
function ElementAttributes(source) {}
ElementAttributes.prototype = {
  setTagName: function (tagName) {
    if (!tagNamePattern.test(tagName)) {
      throw new Error('invalid tagName:' + tagName);
    }
    this.tagName = tagName;
  },
  add: function (qName, value, offset) {
    if (!tagNamePattern.test(qName)) {
      throw new Error('invalid attribute:' + qName);
    }
    this[this.length++] = {
      qName: qName,
      value: value,
      offset: offset
    };
  },
  length: 0,
  getLocalName: function (i) {
    return this[i].localName;
  },
  getLocator: function (i) {
    return this[i].locator;
  },
  getQName: function (i) {
    return this[i].qName;
  },
  getURI: function (i) {
    return this[i].uri;
  },
  getValue: function (i) {
    return this[i].value;
  }
  //	,getIndex:function(uri, localName)){
  //		if(localName){
  //			
  //		}else{
  //			var qName = uri
  //		}
  //	},
  //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
  //	getType:function(uri,localName){}
  //	getType:function(i){},
};

function split(source, start) {
  var match;
  var buf = [];
  var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
  reg.lastIndex = start;
  reg.exec(source); //skip <
  while (match = reg.exec(source)) {
    buf.push(match);
    if (match[1]) return buf;
  }
}
exports.XMLReader = XMLReader;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HTMLAudioElement = _interopRequireDefault(require("./HTMLAudioElement"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_CURRENT_DATA = 2;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;
let SN_SEED = 1;
const _innerAudioContextMap = {};
class Audio extends _HTMLAudioElement.default {
  constructor(url) {
    super();
    this._$sn = SN_SEED++;
    this.HAVE_NOTHING = HAVE_NOTHING;
    this.HAVE_METADATA = HAVE_METADATA;
    this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA;
    this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA;
    this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA;
    this.readyState = HAVE_NOTHING;
    const innerAudioContext = wx.createInnerAudioContext();
    _innerAudioContextMap[this._$sn] = innerAudioContext;
    this._canplayEvents = ['load', 'loadend', 'canplay', 'canplaythrough', 'loadedmetadata'];
    innerAudioContext.onCanplay(() => {
      this._loaded = true;
      this.readyState = this.HAVE_CURRENT_DATA;
      this._canplayEvents.forEach(type => {
        this.dispatchEvent({
          type: type
        });
      });
    });
    innerAudioContext.onPlay(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      this.dispatchEvent({
        type: 'play'
      });
    });
    innerAudioContext.onPause(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      this.dispatchEvent({
        type: 'pause'
      });
    });
    innerAudioContext.onEnded(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      if (_innerAudioContextMap[this._$sn].loop === false) {
        this.dispatchEvent({
          type: 'ended'
        });
      }
      this.readyState = HAVE_ENOUGH_DATA;
    });
    innerAudioContext.onError(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused;
      this.dispatchEvent({
        type: 'error'
      });
    });
    if (url) {
      this.src = url;
    } else {
      this._src = '';
    }
    this._loop = innerAudioContext.loop;
    this._autoplay = innerAudioContext.autoplay;
    this._paused = innerAudioContext.paused;
    this._volume = innerAudioContext.volume;
    this._muted = false;
  }
  addEventListener(type, listener, options = {}) {
    super.addEventListener(type, listener, options);
    type = String(type).toLowerCase();
    if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
      this.dispatchEvent({
        type: type
      });
    }
  }
  load() {
    // console.warn('HTMLAudioElement.load() is not implemented.')
    // weixin doesn't need call load() manually
  }
  play() {
    _innerAudioContextMap[this._$sn].play();
  }
  resume() {
    _innerAudioContextMap[this._$sn].resume();
  }
  pause() {
    _innerAudioContextMap[this._$sn].pause();
  }
  stop() {
    _innerAudioContextMap[this._$sn].stop();
  }
  destroy() {
    _innerAudioContextMap[this._$sn].destroy();
  }
  canPlayType(mediaType = '') {
    if (typeof mediaType !== 'string') {
      return '';
    }
    if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
      return 'probably';
    }
    return '';
  }
  get currentTime() {
    return _innerAudioContextMap[this._$sn].currentTime;
  }
  set currentTime(value) {
    _innerAudioContextMap[this._$sn].seek(value);
  }
  get duration() {
    return _innerAudioContextMap[this._$sn].duration;
  }
  get src() {
    return this._src;
  }
  set src(value) {
    this._src = value;
    this._loaded = false;
    this.readyState = this.HAVE_NOTHING;
    const innerAudioContext = _innerAudioContextMap[this._$sn];
    innerAudioContext.src = value;
  }
  get loop() {
    return this._loop;
  }
  set loop(value) {
    this._loop = value;
    _innerAudioContextMap[this._$sn].loop = value;
  }
  get autoplay() {
    return this.autoplay;
  }
  set autoplay(value) {
    this._autoplay = value;
    _innerAudioContextMap[this._$sn].autoplay = value;
  }
  get paused() {
    return this._paused;
  }
  get volume() {
    return this._volume;
  }
  set volume(value) {
    this._volume = value;
    if (!this._muted) {
      _innerAudioContextMap[this._$sn].volume = value;
    }
  }
  get muted() {
    return this._muted;
  }
  set muted(value) {
    this._muted = value;
    if (value) {
      _innerAudioContextMap[this._$sn].volume = 0;
    } else {
      _innerAudioContextMap[this._$sn].volume = this._volume;
    }
  }
  cloneNode() {
    const newAudio = new Audio();
    newAudio.loop = this.loop;
    newAudio.autoplay = this.autoplay;
    newAudio.src = this.src;
    return newAudio;
  }
}
exports.default = Audio;

},{"./HTMLAudioElement":13}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Canvas;
var _WindowProperties = require("./WindowProperties");
// import HTMLCanvasElement from './HTMLCanvasElement'

const hasModifiedCanvasPrototype = false;
const hasInit2DContextConstructor = false;
const hasInitWebGLContextConstructor = false;
function Canvas() {
  const canvas = wx.createCanvas();
  canvas.type = 'canvas';

  // canvas.__proto__.__proto__.__proto__ = new HTMLCanvasElement()

  const _getContext = canvas.getContext;
  canvas.getBoundingClientRect = () => {
    const ret = {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
    return ret;
  };
  canvas.style = {
    top: '0px',
    left: '0px',
    width: `${_WindowProperties.innerWidth}px`,
    height: `${_WindowProperties.innerHeight}px`
  };
  canvas.addEventListener = function (type, listener, options = {}) {
    if (typeof getApp === 'function') {
      // for wechat miniprogram
      GameGlobal.document.addEventListener(type, listener, options);
    } else {
      // for wechat minigame
      document.addEventListener(type, listener, options);
    }
  };
  canvas.removeEventListener = function (type, listener) {
    if (typeof getApp === 'function') {
      // for wechat miniprogram
      GameGlobal.document.removeEventListener(type, listener);
    } else {
      // for wechat minigame
      document.removeEventListener(type, listener);
    }
  };
  canvas.dispatchEvent = function (event = {}) {
    console.log('canvas.dispatchEvent', event.type, event);
    // nothing to do
  };

  Object.defineProperty(canvas, 'clientWidth', {
    enumerable: true,
    get: function get() {
      return _WindowProperties.innerWidth;
    }
  });
  Object.defineProperty(canvas, 'clientHeight', {
    enumerable: true,
    get: function get() {
      return _WindowProperties.innerHeight;
    }
  });
  return canvas;
}

},{"./WindowProperties":24}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Node = _interopRequireDefault(require("./Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Element extends _Node.default {
  constructor() {
    super();
    _defineProperty(this, "className", '');
    _defineProperty(this, "children", []);
  }
}
exports.default = Element;

},{"./Node":21}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class MouseEvent {
  constructor() {}
}
exports.default = MouseEvent;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = require("../util/index.js");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class TouchEvent {
  constructor(type) {
    _defineProperty(this, "touches", []);
    _defineProperty(this, "targetTouches", []);
    _defineProperty(this, "changedTouches", []);
    _defineProperty(this, "preventDefault", _index.noop);
    _defineProperty(this, "stopPropagation", _index.noop);
    this.type = type;
    this.target = window.canvas;
    this.currentTarget = window.canvas;
  }
}
exports.default = TouchEvent;
function touchEventHandlerFactory(type) {
  return event => {
    const touchEvent = new TouchEvent(type);
    touchEvent.touches = event.touches;
    touchEvent.targetTouches = Array.prototype.slice.call(event.touches);
    touchEvent.changedTouches = event.changedTouches;
    touchEvent.timeStamp = event.timeStamp;
    if (typeof getApp === 'function') {
      // for wechat miniprogram
      GameGlobal.document.dispatchEvent(touchEvent);
    } else {
      // for wechat minigame
      document.dispatchEvent(touchEvent);
    }
  };
}
wx.onTouchStart(touchEventHandlerFactory('touchstart'));
wx.onTouchMove(touchEventHandlerFactory('touchmove'));
wx.onTouchEnd(touchEventHandlerFactory('touchend'));
wx.onTouchCancel(touchEventHandlerFactory('touchcancel'));

},{"../util/index.js":31}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MouseEvent", {
  enumerable: true,
  get: function () {
    return _MouseEvent2.default;
  }
});
Object.defineProperty(exports, "TouchEvent", {
  enumerable: true,
  get: function () {
    return _TouchEvent2.default;
  }
});
var _TouchEvent2 = _interopRequireDefault(require("./TouchEvent"));
var _MouseEvent2 = _interopRequireDefault(require("./MouseEvent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./MouseEvent":8,"./TouchEvent":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const _events = new WeakMap();
class EventTarget {
  constructor() {
    _events.set(this, {});
  }
  addEventListener(type, listener, options = {}) {
    let events = _events.get(this);
    if (!events) {
      events = {};
      _events.set(this, events);
    }
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
    if (options.capture) {
      // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
    }
    if (options.once) {
      // console.warn('EventTarget.addEventListener: options.once is not implemented.')
    }
    if (options.passive) {
      // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
    }
  }
  removeEventListener(type, listener) {
    const events = _events.get(this);
    if (events) {
      const listeners = events[type];
      if (listeners && listeners.length > 0) {
        for (let i = listeners.length; i--; i > 0) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  dispatchEvent(event = {}) {
    const listeners = _events.get(this)[event.type];
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
  }
}
exports.default = EventTarget;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*
 * TODO 使用 wx.readFile 来封装 FileReader
 */
class FileReader {
  construct() {}
}
exports.default = FileReader;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HTMLMediaElement = _interopRequireDefault(require("./HTMLMediaElement"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HTMLAudioElement extends _HTMLMediaElement.default {
  constructor() {
    super('audio');
  }
}
exports.default = HTMLAudioElement;

},{"./HTMLMediaElement":17}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Canvas = _interopRequireDefault(require("./Canvas"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import HTMLElement from './HTMLElement';

// export default class HTMLCanvasElement extends HTMLElement
// {
//     constructor(){
//         super('canvas')
//     }
// };

GameGlobal.screencanvas = GameGlobal.screencanvas || new _Canvas.default();
const canvas = GameGlobal.screencanvas;
const canvasConstructor = canvas.constructor;

// canvasConstructor.__proto__.__proto__ = new HTMLElement();
var _default = canvasConstructor;
exports.default = _default;

},{"./Canvas":6}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Element = _interopRequireDefault(require("./Element"));
var _index = require("./util/index.js");
var _WindowProperties = require("./WindowProperties");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class HTMLElement extends _Element.default {
  constructor(tagName = '') {
    super();
    _defineProperty(this, "className", '');
    _defineProperty(this, "childern", []);
    _defineProperty(this, "style", {
      width: `${_WindowProperties.innerWidth}px`,
      height: `${_WindowProperties.innerHeight}px`
    });
    _defineProperty(this, "insertBefore", _index.noop);
    _defineProperty(this, "innerHTML", '');
    this.tagName = tagName.toUpperCase();
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  getAttribute(name) {
    return this[name];
  }
  get clientWidth() {
    const ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length;
    return Number.isNaN(ret) ? 0 : ret;
  }
  get clientHeight() {
    const ret = parseInt(this.style.fontSize, 10);
    return Number.isNaN(ret) ? 0 : ret;
  }
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: _WindowProperties.innerWidth,
      height: _WindowProperties.innerHeight
    };
  }
  focus() {}
}
exports.default = HTMLElement;

},{"./Element":7,"./WindowProperties":24,"./util/index.js":31}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// import HTMLElement from './HTMLElement';

// export default class HTMLImageElement extends HTMLElement
// {
//     constructor(){
//         super('img')
//     }
// };

const imageConstructor = wx.createImage().constructor;

// imageConstructor.__proto__.__proto__ = new HTMLElement();
var _default = imageConstructor;
exports.default = _default;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HTMLElement = _interopRequireDefault(require("./HTMLElement"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HTMLMediaElement extends _HTMLElement.default {
  constructor(type) {
    super(type);
  }
  addTextTrack() {}
  captureStream() {}
  fastSeek() {}
  load() {}
  pause() {}
  play() {}
}
exports.default = HTMLMediaElement;

},{"./HTMLElement":15}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _HTMLMediaElement = _interopRequireDefault(require("./HTMLMediaElement"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HTMLVideoElement extends _HTMLMediaElement.default {
  constructor() {
    super('video');
  }
}
exports.default = HTMLVideoElement;
;

},{"./HTMLMediaElement":17}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
function _default() {
  const image = wx.createImage();

  // image.__proto__.__proto__.__proto__ = new HTMLImageElement();

  image.premultiplyAlpha = false;
  return image;
}
;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class ImageBitmap {
  constructor() {
    // TODO
  }
}
exports.default = ImageBitmap;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventTarget = _interopRequireDefault(require("./EventTarget.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class Node extends _EventTarget.default {
  constructor() {
    super();
    _defineProperty(this, "childNodes", []);
  }
  appendChild(node) {
    this.childNodes.push(node);
    // if (node instanceof Node) {
    //   this.childNodes.push(node)
    // } else {
    //   throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
    // }
  }

  cloneNode() {
    const copyNode = Object.create(this);
    Object.assign(copyNode, this);
    return copyNode;
  }
  removeChild(node) {
    const index = this.childNodes.findIndex(child => child === node);
    if (index > -1) {
      return this.childNodes.splice(index, 1);
    }
    return null;
  }
}
exports.default = Node;

},{"./EventTarget.js":11}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class WebGLRenderingContext {
  constructor() {
    // TODO
  }
}
exports.default = WebGLRenderingContext;
WebGLRenderingContext.ACTIVE_ATTRIBUTES = 35721;
WebGLRenderingContext.ACTIVE_TEXTURE = 34016;
WebGLRenderingContext.ACTIVE_UNIFORMS = 35718;
WebGLRenderingContext.ALIASED_LINE_WIDTH_RANGE = 33902;
WebGLRenderingContext.ALIASED_POINT_SIZE_RANGE = 33901;
WebGLRenderingContext.ALPHA = 6406;
WebGLRenderingContext.ALPHA_BITS = 3413;
WebGLRenderingContext.ALWAYS = 519;
WebGLRenderingContext.ARRAY_BUFFER = 34962;
WebGLRenderingContext.ARRAY_BUFFER_BINDING = 34964;
WebGLRenderingContext.ATTACHED_SHADERS = 35717;
WebGLRenderingContext.BACK = 1029;
WebGLRenderingContext.BLEND = 3042;
WebGLRenderingContext.BLEND_COLOR = 32773;
WebGLRenderingContext.BLEND_DST_ALPHA = 32970;
WebGLRenderingContext.BLEND_DST_RGB = 32968;
WebGLRenderingContext.BLEND_EQUATION = 32777;
WebGLRenderingContext.BLEND_EQUATION_ALPHA = 34877;
WebGLRenderingContext.BLEND_EQUATION_RGB = 32777;
WebGLRenderingContext.BLEND_SRC_ALPHA = 32971;
WebGLRenderingContext.BLEND_SRC_RGB = 32969;
WebGLRenderingContext.BLUE_BITS = 3412;
WebGLRenderingContext.BOOL = 35670;
WebGLRenderingContext.BOOL_VEC2 = 35671;
WebGLRenderingContext.BOOL_VEC3 = 35672;
WebGLRenderingContext.BOOL_VEC4 = 35673;
WebGLRenderingContext.BROWSER_DEFAULT_WEBGL = 37444;
WebGLRenderingContext.BUFFER_SIZE = 34660;
WebGLRenderingContext.BUFFER_USAGE = 34661;
WebGLRenderingContext.BYTE = 5120;
WebGLRenderingContext.CCW = 2305;
WebGLRenderingContext.CLAMP_TO_EDGE = 33071;
WebGLRenderingContext.COLOR_ATTACHMENT0 = 36064;
WebGLRenderingContext.COLOR_BUFFER_BIT = 16384;
WebGLRenderingContext.COLOR_CLEAR_VALUE = 3106;
WebGLRenderingContext.COLOR_WRITEMASK = 3107;
WebGLRenderingContext.COMPILE_STATUS = 35713;
WebGLRenderingContext.COMPRESSED_TEXTURE_FORMATS = 34467;
WebGLRenderingContext.CONSTANT_ALPHA = 32771;
WebGLRenderingContext.CONSTANT_COLOR = 32769;
WebGLRenderingContext.CONTEXT_LOST_WEBGL = 37442;
WebGLRenderingContext.CULL_FACE = 2884;
WebGLRenderingContext.CULL_FACE_MODE = 2885;
WebGLRenderingContext.CURRENT_PROGRAM = 35725;
WebGLRenderingContext.CURRENT_VERTEX_ATTRIB = 34342;
WebGLRenderingContext.CW = 2304;
WebGLRenderingContext.DECR = 7683;
WebGLRenderingContext.DECR_WRAP = 34056;
WebGLRenderingContext.DELETE_STATUS = 35712;
WebGLRenderingContext.DEPTH_ATTACHMENT = 36096;
WebGLRenderingContext.DEPTH_BITS = 3414;
WebGLRenderingContext.DEPTH_BUFFER_BIT = 256;
WebGLRenderingContext.DEPTH_CLEAR_VALUE = 2931;
WebGLRenderingContext.DEPTH_COMPONENT = 6402;
WebGLRenderingContext.DEPTH_COMPONENT16 = 33189;
WebGLRenderingContext.DEPTH_FUNC = 2932;
WebGLRenderingContext.DEPTH_RANGE = 2928;
WebGLRenderingContext.DEPTH_STENCIL = 34041;
WebGLRenderingContext.DEPTH_STENCIL_ATTACHMENT = 33306;
WebGLRenderingContext.DEPTH_TEST = 2929;
WebGLRenderingContext.DEPTH_WRITEMASK = 2930;
WebGLRenderingContext.DITHER = 3024;
WebGLRenderingContext.DONT_CARE = 4352;
WebGLRenderingContext.DST_ALPHA = 772;
WebGLRenderingContext.DST_COLOR = 774;
WebGLRenderingContext.DYNAMIC_DRAW = 35048;
WebGLRenderingContext.ELEMENT_ARRAY_BUFFER = 34963;
WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
WebGLRenderingContext.EQUAL = 514;
WebGLRenderingContext.FASTEST = 4353;
WebGLRenderingContext.FLOAT = 5126;
WebGLRenderingContext.FLOAT_MAT2 = 35674;
WebGLRenderingContext.FLOAT_MAT3 = 35675;
WebGLRenderingContext.FLOAT_MAT4 = 35676;
WebGLRenderingContext.FLOAT_VEC2 = 35664;
WebGLRenderingContext.FLOAT_VEC3 = 35665;
WebGLRenderingContext.FLOAT_VEC4 = 35666;
WebGLRenderingContext.FRAGMENT_SHADER = 35632;
WebGLRenderingContext.FRAMEBUFFER = 36160;
WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
WebGLRenderingContext.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
WebGLRenderingContext.FRAMEBUFFER_BINDING = 36006;
WebGLRenderingContext.FRAMEBUFFER_COMPLETE = 36053;
WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
WebGLRenderingContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
WebGLRenderingContext.FRAMEBUFFER_UNSUPPORTED = 36061;
WebGLRenderingContext.FRONT = 1028;
WebGLRenderingContext.FRONT_AND_BACK = 1032;
WebGLRenderingContext.FRONT_FACE = 2886;
WebGLRenderingContext.FUNC_ADD = 32774;
WebGLRenderingContext.FUNC_REVERSE_SUBTRACT = 32779;
WebGLRenderingContext.FUNC_SUBTRACT = 32778;
WebGLRenderingContext.GENERATE_MIPMAP_HINT = 33170;
WebGLRenderingContext.GEQUAL = 518;
WebGLRenderingContext.GREATER = 516;
WebGLRenderingContext.GREEN_BITS = 3411;
WebGLRenderingContext.HIGH_FLOAT = 36338;
WebGLRenderingContext.HIGH_INT = 36341;
WebGLRenderingContext.IMPLEMENTATION_COLOR_READ_FORMAT = 35739;
WebGLRenderingContext.IMPLEMENTATION_COLOR_READ_TYPE = 35738;
WebGLRenderingContext.INCR = 7682;
WebGLRenderingContext.INCR_WRAP = 34055;
WebGLRenderingContext.INT = 5124;
WebGLRenderingContext.INT_VEC2 = 35667;
WebGLRenderingContext.INT_VEC3 = 35668;
WebGLRenderingContext.INT_VEC4 = 35669;
WebGLRenderingContext.INVALID_ENUM = 1280;
WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION = 1286;
WebGLRenderingContext.INVALID_OPERATION = 1282;
WebGLRenderingContext.INVALID_VALUE = 1281;
WebGLRenderingContext.INVERT = 5386;
WebGLRenderingContext.KEEP = 7680;
WebGLRenderingContext.LEQUAL = 515;
WebGLRenderingContext.LESS = 513;
WebGLRenderingContext.LINEAR = 9729;
WebGLRenderingContext.LINEAR_MIPMAP_LINEAR = 9987;
WebGLRenderingContext.LINEAR_MIPMAP_NEAREST = 9985;
WebGLRenderingContext.LINES = 1;
WebGLRenderingContext.LINE_LOOP = 2;
WebGLRenderingContext.LINE_STRIP = 3;
WebGLRenderingContext.LINE_WIDTH = 2849;
WebGLRenderingContext.LINK_STATUS = 35714;
WebGLRenderingContext.LOW_FLOAT = 36336;
WebGLRenderingContext.LOW_INT = 36339;
WebGLRenderingContext.LUMINANCE = 6409;
WebGLRenderingContext.LUMINANCE_ALPHA = 6410;
WebGLRenderingContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
WebGLRenderingContext.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
WebGLRenderingContext.MAX_RENDERBUFFER_SIZE = 34024;
WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS = 34930;
WebGLRenderingContext.MAX_TEXTURE_SIZE = 3379;
WebGLRenderingContext.MAX_VARYING_VECTORS = 36348;
WebGLRenderingContext.MAX_VERTEX_ATTRIBS = 34921;
WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS = 36347;
WebGLRenderingContext.MAX_VIEWPORT_DIMS = 3386;
WebGLRenderingContext.MEDIUM_FLOAT = 36337;
WebGLRenderingContext.MEDIUM_INT = 36340;
WebGLRenderingContext.MIRRORED_REPEAT = 33648;
WebGLRenderingContext.NEAREST = 9728;
WebGLRenderingContext.NEAREST_MIPMAP_LINEAR = 9986;
WebGLRenderingContext.NEAREST_MIPMAP_NEAREST = 9984;
WebGLRenderingContext.NEVER = 512;
WebGLRenderingContext.NICEST = 4354;
WebGLRenderingContext.NONE = 0;
WebGLRenderingContext.NOTEQUAL = 517;
WebGLRenderingContext.NO_ERROR = 0;
WebGLRenderingContext.ONE = 1;
WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA = 32772;
WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR = 32770;
WebGLRenderingContext.ONE_MINUS_DST_ALPHA = 773;
WebGLRenderingContext.ONE_MINUS_DST_COLOR = 775;
WebGLRenderingContext.ONE_MINUS_SRC_ALPHA = 771;
WebGLRenderingContext.ONE_MINUS_SRC_COLOR = 769;
WebGLRenderingContext.OUT_OF_MEMORY = 1285;
WebGLRenderingContext.PACK_ALIGNMENT = 3333;
WebGLRenderingContext.POINTS = 0;
WebGLRenderingContext.POLYGON_OFFSET_FACTOR = 32824;
WebGLRenderingContext.POLYGON_OFFSET_FILL = 32823;
WebGLRenderingContext.POLYGON_OFFSET_UNITS = 10752;
WebGLRenderingContext.RED_BITS = 3410;
WebGLRenderingContext.RENDERBUFFER = 36161;
WebGLRenderingContext.RENDERBUFFER_ALPHA_SIZE = 36179;
WebGLRenderingContext.RENDERBUFFER_BINDING = 36007;
WebGLRenderingContext.RENDERBUFFER_BLUE_SIZE = 36178;
WebGLRenderingContext.RENDERBUFFER_DEPTH_SIZE = 36180;
WebGLRenderingContext.RENDERBUFFER_GREEN_SIZE = 36177;
WebGLRenderingContext.RENDERBUFFER_HEIGHT = 36163;
WebGLRenderingContext.RENDERBUFFER_INTERNAL_FORMAT = 36164;
WebGLRenderingContext.RENDERBUFFER_RED_SIZE = 36176;
WebGLRenderingContext.RENDERBUFFER_STENCIL_SIZE = 36181;
WebGLRenderingContext.RENDERBUFFER_WIDTH = 36162;
WebGLRenderingContext.RENDERER = 7937;
WebGLRenderingContext.REPEAT = 10497;
WebGLRenderingContext.REPLACE = 7681;
WebGLRenderingContext.RGB = 6407;
WebGLRenderingContext.RGB5_A1 = 32855;
WebGLRenderingContext.RGB565 = 36194;
WebGLRenderingContext.RGBA = 6408;
WebGLRenderingContext.RGBA4 = 32854;
WebGLRenderingContext.SAMPLER_2D = 35678;
WebGLRenderingContext.SAMPLER_CUBE = 35680;
WebGLRenderingContext.SAMPLES = 32937;
WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE = 32926;
WebGLRenderingContext.SAMPLE_BUFFERS = 32936;
WebGLRenderingContext.SAMPLE_COVERAGE = 32928;
WebGLRenderingContext.SAMPLE_COVERAGE_INVERT = 32939;
WebGLRenderingContext.SAMPLE_COVERAGE_VALUE = 32938;
WebGLRenderingContext.SCISSOR_BOX = 3088;
WebGLRenderingContext.SCISSOR_TEST = 3089;
WebGLRenderingContext.SHADER_TYPE = 35663;
WebGLRenderingContext.SHADING_LANGUAGE_VERSION = 35724;
WebGLRenderingContext.SHORT = 5122;
WebGLRenderingContext.SRC_ALPHA = 770;
WebGLRenderingContext.SRC_ALPHA_SATURATE = 776;
WebGLRenderingContext.SRC_COLOR = 768;
WebGLRenderingContext.STATIC_DRAW = 35044;
WebGLRenderingContext.STENCIL_ATTACHMENT = 36128;
WebGLRenderingContext.STENCIL_BACK_FAIL = 34817;
WebGLRenderingContext.STENCIL_BACK_FUNC = 34816;
WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
WebGLRenderingContext.STENCIL_BACK_PASS_DEPTH_PASS = 34819;
WebGLRenderingContext.STENCIL_BACK_REF = 36003;
WebGLRenderingContext.STENCIL_BACK_VALUE_MASK = 36004;
WebGLRenderingContext.STENCIL_BACK_WRITEMASK = 36005;
WebGLRenderingContext.STENCIL_BITS = 3415;
WebGLRenderingContext.STENCIL_BUFFER_BIT = 1024;
WebGLRenderingContext.STENCIL_CLEAR_VALUE = 2961;
WebGLRenderingContext.STENCIL_FAIL = 2964;
WebGLRenderingContext.STENCIL_FUNC = 2962;
WebGLRenderingContext.STENCIL_INDEX8 = 36168;
WebGLRenderingContext.STENCIL_PASS_DEPTH_FAIL = 2965;
WebGLRenderingContext.STENCIL_PASS_DEPTH_PASS = 2966;
WebGLRenderingContext.STENCIL_REF = 2967;
WebGLRenderingContext.STENCIL_TEST = 2960;
WebGLRenderingContext.STENCIL_VALUE_MASK = 2963;
WebGLRenderingContext.STENCIL_WRITEMASK = 2968;
WebGLRenderingContext.STREAM_DRAW = 35040;
WebGLRenderingContext.SUBPIXEL_BITS = 3408;
WebGLRenderingContext.TEXTURE = 5890;
WebGLRenderingContext.TEXTURE0 = 33984;
WebGLRenderingContext.TEXTURE1 = 33985;
WebGLRenderingContext.TEXTURE2 = 33986;
WebGLRenderingContext.TEXTURE3 = 33987;
WebGLRenderingContext.TEXTURE4 = 33988;
WebGLRenderingContext.TEXTURE5 = 33989;
WebGLRenderingContext.TEXTURE6 = 33990;
WebGLRenderingContext.TEXTURE7 = 33991;
WebGLRenderingContext.TEXTURE8 = 33992;
WebGLRenderingContext.TEXTURE9 = 33993;
WebGLRenderingContext.TEXTURE10 = 33994;
WebGLRenderingContext.TEXTURE11 = 33995;
WebGLRenderingContext.TEXTURE12 = 33996;
WebGLRenderingContext.TEXTURE13 = 33997;
WebGLRenderingContext.TEXTURE14 = 33998;
WebGLRenderingContext.TEXTURE15 = 33999;
WebGLRenderingContext.TEXTURE16 = 34000;
WebGLRenderingContext.TEXTURE17 = 34001;
WebGLRenderingContext.TEXTURE18 = 34002;
WebGLRenderingContext.TEXTURE19 = 34003;
WebGLRenderingContext.TEXTURE20 = 34004;
WebGLRenderingContext.TEXTURE21 = 34005;
WebGLRenderingContext.TEXTURE22 = 34006;
WebGLRenderingContext.TEXTURE23 = 34007;
WebGLRenderingContext.TEXTURE24 = 34008;
WebGLRenderingContext.TEXTURE25 = 34009;
WebGLRenderingContext.TEXTURE26 = 34010;
WebGLRenderingContext.TEXTURE27 = 34011;
WebGLRenderingContext.TEXTURE28 = 34012;
WebGLRenderingContext.TEXTURE29 = 34013;
WebGLRenderingContext.TEXTURE30 = 34014;
WebGLRenderingContext.TEXTURE31 = 34015;
WebGLRenderingContext.TEXTURE_2D = 3553;
WebGLRenderingContext.TEXTURE_BINDING_2D = 32873;
WebGLRenderingContext.TEXTURE_BINDING_CUBE_MAP = 34068;
WebGLRenderingContext.TEXTURE_CUBE_MAP = 34067;
WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
WebGLRenderingContext.TEXTURE_MAG_FILTER = 10240;
WebGLRenderingContext.TEXTURE_MIN_FILTER = 10241;
WebGLRenderingContext.TEXTURE_WRAP_S = 10242;
WebGLRenderingContext.TEXTURE_WRAP_T = 10243;
WebGLRenderingContext.TRIANGLES = 4;
WebGLRenderingContext.TRIANGLE_FAN = 6;
WebGLRenderingContext.TRIANGLE_STRIP = 5;
WebGLRenderingContext.UNPACK_ALIGNMENT = 3317;
WebGLRenderingContext.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL = 37440;
WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
WebGLRenderingContext.UNSIGNED_BYTE = 5121;
WebGLRenderingContext.UNSIGNED_INT = 5125;
WebGLRenderingContext.UNSIGNED_SHORT = 5123;
WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4 = 32819;
WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1 = 32820;
WebGLRenderingContext.UNSIGNED_SHORT_5_6_5 = 33635;
WebGLRenderingContext.VALIDATE_STATUS = 35715;
WebGLRenderingContext.VENDOR = 7936;
WebGLRenderingContext.VERSION = 7938;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_POINTER = 34373;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_SIZE = 34339;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
WebGLRenderingContext.VERTEX_ATTRIB_ARRAY_TYPE = 34341;
WebGLRenderingContext.VERTEX_SHADER = 35633;
WebGLRenderingContext.VIEWPORT = 2978;
WebGLRenderingContext.ZERO = 0;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const _socketTask = new WeakMap();
class WebSocket {
  constructor(url, protocols = []) {
    // The connection is closed or couldn't be opened.
    _defineProperty(this, "binaryType", '');
    // TODO 更新 binaryType
    _defineProperty(this, "bufferedAmount", 0);
    // TODO 更新 bufferedAmount
    _defineProperty(this, "extensions", '');
    _defineProperty(this, "onclose", null);
    _defineProperty(this, "onerror", null);
    _defineProperty(this, "onmessage", null);
    _defineProperty(this, "onopen", null);
    _defineProperty(this, "protocol", '');
    // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
    _defineProperty(this, "readyState", 3);
    if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`);
    }
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    const socketTask = wx.connectSocket({
      url,
      protocols: Array.isArray(protocols) ? protocols : [protocols],
      tcpNoDelay: true
    });
    _socketTask.set(this, socketTask);
    socketTask.onClose(res => {
      this.readyState = WebSocket.CLOSED;
      if (typeof this.onclose === 'function') {
        this.onclose(res);
      }
    });
    socketTask.onMessage(res => {
      if (typeof this.onmessage === 'function') {
        this.onmessage(res);
      }
    });
    socketTask.onOpen(() => {
      this.readyState = WebSocket.OPEN;
      if (typeof this.onopen === 'function') {
        this.onopen();
      }
    });
    socketTask.onError(res => {
      if (typeof this.onerror === 'function') {
        this.onerror(new Error(res.errMsg));
      }
    });
    return this;
  }
  close(code, reason) {
    this.readyState = WebSocket.CLOSING;
    const socketTask = _socketTask.get(this);
    socketTask.close({
      code,
      reason
    });
  }
  send(data) {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data)) {
      throw new TypeError(`Failed to send message: The data ${data} is invalid`);
    }
    const socketTask = _socketTask.get(this);
    socketTask.send({
      data
    });
  }
}
exports.default = WebSocket;
_defineProperty(WebSocket, "CONNECTING", 0);
// The connection is not yet open.
_defineProperty(WebSocket, "OPEN", 1);
// The connection is open and ready to communicate.
_defineProperty(WebSocket, "CLOSING", 2);
// The connection is in the process of closing.
_defineProperty(WebSocket, "CLOSED", 3);

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.screen = exports.performance = exports.ontouchstart = exports.ontouchmove = exports.ontouchend = exports.innerWidth = exports.innerHeight = exports.devicePixelRatio = void 0;
const {
  screenWidth,
  screenHeight,
  devicePixelRatio
} = wx.getSystemInfoSync();
exports.devicePixelRatio = devicePixelRatio;
const innerWidth = screenWidth;
exports.innerWidth = innerWidth;
const innerHeight = screenHeight;
exports.innerHeight = innerHeight;
const screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0
};
exports.screen = screen;
const performance = {
  now: Date.now
};
exports.performance = performance;
const ontouchstart = null;
exports.ontouchstart = ontouchstart;
const ontouchmove = null;
exports.ontouchmove = ontouchmove;
const ontouchend = null;
exports.ontouchend = ontouchend;

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EventTarget = _interopRequireDefault(require("./EventTarget.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const _url = new WeakMap();
const _method = new WeakMap();
const _requestHeader = new WeakMap();
const _responseHeader = new WeakMap();
const _requestTask = new WeakMap();
function _triggerEvent(type, ...args) {
  if (typeof this[`on${type}`] === 'function') {
    this[`on${type}`].apply(this, args);
  }
}
function _changeReadyState(readyState) {
  this.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange');
}
class XMLHttpRequest extends _EventTarget.default {
  constructor() {
    super();
    _defineProperty(this, "timeout", 0);
    /*
     * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
     */
    _defineProperty(this, "onabort", null);
    _defineProperty(this, "onerror", null);
    _defineProperty(this, "onload", null);
    _defineProperty(this, "onloadstart", null);
    _defineProperty(this, "onprogress", null);
    _defineProperty(this, "ontimeout", null);
    _defineProperty(this, "onloadend", null);
    _defineProperty(this, "onreadystatechange", null);
    _defineProperty(this, "readyState", 0);
    _defineProperty(this, "response", null);
    _defineProperty(this, "responseText", null);
    _defineProperty(this, "responseType", '');
    _defineProperty(this, "responseXML", null);
    _defineProperty(this, "status", 0);
    _defineProperty(this, "statusText", '');
    _defineProperty(this, "upload", {});
    _defineProperty(this, "withCredentials", false);
    _requestHeader.set(this, {
      'content-type': 'application/x-www-form-urlencoded'
    });
    _responseHeader.set(this, {});
  }
  abort() {
    const myRequestTask = _requestTask.get(this);
    if (myRequestTask) {
      myRequestTask.abort();
    }
  }
  getAllResponseHeaders() {
    const responseHeader = _responseHeader.get(this);
    return Object.keys(responseHeader).map(header => {
      return `${header}: ${responseHeader[header]}`;
    }).join('\n');
  }
  getResponseHeader(header) {
    return _responseHeader.get(this)[header];
  }
  open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
    _method.set(this, method);
    _url.set(this, url);
    _changeReadyState.call(this, XMLHttpRequest.OPENED);
  }
  overrideMimeType() {}
  send(data = '') {
    if (this.readyState !== XMLHttpRequest.OPENED) {
      throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
    } else {
      let myRequestTask = wx.request({
        data,
        url: _url.get(this),
        method: _method.get(this),
        header: _requestHeader.get(this),
        dataType: 'other',
        responseType: this.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
        timeout: this.timeout || undefined,
        success: ({
          data,
          statusCode,
          header
        }) => {
          this.status = statusCode;
          _responseHeader.set(this, header);
          _triggerEvent.call(this, 'loadstart');
          _changeReadyState.call(this, XMLHttpRequest.HEADERS_RECEIVED);
          _changeReadyState.call(this, XMLHttpRequest.LOADING);
          switch (this.responseType) {
            case 'json':
              this.responseText = data;
              try {
                this.response = JSON.parse(data);
              } catch (e) {
                this.response = null;
              }
              break;
            case '':
            case 'text':
              this.responseText = this.response = data;
              break;
            case 'arraybuffer':
              this.response = data;
              this.responseText = '';
              var bytes = new Uint8Array(data);
              var len = bytes.byteLength;
              for (var i = 0; i < len; i++) {
                this.responseText += String.fromCharCode(bytes[i]);
              }
              break;
            default:
              this.response = null;
          }
          _changeReadyState.call(this, XMLHttpRequest.DONE);
          _triggerEvent.call(this, 'load');
          _triggerEvent.call(this, 'loadend');
        },
        fail: ({
          errMsg
        }) => {
          // TODO 规范错误
          if (errMsg.indexOf('abort') !== -1) {
            _triggerEvent.call(this, 'abort');
          } else if (errMsg.indexOf('timeout') !== -1) {
            _triggerEvent.call(this, 'timeout');
          } else {
            _triggerEvent.call(this, 'error', errMsg);
          }
          _triggerEvent.call(this, 'loadend');
        }
      });
      _requestTask.set(this, myRequestTask);
    }
  }
  setRequestHeader(header, value) {
    const myHeader = _requestHeader.get(this);
    myHeader[header] = value;
    _requestHeader.set(this, myHeader);
  }
  addEventListener(type, listener) {
    if (typeof listener === 'function') {
      let _this = this;
      let event = {
        target: _this
      };
      this['on' + type] = function (event) {
        listener.call(_this, event);
      };
    }
  }
}
exports.default = XMLHttpRequest;
// TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
_defineProperty(XMLHttpRequest, "UNSEND", 0);
_defineProperty(XMLHttpRequest, "OPENED", 1);
_defineProperty(XMLHttpRequest, "HEADERS_RECEIVED", 2);
_defineProperty(XMLHttpRequest, "LOADING", 3);
_defineProperty(XMLHttpRequest, "DONE", 4);

},{"./EventTarget.js":11}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var window = _interopRequireWildcard(require("./window"));
var _HTMLElement = _interopRequireDefault(require("./HTMLElement"));
var _HTMLVideoElement = _interopRequireDefault(require("./HTMLVideoElement"));
var _Image = _interopRequireDefault(require("./Image"));
var _Audio = _interopRequireDefault(require("./Audio"));
var _Canvas = _interopRequireDefault(require("./Canvas"));
require("./EventIniter/index.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const events = {};
const document = {
  readyState: 'complete',
  visibilityState: 'visible',
  documentElement: window,
  hidden: false,
  style: {},
  location: window.location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,
  head: new _HTMLElement.default('head'),
  body: new _HTMLElement.default('body'),
  createElement(tagName) {
    if (tagName === 'canvas') {
      return new _Canvas.default();
    } else if (tagName === 'audio') {
      return new _Audio.default();
    } else if (tagName === 'img') {
      return new _Image.default();
    } else if (tagName === 'video') {
      return new _HTMLVideoElement.default();
    }
    return new _HTMLElement.default(tagName);
  },
  createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },
  getElementById(id) {
    if (id === window.canvas.id) {
      return window.canvas;
    }
    return null;
  },
  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  querySelector(query) {
    if (query === 'head') {
      return document.head;
    } else if (query === 'body') {
      return document.body;
    } else if (query === 'canvas') {
      return window.canvas;
    } else if (query === `#${window.canvas.id}`) {
      return window.canvas;
    }
    return null;
  },
  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head];
    } else if (query === 'body') {
      return [document.body];
    } else if (query === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  addEventListener(type, listener) {
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
  },
  removeEventListener(type, listener) {
    const listeners = events[type];
    if (listeners && listeners.length > 0) {
      for (let i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  },
  dispatchEvent(event) {
    const listeners = events[event.type];
    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
  }
};
var _default = document;
exports.default = _default;

},{"./Audio":5,"./Canvas":6,"./EventIniter/index.js":10,"./HTMLElement":15,"./HTMLVideoElement":18,"./Image":19,"./window":32}],27:[function(require,module,exports){
"use strict";

var _window = _interopRequireWildcard(require("./window"));
var _document = _interopRequireDefault(require("./document"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const global = GameGlobal;
function inject() {
  _window.document = _document.default;
  _window.addEventListener = (type, listener) => {
    _window.document.addEventListener(type, listener);
  };
  _window.removeEventListener = (type, listener) => {
    _window.document.removeEventListener(type, listener);
  };
  _window.dispatchEvent = function (event = {}) {
    console.log('window.dispatchEvent', event.type, event);
    // nothing to do
  };

  const {
    platform
  } = wx.getSystemInfoSync();

  // 开发者工具无法重定义 window
  if (typeof __devtoolssubcontext === 'undefined' && platform === 'devtools') {
    for (const key in _window) {
      const descriptor = Object.getOwnPropertyDescriptor(global, key);
      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(window, key, {
          value: _window[key]
        });
      }
    }
    for (const key in _window.document) {
      const descriptor = Object.getOwnPropertyDescriptor(global.document, key);
      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(global.document, key, {
          value: _window.document[key]
        });
      }
    }
    window.parent = window;
  } else {
    for (const key in _window) {
      global[key] = _window[key];
    }
    global.window = _window;
    window = global;
    window.top = window.parent = window;
  }
}
if (!GameGlobal.__isAdapterInjected) {
  GameGlobal.__isAdapterInjected = true;
  inject();
}

// overwrite global WebAssembly
global.CCWebAssembly = global.WebAssembly = global.WXWebAssembly;
require('../../../../common/xmldom/dom-parser');
require('../unify');
require('../fs-utils');

},{"../../../../common/xmldom/dom-parser":1,"../fs-utils":33,"../unify":34,"./document":26,"./window":32}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const localStorage = {
  get length() {
    const {
      keys
    } = wx.getStorageInfoSync();
    return keys.length;
  },
  key(n) {
    const {
      keys
    } = wx.getStorageInfoSync();
    return keys[n];
  },
  getItem(key) {
    return wx.getStorageSync(key);
  },
  setItem(key, value) {
    return wx.setStorageSync(key, value);
  },
  removeItem(key) {
    wx.removeStorageSync(key);
  },
  clear() {
    wx.clearStorageSync();
  }
};
var _default = localStorage;
exports.default = _default;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const location = {
  href: 'game.js',
  protocol: '',
  reload() {}
};
var _default = location;
exports.default = _default;

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = require("./util/index.js");
// TODO 需要 wx.getSystemInfo 获取更详细信息
const systemInfo = wx.getSystemInfoSync();
console.log(systemInfo);
const system = systemInfo.system;
const platform = systemInfo.platform;
const language = systemInfo.language;
const wechatVersioin = systemInfo.version;
const android = system.toLowerCase().indexOf('android') !== -1;
const uaDesc = android ? `Android; CPU ${system}` : `iPhone; CPU iPhone OS ${system} like Mac OS X`;
const ua = `Mozilla/5.0 (${uaDesc}) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/${wechatVersioin} MiniGame NetType/WIFI Language/${language}`;
const navigator = {
  platform,
  language: language,
  appVersion: `5.0 (${uaDesc}) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`,
  userAgent: ua,
  onLine: true,
  // TODO 用 wx.getNetworkStateChange 和 wx.onNetworkStateChange 来返回真实的状态

  // TODO 用 wx.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: _index.noop,
    watchPosition: _index.noop,
    clearWatch: _index.noop
  }
};
if (wx.onNetworkStatusChange) {
  wx.onNetworkStatusChange(function (event) {
    navigator.onLine = event.isConnected;
  });
}
var _default = navigator;
exports.default = _default;

},{"./util/index.js":31}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
function noop() {}

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  canvas: true,
  setTimeout: true,
  setInterval: true,
  clearTimeout: true,
  clearInterval: true,
  requestAnimationFrame: true,
  cancelAnimationFrame: true,
  navigator: true,
  XMLHttpRequest: true,
  WebSocket: true,
  Image: true,
  ImageBitmap: true,
  Audio: true,
  FileReader: true,
  HTMLElement: true,
  HTMLImageElement: true,
  HTMLCanvasElement: true,
  HTMLMediaElement: true,
  HTMLAudioElement: true,
  HTMLVideoElement: true,
  WebGLRenderingContext: true,
  TouchEvent: true,
  MouseEvent: true,
  DeviceMotionEvent: true,
  localStorage: true,
  location: true
};
Object.defineProperty(exports, "Audio", {
  enumerable: true,
  get: function () {
    return _Audio2.default;
  }
});
Object.defineProperty(exports, "DeviceMotionEvent", {
  enumerable: true,
  get: function () {
    return _index.DeviceMotionEvent;
  }
});
Object.defineProperty(exports, "FileReader", {
  enumerable: true,
  get: function () {
    return _FileReader2.default;
  }
});
Object.defineProperty(exports, "HTMLAudioElement", {
  enumerable: true,
  get: function () {
    return _HTMLAudioElement2.default;
  }
});
Object.defineProperty(exports, "HTMLCanvasElement", {
  enumerable: true,
  get: function () {
    return _HTMLCanvasElement2.default;
  }
});
Object.defineProperty(exports, "HTMLElement", {
  enumerable: true,
  get: function () {
    return _HTMLElement2.default;
  }
});
Object.defineProperty(exports, "HTMLImageElement", {
  enumerable: true,
  get: function () {
    return _HTMLImageElement2.default;
  }
});
Object.defineProperty(exports, "HTMLMediaElement", {
  enumerable: true,
  get: function () {
    return _HTMLMediaElement2.default;
  }
});
Object.defineProperty(exports, "HTMLVideoElement", {
  enumerable: true,
  get: function () {
    return _HTMLVideoElement2.default;
  }
});
Object.defineProperty(exports, "Image", {
  enumerable: true,
  get: function () {
    return _Image2.default;
  }
});
Object.defineProperty(exports, "ImageBitmap", {
  enumerable: true,
  get: function () {
    return _ImageBitmap2.default;
  }
});
Object.defineProperty(exports, "MouseEvent", {
  enumerable: true,
  get: function () {
    return _index.MouseEvent;
  }
});
Object.defineProperty(exports, "TouchEvent", {
  enumerable: true,
  get: function () {
    return _index.TouchEvent;
  }
});
Object.defineProperty(exports, "WebGLRenderingContext", {
  enumerable: true,
  get: function () {
    return _WebGLRenderingContext2.default;
  }
});
Object.defineProperty(exports, "WebSocket", {
  enumerable: true,
  get: function () {
    return _WebSocket2.default;
  }
});
Object.defineProperty(exports, "XMLHttpRequest", {
  enumerable: true,
  get: function () {
    return _XMLHttpRequest2.default;
  }
});
exports.clearTimeout = exports.clearInterval = exports.canvas = exports.cancelAnimationFrame = void 0;
Object.defineProperty(exports, "localStorage", {
  enumerable: true,
  get: function () {
    return _localStorage2.default;
  }
});
Object.defineProperty(exports, "location", {
  enumerable: true,
  get: function () {
    return _location2.default;
  }
});
Object.defineProperty(exports, "navigator", {
  enumerable: true,
  get: function () {
    return _navigator2.default;
  }
});
exports.setTimeout = exports.setInterval = exports.requestAnimationFrame = void 0;
var _Canvas = _interopRequireDefault(require("./Canvas"));
var _navigator2 = _interopRequireDefault(require("./navigator"));
var _XMLHttpRequest2 = _interopRequireDefault(require("./XMLHttpRequest"));
var _WebSocket2 = _interopRequireDefault(require("./WebSocket"));
var _Image2 = _interopRequireDefault(require("./Image"));
var _ImageBitmap2 = _interopRequireDefault(require("./ImageBitmap"));
var _Audio2 = _interopRequireDefault(require("./Audio"));
var _FileReader2 = _interopRequireDefault(require("./FileReader"));
var _HTMLElement2 = _interopRequireDefault(require("./HTMLElement"));
var _HTMLImageElement2 = _interopRequireDefault(require("./HTMLImageElement"));
var _HTMLCanvasElement2 = _interopRequireDefault(require("./HTMLCanvasElement"));
var _HTMLMediaElement2 = _interopRequireDefault(require("./HTMLMediaElement"));
var _HTMLAudioElement2 = _interopRequireDefault(require("./HTMLAudioElement"));
var _HTMLVideoElement2 = _interopRequireDefault(require("./HTMLVideoElement"));
var _WebGLRenderingContext2 = _interopRequireDefault(require("./WebGLRenderingContext"));
var _index = require("./EventIniter/index.js");
var _localStorage2 = _interopRequireDefault(require("./localStorage"));
var _location2 = _interopRequireDefault(require("./location"));
var _WindowProperties = require("./WindowProperties");
Object.keys(_WindowProperties).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _WindowProperties[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _WindowProperties[key];
    }
  });
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 暴露全局的 canvas
GameGlobal.screencanvas = GameGlobal.screencanvas || new _Canvas.default();
const canvas = GameGlobal.screencanvas;
exports.canvas = canvas;
const {
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  requestAnimationFrame,
  cancelAnimationFrame
} = GameGlobal;
exports.cancelAnimationFrame = cancelAnimationFrame;
exports.requestAnimationFrame = requestAnimationFrame;
exports.clearInterval = clearInterval;
exports.clearTimeout = clearTimeout;
exports.setInterval = setInterval;
exports.setTimeout = setTimeout;

},{"./Audio":5,"./Canvas":6,"./EventIniter/index.js":10,"./FileReader":12,"./HTMLAudioElement":13,"./HTMLCanvasElement":14,"./HTMLElement":15,"./HTMLImageElement":16,"./HTMLMediaElement":17,"./HTMLVideoElement":18,"./Image":19,"./ImageBitmap":20,"./WebGLRenderingContext":22,"./WebSocket":23,"./WindowProperties":24,"./XMLHttpRequest":25,"./localStorage":28,"./location":29,"./navigator":30}],33:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of fsUtils software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in fsUtils License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
/* eslint-disable no-undef */

const fs = wx.getFileSystemManager ? wx.getFileSystemManager() : null;
const outOfStorageRegExp = /the maximum size of the file storage/;
const fsUtils = {
  fs,
  isOutOfStorage(errMsg) {
    return outOfStorageRegExp.test(errMsg);
  },
  getUserDataPath() {
    return wx.env.USER_DATA_PATH;
  },
  checkFsValid() {
    if (!fs) {
      console.warn('can not get the file system!');
      return false;
    }
    return true;
  },
  deleteFile(filePath, onComplete) {
    fs.unlink({
      filePath,
      success() {
        onComplete && onComplete(null);
      },
      fail(res) {
        console.warn(`Delete file failed: path: ${filePath} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  downloadFile(remoteUrl, filePath, header, onProgress, onComplete) {
    const options = {
      url: remoteUrl,
      success(res) {
        if (res.statusCode === 200) {
          onComplete && onComplete(null, res.tempFilePath || res.filePath);
        } else {
          if (res.filePath) {
            fsUtils.deleteFile(res.filePath);
          }
          console.warn(`Download file failed: path: ${remoteUrl} message: ${res.statusCode}`);
          onComplete && onComplete(new Error(res.statusCode), null);
        }
      },
      fail(res) {
        console.warn(`Download file failed: path: ${remoteUrl} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg), null);
      }
    };
    if (filePath) options.filePath = filePath;
    if (header) options.header = header;
    const task = wx.downloadFile(options);
    onProgress && task.onProgressUpdate(onProgress);
  },
  saveFile(srcPath, destPath, onComplete) {
    wx.saveFile({
      tempFilePath: srcPath,
      filePath: destPath,
      success() {
        onComplete && onComplete(null);
      },
      fail(res) {
        console.warn(`Save file failed: path: ${srcPath} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  copyFile(srcPath, destPath, onComplete) {
    fs.copyFile({
      srcPath,
      destPath,
      success() {
        onComplete && onComplete(null);
      },
      fail(res) {
        console.warn(`Copy file failed: path: ${srcPath} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  writeFile(path, data, encoding, onComplete) {
    fs.writeFile({
      filePath: path,
      encoding,
      data,
      success() {
        onComplete && onComplete(null);
      },
      fail(res) {
        console.warn(`Write file failed: path: ${path} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  writeFileSync(path, data, encoding) {
    try {
      fs.writeFileSync(path, data, encoding);
      return null;
    } catch (e) {
      console.warn(`Write file failed: path: ${path} message: ${e.message}`);
      return new Error(e.message);
    }
  },
  readFile(filePath, encoding, onComplete) {
    fs.readFile({
      filePath,
      encoding,
      success(res) {
        onComplete && onComplete(null, res.data);
      },
      fail(res) {
        console.warn(`Read file failed: path: ${filePath} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg), null);
      }
    });
  },
  readDir(filePath, onComplete) {
    fs.readdir({
      dirPath: filePath,
      success(res) {
        onComplete && onComplete(null, res.files);
      },
      fail(res) {
        console.warn(`Read directory failed: path: ${filePath} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(res.errMsg), null);
      }
    });
  },
  readText(filePath, onComplete) {
    fsUtils.readFile(filePath, 'utf8', onComplete);
  },
  readArrayBuffer(filePath, onComplete) {
    // Should pass undefined to 'encoding' parameter instead of passing an empty string,
    // otherwise, the new version of WeChat mini-game IDE will report an error:
    //
    // Error: readFile:fail Parameter check error:
    //     parameter.encoding 字段需为 'ascii' | 'base64' | 'binary' | 'hex' | 'latin1' | 'ucs-2' | 'ucs2' | 'utf-16le' | 'utf-8' | 'utf16le' | 'utf8'
    //         at Object.fail (web-adapter.js? [sm]:1)
    //         at Object.t (VM31 WAGameSubContext.js:1)
    //         at Function.C.forEach.v.<computed> (VM20 WAGame.js:1)
    //         at p (VM20 WAGame.js:1)
    //         at Object.fail (VM20 WAGame.js:1)
    //         at VM20 WAGame.js:1
    //         at oe (VM20 WAGame.js:1)
    //         at VM20 WAGame.js:1
    //         at r (VM20 WAGame.js:1)
    //         at s (VM20 WAGame.js:1)
    //
    // API Reference: https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFile.html
    fsUtils.readFile(filePath, undefined, onComplete);
  },
  readJson(filePath, onComplete) {
    fsUtils.readFile(filePath, 'utf8', (err, text) => {
      let out = null;
      if (!err) {
        try {
          out = JSON.parse(text);
        } catch (e) {
          console.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
          err = new Error(e.message);
        }
      }
      onComplete && onComplete(err, out);
    });
  },
  readJsonSync(path) {
    try {
      const str = fs.readFileSync(path, 'utf8');
      return JSON.parse(str);
    } catch (e) {
      console.warn(`Read json failed: path: ${path} message: ${e.message}`);
      return new Error(e.message);
    }
  },
  makeDirSync(path, recursive) {
    try {
      fs.mkdirSync(path, recursive);
      return null;
    } catch (e) {
      console.warn(`Make directory failed: path: ${path} message: ${e.message}`);
      return new Error(e.message);
    }
  },
  rmdirSync(dirPath, recursive) {
    try {
      fs.rmdirSync(dirPath, recursive);
      return null;
    } catch (e) {
      console.warn(`rm directory failed: path: ${dirPath} message: ${e.message}`);
      return new Error(e.message);
    }
  },
  exists(filePath, onComplete) {
    fs.access({
      path: filePath,
      success() {
        onComplete && onComplete(true);
      },
      fail() {
        onComplete && onComplete(false);
      }
    });
  },
  loadSubpackage(name, onProgress, onComplete) {
    const task = wx.loadSubpackage({
      name,
      success() {
        onComplete && onComplete();
      },
      fail(res) {
        console.warn(`Load Subpackage failed: path: ${name} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(`Failed to load subpackage ${name}: ${res.errMsg}`));
      }
    });
    onProgress && task.onProgressUpdate(onProgress);
    return task;
  },
  unzip(zipFilePath, targetPath, onComplete) {
    fs.unzip({
      zipFilePath,
      targetPath,
      success() {
        onComplete && onComplete(null);
      },
      fail(res) {
        console.warn(`unzip failed: path: ${zipFilePath} message: ${res.errMsg}`);
        onComplete && onComplete(new Error(`unzip failed: ${res.errMsg}`));
      }
    });
  }
};
window.fsUtils = module.exports = fsUtils;

},{}],34:[function(require,module,exports){
"use strict";

const utils = require('./utils');
window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
  const globalAdapter = window.__globalAdapter;
  // SystemInfo
  const systemInfo = wx.getSystemInfoSync();
  const windowWidth = systemInfo.windowWidth;
  const windowHeight = systemInfo.windowHeight;
  const isLandscape = windowWidth > windowHeight;
  globalAdapter.isSubContext = wx.getOpenDataContext === undefined;
  globalAdapter.isDevTool = systemInfo.platform === 'devtools';
  utils.cloneMethod(globalAdapter, wx, 'getSystemInfoSync');

  // TouchEvent
  utils.cloneMethod(globalAdapter, wx, 'onTouchStart');
  utils.cloneMethod(globalAdapter, wx, 'onTouchMove');
  utils.cloneMethod(globalAdapter, wx, 'onTouchEnd');
  utils.cloneMethod(globalAdapter, wx, 'onTouchCancel');

  // Audio
  utils.cloneMethod(globalAdapter, wx, 'createInnerAudioContext');

  // AudioInterruption Evnet
  utils.cloneMethod(globalAdapter, wx, 'onAudioInterruptionEnd');
  utils.cloneMethod(globalAdapter, wx, 'onAudioInterruptionBegin');

  // Video
  utils.cloneMethod(globalAdapter, wx, 'createVideo');

  // FrameRate
  utils.cloneMethod(globalAdapter, wx, 'setPreferredFramesPerSecond');

  // Keyboard
  utils.cloneMethod(globalAdapter, wx, 'showKeyboard');
  utils.cloneMethod(globalAdapter, wx, 'hideKeyboard');
  utils.cloneMethod(globalAdapter, wx, 'updateKeyboard');
  utils.cloneMethod(globalAdapter, wx, 'onKeyboardInput');
  utils.cloneMethod(globalAdapter, wx, 'onKeyboardConfirm');
  utils.cloneMethod(globalAdapter, wx, 'onKeyboardComplete');
  utils.cloneMethod(globalAdapter, wx, 'offKeyboardInput');
  utils.cloneMethod(globalAdapter, wx, 'offKeyboardConfirm');
  utils.cloneMethod(globalAdapter, wx, 'offKeyboardComplete');

  // Message
  utils.cloneMethod(globalAdapter, wx, 'getOpenDataContext');
  utils.cloneMethod(globalAdapter, wx, 'onMessage');

  // Subpackage
  utils.cloneMethod(globalAdapter, wx, 'loadSubpackage');

  // SharedCanvas
  utils.cloneMethod(globalAdapter, wx, 'getSharedCanvas');

  // Font
  utils.cloneMethod(globalAdapter, wx, 'loadFont');

  // hide show Event
  utils.cloneMethod(globalAdapter, wx, 'onShow');
  utils.cloneMethod(globalAdapter, wx, 'onHide');

  // wechat program use onAppShow/onAppHide
  if (typeof getApp === 'function') {
    wx.onShow = wx.onAppShow;
    wx.onHide = wx.onAppHide;
  }

  // onError
  utils.cloneMethod(globalAdapter, wx, 'onError');
  // offError
  utils.cloneMethod(globalAdapter, wx, 'offError');

  // Accelerometer
  let isAccelerometerInit = false;
  let deviceOrientation = 1;
  if (wx.onDeviceOrientationChange) {
    wx.onDeviceOrientationChange(res => {
      if (res.value === 'landscape') {
        deviceOrientation = 1;
      } else if (res.value === 'landscapeReverse') {
        deviceOrientation = -1;
      }
    });
  }
  Object.assign(globalAdapter, {
    startAccelerometer(cb) {
      if (!isAccelerometerInit) {
        isAccelerometerInit = true;
        wx.onAccelerometerChange && wx.onAccelerometerChange(res => {
          const resClone = {};
          let x = res.x;
          let y = res.y;
          if (isLandscape) {
            const tmp = x;
            x = -y;
            y = tmp;
          }
          resClone.x = x * deviceOrientation;
          resClone.y = y * deviceOrientation;
          resClone.z = res.z;
          cb && cb(resClone);
        });
      } else {
        wx.startAccelerometer && wx.startAccelerometer({
          fail(err) {
            console.error('start accelerometer failed', err);
          }
          // success () {},
          // complete () {},
        });
      }
    },

    stopAccelerometer() {
      wx.stopAccelerometer && wx.stopAccelerometer({
        fail(err) {
          console.error('stop accelerometer failed', err);
        }
        // success () {},
        // complete () {},
      });
    }
  });
}

},{"./utils":35}],35:[function(require,module,exports){
"use strict";

let utils = {
  /**
   * @param {Object} target 
   * @param {Object} origin 
   * @param {String} methodName 
   * @param {String} targetMethodName 
   */
  cloneMethod(target, origin, methodName, targetMethodName) {
    if (origin[methodName]) {
      targetMethodName = targetMethodName || methodName;
      target[targetMethodName] = origin[methodName].bind(origin);
    }
  }
};
module.exports = utils;

},{}]},{},[27]);
