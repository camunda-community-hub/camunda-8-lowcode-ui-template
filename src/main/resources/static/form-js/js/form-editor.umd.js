(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FormEditor = {}));
}(this, (function (exports) { 'use strict';

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var hat_1 = createCommonjsModule(function (module) {
  var hat = module.exports = function (bits, base) {
      if (!base) base = 16;
      if (bits === undefined) bits = 128;
      if (bits <= 0) return '0';
      
      var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
      for (var i = 2; digits === Infinity; i *= 2) {
          digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
      }
      
      var rem = digits - Math.floor(digits);
      
      var res = '';
      
      for (var i = 0; i < Math.floor(digits); i++) {
          var x = Math.floor(Math.random() * base).toString(base);
          res = x + res;
      }
      
      if (rem) {
          var b = Math.pow(base, rem);
          var x = Math.floor(Math.random() * b).toString(base);
          res = x + res;
      }
      
      var parsed = parseInt(res, base);
      if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
          return hat(bits, base)
      }
      else return res;
  };

  hat.rack = function (bits, base, expandBy) {
      var fn = function (data) {
          var iters = 0;
          do {
              if (iters ++ > 10) {
                  if (expandBy) bits += expandBy;
                  else throw new Error('too many ID collisions, use more bits')
              }
              
              var id = hat(bits, base);
          } while (Object.hasOwnProperty.call(hats, id));
          
          hats[id] = data;
          return id;
      };
      var hats = fn.hats = {};
      
      fn.get = function (id) {
          return fn.hats[id];
      };
      
      fn.set = function (id, value) {
          fn.hats[id] = value;
          return fn;
      };
      
      fn.bits = bits || 128;
      fn.base = base || 16;
      return fn;
  };
  });

  /**
   * Create a new id generator / cache instance.
   *
   * You may optionally provide a seed that is used internally.
   *
   * @param {Seed} seed
   */

  function Ids(seed) {
    if (!(this instanceof Ids)) {
      return new Ids(seed);
    }

    seed = seed || [128, 36, 1];
    this._seed = seed.length ? hat_1.rack(seed[0], seed[1], seed[2]) : seed;
  }
  /**
   * Generate a next id.
   *
   * @param {Object} [element] element to bind the id to
   *
   * @return {String} id
   */

  Ids.prototype.next = function (element) {
    return this._seed(element || true);
  };
  /**
   * Generate a next id with a given prefix.
   *
   * @param {Object} [element] element to bind the id to
   *
   * @return {String} id
   */


  Ids.prototype.nextPrefixed = function (prefix, element) {
    var id;

    do {
      id = prefix + this.next(true);
    } while (this.assigned(id)); // claim {prefix}{random}


    this.claim(id, element); // return

    return id;
  };
  /**
   * Manually claim an existing id.
   *
   * @param {String} id
   * @param {String} [element] element the id is claimed by
   */


  Ids.prototype.claim = function (id, element) {
    this._seed.set(id, element || true);
  };
  /**
   * Returns true if the given id has already been assigned.
   *
   * @param  {String} id
   * @return {Boolean}
   */


  Ids.prototype.assigned = function (id) {
    return this._seed.get(id) || false;
  };
  /**
   * Unclaim an id.
   *
   * @param  {String} id the id to unclaim
   */


  Ids.prototype.unclaim = function (id) {
    delete this._seed.hats[id];
  };
  /**
   * Clear all claimed ids.
   */


  Ids.prototype.clear = function () {
    var hats = this._seed.hats,
        id;

    for (id in hats) {
      this.unclaim(id);
    }
  };

  /**
   * Flatten array, one level deep.
   *
   * @param {Array<?>} arr
   *
   * @return {Array<?>}
   */

  var nativeToString = Object.prototype.toString;
  var nativeHasOwnProperty = Object.prototype.hasOwnProperty;
  function isUndefined(obj) {
    return obj === undefined;
  }
  function isDefined(obj) {
    return obj !== undefined;
  }
  function isNil(obj) {
    return obj == null;
  }
  function isArray$1(obj) {
    return nativeToString.call(obj) === '[object Array]';
  }
  function isObject(obj) {
    return nativeToString.call(obj) === '[object Object]';
  }
  function isNumber(obj) {
    return nativeToString.call(obj) === '[object Number]';
  }
  function isFunction(obj) {
    var tag = nativeToString.call(obj);
    return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object AsyncGeneratorFunction]' || tag === '[object Proxy]';
  }
  function isString(obj) {
    return nativeToString.call(obj) === '[object String]';
  }
  /**
   * Return true, if target owns a property with the given key.
   *
   * @param {Object} target
   * @param {String} key
   *
   * @return {Boolean}
   */

  function has(target, key) {
    return nativeHasOwnProperty.call(target, key);
  }

  /**
   * Find element in collection.
   *
   * @param  {Array|Object} collection
   * @param  {Function|Object} matcher
   *
   * @return {Object}
   */

  function find$1(collection, matcher) {
    matcher = toMatcher(matcher);
    var match;
    forEach(collection, function (val, key) {
      if (matcher(val, key)) {
        match = val;
        return false;
      }
    });
    return match;
  }
  /**
   * Iterate over collection; returning something
   * (non-undefined) will stop iteration.
   *
   * @param  {Array|Object} collection
   * @param  {Function} iterator
   *
   * @return {Object} return result that stopped the iteration
   */

  function forEach(collection, iterator) {
    var val, result;

    if (isUndefined(collection)) {
      return;
    }

    var convertKey = isArray$1(collection) ? toNum : identity;

    for (var key in collection) {
      if (has(collection, key)) {
        val = collection[key];
        result = iterator(val, convertKey(key));

        if (result === false) {
          return val;
        }
      }
    }
  }
  /**
   * Transform a collection into another collection
   * by piping each member through the given fn.
   *
   * @param  {Object|Array}   collection
   * @param  {Function} fn
   *
   * @return {Array} transformed collection
   */

  function map(collection, fn) {
    var result = [];
    forEach(collection, function (val, key) {
      result.push(fn(val, key));
    });
    return result;
  }
  /**
   * Group collection members by attribute.
   *
   * @param  {Object|Array} collection
   * @param  {Function} extractor
   *
   * @return {Object} map with { attrValue => [ a, b, c ] }
   */

  function groupBy(collection, extractor) {
    var grouped = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    extractor = toExtractor(extractor);
    forEach(collection, function (val) {
      var discriminator = extractor(val) || '_';
      var group = grouped[discriminator];

      if (!group) {
        group = grouped[discriminator] = [];
      }

      group.push(val);
    });
    return grouped;
  }
  function uniqueBy(extractor) {
    extractor = toExtractor(extractor);
    var grouped = {};

    for (var _len = arguments.length, collections = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      collections[_key - 1] = arguments[_key];
    }

    forEach(collections, function (c) {
      return groupBy(c, extractor, grouped);
    });
    var result = map(grouped, function (val, key) {
      return val[0];
    });
    return result;
  }
  /**
   * Sort collection by criteria.
   *
   * @param  {Object|Array} collection
   * @param  {String|Function} extractor
   *
   * @return {Array}
   */

  function sortBy(collection, extractor) {
    extractor = toExtractor(extractor);
    var sorted = [];
    forEach(collection, function (value, key) {
      var disc = extractor(value, key);
      var entry = {
        d: disc,
        v: value
      };

      for (var idx = 0; idx < sorted.length; idx++) {
        var d = sorted[idx].d;

        if (disc < d) {
          sorted.splice(idx, 0, entry);
          return;
        }
      } // not inserted, append (!)


      sorted.push(entry);
    });
    return map(sorted, function (e) {
      return e.v;
    });
  }

  function toExtractor(extractor) {
    return isFunction(extractor) ? extractor : function (e) {
      return e[extractor];
    };
  }

  function toMatcher(matcher) {
    return isFunction(matcher) ? matcher : function (e) {
      return e === matcher;
    };
  }

  function identity(arg) {
    return arg;
  }

  function toNum(arg) {
    return Number(arg);
  }

  /**
   * Debounce fn, calling it only once if the given time
   * elapsed between calls.
   *
   * Lodash-style the function exposes methods to `#clear`
   * and `#flush` to control internal behavior.
   *
   * @param  {Function} fn
   * @param  {Number} timeout
   *
   * @return {Function} debounced function
   */
  function debounce$2(fn, timeout) {
    var timer;
    var lastArgs;
    var lastThis;
    var lastNow;

    function fire(force) {
      var now = Date.now();
      var scheduledDiff = force ? 0 : lastNow + timeout - now;

      if (scheduledDiff > 0) {
        return schedule(scheduledDiff);
      }

      fn.apply(lastThis, lastArgs);
      clear();
    }

    function schedule(timeout) {
      timer = setTimeout(fire, timeout);
    }

    function clear() {
      if (timer) {
        clearTimeout(timer);
      }

      timer = lastNow = lastArgs = lastThis = undefined;
    }

    function flush() {
      if (timer) {
        fire(true);
      }

      clear();
    }

    function callback() {
      lastNow = Date.now();

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      lastArgs = args;
      lastThis = this; // ensure an execution is scheduled

      if (!timer) {
        schedule(timeout);
      }
    }

    callback.flush = flush;
    callback.cancel = clear;
    return callback;
  }
  /**
   * Bind function against target <this>.
   *
   * @param  {Function} fn
   * @param  {Object}   target
   *
   * @return {Function} bound function
   */

  function bind$1(fn, target) {
    return fn.bind(target);
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _extends$g() {
    _extends$g = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends$g.apply(this, arguments);
  }

  /**
   * Convenience wrapper for `Object.assign`.
   *
   * @param {Object} target
   * @param {...Object} others
   *
   * @return {Object} the target
   */

  function assign(target) {
    for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      others[_key - 1] = arguments[_key];
    }

    return _extends$g.apply(void 0, [target].concat(others));
  }
  /**
   * Sets a nested property of a given object to the specified value.
   *
   * This mutates the object and returns it.
   *
   * @param {Object} target The target of the set operation.
   * @param {(string|number)[]} path The path to the nested value.
   * @param {any} value The value to set.
   */

  function set(target, path, value) {
    var currentTarget = target;
    forEach(path, function (key, idx) {
      if (typeof key !== 'number' && typeof key !== 'string') {
        throw new Error('illegal key type: ' + _typeof(key) + '. Key should be of type number or string.');
      }

      if (key === 'constructor') {
        throw new Error('illegal key: constructor');
      }

      if (key === '__proto__') {
        throw new Error('illegal key: __proto__');
      }

      var nextKey = path[idx + 1];
      var nextTarget = currentTarget[key];

      if (isDefined(nextKey) && isNil(nextTarget)) {
        nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
      }

      if (isUndefined(nextKey)) {
        if (isUndefined(value)) {
          delete currentTarget[key];
        } else {
          currentTarget[key] = value;
        }
      } else {
        currentTarget = nextTarget;
      }
    });
    return target;
  }
  /**
   * Gets a nested property of a given object.
   *
   * @param {Object} target The target of the get operation.
   * @param {(string|number)[]} path The path to the nested value.
   * @param {any} [defaultValue] The value to return if no value exists.
   */

  function get(target, path, defaultValue) {
    var currentTarget = target;
    forEach(path, function (key) {
      // accessing nil property yields <undefined>
      if (isNil(currentTarget)) {
        currentTarget = undefined;
        return false;
      }

      currentTarget = currentTarget[key];
    });
    return isUndefined(currentTarget) ? defaultValue : currentTarget;
  }

  var e$4={"":["<em>","</em>"],_:["<strong>","</strong>"],"*":["<strong>","</strong>"],"~":["<s>","</s>"],"\n":["<br />"]," ":["<br />"],"-":["<hr />"]};function n$2(e){return e.replace(RegExp("^"+(e.match(/^(\t| )+/)||"")[0],"gm"),"")}function r$2(e){return (e+"").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function t$2(a,o){var c,l,s,g,p,u=/((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)|<([^>]+)>/gm,h=[],m="",i=o||{},f=0;function d(n){var r=e$4[n[1]||""],t=h[h.length-1]==n;return r?r[1]?(t?h.pop():h.push(n),r[0|t]):r[0]:n}function $(){for(var e="";h.length;)e+=d(h[h.length-1]);return e}for(a=a.replace(/^\[(.+?)\]:\s*(.+)$/gm,function(e,n,r){return i[n.toLowerCase()]=r,""}).replace(/^\n+|\n+$/g,"");s=u.exec(a);)l=a.substring(f,s.index),f=u.lastIndex,c=s[0],l.match(/[^\\](\\\\)*\\$/)||((p=s[3]||s[4])?c='<pre class="code '+(s[4]?"poetry":s[2].toLowerCase())+'"><code'+(s[2]?' class="language-'+s[2].toLowerCase()+'"':"")+">"+n$2(r$2(p).replace(/^\n+|\n+$/g,""))+"</code></pre>":(p=s[6])?(p.match(/\./)&&(s[5]=s[5].replace(/^\d+/gm,"")),g=t$2(n$2(s[5].replace(/^\s*[>*+.-]/gm,""))),">"==p?p="blockquote":(p=p.match(/\./)?"ol":"ul",g=g.replace(/^(.*)(\n|$)/gm,"<li>$1</li>")),c="<"+p+">"+g+"</"+p+">"):s[8]?c='<img src="'+r$2(s[8])+'" alt="'+r$2(s[7])+'">':s[10]?(m=m.replace("<a>",'<a href="'+r$2(s[11]||i[l.toLowerCase()])+'">'),c=$()+"</a>"):s[18]&&/^(https?|mailto):/.test(s[18])?c='<a href="'+r$2(s[18])+'">'+r$2(s[18])+"</a>":s[9]?c="<a>":s[12]||s[14]?c="<"+(p="h"+(s[14]?s[14].length:s[13]>"="?1:2))+">"+t$2(s[12]||s[15],i)+"</"+p+">":s[16]?c="<code>"+r$2(s[16])+"</code>":(s[17]||s[1])&&(c=d(s[17]||"--"))),m+=l,m+=c;return (m+a.substring(f)+$()).replace(/^\n+|\n+$/g,"")}

  var n$1,l$2,u$1,t$1,o$3,r$1,f$1,e$3={},c$1=[],s$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a$2(n,l){for(var u in l)n[u]=l[u];return n}function h$1(n){var l=n.parentNode;l&&l.removeChild(n);}function v$1(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n$1.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y$1(l,f,t,o,null)}function y$1(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u$1:r};return null!=l$2.vnode&&l$2.vnode(f),f}function p$2(){return {current:null}}function d$1(n){return n.children}function _$1(n,l){this.props=n,this.context=l;}function k$2(n,l){if(null==l)return n.__?k$2(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?k$2(n):null}function b$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b$1(n)}}function m$1(n){(!n.__d&&(n.__d=!0)&&t$1.push(n)&&!g$2.__r++||r$1!==l$2.debounceRendering)&&((r$1=l$2.debounceRendering)||o$3)(g$2);}function g$2(){for(var n;g$2.__r=t$1.length;)n=t$1.sort(function(n,l){return n.__v.__b-l.__v.__b}),t$1=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a$2({},t)).__v=t.__v+1,j$2(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k$2(t):o,t.__h),z$1(u,t),t.__e!=o&&b$1(t)));});}function w$2(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c$1,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y$1(null,_,null,null,_):Array.isArray(_)?y$1(d$1,{children:_},null,null,null):_.__b>0?y$1(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null;}j$2(n,_,p=p||e$3,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&null!=_.__k&&_.__k===p.__k?_.__d=s=x$2(_,s,n):s=P$1(n,_,p,w,b,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&p.__e==s&&s.parentNode!=n&&(s=k$2(p));}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k$2(i,h+1)),N$1(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M$1(g[h],g[++h],g[++h]);}function x$2(n,l,u){var i,t;for(i=0;i<n.__k.length;i++)(t=n.__k[i])&&(t.__=n,l="function"==typeof t.type?x$2(t,l,u):P$1(u,t,t,n.__k,t.__e,l));return l}function A$2(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){A$2(n,l);}):l.push(n)),l}function P$1(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else {for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o;}return void 0!==r?r:t.nextSibling}function C$1(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H$1(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H$1(n,o,l[o],u[o],i);}function $$1(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s$1.test(l)?u:u+"px";}function H$1(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$$1(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$$1(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T$2:I$1,o):n.removeEventListener(l,o?T$2:I$1,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function I$1(n){this.l[n.type+!1](l$2.event?l$2.event(n):n);}function T$2(n){this.l[n.type+!0](l$2.event?l$2.event(n):n);}function j$2(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l$2.__b)&&s(u);try{n:if("function"==typeof P){if(m=u.props,g=(s=P.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(m,x):(u.__c=h=new _$1(m,x),h.constructor=P,h.render=O$1),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a$2({},h.__s)),a$2(h.__s,P.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==P.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k);});}h.context=x,h.props=m,h.state=h.__s,(s=l$2.__r)&&s(u),h.__d=!1,h.__v=u,h.__P=n,s=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=a$2(a$2({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),A=null!=s&&s.type===d$1&&null==s.key?s.props.children:s,w$2(n,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L$1(i.__e,u,i,t,o,r,f,c);(s=l$2.diffed)&&s(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l$2.__e(n,u,i);}}function z$1(n,u){l$2.__c&&l$2.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$2.__e(n,u.__v);}});}function L$1(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1;}if(null===d)y===p||c&&l.data===p||(l.data=p);else {if(r=r&&n$1.call(l.childNodes),a=(y=i.props||e$3).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""));}if(C$1(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w$2(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k$2(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h$1(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_)&&H$1(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H$1(l,"checked",_,y.checked,!1));}return l}function M$1(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l$2.__e(n,i);}}function N$1(n,u,i){var t,o;if(l$2.unmount&&l$2.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M$1(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l$2.__e(n,u);}t.base=t.__P=null;}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N$1(t[o],u,"function"!=typeof n.type);i||null==n.__e||h$1(n.__e),n.__e=n.__d=void 0;}function O$1(n,l,u){return this.constructor(n,u)}function S$1(u,i,t){var o,r,f;l$2.__&&l$2.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j$2(i,u=(!o&&t||i).__k=v$1(d$1,null,[u]),r||e$3,e$3,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n$1.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z$1(f,u);}function q$1(n,l){S$1(n,l,q$1);}function B$1(l,u,i){var t,o,r,f=a$2({},l.props);for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n$1.call(arguments,2):i),y$1(l.type,f,t||l.key,o||l.ref,null)}function D$1(n,l){var u={__c:l="__cC"+f$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(m$1);},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n$1=c$1.slice,l$2={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n}},u$1=0,_$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a$2({},this.state),"function"==typeof n&&(n=n(a$2({},u),this.props)),n&&a$2(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m$1(this));},_$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m$1(this));},_$1.prototype.render=d$1,t$1=[],o$3="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g$2.__r=0,f$1=0;

  var t,u,r,o$2=0,i$1=[],c=l$2.__b,f=l$2.__r,e$2=l$2.diffed,a$1=l$2.__c,v=l$2.unmount;function m(t,r){l$2.__h&&l$2.__h(u,t,o$2||r),o$2=0;var i=u.__H||(u.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({}),i.__[t]}function l$1(n){return o$2=1,p$1(w$1,n)}function p$1(n,r,o){var i=m(t++,2);return i.t=n,i.__c||(i.__=[o?o(r):w$1(void 0,r),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}));}],i.__c=u),i.__}function y(r,o){var i=m(t++,3);!l$2.__s&&k$1(i.__H,o)&&(i.__=r,i.__H=o,u.__H.__h.push(i));}function h(r,o){var i=m(t++,4);!l$2.__s&&k$1(i.__H,o)&&(i.__=r,i.__H=o,u.__h.push(i));}function s(n){return o$2=5,d(function(){return {current:n}},[])}function _(n,t,u){o$2=6,h(function(){"function"==typeof n?n(t()):n&&(n.current=t());},null==u?u:u.concat(n));}function d(n,u){var r=m(t++,7);return k$1(r.__H,u)&&(r.__=n(),r.__H=u,r.__h=n),r.__}function A$1(n,t){return o$2=8,d(function(){return n},t)}function F$1(n){var r=u.context[n.__c],o=m(t++,9);return o.c=n,r?(null==o.__&&(o.__=!0,r.sub(u)),r.props.value):n.__}function T$1(t,u){l$2.useDebugValue&&l$2.useDebugValue(u?u(t):t);}function x$1(){i$1.forEach(function(t){if(t.__P)try{t.__H.__h.forEach(g$1),t.__H.__h.forEach(j$1),t.__H.__h=[];}catch(u){t.__H.__h=[],l$2.__e(u,t.__v);}}),i$1=[];}l$2.__b=function(n){u=null,c&&c(n);},l$2.__r=function(n){f&&f(n),t=0;var r=(u=n.__c).__H;r&&(r.__h.forEach(g$1),r.__h.forEach(j$1),r.__h=[]);},l$2.diffed=function(t){e$2&&e$2(t);var o=t.__c;o&&o.__H&&o.__H.__h.length&&(1!==i$1.push(o)&&r===l$2.requestAnimationFrame||((r=l$2.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),b&&cancelAnimationFrame(t),setTimeout(n);},r=setTimeout(u,100);b&&(t=requestAnimationFrame(u));})(x$1)),u=void 0;},l$2.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g$1),t.__h=t.__h.filter(function(n){return !n.__||j$1(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],l$2.__e(r,t.__v);}}),a$1&&a$1(t,u);},l$2.unmount=function(t){v&&v(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g$1);}catch(t){l$2.__e(t,u.__v);}};var b="function"==typeof requestAnimationFrame;function g$1(n){var t=u;"function"==typeof n.__c&&n.__c(),u=t;}function j$1(n){var t=u;n.__c=n.__(),u=t;}function k$1(n,t){return !n||n.length!==t.length||t.some(function(t,u){return t!==n[u]})}function w$1(n,t){return "function"==typeof t?t(n):t}

  var o$1=0;function e$1(_,e,n,t,f){var l,s,u={};for(s in e)"ref"==s?l=e[s]:u[s]=e[s];var a={type:_,props:u,key:n,ref:l,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--o$1,__source:t,__self:f};if("function"==typeof _&&(l=_.defaultProps))for(s in l)void 0===u[s]&&(u[s]=l[s]);return l$2.vnode&&l$2.vnode(a),a}

  function S(n,t){for(var e in t)n[e]=t[e];return n}function C(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function E(n){this.props=n;}function g(n,t){function e(n){var e=this.props.ref,r=e==n.ref;return !r&&e&&(e.call?e(null):e.current=null),t?!t(this.props,n)||!r:C(this.props,n)}function r(t){return this.shouldComponentUpdate=e,v$1(n,t)}return r.displayName="Memo("+(n.displayName||n.name)+")",r.prototype.isReactComponent=!0,r.__f=!0,r}(E.prototype=new _$1).isPureReactComponent=!0,E.prototype.shouldComponentUpdate=function(n,t){return C(this.props,n)||C(this.state,t)};var w=l$2.__b;l$2.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),w&&w(n);};var R="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function x(n){function t(t,e){var r=S({},t);return delete r.ref,n(r,(e=t.ref||e)&&("object"!=typeof e||"current"in e)?e:null)}return t.$$typeof=R,t.render=t,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var N=function(n,t){return null==n?null:A$2(A$2(n).map(t))},k={map:N,forEach:N,count:function(n){return n?A$2(n).length:0},only:function(n){var t=A$2(n);if(1!==t.length)throw "Children.only";return t[0]},toArray:A$2},A=l$2.__e;l$2.__e=function(n,t,e){if(n.then)for(var r,u=t;u=u.__;)if((r=u.__c)&&r.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),r.__c(n,t);A(n,t,e);};var O=l$2.unmount;function L(){this.__u=0,this.t=null,this.__b=null;}function U(n){var t=n.__.__c;return t&&t.__e&&t.__e(n)}function F(n){var t,e,r;function u(u){if(t||(t=n()).then(function(n){e=n.default||n;},function(n){r=n;}),r)throw r;if(!e)throw t;return v$1(e,u)}return u.displayName="Lazy",u.__f=!0,u}function M(){this.u=null,this.o=null;}l$2.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&!0===n.__h&&(n.type=null),O&&O(n);},(L.prototype=new _$1).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=U(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(l):l());};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__e){var n=r.state.__e;r.__v.__k[0]=function n(t,e,r){return t&&(t.__v=null,t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)}),t.__c&&t.__c.__P===e&&(t.__e&&r.insertBefore(t.__e,t.__d),t.__c.__e=!0,t.__c.__P=r)),t}(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__e:r.__b=null});t=r.t.pop();)t.forceUpdate();}},f=!0===t.__h;r.__u++||f||r.setState({__e:r.__b=r.__v.__k[0]}),n.then(i,i);},L.prototype.componentWillUnmount=function(){this.t=[];},L.prototype.render=function(n,t){if(this.__b){if(this.__v.__k){var e=document.createElement("div"),r=this.__v.__k[0].__c;this.__v.__k[0]=function n(t,e,r){return t&&(t.__c&&t.__c.__H&&(t.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),t.__c.__H=null),null!=(t=S({},t)).__c&&(t.__c.__P===r&&(t.__c.__P=e),t.__c=null),t.__k=t.__k&&t.__k.map(function(t){return n(t,e,r)})),t}(this.__b,e,r.__O=r.__P);}this.__b=null;}var u=t.__e&&v$1(d$1,null,n.fallback);return u&&(u.__h=null),[v$1(d$1,null,t.__e?null:n.children),u]};var T=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};function D(n){return this.getChildContext=function(){return n.context},n.children}function I(n){var t=this,e=n.i;t.componentWillUnmount=function(){S$1(null,t.l),t.l=null,t.i=null;},t.i&&t.i!==e&&t.componentWillUnmount(),n.__v?(t.l||(t.i=e,t.l={nodeType:1,parentNode:e,childNodes:[],appendChild:function(n){this.childNodes.push(n),t.i.appendChild(n);},insertBefore:function(n,e){this.childNodes.push(n),t.i.appendChild(n);},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),t.i.removeChild(n);}}),S$1(v$1(D,{context:t.context},n.__v),t.l)):t.l&&t.componentWillUnmount();}function W(n,t){return v$1(I,{__v:n,i:t})}(M.prototype=new _$1).__e=function(n){var t=this,e=U(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),T(t,n,r)):u();};e?e(o):o();}},M.prototype.render=function(n){this.u=null,this.o=new Map;var t=A$2(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},M.prototype.componentDidUpdate=M.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){T(n,e,t);});};var j="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,P=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,V=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/i:/fil|che|ra/i).test(n)};function z(n,t,e){return null==t.__k&&(t.textContent=""),S$1(n,t),"function"==typeof e&&e(),n?n.__c:null}function B(n,t,e){return q$1(n,t),"function"==typeof e&&e(),n?n.__c:null}_$1.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(n){Object.defineProperty(_$1.prototype,n,{configurable:!0,get:function(){return this["UNSAFE_"+n]},set:function(t){Object.defineProperty(this,n,{configurable:!0,writable:!0,value:t});}});});var H=l$2.event;function Z(){}function Y(){return this.cancelBubble}function $(){return this.defaultPrevented}l$2.event=function(n){return H&&(n=H(n)),n.persist=Z,n.isPropagationStopped=Y,n.isDefaultPrevented=$,n.nativeEvent=n};var q,G={configurable:!0,get:function(){return this.class}},J=l$2.vnode;l$2.vnode=function(n){var t=n.type,e=n.props,r=e;if("string"==typeof t){for(var u in r={},e){var o=e[u];"value"===u&&"defaultValue"in e&&null==o||("defaultValue"===u&&"value"in e&&null==e.value?u="value":"download"===u&&!0===o?o="":/ondoubleclick/i.test(u)?u="ondblclick":/^onchange(textarea|input)/i.test(u+t)&&!V(e.type)?u="oninput":/^on(Ani|Tra|Tou|BeforeInp)/.test(u)?u=u.toLowerCase():P.test(u)?u=u.replace(/[A-Z0-9]/,"-$&").toLowerCase():null===o&&(o=void 0),r[u]=o);}"select"==t&&r.multiple&&Array.isArray(r.value)&&(r.value=A$2(e.children).forEach(function(n){n.props.selected=-1!=r.value.indexOf(n.props.value);})),"select"==t&&null!=r.defaultValue&&(r.value=A$2(e.children).forEach(function(n){n.props.selected=r.multiple?-1!=r.defaultValue.indexOf(n.props.value):r.defaultValue==n.props.value;})),n.props=r;}t&&e.class!=e.className&&(G.enumerable="className"in e,null!=e.className&&(r.class=e.className),Object.defineProperty(r,"className",G)),n.$$typeof=j,J&&J(n);};var K=l$2.__r;l$2.__r=function(n){K&&K(n),q=n.__c;};var Q={ReactCurrentDispatcher:{current:{readContext:function(n){return q.__n[n.__c].props.value}}}};function nn(n){return v$1.bind(null,n)}function tn(n){return !!n&&n.$$typeof===j}function en(n){return tn(n)?B$1.apply(null,arguments):n}function rn(n){return !!n.__k&&(S$1(null,n),!0)}function un(n){return n&&(n.base||1===n.nodeType&&n)||null}var on=function(n,t){return n(t)},ln=function(n,t){return n(t)};var React = {useState:l$1,useReducer:p$1,useEffect:y,useLayoutEffect:h,useRef:s,useImperativeHandle:_,useMemo:d,useCallback:A$1,useContext:F$1,useDebugValue:T$1,version:"17.0.2",Children:k,render:z,hydrate:B,unmountComponentAtNode:rn,createPortal:W,createElement:v$1,createContext:D$1,createFactory:nn,cloneElement:en,createRef:p$2,Fragment:d$1,isValidElement:tn,findDOMNode:un,Component:_$1,PureComponent:E,memo:g,forwardRef:x,flushSync:ln,unstable_batchedUpdates:on,StrictMode:d$1,Suspense:L,SuspenseList:M,lazy:F,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:Q};

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var classnames$1 = {exports: {}};

  /*!
    Copyright (c) 2018 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  */

  (function (module) {
  /* global define */

  (function () {

  	var hasOwn = {}.hasOwnProperty;

  	function classNames() {
  		var classes = [];

  		for (var i = 0; i < arguments.length; i++) {
  			var arg = arguments[i];
  			if (!arg) continue;

  			var argType = typeof arg;

  			if (argType === 'string' || argType === 'number') {
  				classes.push(arg);
  			} else if (Array.isArray(arg)) {
  				if (arg.length) {
  					var inner = classNames.apply(null, arg);
  					if (inner) {
  						classes.push(inner);
  					}
  				}
  			} else if (argType === 'object') {
  				if (arg.toString === Object.prototype.toString) {
  					for (var key in arg) {
  						if (hasOwn.call(arg, key) && arg[key]) {
  							classes.push(key);
  						}
  					}
  				} else {
  					classes.push(arg.toString());
  				}
  			}
  		}

  		return classes.join(' ');
  	}

  	if (module.exports) {
  		classNames.default = classNames;
  		module.exports = classNames;
  	} else {
  		window.classNames = classNames;
  	}
  }());
  }(classnames$1));

  var classnames = classnames$1.exports;

  var e,o={};function n(r,t,e){if(3===r.nodeType){var o="textContent"in r?r.textContent:r.nodeValue||"";if(!1!==n.options.trim){var a=0===t||t===e.length-1;if((!(o=o.match(/^[\s\n]+$/g)&&"all"!==n.options.trim?" ":o.replace(/(^[\s\n]+|[\s\n]+$)/g,"all"===n.options.trim||a?"":" "))||" "===o)&&e.length>1&&a)return null}return o}if(1!==r.nodeType)return null;var p=String(r.nodeName).toLowerCase();if("script"===p&&!n.options.allowScripts)return null;var l,s,u=n.h(p,function(r){var t=r&&r.length;if(!t)return null;for(var e={},o=0;o<t;o++){var a=r[o],i=a.name,p=a.value;"on"===i.substring(0,2)&&n.options.allowEvents&&(p=new Function(p)),e[i]=p;}return e}(r.attributes),(s=(l=r.childNodes)&&Array.prototype.map.call(l,n).filter(i))&&s.length?s:null);return n.visitor&&n.visitor(u),u}var a,i=function(r){return r},p={};function l(r){var t=(r.type||"").toLowerCase(),e=l.map;e&&e.hasOwnProperty(t)?(r.type=e[t],r.props=Object.keys(r.props||{}).reduce(function(t,e){var o;return t[(o=e,o.replace(/-(.)/g,function(r,t){return t.toUpperCase()}))]=r.props[e],t},{})):r.type=t.replace(/[^a-z0-9-]/i,"");}var Markup = (function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i,i.setReviver=function(r){a=r;},i.prototype.shouldComponentUpdate=function(r){var t=this.props;return r.wrap!==t.wrap||r.type!==t.type||r.markup!==t.markup},i.prototype.setComponents=function(r){if(this.map={},r)for(var t in r)if(r.hasOwnProperty(t)){var e=t.replace(/([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,"$1$3-$2$4").toLowerCase();this.map[e]=r[t];}},i.prototype.render=function(t){var i=t.wrap;void 0===i&&(i=!0);var s,u=t.type,c=t.markup,m=t.components,v=t.reviver,f=t.onError,d=t["allow-scripts"],h=t["allow-events"],y=t.trim,w=function(r,t){var e={};for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&-1===t.indexOf(o)&&(e[o]=r[o]);return e}(t,["wrap","type","markup","components","reviver","onError","allow-scripts","allow-events","trim"]),C=v||this.reviver||this.constructor.prototype.reviver||a||v$1;this.setComponents(m);var g={allowScripts:d,allowEvents:h,trim:y};try{s=function(r,t,a,i,s){var u=function(r,t){var o,n,a,i,p="html"===t?"text/html":"application/xml";"html"===t?(i="body",a="<!DOCTYPE html>\n<html><body>"+r+"</body></html>"):(i="xml",a='<?xml version="1.0" encoding="UTF-8"?>\n<xml>'+r+"</xml>");try{o=(new DOMParser).parseFromString(a,p);}catch(r){n=r;}if(o||"html"!==t||((o=e||(e=function(){if(document.implementation&&document.implementation.createHTMLDocument)return document.implementation.createHTMLDocument("");var r=document.createElement("iframe");return r.style.cssText="position:absolute; left:0; top:-999em; width:1px; height:1px; overflow:hidden;",r.setAttribute("sandbox","allow-forms"),document.body.appendChild(r),r.contentWindow.document}())).open(),o.write(a),o.close()),o){var l=o.getElementsByTagName(i)[0],s=l.firstChild;return r&&!s&&(l.error="Document parse failed."),s&&"parsererror"===String(s.nodeName).toLowerCase()&&(s.removeChild(s.firstChild),s.removeChild(s.lastChild),l.error=s.textContent||s.nodeValue||n||"Unknown error",l.removeChild(s)),l}}(r,t);if(u&&u.error)throw new Error(u.error);var c=u&&u.body||u;l.map=i||p;var m=c&&function(r,t,e,a){return n.visitor=t,n.h=e,n.options=a||o,n(r)}(c,l,a,s);return l.map=null,m&&m.props&&m.props.children||null}(c,u,C,this.map,g);}catch(r){f?f({error:r}):"undefined"!=typeof console&&console.error&&console.error("preact-markup: "+r);}if(!1===i)return s||null;var x=w.hasOwnProperty("className")?"className":"class",b=w[x];return b?b.splice?b.splice(0,0,"markup"):"string"==typeof b?w[x]+=" markup":"object"==typeof b&&(b.markup=!0):w[x]="markup",C("div",w,s||null)},i}(_$1));

  var CLASS_PATTERN = /^class /;

  function isClass(fn) {
    return CLASS_PATTERN.test(fn.toString());
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function annotate() {
    var args = Array.prototype.slice.call(arguments);

    if (args.length === 1 && isArray(args[0])) {
      args = args[0];
    }

    var fn = args.pop();

    fn.$inject = args;

    return fn;
  }


  // Current limitations:
  // - can't put into "function arg" comments
  // function /* (no parenthesis like this) */ (){}
  // function abc( /* xx (no parenthesis like this) */ a, b) {}
  //
  // Just put the comment before function or inside:
  // /* (((this is fine))) */ function(a, b) {}
  // function abc(a) { /* (((this is fine))) */}
  //
  // - can't reliably auto-annotate constructor; we'll match the
  // first constructor(...) pattern found which may be the one
  // of a nested class, too.

  var CONSTRUCTOR_ARGS = /constructor\s*[^(]*\(\s*([^)]*)\)/m;
  var FN_ARGS = /^(?:async )?(?:function\s*)?[^(]*\(\s*([^)]*)\)/m;
  var FN_ARG = /\/\*([^*]*)\*\//m;

  function parseAnnotations(fn) {

    if (typeof fn !== 'function') {
      throw new Error('Cannot annotate "' + fn + '". Expected a function!');
    }

    var match = fn.toString().match(isClass(fn) ? CONSTRUCTOR_ARGS : FN_ARGS);

    // may parse class without constructor
    if (!match) {
      return [];
    }

    return match[1] && match[1].split(',').map(function(arg) {
      match = arg.match(FN_ARG);
      return match ? match[1].trim() : arg.trim();
    }) || [];
  }

  function Module() {
    var providers = [];

    this.factory = function(name, factory) {
      providers.push([name, 'factory', factory]);
      return this;
    };

    this.value = function(name, value) {
      providers.push([name, 'value', value]);
      return this;
    };

    this.type = function(name, type) {
      providers.push([name, 'type', type]);
      return this;
    };

    this.forEach = function(iterator) {
      providers.forEach(iterator);
    };

  }

  function Injector(modules, parent) {
    parent = parent || {
      get: function(name, strict) {
        currentlyResolving.push(name);

        if (strict === false) {
          return null;
        } else {
          throw error('No provider for "' + name + '"!');
        }
      }
    };

    var currentlyResolving = [];
    var providers = this._providers = Object.create(parent._providers || null);
    var instances = this._instances = Object.create(null);

    var self = instances.injector = this;

    var error = function(msg) {
      var stack = currentlyResolving.join(' -> ');
      currentlyResolving.length = 0;
      return new Error(stack ? msg + ' (Resolving: ' + stack + ')' : msg);
    };

    /**
     * Return a named service.
     *
     * @param {String} name
     * @param {Boolean} [strict=true] if false, resolve missing services to null
     *
     * @return {Object}
     */
    var get = function(name, strict) {
      if (!providers[name] && name.indexOf('.') !== -1) {
        var parts = name.split('.');
        var pivot = get(parts.shift());

        while (parts.length) {
          pivot = pivot[parts.shift()];
        }

        return pivot;
      }

      if (hasOwnProp(instances, name)) {
        return instances[name];
      }

      if (hasOwnProp(providers, name)) {
        if (currentlyResolving.indexOf(name) !== -1) {
          currentlyResolving.push(name);
          throw error('Cannot resolve circular dependency!');
        }

        currentlyResolving.push(name);
        instances[name] = providers[name][0](providers[name][1]);
        currentlyResolving.pop();

        return instances[name];
      }

      return parent.get(name, strict);
    };

    var fnDef = function(fn, locals) {

      if (typeof locals === 'undefined') {
        locals = {};
      }

      if (typeof fn !== 'function') {
        if (isArray(fn)) {
          fn = annotate(fn.slice());
        } else {
          throw new Error('Cannot invoke "' + fn + '". Expected a function!');
        }
      }

      var inject = fn.$inject || parseAnnotations(fn);
      var dependencies = inject.map(function(dep) {
        if (hasOwnProp(locals, dep)) {
          return locals[dep];
        } else {
          return get(dep);
        }
      });

      return {
        fn: fn,
        dependencies: dependencies
      };
    };

    var instantiate = function(Type) {
      var def = fnDef(Type);

      var fn = def.fn,
          dependencies = def.dependencies;

      // instantiate var args constructor
      var Constructor = Function.prototype.bind.apply(fn, [ null ].concat(dependencies));

      return new Constructor();
    };

    var invoke = function(func, context, locals) {
      var def = fnDef(func, locals);

      var fn = def.fn,
          dependencies = def.dependencies;

      return fn.apply(context, dependencies);
    };


    var createPrivateInjectorFactory = function(privateChildInjector) {
      return annotate(function(key) {
        return privateChildInjector.get(key);
      });
    };

    var createChild = function(modules, forceNewInstances) {
      if (forceNewInstances && forceNewInstances.length) {
        var fromParentModule = Object.create(null);
        var matchedScopes = Object.create(null);

        var privateInjectorsCache = [];
        var privateChildInjectors = [];
        var privateChildFactories = [];

        var provider;
        var cacheIdx;
        var privateChildInjector;
        var privateChildInjectorFactory;
        for (var name in providers) {
          provider = providers[name];

          if (forceNewInstances.indexOf(name) !== -1) {
            if (provider[2] === 'private') {
              cacheIdx = privateInjectorsCache.indexOf(provider[3]);
              if (cacheIdx === -1) {
                privateChildInjector = provider[3].createChild([], forceNewInstances);
                privateChildInjectorFactory = createPrivateInjectorFactory(privateChildInjector);
                privateInjectorsCache.push(provider[3]);
                privateChildInjectors.push(privateChildInjector);
                privateChildFactories.push(privateChildInjectorFactory);
                fromParentModule[name] = [privateChildInjectorFactory, name, 'private', privateChildInjector];
              } else {
                fromParentModule[name] = [privateChildFactories[cacheIdx], name, 'private', privateChildInjectors[cacheIdx]];
              }
            } else {
              fromParentModule[name] = [provider[2], provider[1]];
            }
            matchedScopes[name] = true;
          }

          if ((provider[2] === 'factory' || provider[2] === 'type') && provider[1].$scope) {
            /* jshint -W083 */
            forceNewInstances.forEach(function(scope) {
              if (provider[1].$scope.indexOf(scope) !== -1) {
                fromParentModule[name] = [provider[2], provider[1]];
                matchedScopes[scope] = true;
              }
            });
          }
        }

        forceNewInstances.forEach(function(scope) {
          if (!matchedScopes[scope]) {
            throw new Error('No provider for "' + scope + '". Cannot use provider from the parent!');
          }
        });

        modules.unshift(fromParentModule);
      }

      return new Injector(modules, self);
    };

    var factoryMap = {
      factory: invoke,
      type: instantiate,
      value: function(value) {
        return value;
      }
    };

    modules.forEach(function(module) {

      function arrayUnwrap(type, value) {
        if (type !== 'value' && isArray(value)) {
          value = annotate(value.slice());
        }

        return value;
      }

      // TODO(vojta): handle wrong inputs (modules)
      if (module instanceof Module) {
        module.forEach(function(provider) {
          var name = provider[0];
          var type = provider[1];
          var value = provider[2];

          providers[name] = [factoryMap[type], arrayUnwrap(type, value), type];
        });
      } else if (typeof module === 'object') {
        if (module.__exports__) {
          var clonedModule = Object.keys(module).reduce(function(m, key) {
            if (key.substring(0, 2) !== '__') {
              m[key] = module[key];
            }
            return m;
          }, Object.create(null));

          var privateInjector = new Injector((module.__modules__ || []).concat([clonedModule]), self);
          var getFromPrivateInjector = annotate(function(key) {
            return privateInjector.get(key);
          });
          module.__exports__.forEach(function(key) {
            providers[key] = [getFromPrivateInjector, key, 'private', privateInjector];
          });
        } else {
          Object.keys(module).forEach(function(name) {
            if (module[name][2] === 'private') {
              providers[name] = module[name];
              return;
            }

            var type = module[name][0];
            var value = module[name][1];

            providers[name] = [factoryMap[type], arrayUnwrap(type, value), type];
          });
        }
      }
    });

    // public API
    this.get = get;
    this.invoke = invoke;
    this.instantiate = instantiate;
    this.createChild = createChild;
  }

  class FormFieldRegistry$1 {
    constructor(eventBus) {
      this._eventBus = eventBus;
      this._formFields = {};
      eventBus.on('form.clear', () => this.clear());
      this._ids = new Ids([32, 36, 1]);
      this._keys = new Ids([32, 36, 1]);
    }

    add(formField) {
      const {
        id
      } = formField;

      if (this._formFields[id]) {
        throw new Error(`form field with ID ${id} already exists`);
      }

      this._eventBus.fire('formField.add', {
        formField
      });

      this._formFields[id] = formField;
    }

    remove(formField) {
      const {
        id
      } = formField;

      if (!this._formFields[id]) {
        return;
      }

      this._eventBus.fire('formField.remove', {
        formField
      });

      delete this._formFields[id];
    }

    get(id) {
      return this._formFields[id];
    }

    getAll() {
      return Object.values(this._formFields);
    }

    forEach(callback) {
      this.getAll().forEach(formField => callback(formField));
    }

    clear() {
      this._formFields = {};

      this._ids.clear();

      this._keys.clear();
    }

  }
  FormFieldRegistry$1.$inject = ['eventBus'];

  function createInjector(bootstrapModules) {
    const modules = [],
          components = [];

    function hasModule(module) {
      return modules.includes(module);
    }

    function addModule(module) {
      modules.push(module);
    }

    function visit(module) {
      if (hasModule(module)) {
        return;
      }

      (module.__depends__ || []).forEach(visit);

      if (hasModule(module)) {
        return;
      }

      addModule(module);
      (module.__init__ || []).forEach(function (component) {
        components.push(component);
      });
    }

    bootstrapModules.forEach(visit);
    const injector = new Injector(modules);
    components.forEach(function (component) {
      try {
        injector[typeof component === 'string' ? 'get' : 'invoke'](component);
      } catch (err) {
        console.error('Failed to instantiate component');
        console.error(err.stack);
        throw err;
      }
    });
    return injector;
  }

  /**
   * @param {string?} prefix
   *
   * @returns Element
   */
  function createFormContainer(prefix = 'fjs') {
    const container = document.createElement('div');
    container.classList.add(`${prefix}-container`);
    return container;
  }

  function findErrors(errors, path) {
    return errors[pathStringify(path)];
  }
  function pathStringify(path) {
    if (!path) {
      return '';
    }

    return path.join('.');
  }
  /**
   * @template T
   * @param {T} data
   * @param {(this: any, key: string, value: any) => any} [replacer]
   * @return {T}
   */

  function clone(data, replacer) {
    return JSON.parse(JSON.stringify(data, replacer));
  }

  const NODE_TYPE_TEXT = 3,
        NODE_TYPE_ELEMENT = 1;
  const ALLOWED_NODES = ['h1', 'h2', 'h3', 'h4', 'h5', 'span', 'em', 'a', 'p', 'div', 'ul', 'ol', 'li', 'hr', 'blockquote', 'img', 'pre', 'code', 'br', 'strong'];
  const ALLOWED_ATTRIBUTES = ['align', 'alt', 'class', 'href', 'id', 'name', 'rel', 'target', 'src'];
  const ALLOWED_URI_PATTERN = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i; // eslint-disable-line no-useless-escape

  const ATTR_WHITESPACE_PATTERN = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g; // eslint-disable-line no-control-regex

  const FORM_ELEMENT = document.createElement('form');
  /**
   * Sanitize a HTML string and return the cleaned, safe version.
   *
   * @param {string} html
   * @return {string}
   */

  function sanitizeHTML(html) {
    const doc = new DOMParser().parseFromString(`<!DOCTYPE html>\n<html><body><div>${html}`, 'text/html');
    doc.normalize();
    const element = doc.body.firstChild;

    if (element) {
      sanitizeNode(
      /** @type Element */
      element);
      return new XMLSerializer().serializeToString(element);
    } else {
      // handle the case that document parsing
      // does not work at all, due to HTML gibberish
      return '';
    }
  }
  /**
   * Recursively sanitize a HTML node, potentially
   * removing it, its children or attributes.
   *
   * Inspired by https://github.com/developit/snarkdown/issues/70
   * and https://github.com/cure53/DOMPurify. Simplified
   * for our use-case.
   *
   * @param {Element} node
   */

  function sanitizeNode(node) {
    // allow text nodes
    if (node.nodeType === NODE_TYPE_TEXT) {
      return;
    } // disallow all other nodes but Element


    if (node.nodeType !== NODE_TYPE_ELEMENT) {
      return node.remove();
    }

    const lcTag = node.tagName.toLowerCase(); // disallow non-whitelisted tags

    if (!ALLOWED_NODES.includes(lcTag)) {
      return node.remove();
    }

    const attributes = node.attributes; // clean attributes

    for (let i = attributes.length; i--;) {
      const attribute = attributes[i];
      const name = attribute.name;
      const lcName = name.toLowerCase(); // normalize node value

      const value = attribute.value.trim();
      node.removeAttribute(name);
      const valid = isValidAttribute(lcTag, lcName, value);

      if (valid) {
        node.setAttribute(name, value);
      }
    } // force noopener on target="_blank" links


    if (lcTag === 'a' && node.getAttribute('target') === '_blank' && node.getAttribute('rel') !== 'noopener') {
      node.setAttribute('rel', 'noopener');
    }

    for (let i = node.childNodes.length; i--;) {
      sanitizeNode(
      /** @type Element */
      node.childNodes[i]);
    }
  }
  /**
   * Validates attributes for validity.
   *
   * @param {string} lcTag
   * @param {string} lcName
   * @param {string} value
   * @return {boolean}
   */


  function isValidAttribute(lcTag, lcName, value) {
    // disallow most attributes based on whitelist
    if (!ALLOWED_ATTRIBUTES.includes(lcName)) {
      return false;
    } // disallow "DOM clobbering" / polution of document and wrapping form elements


    if ((lcName === 'id' || lcName === 'name') && (value in document || value in FORM_ELEMENT)) {
      return false;
    }

    if (lcName === 'target' && value !== '_blank') {
      return false;
    } // allow valid url links only


    if (lcName === 'href' && !ALLOWED_URI_PATTERN.test(value.replace(ATTR_WHITESPACE_PATTERN, ''))) {
      return false;
    }

    return true;
  }

  const FormRenderContext = D$1({
    Empty: props => {
      return null;
    },
    Children: props => {
      return props.children;
    },
    Element: props => {
      return props.children;
    }
  });

  /**
   * @param {string} type
   * @param {boolean} [strict]
   *
   * @returns {any}
   */

  function getService$1(type, strict) {}

  const FormContext = D$1({
    getService: getService$1,
    formId: null
  });

  function useService$1 (type, strict) {
    const {
      getService
    } = F$1(FormContext);
    return getService(type, strict);
  }

  function getDataAsJson() {
    const form = useService$1('form');
    return JSON.stringify(form._getState().data);
  }
  function formFieldClassesCustom(type, hiddenFx, errors = []) {
    let dataStr = getDataAsJson();

    if (!type) {
      throw new Error('type required');
    }

    let hidden = false;

    try {
      hidden = Function("let data = " + dataStr + "; return " + hiddenFx).call();
    } catch (err) {
      hidden = false;
    }

    let fieldClass = hidden ? 'fjs-form-field hidden' : 'fjs-form-field';
    const classes = [fieldClass, `fjs-form-field-${type}`];

    if (errors.length) {
      classes.push('fjs-has-errors');
    }

    return classes.join(' ');
  }
  function prefixId(id, formId) {
    if (formId) {
      return `fjs-form-${formId}-${id}`;
    }

    return `fjs-form-${id}`;
  }
  function markdownToHTML(markdown) {
    const htmls = markdown.split(/(?:\r?\n){2,}/).map(line => /^((\d+.)|[><\s#-*])/.test(line) ? t$2(line) : `<p>${t$2(line)}</p>`);
    return htmls.join('\n\n');
  } // see https://github.com/developit/snarkdown/issues/70

  function safeMarkdown(markdown) {
    const html = markdownToHTML(markdown);
    return sanitizeHTML(html);
  }

  const type$b = 'button';
  function Button(props) {
    const {
      disabled,
      field
    } = props;
    const {
      action = 'submit',
      hiddenFx,
      targetApi,
      targetApiVerb
    } = field;
    return e$1("div", {
      class: formFieldClassesCustom(type$b, hiddenFx),
      children: e$1("button", {
        class: "fjs-button",
        type: action,
        disabled: disabled,
        children: field.label
      })
    });
  }

  Button.create = function (options = {}) {
    return {
      action: 'submit',
      ...options
    };
  };

  Button.type = type$b;
  Button.label = 'Button';
  Button.keyed = true;
  Button.hiddenFx = 'false';

  function Description$2(props) {
    const {
      description
    } = props;

    if (!description) {
      return null;
    }

    return e$1("div", {
      class: "fjs-form-field-description",
      children: description
    });
  }

  function Errors(props) {
    const {
      errors
    } = props;

    if (!errors.length) {
      return null;
    }

    return e$1("div", {
      class: "fjs-form-field-error",
      children: e$1("ul", {
        children: errors.map(error => {
          return e$1("li", {
            children: error
          });
        })
      })
    });
  }

  function Label$2(props) {
    const {
      id,
      label,
      required = false
    } = props;
    return e$1("label", {
      for: id,
      class: "fjs-form-field-label",
      children: [props.children, label || '', required && e$1("span", {
        class: "fjs-asterix",
        children: "*"
      })]
    });
  }

  const type$a = 'checkbox';
  function Checkbox$1(props) {
    const {
      disabled,
      errors = [],
      field,
      value = false
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx
    } = field;

    const onChange = ({
      target
    }) => {
      props.onChange({
        field,
        value: target.checked
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$a, hiddenFx, errors),
      children: [e$1(Label$2, {
        id: prefixId(id, formId),
        label: label,
        required: false,
        children: e$1("input", {
          checked: value,
          class: "fjs-input",
          disabled: disabled,
          id: prefixId(id, formId),
          type: "checkbox",
          onChange: onChange
        })
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Checkbox$1.create = function (options = {}) {
    return { ...options
    };
  };

  Checkbox$1.type = type$a;
  Checkbox$1.label = 'Checkbox';
  Checkbox$1.keyed = true;
  Checkbox$1.emptyValue = false;
  Checkbox$1.hiddenFx = 'false';

  const type$9 = 'checklist';
  function Checklist(props) {
    const {
      disabled,
      errors = [],
      field,
      value = []
    } = props;
    const {
      description,
      id,
      label,
      values,
      dataSource,
      hiddenFx
    } = field;
    const [myValues, myValuesSet] = l$1([]);
    const fetchMyAPI = A$1(async () => {
      if (dataSource && dataSource.length > 0) {
        let response = await fetch(dataSource);
        response = await response.json();
        myValuesSet(response);
      } else {
        myValuesSet(values);
      }
    }, [dataSource]); // if dataSource changes, useEffect will run again

    y(() => {
      fetchMyAPI();
    }, [fetchMyAPI]);

    const toggleCheckbox = v => {
      let newValue = [...value];

      if (!newValue.includes(v)) {
        newValue.push(v);
      } else {
        newValue = newValue.filter(x => x != v);
      }

      props.onChange({
        field,
        value: newValue
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$9, hiddenFx, errors),
      children: [e$1(Label$2, {
        label: label
      }), myValues.map((v, index) => {
        return e$1(Label$2, {
          id: prefixId(`${id}-${index}`, formId),
          label: v.label,
          required: false,
          children: e$1("input", {
            checked: value.includes(v.value),
            class: "fjs-input",
            disabled: disabled,
            id: prefixId(`${id}-${index}`, formId),
            type: "checkbox",
            onClick: () => toggleCheckbox(v.value)
          })
        }, `${id}-${index}`);
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Checklist.create = function (options = {}) {
    return {
      values: [{
        label: 'Value',
        value: 'value'
      }],
      ...options
    };
  };

  Checklist.type = type$9;
  Checklist.label = 'Checklist';
  Checklist.keyed = true;
  Checklist.emptyValue = [];
  Checklist.hiddenFx = 'false';

  const noop$1$1 = () => false;

  function FormField(props) {
    const {
      field,
      onChange
    } = props;
    const {
      _path
    } = field;
    const formFields = useService$1('formFields'),
          form = useService$1('form');

    const {
      data,
      errors,
      properties
    } = form._getState();

    const {
      Element
    } = F$1(FormRenderContext);
    const FormFieldComponent = formFields.get(field.type);

    if (!FormFieldComponent) {
      throw new Error(`cannot render field <${field.type}>`);
    }

    const value = get(data, _path);
    const fieldErrors = findErrors(errors, _path);
    const disabled = properties.readOnly || field.disabled || false;
    return e$1(Element, {
      field: field,
      children: e$1(FormFieldComponent, { ...props,
        disabled: disabled,
        errors: fieldErrors,
        onChange: disabled ? noop$1$1 : onChange,
        value: value
      })
    });
  }

  function Default(props) {
    const {
      Children,
      Empty
    } = F$1(FormRenderContext);
    const {
      field
    } = props;
    const {
      components = []
    } = field;
    return e$1(Children, {
      class: "fjs-vertical-layout",
      field: field,
      children: [components.map(childField => {
        return v$1(FormField, { ...props,
          key: childField.id,
          field: childField
        });
      }), components.length ? null : e$1(Empty, {})]
    });
  }

  Default.create = function (options = {}) {
    return {
      components: [],
      ...options
    };
  };

  Default.type = 'default';
  Default.keyed = false;

  /**
   * This file must not be changed or exchanged.
   *
   * @see http://bpmn.io/license for more information.
   */

  function Logo() {
    return e$1("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 14.02 5.57",
      width: "53",
      height: "21",
      style: "vertical-align:middle",
      children: [e$1("path", {
        fill: "currentColor",
        d: "M1.88.92v.14c0 .41-.13.68-.4.8.33.14.46.44.46.86v.33c0 .61-.33.95-.95.95H0V0h.95c.65 0 .93.3.93.92zM.63.57v1.06h.24c.24 0 .38-.1.38-.43V.98c0-.28-.1-.4-.32-.4zm0 1.63v1.22h.36c.2 0 .32-.1.32-.39v-.35c0-.37-.12-.48-.4-.48H.63zM4.18.99v.52c0 .64-.31.98-.94.98h-.3V4h-.62V0h.92c.63 0 .94.35.94.99zM2.94.57v1.35h.3c.2 0 .3-.09.3-.37v-.6c0-.29-.1-.38-.3-.38h-.3zm2.89 2.27L6.25 0h.88v4h-.6V1.12L6.1 3.99h-.6l-.46-2.82v2.82h-.55V0h.87zM8.14 1.1V4h-.56V0h.79L9 2.4V0h.56v4h-.64zm2.49 2.29v.6h-.6v-.6zM12.12 1c0-.63.33-1 .95-1 .61 0 .95.37.95 1v2.04c0 .64-.34 1-.95 1-.62 0-.95-.37-.95-1zm.62 2.08c0 .28.13.39.33.39s.32-.1.32-.4V.98c0-.29-.12-.4-.32-.4s-.33.11-.33.4z"
      }), e$1("path", {
        fill: "currentColor",
        d: "M0 4.53h14.02v1.04H0zM11.08 0h.63v.62h-.63zm.63 4V1h-.63v2.98z"
      })]
    });
  }

  function Lightbox(props) {
    const {
      open
    } = props;

    if (!open) {
      return null;
    }

    return e$1("div", {
      class: "fjs-powered-by-lightbox",
      style: "z-index: 100; position: fixed; top: 0; left: 0;right: 0; bottom: 0",
      children: [e$1("div", {
        class: "backdrop",
        style: "width: 100%; height: 100%; background: rgba(40 40 40 / 20%)",
        onClick: props.onBackdropClick
      }), e$1("div", {
        class: "notice",
        style: "position: absolute; left: 50%; top: 40%; transform: translate(-50%); width: 260px; padding: 10px; background: white; box-shadow: 0  1px 4px rgba(0 0 0 / 30%); font-family: Helvetica, Arial, sans-serif; font-size: 14px; display: flex; line-height: 1.3",
        children: [e$1("a", {
          href: "https://bpmn.io",
          target: "_blank",
          rel: "noopener",
          style: "margin: 15px 20px 15px 10px; align-self: center; color: #404040",
          children: e$1(Logo, {})
        }), e$1("span", {
          children: ["Web-based tooling for BPMN, DMN, and forms powered by ", e$1("a", {
            href: "https://bpmn.io",
            target: "_blank",
            rel: "noopener",
            children: "bpmn.io"
          }), "."]
        })]
      })]
    });
  }

  function Link(props) {
    return e$1("div", {
      class: "fjs-powered-by fjs-form-field",
      style: "text-align: right",
      children: e$1("a", {
        href: "https://bpmn.io",
        target: "_blank",
        rel: "noopener",
        class: "fjs-powered-by-link",
        title: "Powered by bpmn.io",
        style: "color: #404040",
        onClick: props.onClick,
        children: e$1(Logo, {})
      })
    });
  }

  function PoweredBy(props) {
    const [open, setOpen] = l$1(false);

    function toggleOpen(open) {
      return event => {
        event.preventDefault();
        setOpen(open);
      };
    }

    return e$1(d$1, {
      children: [W(e$1(Lightbox, {
        open: open,
        onBackdropClick: toggleOpen(false)
      }), document.body), e$1(Link, {
        onClick: toggleOpen(true)
      })]
    });
  }

  const noop$4 = () => {};

  function FormComponent(props) {
    const form = useService$1('form');

    const {
      schema
    } = form._getState();

    const {
      onSubmit = noop$4,
      onReset = noop$4,
      onChange = noop$4
    } = props;

    const handleSubmit = event => {
      event.preventDefault();
      onSubmit();
    };

    const handleReset = event => {
      event.preventDefault();
      onReset();
    };

    return e$1("form", {
      class: "fjs-form",
      onSubmit: handleSubmit,
      onReset: handleReset,
      children: [e$1(FormField, {
        field: schema,
        onChange: onChange
      }), e$1(PoweredBy, {})]
    });
  }

  const type$8 = 'number';
  function Number$1(props) {
    const {
      disabled,
      errors = [],
      field,
      value
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx,
      validate = {}
    } = field;
    const {
      required
    } = validate;

    const onChange = ({
      target
    }) => {
      const parsedValue = parseInt(target.value, 10);
      props.onChange({
        field,
        value: isNaN(parsedValue) ? null : parsedValue
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$8, hiddenFx, errors),
      children: [e$1(Label$2, {
        id: prefixId(id, formId),
        label: label,
        required: required
      }), e$1("input", {
        class: "fjs-input",
        disabled: disabled,
        id: prefixId(id, formId),
        onInput: onChange,
        type: "number",
        value: value || ''
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Number$1.create = function (options = {}) {
    return { ...options
    };
  };

  Number$1.type = type$8;
  Number$1.keyed = true;
  Number$1.label = 'Number';
  Number$1.emptyValue = null;
  Number$1.hiddenFx = 'false';

  const type$7 = 'radio';
  function Radio(props) {
    const {
      disabled,
      errors = [],
      field,
      value
    } = props;
    const {
      description,
      id,
      label,
      validate = {},
      values,
      hiddenFx
    } = field;
    const {
      required
    } = validate;

    const onChange = v => {
      props.onChange({
        field,
        value: v
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$7, hiddenFx, errors),
      children: [e$1(Label$2, {
        label: label,
        required: required
      }), values.map((v, index) => {
        return e$1(Label$2, {
          id: prefixId(`${id}-${index}`, formId),
          label: v.label,
          required: false,
          children: e$1("input", {
            checked: v.value === value,
            class: "fjs-input",
            disabled: disabled,
            id: prefixId(`${id}-${index}`, formId),
            type: "radio",
            onClick: () => onChange(v.value)
          })
        }, `${id}-${index}`);
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Radio.create = function (options = {}) {
    return {
      values: [{
        label: 'Value',
        value: 'value'
      }],
      ...options
    };
  };

  Radio.type = type$7;
  Radio.label = 'Radio';
  Radio.keyed = true;
  Radio.emptyValue = null;
  Radio.hiddenFx = 'false';

  const type$6 = 'select';
  function Select$1(props) {
    const {
      disabled,
      errors = [],
      field,
      value
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx,
      validate = {},
      dataSource,
      values
    } = field;
    const {
      required
    } = validate;
    const [myValues, myValuesSet] = l$1([]);
    let dataFormStr = getDataAsJson();
    const fetchMyAPI = A$1(async () => {
      if (dataSource && dataSource.length > 0) {
        let computedDs = dataSource;

        if (dataSource.includes('${data')) {
          try {
            let transform = '"' + dataSource.replace('${', '"+').replace('}', '+"') + '"';
            computedDs = Function("let data = " + dataFormStr + "; return " + transform + ";").call();
          } catch (err) {
            console.log(err);
          }
        }

        try {
          let response = await fetch(computedDs);
          response = await response.json();
          myValuesSet(response);
        } catch (err) {
          myValuesSet(values);
        }
      } else {
        myValuesSet(values);
      }
    }, [dataSource]); // if dataSource changes, useEffect will run again

    y(() => {
      fetchMyAPI();
    }, [fetchMyAPI]);

    const onChange = ({
      target
    }) => {
      props.onChange({
        field,
        value: target.value === '' ? null : target.value
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$6, hiddenFx, errors),
      children: [e$1(Label$2, {
        id: prefixId(id, formId),
        label: label,
        required: required
      }), e$1("select", {
        class: "fjs-select",
        disabled: disabled,
        id: prefixId(id, formId),
        onChange: onChange,
        value: value || '',
        children: [e$1("option", {
          value: ""
        }), myValues.map((v, index) => {
          return e$1("option", {
            value: v.value,
            children: v.label
          }, `${id}-${index}`);
        })]
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Select$1.create = function (options = {}) {
    return {
      values: [{
        label: 'Value',
        value: 'value'
      }],
      ...options
    };
  };

  Select$1.type = type$6;
  Select$1.label = 'Select';
  Select$1.keyed = true;
  Select$1.emptyValue = null;
  Select$1.hiddenFx = 'false';

  function _extends$f() { _extends$f = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }
  var CloseIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$f({
    width: "16",
    height: "16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 4.7l-.7-.7L8 7.3 4.7 4l-.7.7L7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8 12 4.7z",
    fill: "#000"
  })));

  function useKeyDownAction(targetKey, action, listenerElement = window) {
    function downHandler({
      key
    }) {
      if (key === targetKey) {
        action();
      }
    }

    y(() => {
      listenerElement.addEventListener('keydown', downHandler);
      return () => {
        listenerElement.removeEventListener('keydown', downHandler);
      };
    });
  }

  const DEFAULT_LABEL_GETTER = value => value;

  const NOOP = () => {};

  function DropdownList(props) {
    const {
      keyEventsListener = window,
      values = [],
      getLabel = DEFAULT_LABEL_GETTER,
      onValueSelected = NOOP,
      height = 235,
      emptyListMessage = 'No results'
    } = props;
    const [mouseControl, setMouseControl] = l$1(true);
    const [focusedValueIndex, setFocusedValueIndex] = l$1(0);
    const dropdownContainer = s();
    const mouseScreenPos = s();
    const focusedItem = d(() => values.length ? values[focusedValueIndex] : null, [focusedValueIndex, values]);
    const changeFocusedValueIndex = A$1(delta => {
      setFocusedValueIndex(x => Math.min(Math.max(0, x + delta), values.length - 1));
    }, [values.length]);
    y(() => {
      if (focusedValueIndex === 0) return;

      if (!focusedValueIndex || !values.length) {
        setFocusedValueIndex(0);
      } else if (focusedValueIndex >= values.length) {
        setFocusedValueIndex(values.length - 1);
      }
    }, [focusedValueIndex, values.length]);
    useKeyDownAction('ArrowUp', () => {
      if (values.length) {
        changeFocusedValueIndex(-1);
        setMouseControl(false);
      }
    }, keyEventsListener);
    useKeyDownAction('ArrowDown', () => {
      if (values.length) {
        changeFocusedValueIndex(1);
        setMouseControl(false);
      }
    }, keyEventsListener);
    useKeyDownAction('Enter', () => {
      if (focusedItem) {
        onValueSelected(focusedItem);
      }
    }, keyEventsListener);
    y(() => {
      const individualEntries = dropdownContainer.current.children;

      if (individualEntries.length && !mouseControl) {
        individualEntries[focusedValueIndex].scrollIntoView({
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, [focusedValueIndex, mouseControl]);

    const mouseMove = (e, i) => {
      const userMoved = !mouseScreenPos.current || mouseScreenPos.current.x !== e.screenX && mouseScreenPos.current.y !== e.screenY;

      if (userMoved) {
        mouseScreenPos.current = {
          x: e.screenX,
          y: e.screenY
        };

        if (!mouseControl) {
          setMouseControl(true);
          setFocusedValueIndex(i);
        }
      }
    };

    return e$1("div", {
      ref: dropdownContainer,
      tabIndex: -1,
      class: "fjs-dropdownlist",
      style: {
        maxHeight: height
      },
      children: [!!values.length && values.map((v, i) => {
        return e$1("div", {
          class: 'fjs-dropdownlist-item' + (focusedValueIndex === i ? ' focused' : ''),
          onMouseMove: e => mouseMove(e, i),
          onMouseEnter: mouseControl ? () => setFocusedValueIndex(i) : undefined,
          onMouseDown: e => {
            e.preventDefault();
            onValueSelected(v);
          },
          children: getLabel(v)
        });
      }), !values.length && e$1("div", {
        class: "fjs-dropdownlist-empty",
        children: emptyListMessage
      })]
    });
  }

  const type$5 = 'taglist';
  function Taglist(props) {
    const {
      disabled,
      errors = [],
      field,
      value: values = []
    } = props;
    const {
      description,
      id,
      label,
      dataSource,
      values: options,
      hiddenFx
    } = field;
    const {
      formId
    } = F$1(FormContext);
    const [filter, setFilter] = l$1('');
    const [selectedValues, setSelectedValues] = l$1([]);
    const [filteredValues, setFilteredValues] = l$1([]);
    const [isDropdownExpanded, setIsDropdownExpanded] = l$1(false);
    const [hasValuesLeft, setHasValuesLeft] = l$1(true);
    const [escapeClose, setEscapeClose] = l$1(false);
    const searchbarRef = s();
    const [myOptions, myOptionsSet] = l$1([]);
    const fetchMyAPI = A$1(async () => {
      if (dataSource && dataSource.length > 0) {
        let response = await fetch(dataSource);
        response = await response.json();
        myOptionsSet(response);
      } else {
        myOptionsSet(options);
      }
    }, [dataSource]); // if dataSource changes, useEffect will run again

    y(() => {
      fetchMyAPI();
    }, [fetchMyAPI]); // Usage of stringify is necessary here because we want this effect to only trigger when there is a value change to the array

    y(() => {
      const selectedValues = values.map(v => myOptions.find(o => o.value === v)).filter(v => v !== undefined);
      setSelectedValues(selectedValues);
    }, [JSON.stringify(values), myOptions]);
    y(() => {
      setFilteredValues(myOptions.filter(o => o.label && o.label.toLowerCase().includes(filter.toLowerCase()) && !values.includes(o.value)));
    }, [filter, JSON.stringify(values), myOptions]);
    y(() => {
      setHasValuesLeft(selectedValues.length < myOptions.length);
    }, [selectedValues.length, myOptions.length]);

    const onFilterChange = ({
      target
    }) => {
      setEscapeClose(false);
      setFilter(target.value);
    };

    const selectValue = option => {
      setFilter('');
      props.onChange({
        value: [...values, option.value],
        field
      });
    };

    const deselectValue = option => {
      props.onChange({
        value: values.filter(v => v != option.value),
        field
      });
    };

    const onInputKeyDown = e => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          // We do not want the cursor to seek in the search field when we press up and down
          e.preventDefault();
          break;

        case 'Backspace':
          if (!filter && selectedValues.length) {
            deselectValue(selectedValues[selectedValues.length - 1]);
          }

          break;

        case 'Escape':
          setEscapeClose(true);
          break;

        case 'Enter':
          if (escapeClose) {
            setEscapeClose(false);
          }

          break;
      }
    };

    return e$1("div", {
      class: formFieldClassesCustom(type$5, hiddenFx, errors),
      children: [e$1(Label$2, {
        label: label,
        id: prefixId(id, formId)
      }), e$1("div", {
        class: classnames('fjs-taglist', {
          'disabled': disabled
        }),
        children: [!disabled && selectedValues.map(sv => {
          return e$1("div", {
            class: "fjs-taglist-tag",
            onMouseDown: e => e.preventDefault(),
            children: [e$1("span", {
              class: "fjs-taglist-tag-label",
              children: sv.label
            }), e$1("span", {
              class: "fjs-taglist-tag-remove",
              onMouseDown: () => deselectValue(sv),
              children: e$1(CloseIcon, {})
            })]
          });
        }), e$1("input", {
          disabled: disabled,
          class: "fjs-taglist-input",
          ref: searchbarRef,
          id: prefixId(`${id}-search`, formId),
          onChange: onFilterChange,
          type: "text",
          value: filter,
          placeholder: 'Search',
          autoComplete: "off",
          onKeyDown: e => onInputKeyDown(e),
          onMouseDown: () => setEscapeClose(false),
          onFocus: () => setIsDropdownExpanded(true),
          onBlur: () => {
            setIsDropdownExpanded(false);
            setFilter('');
          }
        })]
      }), e$1("div", {
        class: "fjs-taglist-anchor",
        children: !disabled && isDropdownExpanded && !escapeClose && e$1(DropdownList, {
          values: filteredValues,
          getLabel: v => v.label,
          onValueSelected: v => selectValue(v),
          emptyListMessage: hasValuesLeft ? 'No results' : 'All values selected',
          listenerElement: searchbarRef.current
        })
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Taglist.create = function (myOptions = {}) {
    return {
      values: [{
        label: 'Value',
        value: 'value'
      }],
      ...myOptions
    };
  };

  Taglist.type = type$5;
  Taglist.label = 'Taglist';
  Taglist.keyed = true;
  Taglist.emptyValue = [];
  Taglist.hiddenFx = 'false';

  const type$4 = 'text';
  function Text$1(props) {
    const {
      field
    } = props;
    const {
      text = '',
      hiddenFx
    } = field;
    return e$1("div", {
      class: formFieldClassesCustom(type$4, hiddenFx),
      children: e$1(Markup, {
        markup: safeMarkdown(text),
        trim: false
      })
    });
  }

  Text$1.create = function (options = {}) {
    return {
      text: '# Text',
      ...options
    };
  };

  Text$1.type = type$4;
  Text$1.keyed = false;
  Text$1.hiddenFx = 'false';

  const type$3 = 'textfield';
  function Textfield$1(props) {
    const {
      disabled,
      errors = [],
      field,
      value = ''
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx,
      validate = {}
    } = field;
    const {
      required
    } = validate;

    const onChange = ({
      target
    }) => {
      props.onChange({
        field,
        value: target.value
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$3, hiddenFx, errors),
      children: [e$1(Label$2, {
        id: prefixId(id, formId),
        label: label,
        required: required
      }), e$1("input", {
        class: "fjs-input",
        disabled: disabled,
        id: prefixId(id, formId),
        onInput: onChange,
        type: "text",
        value: value
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Textfield$1.create = function (options = {}) {
    return { ...options
    };
  };

  Textfield$1.type = type$3;
  Textfield$1.label = 'Text Field';
  Textfield$1.keyed = true;
  Textfield$1.emptyValue = '';
  Textfield$1.hiddenFx = 'false';

  const type$2 = 'datefield';
  function Datefield(props) {
    const {
      disabled,
      errors = [],
      field,
      value = ''
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx,
      validate = {}
    } = field;
    const {
      required
    } = validate;

    const onChange = ({
      target
    }) => {
      props.onChange({
        field,
        value: target.value
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type$2, hiddenFx, errors),
      children: [e$1(Label$2, {
        id: prefixId(id, formId),
        label: label,
        required: required
      }), e$1("input", {
        class: "fjs-input",
        disabled: disabled,
        id: prefixId(id, formId),
        onInput: onChange,
        type: "date",
        value: value
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Datefield.create = function (options = {}) {
    return { ...options
    };
  };

  Datefield.type = type$2;
  Datefield.label = 'Date Field';
  Datefield.keyed = true;
  Datefield.emptyValue = '';
  Datefield.hiddenFx = 'false';

  const type$1 = 'table';
  function tableClasses(type, hiddenFx, length) {
    let classes = formFieldClassesCustom(type, hiddenFx, []);
    return classes + ' table' + length;
  }
  function Table(props) {
    const {
      disabled,
      errors = [],
      field,
      value = []
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx,
      headers,
      headersNames,
      editableColumns,
      dynamicRows,
      validate = {}
    } = field;
    const {
      required
    } = validate;
    const headersArray = headers ? headers.split(",") : [];
    const headersNamesArray = headersNames ? headersNames.split(",") : [];
    const editableColumnsArray = editableColumns ? editableColumns.split(",") : [];
    const editableMap = {}; //build the editableMap

    for (let i = 0; i < editableColumnsArray.length; i++) {
      let col = editableColumnsArray[i].trim();
      let type = "text";
      let colAndType = col.match(/([a-z0-9]+)[ ]*\[([a-z]+)\]/i);

      if (colAndType != null) {
        col = colAndType[1];
        type = colAndType[2];
      }

      editableMap[col] = type;
    }

    const {
      formId
    } = F$1(FormContext);

    const onChange = (index, col, newValue) => {
      value[index][col] = newValue;
      props.onChange({
        field,
        value: value
      });
    };

    const getInput = (col, type, index) => {
      return type == 'boolean' || type == 'bool' ? e$1("input", {
        checked: value[index][col],
        class: "fjs-table-checkbox",
        type: "checkbox",
        onChange: e => onChange(index, col, e.target.checked)
      }) : e$1("input", {
        class: "fjs-table-input",
        onInput: e => onChange(index, col, e.target.value),
        type: type,
        value: value[index][col]
      });
    };

    const remove = index => {
      value.splice(index, 1);
      props.onChange({
        field,
        value: value
      });
    };

    const add = () => {
      if (!Array.isArray(value)) {
        props.onChange({
          field,
          value: [{}]
        });
      } else {
        value.push({});
        props.onChange({
          field,
          value: value
        });
      }
    };

    return e$1("div", {
      class: tableClasses(type$1, hiddenFx, headersArray.length),
      children: [e$1(Label$2, {
        id: prefixId(id, formId),
        label: label,
        required: required
      }), e$1("table", {
        children: [e$1("thead", {
          children: e$1("tr", {
            children: [headersNamesArray.map(header => e$1("th", {
              children: header.trim()
            })), dynamicRows ? e$1("th", {}) : null]
          })
        }), e$1("tbody", {
          children: value && value.map((row, index) => e$1("tr", {
            children: [headersArray.map(header => e$1("td", {
              children: editableMap[header.trim()] ? getInput(header.trim(), editableMap[header.trim()], index) : row[header.trim()]
            })), dynamicRows ? e$1("td", {
              class: "actions",
              children: e$1("button", {
                class: "btn btn-danger",
                onClick: () => remove(index),
                children: " - "
              })
            }) : null]
          }))
        }), dynamicRows ? e$1("tfoot", {
          children: e$1("tr", {
            children: [headersNamesArray.map(header => e$1("td", {})), e$1("td", {
              class: "actions",
              children: e$1("button", {
                class: "btn btn-primary",
                onClick: () => add(),
                children: " + "
              })
            })]
          })
        }) : null]
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Table.create = function (options = {}) {
    return { ...options
    };
  };

  Table.type = type$1;
  Table.label = 'Table';
  Table.keyed = true;
  Table.emptyValue = '';
  Table.hiddenFx = 'false';

  const type = 'fileUpload';
  function FileUpload(props) {
    const {
      disabled,
      errors = [],
      field,
      value = ''
    } = props;
    const {
      description,
      id,
      label,
      hiddenFx,
      targetApi,
      targetApiVerb,
      validate = {}
    } = field;
    const {
      required
    } = validate;

    const onChange = ({
      target
    }) => {
      const formData = new FormData();
      formData.append('File', target.files[0]);
      const requestOptions = {
        method: targetApiVerb,
        body: formData
      };
      fetch(targetApi, requestOptions).then(response => {
        response.ok ? response.json().then(json => {
          props.onChange({
            field,
            value: json
          });
        }) : console.log(response);
      });
    };

    const {
      formId
    } = F$1(FormContext);
    return e$1("div", {
      class: formFieldClassesCustom(type, hiddenFx, errors),
      children: [e$1("label", {
        class: "fjs-form-field-label",
        children: [label || '', required && e$1("span", {
          class: "fjs-asterix",
          children: "*"
        })]
      }), e$1("label", {
        for: prefixId(id, formId),
        class: "fjs-form-field-label fjs-file-input",
        children: ["File Upload", e$1("div", {
          class: "fjs-file-input-info",
          children: value.name
        }), e$1("img", {
          src: "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACLklEQVRoge2YTS8DQRjHHwfahAYHRycfgAQ3dWlExFGCfgFXX8HBN5AQr9c6e7l7S9TJgYarEFFXkYgqnr/dTadjptul0x0xv+SftLszO792Z+dliRwOh8PhcPxP2jjJuCWiMsTZ4txyPvwUOducTIxeoSQ4G5x3qoirssvpislRS4pzRLXFxRTIoh8B+RNSi75xXjXnduKQldHJX3LGOe3kda0RUt+hWJ8Jnfwpp1NRHiPSsVQ21xRTBVHlA9JS+aJZTTU/lQeYE0pCHYxYCWOmCuqRHw6pXxbq4XOrKVlV4yr5PFXkp8n7h7Oaa0xKdW8M+lYRRR7H9xXXwLh/LdVfN2rtgz56SPXLB11KBOXOpProPgOG3b9YoGjyyKpQXyWPLJtXJ2rh3FM0+RdOf4j8AXnzgjGCkaFHaviJ011DHt9nQuQxI3eYlMfF9wQJsXGsa8Y4cxr52bjlxQe21z92oRCRY4U8WBManPePZf+K/CBVb0awo0r55xY18s+cKRvkwabUcIGq1zaj5K0ecfycs8Tp88/FLg/upMYn6qxnhTzGZLH7lOtsHPJ5+i6PZUeqRr2Gk5QEShT+OkQnj01L0/55kUdJJF2jrHXyIKeQUU33VsqDjEIKfRl3At0JfRrr+StFudjlA/CqQzdZlTXnrJEH2HRgnA9bOgTBssMa+QD8CN2dEIfZFTK8JP4teCbwYD+QJ415AntYbAObspNqJFilNu3tgcPhcNjFJ4udZjdSNDK9AAAAAElFTkSuQmCC",
          class: "fjs-upload-icon"
        })]
      }), e$1("input", {
        class: "fjs-input-file-hidden",
        disabled: disabled,
        id: prefixId(id, formId),
        onInput: onChange,
        type: "file"
      }), e$1(Description$2, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  FileUpload.create = function (options = {}) {
    return { ...options
    };
  };

  FileUpload.type = type;
  FileUpload.label = 'File Upload';
  FileUpload.keyed = true;
  FileUpload.emptyValue = '';
  FileUpload.hiddenFx = 'false';

  const formFields = [Button, Checkbox$1, Checklist, Default, Number$1, Radio, Select$1, Taglist, Text$1, Textfield$1, Datefield, Table, FileUpload];

  class FormFields {
    constructor() {
      this._formFields = {};
      formFields.forEach(formField => {
        const {
          type
        } = formField;
        this.register(type, formField);
      });
    }

    register(type, formField) {
      this._formFields[type] = formField;
    }

    get(type) {
      return this._formFields[type];
    }

  }

  /**
   * @typedef { import('./types').Injector } Injector
   * @typedef { import('./types').Data } Data
   * @typedef { import('./types').Errors } Errors
   * @typedef { import('./types').Schema } Schema
   * @typedef { import('./types').FormProperties } FormProperties
   * @typedef { import('./types').FormProperty } FormProperty
   * @typedef { import('./types').FormEvent } FormEvent
   * @typedef { import('./types').FormOptions } FormOptions
   *
   * @typedef { {
   *   data: Data,
   *   initialData: Data,
   *   errors: Errors,
   *   properties: FormProperties,
   *   schema: Schema
   * } } State
   *
   * @typedef { (type:FormEvent, priority:number, handler:Function) => void } OnEventWithPriority
   * @typedef { (type:FormEvent, handler:Function) => void } OnEventWithOutPriority
   * @typedef { OnEventWithPriority & OnEventWithOutPriority } OnEventType
   */

  new Ids([32, 36, 1]);

  const schemaVersion = 4;

  /**
   * Set attribute `name` to `val`, or get attr `name`.
   *
   * @param {Element} el
   * @param {String} name
   * @param {String} [val]
   * @api public
   */

  var proto = typeof Element !== 'undefined' ? Element.prototype : {};
  var vendor = proto.matches
    || proto.matchesSelector
    || proto.webkitMatchesSelector
    || proto.mozMatchesSelector
    || proto.msMatchesSelector
    || proto.oMatchesSelector;

  var matchesSelector = match;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match(el, selector) {
    if (!el || el.nodeType !== 1) return false;
    if (vendor) return vendor.call(el, selector);
    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  /**
   * Closest
   *
   * @param {Element} el
   * @param {String} selector
   * @param {Boolean} checkYourSelf (optional)
   */
  function closest (element, selector, checkYourSelf) {
    var currentElem = checkYourSelf ? element : element.parentNode;

    while (currentElem && currentElem.nodeType !== document.DOCUMENT_NODE && currentElem.nodeType !== document.DOCUMENT_FRAGMENT_NODE) {

      if (matchesSelector(currentElem, selector)) {
        return currentElem;
      }

      currentElem = currentElem.parentNode;
    }

    return matchesSelector(currentElem, selector) ? currentElem : null;
  }

  var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
      unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
      prefix = bind !== 'addEventListener' ? 'on' : '';

  /**
   * Bind `el` event `type` to `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var bind_1 = function(el, type, fn, capture){
    el[bind](prefix + type, fn, capture || false);
    return fn;
  };

  /**
   * Unbind `el` event `type`'s callback `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var unbind_1 = function(el, type, fn, capture){
    el[unbind](prefix + type, fn, capture || false);
    return fn;
  };

  var componentEvent = {
  	bind: bind_1,
  	unbind: unbind_1
  };
  var bugTestDiv;
  if (typeof document !== 'undefined') {
    bugTestDiv = document.createElement('div');
    // Setup
    bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    !bugTestDiv.getElementsByTagName('link').length;
    bugTestDiv = undefined;
  }

  function query(selector, el) {
    el = el || document;

    return el.querySelector(selector);
  }

  var atoa$1 = function atoa (a, n) { return Array.prototype.slice.call(a, n); };

  var si = typeof setImmediate === 'function', tick;
  if (si) {
    tick = function (fn) { setImmediate(fn); };
  } else if (typeof process !== 'undefined' && process.nextTick) {
    tick = process.nextTick;
  } else {
    tick = function (fn) { setTimeout(fn, 0); };
  }

  var ticky$1 = tick;

  var ticky = ticky$1;

  var debounce$1 = function debounce (fn, args, ctx) {
    if (!fn) { return; }
    ticky(function run () {
      fn.apply(ctx || null, args || []);
    });
  };

  var atoa = atoa$1;
  var debounce = debounce$1;

  var emitter$1 = function emitter (thing, options) {
    var opts = options || {};
    var evt = {};
    if (thing === undefined) { thing = {}; }
    thing.on = function (type, fn) {
      if (!evt[type]) {
        evt[type] = [fn];
      } else {
        evt[type].push(fn);
      }
      return thing;
    };
    thing.once = function (type, fn) {
      fn._once = true; // thing.off(fn) still works!
      thing.on(type, fn);
      return thing;
    };
    thing.off = function (type, fn) {
      var c = arguments.length;
      if (c === 1) {
        delete evt[type];
      } else if (c === 0) {
        evt = {};
      } else {
        var et = evt[type];
        if (!et) { return thing; }
        et.splice(et.indexOf(fn), 1);
      }
      return thing;
    };
    thing.emit = function () {
      var args = atoa(arguments);
      return thing.emitterSnapshot(args.shift()).apply(this, args);
    };
    thing.emitterSnapshot = function (type) {
      var et = (evt[type] || []).slice(0);
      return function () {
        var args = atoa(arguments);
        var ctx = this || thing;
        if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
        et.forEach(function emitter (listen) {
          if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
          if (listen._once) { thing.off(type, listen); }
        });
        return thing;
      };
    };
    return thing;
  };

  var NativeCustomEvent = commonjsGlobal.CustomEvent;

  function useNative () {
    try {
      var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
      return  'cat' === p.type && 'bar' === p.detail.foo;
    } catch (e) {
    }
    return false;
  }

  /**
   * Cross-browser `CustomEvent` constructor.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
   *
   * @public
   */

  var customEvent$1 = useNative() ? NativeCustomEvent :

  // IE >= 9
  'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
    var e = document.createEvent('CustomEvent');
    if (params) {
      e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
    } else {
      e.initCustomEvent(type, false, false, void 0);
    }
    return e;
  } :

  // IE <= 8
  function CustomEvent (type, params) {
    var e = document.createEventObject();
    e.type = type;
    if (params) {
      e.bubbles = Boolean(params.bubbles);
      e.cancelable = Boolean(params.cancelable);
      e.detail = params.detail;
    } else {
      e.bubbles = false;
      e.cancelable = false;
      e.detail = void 0;
    }
    return e;
  };

  var eventmap$1 = [];
  var eventname = '';
  var ron = /^on/;

  for (eventname in commonjsGlobal) {
    if (ron.test(eventname)) {
      eventmap$1.push(eventname.slice(2));
    }
  }

  var eventmap_1 = eventmap$1;

  var customEvent = customEvent$1;
  var eventmap = eventmap_1;
  var doc$1 = commonjsGlobal.document;
  var addEvent = addEventEasy;
  var removeEvent = removeEventEasy;
  var hardCache = [];

  if (!commonjsGlobal.addEventListener) {
    addEvent = addEventHard;
    removeEvent = removeEventHard;
  }

  var crossvent$1 = {
    add: addEvent,
    remove: removeEvent,
    fabricate: fabricateEvent
  };

  function addEventEasy (el, type, fn, capturing) {
    return el.addEventListener(type, fn, capturing);
  }

  function addEventHard (el, type, fn) {
    return el.attachEvent('on' + type, wrap(el, type, fn));
  }

  function removeEventEasy (el, type, fn, capturing) {
    return el.removeEventListener(type, fn, capturing);
  }

  function removeEventHard (el, type, fn) {
    var listener = unwrap(el, type, fn);
    if (listener) {
      return el.detachEvent('on' + type, listener);
    }
  }

  function fabricateEvent (el, type, model) {
    var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
    if (el.dispatchEvent) {
      el.dispatchEvent(e);
    } else {
      el.fireEvent('on' + type, e);
    }
    function makeClassicEvent () {
      var e;
      if (doc$1.createEvent) {
        e = doc$1.createEvent('Event');
        e.initEvent(type, true, true);
      } else if (doc$1.createEventObject) {
        e = doc$1.createEventObject();
      }
      return e;
    }
    function makeCustomEvent () {
      return new customEvent(type, { detail: model });
    }
  }

  function wrapperFactory (el, type, fn) {
    return function wrapper (originalEvent) {
      var e = originalEvent || commonjsGlobal.event;
      e.target = e.target || e.srcElement;
      e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
      e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
      e.which = e.which || e.keyCode;
      fn.call(el, e);
    };
  }

  function wrap (el, type, fn) {
    var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
    hardCache.push({
      wrapper: wrapper,
      element: el,
      type: type,
      fn: fn
    });
    return wrapper;
  }

  function unwrap (el, type, fn) {
    var i = find(el, type, fn);
    if (i) {
      var wrapper = hardCache[i].wrapper;
      hardCache.splice(i, 1); // free up a tad of memory
      return wrapper;
    }
  }

  function find (el, type, fn) {
    var i, item;
    for (i = 0; i < hardCache.length; i++) {
      item = hardCache[i];
      if (item.element === el && item.type === type && item.fn === fn) {
        return i;
      }
    }
  }

  var cache = {};
  var start = '(?:^|\\s)';
  var end = '(?:\\s|$)';

  function lookupClass (className) {
    var cached = cache[className];
    if (cached) {
      cached.lastIndex = 0;
    } else {
      cache[className] = cached = new RegExp(start + className + end, 'g');
    }
    return cached;
  }

  function addClass (el, className) {
    var current = el.className;
    if (!current.length) {
      el.className = className;
    } else if (!lookupClass(className).test(current)) {
      el.className += ' ' + className;
    }
  }

  function rmClass (el, className) {
    el.className = el.className.replace(lookupClass(className), ' ').trim();
  }

  var classes$1 = {
    add: addClass,
    rm: rmClass
  };

  var emitter = emitter$1;
  var crossvent = crossvent$1;
  var classes = classes$1;
  var doc = document;
  var documentElement = doc.documentElement;

  function dragula (initialContainers, options) {
    var len = arguments.length;
    if (len === 1 && Array.isArray(initialContainers) === false) {
      options = initialContainers;
      initialContainers = [];
    }
    var _mirror; // mirror image
    var _source; // source container
    var _item; // item being dragged
    var _offsetX; // reference x
    var _offsetY; // reference y
    var _moveX; // reference move x
    var _moveY; // reference move y
    var _initialSibling; // reference sibling when grabbed
    var _currentSibling; // reference sibling now
    var _copy; // item used for copying
    var _renderTimer; // timer for setTimeout renderMirrorImage
    var _lastDropTarget = null; // last container item was over
    var _grabbed; // holds mousedown context until first mousemove

    var o = options || {};
    if (o.moves === void 0) { o.moves = always; }
    if (o.accepts === void 0) { o.accepts = always; }
    if (o.invalid === void 0) { o.invalid = invalidTarget; }
    if (o.containers === void 0) { o.containers = initialContainers || []; }
    if (o.isContainer === void 0) { o.isContainer = never; }
    if (o.copy === void 0) { o.copy = false; }
    if (o.copySortSource === void 0) { o.copySortSource = false; }
    if (o.revertOnSpill === void 0) { o.revertOnSpill = false; }
    if (o.removeOnSpill === void 0) { o.removeOnSpill = false; }
    if (o.direction === void 0) { o.direction = 'vertical'; }
    if (o.ignoreInputTextSelection === void 0) { o.ignoreInputTextSelection = true; }
    if (o.mirrorContainer === void 0) { o.mirrorContainer = doc.body; }

    var drake = emitter({
      containers: o.containers,
      start: manualStart,
      end: end,
      cancel: cancel,
      remove: remove,
      destroy: destroy,
      canMove: canMove,
      dragging: false
    });

    if (o.removeOnSpill === true) {
      drake.on('over', spillOver).on('out', spillOut);
    }

    events();

    return drake;

    function isContainer (el) {
      return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
    }

    function events (remove) {
      var op = remove ? 'remove' : 'add';
      touchy(documentElement, op, 'mousedown', grab);
      touchy(documentElement, op, 'mouseup', release);
    }

    function eventualMovements (remove) {
      var op = remove ? 'remove' : 'add';
      touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
    }

    function movements (remove) {
      var op = remove ? 'remove' : 'add';
      crossvent[op](documentElement, 'selectstart', preventGrabbed); // IE8
      crossvent[op](documentElement, 'click', preventGrabbed);
    }

    function destroy () {
      events(true);
      release({});
    }

    function preventGrabbed (e) {
      if (_grabbed) {
        e.preventDefault();
      }
    }

    function grab (e) {
      _moveX = e.clientX;
      _moveY = e.clientY;

      var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
      if (ignore) {
        return; // we only care about honest-to-god left clicks and touch events
      }
      var item = e.target;
      var context = canStart(item);
      if (!context) {
        return;
      }
      _grabbed = context;
      eventualMovements();
      if (e.type === 'mousedown') {
        if (isInput$1(item)) { // see also: https://github.com/bevacqua/dragula/issues/208
          item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
        } else {
          e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
        }
      }
    }

    function startBecauseMouseMoved (e) {
      if (!_grabbed) {
        return;
      }
      if (whichMouseButton(e) === 0) {
        release({});
        return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
      }

      // truthy check fixes #239, equality fixes #207, fixes #501
      if ((e.clientX !== void 0 && Math.abs(e.clientX - _moveX) <= (o.slideFactorX || 0)) &&
        (e.clientY !== void 0 && Math.abs(e.clientY - _moveY) <= (o.slideFactorY || 0))) {
        return;
      }

      if (o.ignoreInputTextSelection) {
        var clientX = getCoord('clientX', e) || 0;
        var clientY = getCoord('clientY', e) || 0;
        var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
        if (isInput$1(elementBehindCursor)) {
          return;
        }
      }

      var grabbed = _grabbed; // call to end() unsets _grabbed
      eventualMovements(true);
      movements();
      end();
      start(grabbed);

      var offset = getOffset(_item);
      _offsetX = getCoord('pageX', e) - offset.left;
      _offsetY = getCoord('pageY', e) - offset.top;

      classes.add(_copy || _item, 'gu-transit');
      renderMirrorImage();
      drag(e);
    }

    function canStart (item) {
      if (drake.dragging && _mirror) {
        return;
      }
      if (isContainer(item)) {
        return; // don't drag container itself
      }
      var handle = item;
      while (getParent(item) && isContainer(getParent(item)) === false) {
        if (o.invalid(item, handle)) {
          return;
        }
        item = getParent(item); // drag target should be a top element
        if (!item) {
          return;
        }
      }
      var source = getParent(item);
      if (!source) {
        return;
      }
      if (o.invalid(item, handle)) {
        return;
      }

      var movable = o.moves(item, source, handle, nextEl(item));
      if (!movable) {
        return;
      }

      return {
        item: item,
        source: source
      };
    }

    function canMove (item) {
      return !!canStart(item);
    }

    function manualStart (item) {
      var context = canStart(item);
      if (context) {
        start(context);
      }
    }

    function start (context) {
      if (isCopy(context.item, context.source)) {
        _copy = context.item.cloneNode(true);
        drake.emit('cloned', _copy, context.item, 'copy');
      }

      _source = context.source;
      _item = context.item;
      _initialSibling = _currentSibling = nextEl(context.item);

      drake.dragging = true;
      drake.emit('drag', _item, _source);
    }

    function invalidTarget () {
      return false;
    }

    function end () {
      if (!drake.dragging) {
        return;
      }
      var item = _copy || _item;
      drop(item, getParent(item));
    }

    function ungrab () {
      _grabbed = false;
      eventualMovements(true);
      movements(true);
    }

    function release (e) {
      ungrab();

      if (!drake.dragging) {
        return;
      }
      var item = _copy || _item;
      var clientX = getCoord('clientX', e) || 0;
      var clientY = getCoord('clientY', e) || 0;
      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
      if (dropTarget && ((_copy && o.copySortSource) || (!_copy || dropTarget !== _source))) {
        drop(item, dropTarget);
      } else if (o.removeOnSpill) {
        remove();
      } else {
        cancel();
      }
    }

    function drop (item, target) {
      var parent = getParent(item);
      if (_copy && o.copySortSource && target === _source) {
        parent.removeChild(_item);
      }
      if (isInitialPlacement(target)) {
        drake.emit('cancel', item, _source, _source);
      } else {
        drake.emit('drop', item, target, _source, _currentSibling);
      }
      cleanup();
    }

    function remove () {
      if (!drake.dragging) {
        return;
      }
      var item = _copy || _item;
      var parent = getParent(item);
      if (parent) {
        parent.removeChild(item);
      }
      drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
      cleanup();
    }

    function cancel (revert) {
      if (!drake.dragging) {
        return;
      }
      var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
      var item = _copy || _item;
      var parent = getParent(item);
      var initial = isInitialPlacement(parent);
      if (initial === false && reverts) {
        if (_copy) {
          if (parent) {
            parent.removeChild(_copy);
          }
        } else {
          _source.insertBefore(item, _initialSibling);
        }
      }
      if (initial || reverts) {
        drake.emit('cancel', item, _source, _source);
      } else {
        drake.emit('drop', item, parent, _source, _currentSibling);
      }
      cleanup();
    }

    function cleanup () {
      var item = _copy || _item;
      ungrab();
      removeMirrorImage();
      if (item) {
        classes.rm(item, 'gu-transit');
      }
      if (_renderTimer) {
        clearTimeout(_renderTimer);
      }
      drake.dragging = false;
      if (_lastDropTarget) {
        drake.emit('out', item, _lastDropTarget, _source);
      }
      drake.emit('dragend', item);
      _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
    }

    function isInitialPlacement (target, s) {
      var sibling;
      if (s !== void 0) {
        sibling = s;
      } else if (_mirror) {
        sibling = _currentSibling;
      } else {
        sibling = nextEl(_copy || _item);
      }
      return target === _source && sibling === _initialSibling;
    }

    function findDropTarget (elementBehindCursor, clientX, clientY) {
      var target = elementBehindCursor;
      while (target && !accepted()) {
        target = getParent(target);
      }
      return target;

      function accepted () {
        var droppable = isContainer(target);
        if (droppable === false) {
          return false;
        }

        var immediate = getImmediateChild(target, elementBehindCursor);
        var reference = getReference(target, immediate, clientX, clientY);
        var initial = isInitialPlacement(target, reference);
        if (initial) {
          return true; // should always be able to drop it right back where it was
        }
        return o.accepts(_item, target, _source, reference);
      }
    }

    function drag (e) {
      if (!_mirror) {
        return;
      }
      e.preventDefault();

      var clientX = getCoord('clientX', e) || 0;
      var clientY = getCoord('clientY', e) || 0;
      var x = clientX - _offsetX;
      var y = clientY - _offsetY;

      _mirror.style.left = x + 'px';
      _mirror.style.top = y + 'px';

      var item = _copy || _item;
      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
      var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
      if (changed || dropTarget === null) {
        out();
        _lastDropTarget = dropTarget;
        over();
      }
      var parent = getParent(item);
      if (dropTarget === _source && _copy && !o.copySortSource) {
        if (parent) {
          parent.removeChild(item);
        }
        return;
      }
      var reference;
      var immediate = getImmediateChild(dropTarget, elementBehindCursor);
      if (immediate !== null) {
        reference = getReference(dropTarget, immediate, clientX, clientY);
      } else if (o.revertOnSpill === true && !_copy) {
        reference = _initialSibling;
        dropTarget = _source;
      } else {
        if (_copy && parent) {
          parent.removeChild(item);
        }
        return;
      }
      if (
        (reference === null && changed) ||
        reference !== item &&
        reference !== nextEl(item)
      ) {
        _currentSibling = reference;
        dropTarget.insertBefore(item, reference);
        drake.emit('shadow', item, dropTarget, _source);
      }
      function moved (type) { drake.emit(type, item, _lastDropTarget, _source); }
      function over () { if (changed) { moved('over'); } }
      function out () { if (_lastDropTarget) { moved('out'); } }
    }

    function spillOver (el) {
      classes.rm(el, 'gu-hide');
    }

    function spillOut (el) {
      if (drake.dragging) { classes.add(el, 'gu-hide'); }
    }

    function renderMirrorImage () {
      if (_mirror) {
        return;
      }
      var rect = _item.getBoundingClientRect();
      _mirror = _item.cloneNode(true);
      _mirror.style.width = getRectWidth(rect) + 'px';
      _mirror.style.height = getRectHeight(rect) + 'px';
      classes.rm(_mirror, 'gu-transit');
      classes.add(_mirror, 'gu-mirror');
      o.mirrorContainer.appendChild(_mirror);
      touchy(documentElement, 'add', 'mousemove', drag);
      classes.add(o.mirrorContainer, 'gu-unselectable');
      drake.emit('cloned', _mirror, _item, 'mirror');
    }

    function removeMirrorImage () {
      if (_mirror) {
        classes.rm(o.mirrorContainer, 'gu-unselectable');
        touchy(documentElement, 'remove', 'mousemove', drag);
        getParent(_mirror).removeChild(_mirror);
        _mirror = null;
      }
    }

    function getImmediateChild (dropTarget, target) {
      var immediate = target;
      while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
        immediate = getParent(immediate);
      }
      if (immediate === documentElement) {
        return null;
      }
      return immediate;
    }

    function getReference (dropTarget, target, x, y) {
      var horizontal = o.direction === 'horizontal';
      var reference = target !== dropTarget ? inside() : outside();
      return reference;

      function outside () { // slower, but able to figure out any position
        var len = dropTarget.children.length;
        var i;
        var el;
        var rect;
        for (i = 0; i < len; i++) {
          el = dropTarget.children[i];
          rect = el.getBoundingClientRect();
          if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
          if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
        }
        return null;
      }

      function inside () { // faster, but only available if dropped inside a child element
        var rect = target.getBoundingClientRect();
        if (horizontal) {
          return resolve(x > rect.left + getRectWidth(rect) / 2);
        }
        return resolve(y > rect.top + getRectHeight(rect) / 2);
      }

      function resolve (after) {
        return after ? nextEl(target) : target;
      }
    }

    function isCopy (item, container) {
      return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
    }
  }

  function touchy (el, op, type, fn) {
    var touch = {
      mouseup: 'touchend',
      mousedown: 'touchstart',
      mousemove: 'touchmove'
    };
    var pointers = {
      mouseup: 'pointerup',
      mousedown: 'pointerdown',
      mousemove: 'pointermove'
    };
    var microsoft = {
      mouseup: 'MSPointerUp',
      mousedown: 'MSPointerDown',
      mousemove: 'MSPointerMove'
    };
    if (commonjsGlobal.navigator.pointerEnabled) {
      crossvent[op](el, pointers[type], fn);
    } else if (commonjsGlobal.navigator.msPointerEnabled) {
      crossvent[op](el, microsoft[type], fn);
    } else {
      crossvent[op](el, touch[type], fn);
      crossvent[op](el, type, fn);
    }
  }

  function whichMouseButton (e) {
    if (e.touches !== void 0) { return e.touches.length; }
    if (e.which !== void 0 && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261
    if (e.buttons !== void 0) { return e.buttons; }
    var button = e.button;
    if (button !== void 0) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
      return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
    }
  }

  function getOffset (el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
      top: rect.top + getScroll('scrollTop', 'pageYOffset')
    };
  }

  function getScroll (scrollProp, offsetProp) {
    if (typeof commonjsGlobal[offsetProp] !== 'undefined') {
      return commonjsGlobal[offsetProp];
    }
    if (documentElement.clientHeight) {
      return documentElement[scrollProp];
    }
    return doc.body[scrollProp];
  }

  function getElementBehindPoint (point, x, y) {
    point = point || {};
    var state = point.className || '';
    var el;
    point.className += ' gu-hide';
    el = doc.elementFromPoint(x, y);
    point.className = state;
    return el;
  }

  function never () { return false; }
  function always () { return true; }
  function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
  function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
  function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
  function isInput$1 (el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
  function isEditable (el) {
    if (!el) { return false; } // no parents were editable
    if (el.contentEditable === 'false') { return false; } // stop the lookup
    if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
    return isEditable(getParent(el)); // contentEditable is set to 'inherit'
  }

  function nextEl (el) {
    return el.nextElementSibling || manually();
    function manually () {
      var sibling = el;
      do {
        sibling = sibling.nextSibling;
      } while (sibling && sibling.nodeType !== 1);
      return sibling;
    }
  }

  function getEventHost (e) {
    // on touchend event, we have to use `e.changedTouches`
    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
    // see https://github.com/bevacqua/dragula/issues/34
    if (e.targetTouches && e.targetTouches.length) {
      return e.targetTouches[0];
    }
    if (e.changedTouches && e.changedTouches.length) {
      return e.changedTouches[0];
    }
    return e;
  }

  function getCoord (coord, e) {
    var host = getEventHost(e);
    var missMap = {
      pageX: 'clientX', // IE8
      pageY: 'clientY' // IE8
    };
    if (coord in missMap && !(coord in host) && missMap[coord] in host) {
      coord = missMap[coord];
    }
    return host[coord];
  }

  var dragula_1 = dragula;

  var arrayMove$1 = {exports: {}};

  const arrayMoveMutate = (array, from, to) => {
  	const startIndex = from < 0 ? array.length + from : from;

  	if (startIndex >= 0 && startIndex < array.length) {
  		const endIndex = to < 0 ? array.length + to : to;

  		const [item] = array.splice(from, 1);
  		array.splice(endIndex, 0, item);
  	}
  };

  const arrayMove = (array, from, to) => {
  	array = [...array];
  	arrayMoveMutate(array, from, to);
  	return array;
  };

  arrayMove$1.exports = arrayMove;
  var mutate = arrayMove$1.exports.mutate = arrayMoveMutate;

  var FN_REF = '__fn';
  var DEFAULT_PRIORITY$3 = 1000;
  var slice = Array.prototype.slice;
  /**
   * A general purpose event bus.
   *
   * This component is used to communicate across a diagram instance.
   * Other parts of a diagram can use it to listen to and broadcast events.
   *
   *
   * ## Registering for Events
   *
   * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
   * methods to register for events. {@link EventBus#off} can be used to
   * remove event registrations. Listeners receive an instance of {@link Event}
   * as the first argument. It allows them to hook into the event execution.
   *
   * ```javascript
   *
   * // listen for event
   * eventBus.on('foo', function(event) {
   *
   *   // access event type
   *   event.type; // 'foo'
   *
   *   // stop propagation to other listeners
   *   event.stopPropagation();
   *
   *   // prevent event default
   *   event.preventDefault();
   * });
   *
   * // listen for event with custom payload
   * eventBus.on('bar', function(event, payload) {
   *   console.log(payload);
   * });
   *
   * // listen for event returning value
   * eventBus.on('foobar', function(event) {
   *
   *   // stop event propagation + prevent default
   *   return false;
   *
   *   // stop event propagation + return custom result
   *   return {
   *     complex: 'listening result'
   *   };
   * });
   *
   *
   * // listen with custom priority (default=1000, higher is better)
   * eventBus.on('priorityfoo', 1500, function(event) {
   *   console.log('invoked first!');
   * });
   *
   *
   * // listen for event and pass the context (`this`)
   * eventBus.on('foobar', function(event) {
   *   this.foo();
   * }, this);
   * ```
   *
   *
   * ## Emitting Events
   *
   * Events can be emitted via the event bus using {@link EventBus#fire}.
   *
   * ```javascript
   *
   * // false indicates that the default action
   * // was prevented by listeners
   * if (eventBus.fire('foo') === false) {
   *   console.log('default has been prevented!');
   * };
   *
   *
   * // custom args + return value listener
   * eventBus.on('sum', function(event, a, b) {
   *   return a + b;
   * });
   *
   * // you can pass custom arguments + retrieve result values.
   * var sum = eventBus.fire('sum', 1, 2);
   * console.log(sum); // 3
   * ```
   */

  function EventBus() {
    this._listeners = {}; // cleanup on destroy on lowest priority to allow
    // message passing until the bitter end

    this.on('diagram.destroy', 1, this._destroy, this);
  }
  /**
   * Register an event listener for events with the given name.
   *
   * The callback will be invoked with `event, ...additionalArguments`
   * that have been passed to {@link EventBus#fire}.
   *
   * Returning false from a listener will prevent the events default action
   * (if any is specified). To stop an event from being processed further in
   * other listeners execute {@link Event#stopPropagation}.
   *
   * Returning anything but `undefined` from a listener will stop the listener propagation.
   *
   * @param {string|Array<string>} events
   * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
   * @param {Function} callback
   * @param {Object} [that] Pass context (`this`) to the callback
   */

  EventBus.prototype.on = function (events, priority, callback, that) {
    events = isArray$1(events) ? events : [events];

    if (isFunction(priority)) {
      that = callback;
      callback = priority;
      priority = DEFAULT_PRIORITY$3;
    }

    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    var actualCallback = callback;

    if (that) {
      actualCallback = bind$1(callback, that); // make sure we remember and are able to remove
      // bound callbacks via {@link #off} using the original
      // callback

      actualCallback[FN_REF] = callback[FN_REF] || callback;
    }

    var self = this;
    events.forEach(function (e) {
      self._addListener(e, {
        priority: priority,
        callback: actualCallback,
        next: null
      });
    });
  };
  /**
   * Register an event listener that is executed only once.
   *
   * @param {string} event the event name to register for
   * @param {number} [priority=1000] the priority in which this listener is called, larger is higher
   * @param {Function} callback the callback to execute
   * @param {Object} [that] Pass context (`this`) to the callback
   */


  EventBus.prototype.once = function (event, priority, callback, that) {
    var self = this;

    if (isFunction(priority)) {
      that = callback;
      callback = priority;
      priority = DEFAULT_PRIORITY$3;
    }

    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    function wrappedCallback() {
      wrappedCallback.__isTomb = true;
      var result = callback.apply(that, arguments);
      self.off(event, wrappedCallback);
      return result;
    } // make sure we remember and are able to remove
    // bound callbacks via {@link #off} using the original
    // callback


    wrappedCallback[FN_REF] = callback;
    this.on(event, priority, wrappedCallback);
  };
  /**
   * Removes event listeners by event and callback.
   *
   * If no callback is given, all listeners for a given event name are being removed.
   *
   * @param {string|Array<string>} events
   * @param {Function} [callback]
   */


  EventBus.prototype.off = function (events, callback) {
    events = isArray$1(events) ? events : [events];
    var self = this;
    events.forEach(function (event) {
      self._removeListener(event, callback);
    });
  };
  /**
   * Create an EventBus event.
   *
   * @param {Object} data
   *
   * @return {Object} event, recognized by the eventBus
   */


  EventBus.prototype.createEvent = function (data) {
    var event = new InternalEvent();
    event.init(data);
    return event;
  };
  /**
   * Fires a named event.
   *
   * @example
   *
   * // fire event by name
   * events.fire('foo');
   *
   * // fire event object with nested type
   * var event = { type: 'foo' };
   * events.fire(event);
   *
   * // fire event with explicit type
   * var event = { x: 10, y: 20 };
   * events.fire('element.moved', event);
   *
   * // pass additional arguments to the event
   * events.on('foo', function(event, bar) {
   *   alert(bar);
   * });
   *
   * events.fire({ type: 'foo' }, 'I am bar!');
   *
   * @param {string} [name] the optional event name
   * @param {Object} [event] the event object
   * @param {...Object} additional arguments to be passed to the callback functions
   *
   * @return {boolean} the events return value, if specified or false if the
   *                   default action was prevented by listeners
   */


  EventBus.prototype.fire = function (type, data) {
    var event, firstListener, returnValue, args;
    args = slice.call(arguments);

    if (typeof type === 'object') {
      data = type;
      type = data.type;
    }

    if (!type) {
      throw new Error('no event type specified');
    }

    firstListener = this._listeners[type];

    if (!firstListener) {
      return;
    } // we make sure we fire instances of our home made
    // events here. We wrap them only once, though


    if (data instanceof InternalEvent) {
      // we are fine, we alread have an event
      event = data;
    } else {
      event = this.createEvent(data);
    } // ensure we pass the event as the first parameter


    args[0] = event; // original event type (in case we delegate)

    var originalType = event.type; // update event type before delegation

    if (type !== originalType) {
      event.type = type;
    }

    try {
      returnValue = this._invokeListeners(event, args, firstListener);
    } finally {
      // reset event type after delegation
      if (type !== originalType) {
        event.type = originalType;
      }
    } // set the return value to false if the event default
    // got prevented and no other return value exists


    if (returnValue === undefined && event.defaultPrevented) {
      returnValue = false;
    }

    return returnValue;
  };

  EventBus.prototype.handleError = function (error) {
    return this.fire('error', {
      error: error
    }) === false;
  };

  EventBus.prototype._destroy = function () {
    this._listeners = {};
  };

  EventBus.prototype._invokeListeners = function (event, args, listener) {
    var returnValue;

    while (listener) {
      // handle stopped propagation
      if (event.cancelBubble) {
        break;
      }

      returnValue = this._invokeListener(event, args, listener);
      listener = listener.next;
    }

    return returnValue;
  };

  EventBus.prototype._invokeListener = function (event, args, listener) {
    var returnValue;

    if (listener.callback.__isTomb) {
      return returnValue;
    }

    try {
      // returning false prevents the default action
      returnValue = invokeFunction(listener.callback, args); // stop propagation on return value

      if (returnValue !== undefined) {
        event.returnValue = returnValue;
        event.stopPropagation();
      } // prevent default on return false


      if (returnValue === false) {
        event.preventDefault();
      }
    } catch (error) {
      if (!this.handleError(error)) {
        console.error('unhandled error in event listener', error);
        throw error;
      }
    }

    return returnValue;
  };
  /*
   * Add new listener with a certain priority to the list
   * of listeners (for the given event).
   *
   * The semantics of listener registration / listener execution are
   * first register, first serve: New listeners will always be inserted
   * after existing listeners with the same priority.
   *
   * Example: Inserting two listeners with priority 1000 and 1300
   *
   *    * before: [ 1500, 1500, 1000, 1000 ]
   *    * after: [ 1500, 1500, (new=1300), 1000, 1000, (new=1000) ]
   *
   * @param {string} event
   * @param {Object} listener { priority, callback }
   */


  EventBus.prototype._addListener = function (event, newListener) {
    var listener = this._getListeners(event),
        previousListener; // no prior listeners


    if (!listener) {
      this._setListeners(event, newListener);

      return;
    } // ensure we order listeners by priority from
    // 0 (high) to n > 0 (low)


    while (listener) {
      if (listener.priority < newListener.priority) {
        newListener.next = listener;

        if (previousListener) {
          previousListener.next = newListener;
        } else {
          this._setListeners(event, newListener);
        }

        return;
      }

      previousListener = listener;
      listener = listener.next;
    } // add new listener to back


    previousListener.next = newListener;
  };

  EventBus.prototype._getListeners = function (name) {
    return this._listeners[name];
  };

  EventBus.prototype._setListeners = function (name, listener) {
    this._listeners[name] = listener;
  };

  EventBus.prototype._removeListener = function (event, callback) {
    var listener = this._getListeners(event),
        nextListener,
        previousListener,
        listenerCallback;

    if (!callback) {
      // clear listeners
      this._setListeners(event, null);

      return;
    }

    while (listener) {
      nextListener = listener.next;
      listenerCallback = listener.callback;

      if (listenerCallback === callback || listenerCallback[FN_REF] === callback) {
        if (previousListener) {
          previousListener.next = nextListener;
        } else {
          // new first listener
          this._setListeners(event, nextListener);
        }
      }

      previousListener = listener;
      listener = nextListener;
    }
  };
  /**
   * A event that is emitted via the event bus.
   */


  function InternalEvent() {}

  InternalEvent.prototype.stopPropagation = function () {
    this.cancelBubble = true;
  };

  InternalEvent.prototype.preventDefault = function () {
    this.defaultPrevented = true;
  };

  InternalEvent.prototype.init = function (data) {
    assign(this, data || {});
  };
  /**
   * Invoke function. Be fast...
   *
   * @param {Function} fn
   * @param {Array<Object>} args
   *
   * @return {Any}
   */


  function invokeFunction(fn, args) {
    return fn.apply(null, args);
  }

  /**
   * A factory to create a configurable debouncer.
   *
   * @param {number|boolean} [config=true]
   */

  function DebounceFactory(config = true) {
    const timeout = typeof config === 'number' ? config : config ? 300 : 0;

    if (timeout) {
      return fn => debounce$2(fn, timeout);
    } else {
      return fn => fn;
    }
  }
  DebounceFactory.$inject = ['config.debounce'];

  class FieldFactory {
    /**
     * @constructor
     *
     * @param { import('./FormFieldRegistry').default } formFieldRegistry
     * @param { import('@bpmn-io/form-js-viewer').FormFields } formFields
     */
    constructor(formFieldRegistry, formFields) {
      this._formFieldRegistry = formFieldRegistry;
      this._formFields = formFields;
    }

    create(attrs, applyDefaults = true) {
      const {
        id,
        key,
        type
      } = attrs;

      const fieldDefinition = this._formFields.get(type);

      if (!fieldDefinition) {
        throw new Error(`form field of type <${type}> not supported`);
      }

      if (id && this._formFieldRegistry._ids.assigned(id)) {
        throw new Error(`ID <${id}> already assigned`);
      }

      if (key && this._formFieldRegistry._keys.assigned(key)) {
        throw new Error(`key <${key}> already assigned`);
      }

      const labelAttrs = applyDefaults && fieldDefinition.label ? {
        label: fieldDefinition.label
      } : {};
      const field = fieldDefinition.create({ ...labelAttrs,
        ...attrs
      });

      this._ensureId(field);

      if (fieldDefinition.keyed) {
        this._ensureKey(field, applyDefaults);
      }

      return field;
    }

    _ensureId(field) {
      if (field.id) {
        this._formFieldRegistry._ids.claim(field.id, field);

        return;
      }

      let prefix = 'Field';

      if (field.type === 'default') {
        prefix = 'Form';
      }

      field.id = this._formFieldRegistry._ids.nextPrefixed(`${prefix}_`, field);
    }

    _ensureKey(field, applyDefaults) {
      if (field.key) {
        this._formFieldRegistry._keys.claim(field.key, field);

        return;
      }

      if (applyDefaults) {
        let prefix = 'field';
        field.key = this._formFieldRegistry._keys.nextPrefixed(`${prefix}_`, field);
      }
    }

  }
  FieldFactory.$inject = ['formFieldRegistry', 'formFields'];

  class FormFieldRegistry extends FormFieldRegistry$1 {
    /**
     * Updates a form fields id.
     *
     * @param {Object} formField
     * @param {string} newId
     */
    updateId(formField, newId) {
      this._validateId(newId);

      this._eventBus.fire('formField.updateId', {
        formField,
        newId: newId
      });

      this.remove(formField);
      formField.id = newId;
      this.add(formField); // TODO(nikku): make this a proper object graph so we
      // do not have to deal with IDs this way...

      if ('components' in formField) {
        for (const component of formField.components) {
          component._parent = newId;
        }
      }
    }
    /**
     * Validate the suitability of the given id and signals a problem
     * with an exception.
     *
     * @param {string} id
     *
     * @throws {Error} if id is empty or already assigned
     */


    _validateId(id) {
      if (!id) {
        throw new Error('formField must have an id');
      }

      if (this.get(id)) {
        throw new Error('formField with id ' + id + ' already added');
      }
    }

  }

  class Importer {
    /**
     * @constructor
     * @param { import('../core/FormFieldRegistry').default } formFieldRegistry
     * @param { import('../core/FieldFactory').default } fieldFactory
     */
    constructor(formFieldRegistry, fieldFactory) {
      this._formFieldRegistry = formFieldRegistry;
      this._fieldFactory = fieldFactory;
    }
    /**
     * Import schema creating fields, attaching additional
     * information to each field and adding fields to the
     * field registry.
     *
     * Additional information attached:
     *
     *   * `id` (unless present)
     *   * `_parent`
     *   * `_path`
     *
     * @param {any} schema
     *
     * @typedef {{ warnings: Error[], schema: any }} ImportResult
     * @returns {ImportResult}
     */


    importSchema(schema) {
      // TODO: Add warnings
      const warnings = [];

      try {
        const importedSchema = this.importFormField(clone(schema));
        return {
          schema: importedSchema,
          warnings
        };
      } catch (err) {
        err.warnings = warnings;
        throw err;
      }
    }
    /**
     * @param {{[x: string]: any}} fieldAttrs
     * @param {String} [parentId]
     * @param {number} [index]
     *
     * @return {any} field
     */


    importFormField(fieldAttrs, parentId, index) {
      const {
        components,
        id,
        key
      } = fieldAttrs;
      let parent, path;

      if (parentId) {
        parent = this._formFieldRegistry.get(parentId);
      } // validate <id> uniqueness


      if (id && this._formFieldRegistry._ids.assigned(id)) {
        throw new Error(`form field with id <${id}> already exists`);
      } // validate <key> uniqueness


      if (key && this._formFieldRegistry._keys.assigned(key)) {
        throw new Error(`form field with key <${key}> already exists`);
      } // set form field path


      path = parent ? [...parent._path, 'components', index] : [];

      const field = this._fieldFactory.create({ ...fieldAttrs,
        _path: path,
        _parent: parent && parent.id
      }, false);

      this._formFieldRegistry.add(field);

      if (components) {
        field.components = this.importFormFields(components, field.id);
      }

      return field;
    }
    /**
     * @param {Array<any>} components
     * @param {string} parentId
     *
     * @return {Array<any>} imported components
     */


    importFormFields(components, parentId) {
      return components.map((component, index) => {
        return this.importFormField(component, parentId, index);
      });
    }

  }
  Importer.$inject = ['formFieldRegistry', 'fieldFactory'];

  var importModule = {
    importer: ['type', Importer]
  };

  const DragAndDropContext = D$1({
    drake: null
  });

  /**
   * @param {string} type
   * @param {boolean} [strict]
   *
   * @returns {any}
   */

  function getService(type, strict) {}

  const FormEditorContext = D$1({
    getService
  });

  function useService (type, strict) {
    const {
      getService
    } = F$1(FormEditorContext);
    return getService(type, strict);
  }

  function _extends$e() { _extends$e = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }
  var ButtonIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$e({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M45 17a3 3 0 013 3v14a3 3 0 01-3 3H9a3 3 0 01-3-3V20a3 3 0 013-3h36zm-9 8.889H18v2.222h18V25.89z"
  })));

  function _extends$d() { _extends$d = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }
  var CheckboxIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$d({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M34 18H20a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V20a2 2 0 00-2-2zm-9 14l-5-5 1.41-1.41L25 29.17l7.59-7.59L34 23l-9 9z"
  })));

  function _extends$c() { _extends$c = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }
  var ChecklistIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$c({
    width: "54",
    height: "54",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M19 24h-6v6h6v-6zm-6-2a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6zm6 18h-6v6h6v-6zm-6-2a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6zm6-30h-6v6h6V8zm-6-2a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2h-6z",
    fill: "#22242A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26 26a1 1 0 011-1h15a1 1 0 011 1v2a1 1 0 01-1 1H27a1 1 0 01-1-1v-2zm0 16a1 1 0 011-1h15a1 1 0 011 1v2a1 1 0 01-1 1H27a1 1 0 01-1-1v-2zm0-32a1 1 0 011-1h15a1 1 0 011 1v2a1 1 0 01-1 1H27a1 1 0 01-1-1v-2z",
    fill: "#22242A"
  })));

  function _extends$b() { _extends$b = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }
  var TaglistIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$b({
    width: "54",
    height: "54",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1z",
    fill: "#000"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 22a1 1 0 011-1h19a1 1 0 011 1v10a1 1 0 01-1 1H12a1 1 0 01-1-1V22z",
    fill: "#505562"
  })));

  function _extends$a() { _extends$a = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }
  var FormIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$a({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "17",
    width: "24",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "25",
    width: "24",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "33",
    width: "13",
    height: "4",
    rx: "1"
  })));

  function _extends$9() { _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
  var ColumnsIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$9({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M8 33v5a1 1 0 001 1h4v2H9a3 3 0 01-3-3v-5h2zm18 6v2H15v-2h11zm13 0v2H28v-2h11zm9-6v5a3 3 0 01-3 3h-4v-2h4a1 1 0 00.993-.883L46 38v-5h2zM8 22v9H6v-9h2zm40 0v9h-2v-9h2zm-35-9v2H9a1 1 0 00-.993.883L8 16v4H6v-4a3 3 0 013-3h4zm32 0a3 3 0 013 3v4h-2v-4a1 1 0 00-.883-.993L45 15h-4v-2h4zm-6 0v2H28v-2h11zm-13 0v2H15v-2h11z"
  })));

  function _extends$8() { _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
  var NumberIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$8({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1zM35 28.444h7l-3.5 4-3.5-4zM35 26h7l-3.5-4-3.5 4z"
  })));

  function _extends$7() { _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
  var RadioIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$7({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M27 22c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
  })));

  function _extends$6() { _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
  var SelectIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$6({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1zm-12 7h9l-4.5 6-4.5-6z"
  })));

  function _extends$5() { _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
  var TextIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$5({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M20.58 33.77h-3l-1.18-3.08H11l-1.1 3.08H7l5.27-13.54h2.89zm-5-5.36l-1.86-5-1.83 5zM22 20.23h5.41a15.47 15.47 0 012.4.14 3.42 3.42 0 011.41.55 3.47 3.47 0 011 1.14 3 3 0 01.42 1.58 3.26 3.26 0 01-1.91 2.94 3.63 3.63 0 011.91 1.22 3.28 3.28 0 01.66 2 4 4 0 01-.43 1.8 3.63 3.63 0 01-1.09 1.4 3.89 3.89 0 01-1.83.65q-.69.07-3.3.09H22zm2.73 2.25v3.13h3.8a1.79 1.79 0 001.1-.49 1.41 1.41 0 00.41-1 1.49 1.49 0 00-.35-1 1.54 1.54 0 00-1-.48c-.27 0-1.05-.05-2.34-.05zm0 5.39v3.62h2.57a11.52 11.52 0 001.88-.09 1.65 1.65 0 001-.54 1.6 1.6 0 00.38-1.14 1.75 1.75 0 00-.29-1 1.69 1.69 0 00-.86-.62 9.28 9.28 0 00-2.41-.23zM44.35 28.79l2.65.84a5.94 5.94 0 01-2 3.29A5.74 5.74 0 0141.38 34a5.87 5.87 0 01-4.44-1.84 7.09 7.09 0 01-1.73-5A7.43 7.43 0 0137 21.87 6 6 0 0141.54 20a5.64 5.64 0 014 1.47A5.33 5.33 0 0147 24l-2.7.65a2.8 2.8 0 00-2.86-2.27A3.09 3.09 0 0039 23.42a5.31 5.31 0 00-.93 3.5 5.62 5.62 0 00.93 3.65 3 3 0 002.4 1.09 2.72 2.72 0 001.82-.66 4 4 0 001.13-2.21z"
  })));

  function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
  var TextfieldIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54"
  }, props), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M45 16a3 3 0 013 3v16a3 3 0 01-3 3H9a3 3 0 01-3-3V19a3 3 0 013-3h36zm0 2H9a1 1 0 00-1 1v16a1 1 0 001 1h36a1 1 0 001-1V19a1 1 0 00-1-1zm-32 4v10h-2V22h2z"
  })));

  function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
  var DateFieldIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54",
    viewBox: "0 0 448 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M152 64h144V24c0-13.25 10.7-24 24-24s24 10.75 24 24v40h40c35.3 0 64 28.65 64 64v320c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V128c0-35.35 28.65-64 64-64h40V24c0-13.25 10.7-24 24-24s24 10.75 24 24v40zM48 448c0 8.8 7.16 16 16 16h320c8.8 0 16-7.2 16-16V192H48v256z"
  })));

  function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
  var TableIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    width: "54",
    height: "54",
    viewBox: "0 0 512 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M448 32c35.3 0 64 28.65 64 64v320c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V96c0-35.35 28.65-64 64-64h384zM224 256v-96H64v96h160zM64 320v96h160v-96H64zm224 96h160v-96H288v96zm160-160v-96H288v96h160z"
  })));

  function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
  var FileUploadIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 384 512"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M256 0v128h128L256 0zm-32 128V0H48C21.49 0 0 21.49 0 48v416c0 26.5 21.49 48 48 48h288c26.51 0 48-21.49 48-48V160H256.9c-18.6 0-32.9-14.3-32.9-32zm64.1 216.1c-3.8 5.6-9.9 7.9-16.1 7.9s-12.28-2.344-16.97-7.031L216 305.9V408c0 13.25-10.75 24-24 24s-24-10.75-24-24V305.9l-39.03 39.03c-9.375 9.375-24.56 9.375-33.94 0s-9.375-24.56 0-33.94l80-80c9.375-9.375 24.56-9.375 33.94 0l80 80c9.33 9.41 9.33 24.61-.87 33.11z"
  })));

  const iconsByType = {
    button: ButtonIcon,
    checkbox: CheckboxIcon,
    checklist: ChecklistIcon,
    columns: ColumnsIcon,
    number: NumberIcon,
    radio: RadioIcon,
    select: SelectIcon,
    taglist: TaglistIcon,
    text: TextIcon,
    textfield: TextfieldIcon,
    datefield: DateFieldIcon,
    table: TableIcon,
    fileUpload: FileUploadIcon,
    default: FormIcon
  };

  const types = [{
    label: 'Text Field',
    type: 'textfield'
  }, {
    label: 'Number',
    type: 'number'
  }, {
    label: 'Checkbox',
    type: 'checkbox'
  }, {
    label: 'Checklist',
    type: 'checklist'
  }, {
    label: 'Taglist',
    type: 'taglist'
  }, {
    label: 'Radio',
    type: 'radio'
  }, {
    label: 'Select',
    type: 'select'
  }, {
    label: 'Text',
    type: 'text'
  }, {
    label: 'Button',
    type: 'button'
  }, {
    label: 'Date Field',
    type: 'datefield'
  }, {
    label: 'Table',
    type: 'table'
  }, {
    label: 'FileUpload',
    type: 'fileUpload'
  }];
  function Palette(props) {
    return e$1("div", {
      class: "fjs-palette",
      children: [e$1("div", {
        class: "fjs-palette-header",
        title: "Form elements library",
        children: [e$1("span", {
          class: "fjs-hide-compact",
          children: "FORM ELEMENTS "
        }), "LIBRARY"]
      }), e$1("div", {
        class: "fjs-palette-fields fjs-drag-container fjs-no-drop",
        children: types.map(({
          label,
          type
        }) => {
          const Icon = iconsByType[type];
          return e$1("div", {
            class: "fjs-palette-field fjs-drag-copy fjs-no-drop",
            "data-field-type": type,
            title: `Create a ${label} element`,
            children: [Icon ? Icon.name == "DateFieldIcon" || Icon.name == "TableIcon" || Icon.name == "FileUploadIcon" ? e$1(Icon, {
              class: "fjs-palette-field-icon",
              width: "36",
              height: "36"
            }) : e$1(Icon, {
              class: "fjs-palette-field-icon",
              width: "36",
              height: "36",
              viewBox: "0 0 54 54"
            }) : null, e$1("span", {
              class: "fjs-palette-field-text fjs-hide-compact",
              children: label
            })]
          });
        })
      })]
    });
  }

  var ArrowIcon = function ArrowIcon(props) {
    return e$1("svg", { ...props,
      children: e$1("path", {
        fillRule: "evenodd",
        d: "m11.657 8-4.95 4.95a1 1 0 0 1-1.414-1.414L8.828 8 5.293 4.464A1 1 0 1 1 6.707 3.05L11.657 8z"
      })
    });
  };

  ArrowIcon.defaultProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16"
  };

  var CreateIcon = function CreateIcon(props) {
    return e$1("svg", { ...props,
      children: e$1("path", {
        fillRule: "evenodd",
        d: "M9 13V9h4a1 1 0 0 0 0-2H9V3a1 1 0 1 0-2 0v4H3a1 1 0 1 0 0 2h4v4a1 1 0 0 0 2 0z"
      })
    });
  };

  CreateIcon.defaultProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16"
  };

  var DeleteIcon = function DeleteIcon(props) {
    return e$1("svg", { ...props,
      children: e$1("path", {
        fillRule: "evenodd",
        d: "M12 6v7c0 1.1-.4 1.55-1.5 1.55h-5C4.4 14.55 4 14.1 4 13V6h8zm-1.5 1.5h-5v4.3c0 .66.5 1.2 1.111 1.2H9.39c.611 0 1.111-.54 1.111-1.2V7.5zM13 3h-2l-1-1H6L5 3H3v1.5h10V3z"
      })
    });
  };

  DeleteIcon.defaultProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16"
  };

  var ExternalLinkIcon = function ExternalLinkIcon(props) {
    return e$1("svg", { ...props,
      children: e$1("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.637 12.637v-4.72h1.362v4.721c0 .36-.137.676-.411.95-.275.275-.591.412-.95.412H3.362c-.38 0-.703-.132-.967-.396A1.315 1.315 0 0 1 2 12.638V3.362c0-.38.132-.703.396-.967S2.982 2 3.363 2h4.553v1.363H3.363v9.274h9.274zM14 2H9.28l-.001 1.362h2.408L5.065 9.984l.95.95 6.622-6.622v2.409H14V2z",
        fill: "#818798"
      })
    });
  };

  ExternalLinkIcon.defaultProps = {
    width: "16",
    height: "16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  var FeelRequiredIcon = function FeelRequiredIcon(props) {
    return e$1("svg", { ...props,
      children: [e$1("path", {
        d: "M5.8 7.06V5.95h4.307v1.11H5.8zm0 3.071v-1.11h4.307v1.11H5.8z",
        fill: "#505562"
      }), e$1("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M8 3.268A4.732 4.732 0 1 0 12.732 8H14a6 6 0 1 1-6-6v1.268z",
        fill: "#505562"
      }), e$1("path", {
        d: "m11.28 6.072-.832-.56 1.016-1.224L10 3.848l.312-.912 1.392.584L11.632 2h1.032l-.072 1.52 1.392-.584.312.912-1.464.44 1.008 1.224-.832.552-.864-1.296-.864 1.304z",
        fill: "#505562"
      })]
    });
  };

  FeelRequiredIcon.defaultProps = {
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  var FeelOptionalIcon = function FeelOptionalIcon(props) {
    return e$1("svg", { ...props,
      children: [e$1("path", {
        d: "M5.845 7.04V5.93h4.307v1.11H5.845zm0 3.07V9h4.307v1.11H5.845z",
        fill: "#505562"
      }), e$1("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M3.286 8a4.714 4.714 0 1 0 9.428 0 4.714 4.714 0 0 0-9.428 0zM8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z",
        fill: "#505562"
      })]
    });
  };

  FeelOptionalIcon.defaultProps = {
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  function Header(props) {
    const {
      element,
      headerProvider
    } = props;
    const {
      getElementIcon,
      getDocumentationRef,
      getElementLabel,
      getTypeLabel
    } = headerProvider;
    const label = getElementLabel(element);
    const type = getTypeLabel(element);
    const documentationRef = getDocumentationRef && getDocumentationRef(element);
    const ElementIcon = getElementIcon(element);
    return e$1("div", {
      class: "bio-properties-panel-header",
      children: [e$1("div", {
        class: "bio-properties-panel-header-icon",
        children: ElementIcon && e$1(ElementIcon, {
          width: "32",
          height: "32",
          viewBox: "0 0 32 32"
        })
      }), e$1("div", {
        class: "bio-properties-panel-header-labels",
        children: [e$1("div", {
          title: type,
          class: "bio-properties-panel-header-type",
          children: type
        }), label ? e$1("div", {
          title: label,
          class: "bio-properties-panel-header-label",
          children: label
        }) : null]
      }), e$1("div", {
        class: "bio-properties-panel-header-actions",
        children: documentationRef ? e$1("a", {
          rel: "noopener",
          class: "bio-properties-panel-header-link",
          href: documentationRef,
          title: "Open documentation",
          target: "_blank",
          children: e$1(ExternalLinkIcon, {})
        }) : null
      })]
    });
  }

  const DescriptionContext = D$1({
    description: {},
    getDescriptionForId: () => {}
  });
  /**
   * @typedef {Function} <propertiesPanel.showEntry> callback
   *
   * @example
   *
   * useEvent('propertiesPanel.showEntry', ({ focus = false, ...rest }) => {
   *   // ...
   * });
   *
   * @param {Object} context
   * @param {boolean} [context.focus]
   *
   * @returns void
   */

  const EventContext = D$1({
    eventBus: null
  });
  const LayoutContext = D$1({
    layout: {},
    setLayout: () => {},
    getLayoutForKey: () => {},
    setLayoutForKey: () => {}
  });
  /**
   * Accesses the global DescriptionContext and returns a description for a given id and element.
   *
   * @example
   * ```jsx
   * function TextField(props) {
   *   const description = useDescriptionContext('input1', element);
   * }
   * ```
   *
   * @param {string} id
   * @param {object} element
   *
   * @returns {string}
   */

  function useDescriptionContext(id, element) {
    const {
      getDescriptionForId
    } = F$1(DescriptionContext);
    return getDescriptionForId(id, element);
  }

  const DEFAULT_PRIORITY$2 = 1000;
  /**
   * Subscribe to an event.
   *
   * @param {string} event
   * @param {Function} callback
   * @param {number} [priority]
   *
   * @returns {import('preact').Ref}
   */

  function useEvent(event, callback, priority = DEFAULT_PRIORITY$2) {
    const {
      eventBus
    } = F$1(EventContext);
    y(() => {
      if (!eventBus) {
        return;
      }

      eventBus.on(event, priority, callback);
      return () => eventBus.off(event, callback);
    }, [callback, event, eventBus, priority]);
  }

  const HIGH_PRIORITY = 10000;
  /**
   * Buffer events and re-fire during passive effect phase.
   *
   * @param {string[]} bufferedEvents
   * @param {Object} [eventBus]
   */

  function useEventBuffer(bufferedEvents, eventBus) {
    const buffer = s([]),
          buffering = s(true);

    const createCallback = event => data => {
      if (buffering.current === true) {
        buffer.current.unshift([event, data]);
      }
    }; // (1) buffer events


    y(() => {
      if (!eventBus) {
        return;
      }

      const listeners = bufferedEvents.map(event => {
        return [event, createCallback(event)];
      });
      listeners.forEach(([event, callback]) => {
        eventBus.on(event, HIGH_PRIORITY, callback);
      });
      return () => {
        listeners.forEach(([event, callback]) => {
          eventBus.off(event, callback);
        });
      };
    }, [bufferedEvents, eventBus]); // (2) re-fire events

    y(() => {
      if (!eventBus) {
        return;
      }

      buffering.current = false;

      while (buffer.current.length) {
        const [event, data] = buffer.current.pop();
        eventBus.fire(event, data);
      }

      buffering.current = true;
    });
  }
  /**
   * Creates a state that persists in the global LayoutContext.
   *
   * @example
   * ```jsx
   * function Group(props) {
   *   const [ open, setOpen ] = useLayoutState([ 'groups', 'foo', 'open' ], false);
   * }
   * ```
   *
   * @param {(string|number)[]} path
   * @param {any} [defaultValue]
   *
   * @returns {[ any, Function ]}
   */


  function useLayoutState(path, defaultValue) {
    const {
      getLayoutForKey,
      setLayoutForKey
    } = F$1(LayoutContext);
    const layoutForKey = getLayoutForKey(path, defaultValue);
    const [value, set] = l$1(layoutForKey);

    const setState = newValue => {
      // (1) set component state
      set(newValue); // (2) set context

      setLayoutForKey(path, newValue);
    };

    return [value, setState];
  }
  /**
   * @pinussilvestrus: we need to introduce our own hook to persist the previous
   * state on updates.
   *
   * cf. https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
   */


  function usePrevious(value) {
    const ref = s();
    y(() => {
      ref.current = value;
    });
    return ref.current;
  }
  /**
   * Subscribe to `propertiesPanel.showEntry`.
   *
   * @param {Function} show
   *
   * @returns {import('preact').Ref}
   */


  function useShowEntryEvent(show) {
    const {
      onShow
    } = F$1(LayoutContext);
    const ref = s();
    const [focus, setFocus] = l$1(false);
    const onShowEntry = A$1(event => {
      if (show(event)) {
        if (isFunction(onShow)) {
          onShow();
        }

        if (event.focus && !focus) {
          setFocus(true);
        }
      }
    }, [show]);
    y(() => {
      if (focus && ref.current) {
        if (isFunction(ref.current.focus)) {
          ref.current.focus();
        }

        if (isFunction(ref.current.select)) {
          ref.current.select();
        }

        setFocus(false);
      }
    }, [focus]);
    useEvent('propertiesPanel.showEntry', onShowEntry);
    return ref;
  }
  /**
   * Subscribe to `propertiesPanel.showError`. On `propertiesPanel.showError` set
   * temporary error. Fire `propertiesPanel.showEntry` for temporary error to be
   * visible. Unset error on `propertiesPanel.updated`.
   *
   * @param {Function} show
   *
   * @returns {import('preact').Ref}
   */


  function useShowErrorEvent(show) {
    const {
      eventBus
    } = F$1(EventContext);
    const [temporaryError, setTemporaryError] = l$1(null);
    const onPropertiesPanelUpdated = A$1(() => setTemporaryError(null), []);
    useEvent('propertiesPanel.updated', onPropertiesPanelUpdated);
    const onShowError = A$1(event => {
      setTemporaryError(null);

      if (show(event)) {
        if (eventBus) {
          eventBus.fire('propertiesPanel.showEntry', event);
        }

        setTemporaryError(event.message);
      }
    }, [show]);
    useEvent('propertiesPanel.showError', onShowError);
    return temporaryError;
  }
  /**
   * @callback setSticky
   * @param {boolean} value
   */

  /**
   * Use IntersectionObserver to identify when DOM element is in sticky mode.
   * If sticky is observered setSticky(true) will be called.
   * If sticky mode is left, setSticky(false) will be called.
   *
   *
   * @param {Object} ref
   * @param {string} scrollContainerSelector
   * @param {setSticky} setSticky
   */


  function useStickyIntersectionObserver(ref, scrollContainerSelector, setSticky) {
    y(() => {
      // return early if IntersectionObserver is not available
      if (!IntersectionObserver) {
        return;
      }

      let observer;

      if (ref.current) {
        const scrollContainer = query(scrollContainerSelector);
        observer = new IntersectionObserver(entries => {
          if (entries[0].intersectionRatio < 1) {
            setSticky(true);
          } else if (entries[0].intersectionRatio === 1) {
            setSticky(false);
          }
        }, {
          root: scrollContainer,
          rootMargin: '0px 0px 999999% 0px',
          // Use bottom margin to avoid stickyness when scrolling out to bottom
          threshold: [1]
        });
        observer.observe(ref.current);
      } // Unobserve if unmounted


      return () => {
        if (ref.current && observer) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref]);
  }

  function Group(props) {
    const {
      element,
      entries = [],
      id,
      label,
      shouldOpen = false
    } = props;
    const groupRef = s(null);
    const [open, setOpen] = useLayoutState(['groups', id, 'open'], shouldOpen);
    const onShow = A$1(() => setOpen(true), [setOpen]);

    const toggleOpen = () => setOpen(!open);

    const [edited, setEdited] = l$1(false);
    const [sticky, setSticky] = l$1(false); // set edited state depending on all entries

    y(() => {
      const hasOneEditedEntry = entries.find(entry => {
        const {
          id,
          isEdited
        } = entry;
        const entryNode = query(`[data-entry-id="${id}"]`);

        if (!isFunction(isEdited) || !entryNode) {
          return false;
        }

        const inputNode = query('.bio-properties-panel-input', entryNode);
        return isEdited(inputNode);
      });
      setEdited(hasOneEditedEntry);
    }, [entries]); // set css class when group is sticky to top

    useStickyIntersectionObserver(groupRef, 'div.bio-properties-panel-scroll-container', setSticky);
    const propertiesPanelContext = { ...F$1(LayoutContext),
      onShow
    };
    return e$1("div", {
      class: "bio-properties-panel-group",
      "data-group-id": 'group-' + id,
      ref: groupRef,
      children: [e$1("div", {
        class: classnames('bio-properties-panel-group-header', edited ? '' : 'empty', open ? 'open' : '', sticky && open ? 'sticky' : ''),
        onClick: toggleOpen,
        children: [e$1("div", {
          title: label,
          class: "bio-properties-panel-group-header-title",
          children: label
        }), e$1("div", {
          class: "bio-properties-panel-group-header-buttons",
          children: [edited && e$1(DataMarker, {}), e$1("button", {
            title: "Toggle section",
            class: "bio-properties-panel-group-header-button bio-properties-panel-arrow",
            children: e$1(ArrowIcon, {
              class: open ? 'bio-properties-panel-arrow-down' : 'bio-properties-panel-arrow-right'
            })
          })]
        })]
      }), e$1("div", {
        class: classnames('bio-properties-panel-group-entries', open ? 'open' : ''),
        children: e$1(LayoutContext.Provider, {
          value: propertiesPanelContext,
          children: entries.map(entry => {
            const {
              component: Component,
              id
            } = entry;
            return v$1(Component, { ...entry,
              element: element,
              key: id
            });
          })
        })
      })]
    });
  }

  function DataMarker() {
    return e$1("div", {
      title: "Section contains data",
      class: "bio-properties-panel-dot"
    });
  }
  /**
   * @typedef { {
   *  text: (element: object) => string,
   *  icon?: (element: Object) => import('preact').Component
   * } } PlaceholderDefinition
   *
   * @param { PlaceholderDefinition } props
   */


  function Placeholder(props) {
    const {
      text,
      icon: Icon
    } = props;
    return e$1("div", {
      class: "bio-properties-panel open",
      children: e$1("section", {
        class: "bio-properties-panel-placeholder",
        children: [Icon && e$1(Icon, {
          class: "bio-properties-panel-placeholder-icon"
        }), e$1("p", {
          class: "bio-properties-panel-placeholder-text",
          children: text
        })]
      })
    });
  }

  const DEFAULT_LAYOUT = {
    open: true
  };
  const DEFAULT_DESCRIPTION = {};
  const bufferedEvents = ['propertiesPanel.showEntry', 'propertiesPanel.showError'];
  /**
   * @typedef { {
   *    component: import('preact').Component,
   *    id: String,
   *    isEdited?: Function
   * } } EntryDefinition
   *
   * @typedef { {
   *    autoFocusEntry: String,
   *    autoOpen?: Boolean,
   *    entries: Array<EntryDefinition>,
   *    id: String,
   *    label: String,
   *    remove: (event: MouseEvent) => void
   * } } ListItemDefinition
   *
   * @typedef { {
   *    add: (event: MouseEvent) => void,
   *    component: import('preact').Component,
   *    element: Object,
   *    id: String,
   *    items: Array<ListItemDefinition>,
   *    label: String,
   *    shouldSort?: Boolean,
   *    shouldOpen?: Boolean
   * } } ListGroupDefinition
   *
   * @typedef { {
   *    component?: import('preact').Component,
   *    entries: Array<EntryDefinition>,
   *    id: String,
   *    label: String,
   *    shouldOpen?: Boolean
   * } } GroupDefinition
   *
   *  @typedef { {
   *    [id: String]: GetDescriptionFunction
   * } } DescriptionConfig
   *
   * @callback { {
   * @param {string} id
   * @param {Object} element
   * @returns {string}
   * } } GetDescriptionFunction
   *
   * @typedef { {
   *  getEmpty: (element: object) => import('./components/Placeholder').PlaceholderDefinition,
   *  getMultiple: (element: Object) => import('./components/Placeholder').PlaceholderDefinition
   * } } PlaceholderProvider
   *
   */

  /**
   * A basic properties panel component. Describes *how* content will be rendered, accepts
   * data from implementor to describe *what* will be rendered.
   *
   * @param {Object} props
   * @param {Object|Array} props.element
   * @param {import('./components/Header').HeaderProvider} props.headerProvider
   * @param {PlaceholderProvider} [props.placeholderProvider]
   * @param {Array<GroupDefinition|ListGroupDefinition>} props.groups
   * @param {Object} [props.layoutConfig]
   * @param {Function} [props.layoutChanged]
   * @param {DescriptionConfig} [props.descriptionConfig]
   * @param {Function} [props.descriptionLoaded]
   * @param {Object} [props.eventBus]
   */

  function PropertiesPanel(props) {
    const {
      element,
      headerProvider,
      placeholderProvider,
      groups,
      layoutConfig = {},
      layoutChanged,
      descriptionConfig = {},
      descriptionLoaded,
      eventBus
    } = props; // set-up layout context

    const [layout, setLayout] = l$1(createLayout(layoutConfig));
    y(() => {
      if (typeof layoutChanged === 'function') {
        layoutChanged(layout);
      }
    }, [layout, layoutChanged]);

    const getLayoutForKey = (key, defaultValue) => {
      return get(layout, key, defaultValue);
    };

    const setLayoutForKey = (key, config) => {
      const newLayout = assign({}, layout);
      set(newLayout, key, config);
      setLayout(newLayout);
    };

    const layoutContext = {
      layout,
      setLayout,
      getLayoutForKey,
      setLayoutForKey
    }; // set-up description context

    const description = createDescriptionContext(descriptionConfig);

    if (typeof descriptionLoaded === 'function') {
      descriptionLoaded(description);
    }

    const getDescriptionForId = (id, element) => {
      return description[id] && description[id](element);
    };

    const descriptionContext = {
      description,
      getDescriptionForId
    };
    useEventBuffer(bufferedEvents, eventBus);
    const eventContext = {
      eventBus
    };
    const propertiesPanelContext = {
      element
    }; // empty state

    if (placeholderProvider && !element) {
      return e$1(Placeholder, { ...placeholderProvider.getEmpty()
      });
    } // multiple state


    if (placeholderProvider && isArray$1(element)) {
      return e$1(Placeholder, { ...placeholderProvider.getMultiple()
      });
    }

    return e$1(LayoutContext.Provider, {
      value: propertiesPanelContext,
      children: e$1(DescriptionContext.Provider, {
        value: descriptionContext,
        children: e$1(LayoutContext.Provider, {
          value: layoutContext,
          children: e$1(EventContext.Provider, {
            value: eventContext,
            children: e$1("div", {
              class: classnames('bio-properties-panel', layout.open ? 'open' : ''),
              children: [e$1(Header, {
                element: element,
                headerProvider: headerProvider
              }), e$1("div", {
                class: "bio-properties-panel-scroll-container",
                children: groups.map(group => {
                  const {
                    component: Component = Group,
                    id
                  } = group;
                  return v$1(Component, { ...group,
                    key: id,
                    element: element
                  });
                })
              })]
            })
          })
        })
      })
    });
  } // helpers //////////////////


  function createLayout(overrides) {
    return { ...DEFAULT_LAYOUT,
      ...overrides
    };
  }

  function createDescriptionContext(overrides) {
    return { ...DEFAULT_DESCRIPTION,
      ...overrides
    };
  }

  function CollapsibleEntry(props) {
    const {
      element,
      entries = [],
      id,
      label,
      open: shouldOpen,
      remove
    } = props;
    const [open, setOpen] = l$1(shouldOpen);

    const toggleOpen = () => setOpen(!open);

    const {
      onShow
    } = F$1(LayoutContext);
    const propertiesPanelContext = { ...F$1(LayoutContext),
      onShow: A$1(() => {
        setOpen(true);

        if (isFunction(onShow)) {
          onShow();
        }
      }, [onShow, setOpen])
    }; // todo(pinussilvestrus): translate once we have a translate mechanism for the core

    const placeholderLabel = '<empty>';
    return e$1("div", {
      "data-entry-id": id,
      class: classnames('bio-properties-panel-collapsible-entry', open ? 'open' : ''),
      children: [e$1("div", {
        class: "bio-properties-panel-collapsible-entry-header",
        onClick: toggleOpen,
        children: [e$1("div", {
          title: label || placeholderLabel,
          class: classnames('bio-properties-panel-collapsible-entry-header-title', !label && 'empty'),
          children: label || placeholderLabel
        }), e$1("button", {
          title: "Toggle list item",
          class: "bio-properties-panel-arrow  bio-properties-panel-collapsible-entry-arrow",
          children: e$1(ArrowIcon, {
            class: open ? 'bio-properties-panel-arrow-down' : 'bio-properties-panel-arrow-right'
          })
        }), remove ? e$1("button", {
          title: "Delete item",
          class: "bio-properties-panel-remove-entry",
          onClick: remove,
          children: e$1(DeleteIcon, {})
        }) : null]
      }), e$1("div", {
        class: classnames('bio-properties-panel-collapsible-entry-entries', open ? 'open' : ''),
        children: e$1(LayoutContext.Provider, {
          value: propertiesPanelContext,
          children: entries.map(entry => {
            const {
              component: Component,
              id
            } = entry;
            return v$1(Component, { ...entry,
              element: element,
              key: id
            });
          })
        })
      })]
    });
  }

  function ListItem(props) {
    const {
      autoFocusEntry,
      autoOpen
    } = props; // focus specified entry on auto open

    y(() => {
      if (autoOpen && autoFocusEntry) {
        const entry = query(`[data-entry-id="${autoFocusEntry}"]`);
        const focusableInput = query('.bio-properties-panel-input', entry);

        if (focusableInput) {
          if (isFunction(focusableInput.select)) {
            focusableInput.select();
          } else if (isFunction(focusableInput.focus)) {
            focusableInput.focus();
          }
        }
      }
    }, [autoOpen, autoFocusEntry]);
    return e$1("div", {
      class: "bio-properties-panel-list-item",
      children: e$1(CollapsibleEntry, { ...props,
        open: autoOpen
      })
    });
  }

  const noop$3 = () => {};
  /**
   * @param {import('../PropertiesPanel').ListGroupDefinition} props
   */


  function ListGroup(props) {
    const {
      add,
      element,
      id,
      items,
      label,
      shouldOpen = true,
      shouldSort = true
    } = props;
    const groupRef = s(null);
    const [open, setOpen] = useLayoutState(['groups', id, 'open'], false);
    const [sticky, setSticky] = l$1(false);
    const onShow = A$1(() => setOpen(true), [setOpen]);
    const [ordering, setOrdering] = l$1([]);
    const [newItemAdded, setNewItemAdded] = l$1(false);
    const prevItems = usePrevious(items);
    const prevElement = usePrevious(element);
    const elementChanged = element !== prevElement;
    const shouldHandleEffects = !elementChanged && (shouldSort || shouldOpen); // reset initial ordering when element changes (before first render)

    if (elementChanged) {
      setOrdering(createOrdering(shouldSort ? sortItems(items) : items));
    } // keep ordering in sync to items - and open changes
    // (0) set initial ordering from given items


    y(() => {
      if (!prevItems || !shouldSort) {
        setOrdering(createOrdering(items));
      }
    }, [items, element]); // (1) items were added

    y(() => {
      if (shouldHandleEffects && prevItems && items.length > prevItems.length) {
        let add = [];
        items.forEach(item => {
          if (!ordering.includes(item.id)) {
            add.push(item.id);
          }
        });
        let newOrdering = ordering; // open if not open and configured

        if (!open && shouldOpen) {
          toggleOpen(); // if I opened and I should sort, then sort items

          if (shouldSort) {
            newOrdering = createOrdering(sortItems(items));
          }
        } // add new items on top or bottom depending on sorting behavior


        newOrdering = newOrdering.filter(item => !add.includes(item));

        if (shouldSort) {
          newOrdering.unshift(...add);
        } else {
          newOrdering.push(...add);
        }

        setOrdering(newOrdering);
        setNewItemAdded(true);
      } else {
        setNewItemAdded(false);
      }
    }, [items, open, shouldHandleEffects]); // (2) sort items on open if shouldSort is set

    y(() => {
      if (shouldSort && open && !newItemAdded) {
        setOrdering(createOrdering(sortItems(items)));
      }
    }, [open, shouldSort]); // (3) items were deleted

    y(() => {
      if (shouldHandleEffects && prevItems && items.length < prevItems.length) {
        let keep = [];
        ordering.forEach(o => {
          if (getItem(items, o)) {
            keep.push(o);
          }
        });
        setOrdering(keep);
      }
    }, [items, shouldHandleEffects]); // set css class when group is sticky to top

    useStickyIntersectionObserver(groupRef, 'div.bio-properties-panel-scroll-container', setSticky);

    const toggleOpen = () => setOpen(!open);

    const hasItems = !!items.length;
    const propertiesPanelContext = { ...F$1(LayoutContext),
      onShow
    };
    return e$1("div", {
      class: "bio-properties-panel-group",
      "data-group-id": 'group-' + id,
      ref: groupRef,
      children: [e$1("div", {
        class: classnames('bio-properties-panel-group-header', hasItems ? '' : 'empty', hasItems && open ? 'open' : '', sticky && open ? 'sticky' : ''),
        onClick: hasItems ? toggleOpen : noop$3,
        children: [e$1("div", {
          title: label,
          class: "bio-properties-panel-group-header-title",
          children: label
        }), e$1("div", {
          class: "bio-properties-panel-group-header-buttons",
          children: [add ? e$1("button", {
            title: "Create new list item",
            class: "bio-properties-panel-group-header-button bio-properties-panel-add-entry",
            onClick: add,
            children: [e$1(CreateIcon, {}), !hasItems ? e$1("span", {
              class: "bio-properties-panel-add-entry-label",
              children: "Create"
            }) : null]
          }) : null, hasItems ? e$1("div", {
            title: `List contains ${items.length} item${items.length != 1 ? 's' : ''}`,
            class: "bio-properties-panel-list-badge",
            children: items.length
          }) : null, hasItems ? e$1("button", {
            title: "Toggle section",
            class: "bio-properties-panel-group-header-button bio-properties-panel-arrow",
            children: e$1(ArrowIcon, {
              class: open ? 'bio-properties-panel-arrow-down' : 'bio-properties-panel-arrow-right'
            })
          }) : null]
        })]
      }), e$1("div", {
        class: classnames('bio-properties-panel-list', open && hasItems ? 'open' : ''),
        children: e$1(LayoutContext.Provider, {
          value: propertiesPanelContext,
          children: ordering.map((o, index) => {
            const item = getItem(items, o);

            if (!item) {
              return;
            }

            const {
              id
            } = item; // if item was added, open first or last item based on ordering

            const autoOpen = newItemAdded && (shouldSort ? index === 0 : index === ordering.length - 1);
            return v$1(ListItem, { ...item,
              autoOpen: autoOpen,
              element: element,
              index: index,
              key: id
            });
          })
        })
      })]
    });
  } // helpers ////////////////////

  /**
   * Sorts given items alphanumeric by label
   */


  function sortItems(items) {
    return sortBy(items, i => i.label.toLowerCase());
  }

  function getItem(items, id) {
    return find$1(items, i => i.id === id);
  }

  function createOrdering(items) {
    return items.map(i => i.id);
  }

  function Description$1(props) {
    const {
      element,
      forId,
      value
    } = props;
    const contextDescription = useDescriptionContext(forId, element);
    const description = value || contextDescription;

    if (description) {
      return e$1("div", {
        class: "bio-properties-panel-description",
        children: description
      });
    }
  }

  const noop$2 = () => {};

  function Checkbox(props) {
    const {
      id,
      label,
      onChange,
      disabled,
      value = false,
      show = noop$2
    } = props;

    const handleChange = ({
      target
    }) => {
      onChange(target.checked);
    };

    const ref = useShowEntryEvent(show);
    return e$1("div", {
      class: "bio-properties-panel-checkbox",
      children: [e$1("input", {
        ref: ref,
        id: prefixId$6(id),
        name: id,
        type: "checkbox",
        class: "bio-properties-panel-input",
        onChange: handleChange,
        checked: value,
        disabled: disabled
      }), e$1("label", {
        for: prefixId$6(id),
        class: "bio-properties-panel-label",
        children: label
      })]
    });
  }
  /**
   * @param {Object} props
   * @param {Object} props.element
   * @param {String} props.id
   * @param {String} props.description
   * @param {String} props.label
   * @param {Function} props.getValue
   * @param {Function} props.setValue
   * @param {boolean} [props.disabled]
   */


  function CheckboxEntry(props) {
    const {
      element,
      id,
      description,
      label,
      getValue,
      setValue,
      disabled,
      show = noop$2
    } = props;
    const value = getValue(element);
    const error = useShowErrorEvent(show);
    return e$1("div", {
      class: "bio-properties-panel-entry bio-properties-panel-checkbox-entry",
      "data-entry-id": id,
      children: [e$1(Checkbox, {
        disabled: disabled,
        id: id,
        label: label,
        onChange: setValue,
        show: show,
        value: value
      }), error && e$1("div", {
        class: "bio-properties-panel-error",
        children: error
      }), e$1(Description$1, {
        forId: id,
        element: element,
        value: description
      })]
    });
  }

  function isEdited$6(node) {
    return node && !!node.checked;
  } // helpers /////////////////


  function prefixId$6(id) {
    return `bio-properties-panel-${id}`;
  }

  function NumberField(props) {
    const {
      debounce,
      disabled,
      id,
      label,
      max,
      min,
      onInput,
      step,
      value = ''
    } = props;
    const handleInput = d(() => {
      return debounce(event => {
        const {
          validity,
          value
        } = event.target;

        if (validity.valid) {
          onInput(value ? parseFloat(value) : undefined);
        }
      });
    }, [onInput, debounce]);
    return e$1("div", {
      class: "bio-properties-panel-numberfield",
      children: [e$1("label", {
        for: prefixId$5(id),
        class: "bio-properties-panel-label",
        children: label
      }), e$1("input", {
        id: prefixId$5(id),
        type: "number",
        name: id,
        spellCheck: "false",
        autoComplete: "off",
        disabled: disabled,
        class: "bio-properties-panel-input",
        max: max,
        min: min,
        onInput: handleInput,
        step: step,
        value: value
      })]
    });
  }
  /**
   * @param {Object} props
   * @param {Boolean} props.debounce
   * @param {String} props.description
   * @param {Boolean} props.disabled
   * @param {Object} props.element
   * @param {Function} props.getValue
   * @param {String} props.id
   * @param {String} props.label
   * @param {String} props.max
   * @param {String} props.min
   * @param {Function} props.setValue
   * @param {String} props.step
   */


  function NumberFieldEntry(props) {
    const {
      debounce,
      description,
      disabled,
      element,
      getValue,
      id,
      label,
      max,
      min,
      setValue,
      step
    } = props;
    const value = getValue(element);
    return e$1("div", {
      class: "bio-properties-panel-entry",
      "data-entry-id": id,
      children: [e$1(NumberField, {
        debounce: debounce,
        disabled: disabled,
        id: id,
        label: label,
        onInput: setValue,
        max: max,
        min: min,
        step: step,
        value: value
      }), e$1(Description$1, {
        forId: id,
        element: element,
        value: description
      })]
    });
  }

  function isEdited$5(node) {
    return node && !!node.value;
  } // helpers /////////////////


  function prefixId$5(id) {
    return `bio-properties-panel-${id}`;
  }

  const noop$1 = () => {};
  /**
   * @typedef { { value: string, label: string, disabled: boolean } } Option
   */

  /**
   * Provides basic select input.
   *
   * @param {object} props
   * @param {string} props.id
   * @param {string[]} props.path
   * @param {string} props.label
   * @param {Function} props.onChange
   * @param {Array<Option>} [props.options]
   * @param {string} props.value
   * @param {boolean} [props.disabled]
   */


  function Select(props) {
    const {
      id,
      label,
      onChange,
      options = [],
      value,
      disabled,
      show = noop$1
    } = props;
    const ref = useShowEntryEvent(show);

    const handleChange = ({
      target
    }) => {
      onChange(target.value);
    };

    return e$1("div", {
      class: "bio-properties-panel-select",
      children: [e$1("label", {
        for: prefixId$4(id),
        class: "bio-properties-panel-label",
        children: label
      }), e$1("select", {
        ref: ref,
        id: prefixId$4(id),
        name: id,
        class: "bio-properties-panel-input",
        onInput: handleChange,
        value: value,
        disabled: disabled,
        children: options.map((option, idx) => {
          return e$1("option", {
            value: option.value,
            disabled: option.disabled,
            children: option.label
          }, idx);
        })
      })]
    });
  }
  /**
   * @param {object} props
   * @param {object} props.element
   * @param {string} props.id
   * @param {string} [props.description]
   * @param {string} props.label
   * @param {Function} props.getValue
   * @param {Function} props.setValue
   * @param {Function} props.getOptions
   * @param {boolean} [props.disabled]
   */


  function SelectEntry(props) {
    const {
      element,
      id,
      description,
      label,
      getValue,
      setValue,
      getOptions,
      disabled,
      show = noop$1
    } = props;
    const value = getValue(element);
    const options = getOptions(element);
    const error = useShowErrorEvent(show);
    return e$1("div", {
      class: classnames('bio-properties-panel-entry', error ? 'has-error' : ''),
      "data-entry-id": id,
      children: [e$1(Select, {
        id: id,
        label: label,
        value: value,
        onChange: setValue,
        options: options,
        disabled: disabled,
        show: show
      }), error && e$1("div", {
        class: "bio-properties-panel-error",
        children: error
      }), e$1(Description$1, {
        forId: id,
        element: element,
        value: description
      })]
    });
  }

  function isEdited$4(node) {
    return node && !!node.value;
  } // helpers /////////////////


  function prefixId$4(id) {
    return `bio-properties-panel-${id}`;
  }

  function FeelIcon(props) {
    const {
      label,
      feel = false
    } = props;
    const feelRequiredLabel = ' must be a FEEL expression';
    const feelOptionalLabel = ' can optionally be a FEEL expression';
    return e$1("i", {
      class: "bio-properties-panel-feel-icon",
      title: label + (feel === 'required' ? feelRequiredLabel : feelOptionalLabel),
      children: feel === 'required' ? e$1(FeelRequiredIcon, {}) : e$1(FeelOptionalIcon, {})
    });
  }

  function TextArea(props) {
    const {
      id,
      label,
      rows = 2,
      debounce,
      feel,
      onInput,
      value = '',
      disabled,
      monospace
    } = props;
    const handleInput = d(() => {
      return debounce(({
        target
      }) => onInput(target.value.length ? target.value : undefined));
    }, [onInput, debounce]);
    return e$1("div", {
      class: "bio-properties-panel-textarea",
      children: [e$1("label", {
        for: prefixId$2(id),
        class: "bio-properties-panel-label",
        children: [label, feel && e$1(FeelIcon, {
          feel: feel,
          label: label
        })]
      }), e$1("textarea", {
        id: prefixId$2(id),
        name: id,
        spellCheck: "false",
        class: classnames('bio-properties-panel-input', monospace ? 'bio-properties-panel-input-monospace' : ''),
        onInput: handleInput,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        rows: rows,
        value: value,
        disabled: disabled
      })]
    });
  }
  /**
   * @param {object} props
   * @param {object} props.element
   * @param {string} props.id
   * @param {string} props.description
   * @param {boolean} props.debounce
   * @param {string} props.label
   * @param {Function} props.getValue
   * @param {Function} props.setValue
   * @param {number} props.rows
   * @param {boolean} props.monospace
   * @param {boolean} [props.disabled]
   */


  function TextAreaEntry(props) {
    const {
      element,
      id,
      description,
      debounce,
      feel,
      label,
      getValue,
      setValue,
      rows,
      monospace,
      disabled
    } = props;
    const value = getValue(element);
    return e$1("div", {
      class: "bio-properties-panel-entry",
      "data-entry-id": id,
      children: [e$1(TextArea, {
        id: id,
        label: label,
        value: value,
        onInput: setValue,
        rows: rows,
        debounce: debounce,
        monospace: monospace,
        feel: feel,
        disabled: disabled
      }), e$1(Description$1, {
        forId: id,
        element: element,
        value: description
      })]
    });
  }

  function isEdited$2(node) {
    return node && !!node.value;
  } // helpers /////////////////


  function prefixId$2(id) {
    return `bio-properties-panel-${id}`;
  }

  const noop = () => {};

  function Textfield(props) {
    const {
      debounce,
      disabled = false,
      id,
      label,
      onInput,
      feel = false,
      value = '',
      show = noop
    } = props;
    const ref = useShowEntryEvent(show);
    const handleInput = d(() => {
      return debounce(({
        target
      }) => onInput(target.value.length ? target.value : undefined));
    }, [onInput, debounce]);
    return e$1("div", {
      class: "bio-properties-panel-textfield",
      children: [e$1("label", {
        for: prefixId$1(id),
        class: "bio-properties-panel-label",
        children: [label, feel && e$1(FeelIcon, {
          feel: feel,
          label: label
        })]
      }), e$1("input", {
        ref: ref,
        id: prefixId$1(id),
        type: "text",
        name: id,
        spellCheck: "false",
        autoComplete: "off",
        disabled: disabled,
        class: "bio-properties-panel-input",
        onInput: handleInput,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        value: value || ''
      })]
    });
  }
  /**
   * @param {Object} props
   * @param {Object} props.element
   * @param {String} props.id
   * @param {String} props.description
   * @param {Boolean} props.debounce
   * @param {Boolean} props.disabled
   * @param {String} props.label
   * @param {Function} props.getValue
   * @param {Function} props.setValue
   * @param {Function} props.validate
   */


  function TextfieldEntry(props) {
    const {
      element,
      id,
      description,
      debounce,
      disabled,
      feel,
      label,
      getValue,
      setValue,
      validate,
      show = noop
    } = props;
    const [cachedInvalidValue, setCachedInvalidValue] = l$1(null);
    const [validationError, setValidationError] = l$1(null);
    let value = getValue(element);
    const previousValue = usePrevious(value);
    y(() => {
      if (isFunction(validate)) {
        const newValidationError = validate(value) || null;
        setValidationError(newValidationError);
      }
    }, [value]);

    const onInput = newValue => {
      let newValidationError = null;

      if (isFunction(validate)) {
        newValidationError = validate(newValue) || null;
      }

      if (newValidationError) {
        setCachedInvalidValue(newValue);
      } else {
        setValue(newValue);
      }

      setValidationError(newValidationError);
    };

    if (previousValue === value && validationError) {
      value = cachedInvalidValue;
    }

    const temporaryError = useShowErrorEvent(show);
    const error = temporaryError || validationError;
    return e$1("div", {
      class: classnames('bio-properties-panel-entry', error ? 'has-error' : ''),
      "data-entry-id": id,
      children: [e$1(Textfield, {
        debounce: debounce,
        disabled: disabled,
        feel: feel,
        id: id,
        label: label,
        onInput: onInput,
        show: show,
        value: value
      }), error && e$1("div", {
        class: "bio-properties-panel-error",
        children: error
      }), e$1(Description$1, {
        forId: id,
        element: element,
        value: description
      })]
    });
  }

  function isEdited$1(node) {
    return node && !!node.value;
  } // helpers /////////////////


  function prefixId$1(id) {
    return `bio-properties-panel-${id}`;
  }

  function arrayAdd$1(array, index, item) {
    const copy = [...array];
    copy.splice(index, 0, item);
    return copy;
  }
  function arrayRemove$1(array, index) {
    const copy = [...array];
    copy.splice(index, 1);
    return copy;
  }
  function textToLabel(text = '...') {
    if (text.length > 10) {
      return `${text.substring(0, 30)}...`;
    }

    return text;
  }
  const INPUTS = ['checkbox', 'checklist', 'number', 'radio', 'select', 'taglist', 'textfield', 'datefield', 'table', 'fileUpload'];
  const OPTIONS_INPUTS = ['checklist', 'radio', 'select', 'taglist'];

  const labelsByType = {
    button: 'BUTTON',
    checkbox: 'CHECKBOX',
    checklist: 'CHECKLIST',
    columns: 'COLUMNS',
    default: 'FORM',
    number: 'NUMBER',
    radio: 'RADIO',
    select: 'SELECT',
    taglist: 'TAGLIST',
    text: 'TEXT',
    textfield: 'TEXT FIELD',
    datefield: 'DATEFIELD',
    table: 'TABLE',
    fileUpload: 'FILE UPLOAD'
  };
  const PropertiesPanelHeaderProvider = {
    getElementLabel: field => {
      const {
        type
      } = field;

      if (type === 'text') {
        return textToLabel(field.text);
      }

      if (type === 'default') {
        return field.id;
      }

      return field.label;
    },
    getElementIcon: field => {
      const {
        type
      } = field;
      const Icon = iconsByType[type];

      if (Icon) {
        return () => e$1(Icon, {
          width: "36",
          height: "36",
          viewBox: "0 0 54 54"
        });
      }
    },
    getTypeLabel: field => {
      const {
        type
      } = field;
      return labelsByType[type];
    }
  };

  /**
   * Provide placeholders for empty and multiple state.
   */
  const PropertiesPanelPlaceholderProvider = {
    getEmpty: () => {
      return {
        text: 'Select a form field to edit its properties.'
      };
    },
    getMultiple: () => {
      return {
        text: 'Multiple form fields are selected. Select a single form field to edit its properties.'
      };
    }
  };

  function ActionEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (type === 'button') {
      entries.push({
        id: 'action',
        component: Action,
        editField: editField,
        field: field,
        isEdited: isEdited$4
      });
    }

    return entries;
  }

  function Action(props) {
    const {
      editField,
      field,
      id
    } = props;
    const path = ['action'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    const getOptions = () => [{
      label: 'Submit',
      value: 'submit'
    }, {
      label: 'Reset',
      value: 'reset'
    }];

    return SelectEntry({
      element: field,
      getOptions,
      getValue,
      id,
      label: 'Action',
      setValue
    });
  }

  function ColumnsEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (type === 'columns') {
      entries.push({
        id: 'columns',
        component: Columns,
        editField: editField,
        field: field,
        isEdited: isEdited$5
      });
    }

    return entries;
  }

  function Columns(props) {
    const {
      editField,
      field,
      id
    } = props;
    const debounce = useService('debounce');

    const getValue = () => {
      return field.components.length;
    };

    const setValue = value => {
      let components = field.components.slice();

      if (value > components.length) {
        while (value > components.length) {
          components.push(Default.create({
            _parent: field.id
          }));
        }
      } else {
        components = components.slice(0, value);
      }

      editField(field, 'components', components);
    };

    return NumberFieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Columns',
      setValue
    });
  }

  function DescriptionEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (INPUTS.includes(type)) {
      entries.push({
        id: 'description',
        component: Description,
        editField: editField,
        field: field,
        isEdited: isEdited$1
      });
    }

    return entries;
  }

  function Description(props) {
    const {
      editField,
      field,
      id
    } = props;
    const debounce = useService('debounce');
    const path = ['description'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Field description',
      setValue
    });
  }

  function DefaultValueEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (!INPUTS.includes(type)) {
      return entries;
    }

    const defaultOptions = {
      editField,
      field,
      id: 'defaultValue',
      label: 'Default value'
    };

    if (type === 'checkbox') {
      entries.push({ ...defaultOptions,
        component: DefaultValueCheckbox,
        isEdited: isEdited$4
      });
    }

    if (type === 'number') {
      entries.push({ ...defaultOptions,
        component: DefaultValueNumber,
        isEdited: isEdited$5
      });
    }

    if (type === 'radio' || type === 'select') {
      entries.push({ ...defaultOptions,
        component: DefaultValueMulti,
        isEdited: isEdited$4
      });
    }

    if (type === 'textfield') {
      entries.push({ ...defaultOptions,
        component: DefaultValueTextfield,
        isEdited: isEdited$1
      });
    }

    return entries;
  }

  function DefaultValueCheckbox(props) {
    const {
      editField,
      field,
      id,
      label
    } = props;
    const {
      defaultValue
    } = field;
    const path = ['defaultValue'];

    const getOptions = () => {
      return [{
        label: 'Checked',
        value: 'true'
      }, {
        label: 'Not checked',
        value: 'false'
      }];
    };

    const setValue = value => {
      return editField(field, path, parseStringToBoolean(value));
    };

    const getValue = () => {
      return parseBooleanToString(defaultValue);
    };

    return SelectEntry({
      element: field,
      getOptions,
      getValue,
      id,
      label,
      setValue
    });
  }

  function DefaultValueNumber(props) {
    const {
      editField,
      field,
      id,
      label
    } = props;
    const debounce = useService('debounce');
    const path = ['defaultValue'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return NumberFieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label,
      setValue
    });
  }

  function DefaultValueMulti(props) {
    const {
      editField,
      field,
      id,
      label
    } = props;
    const {
      defaultValue,
      values = []
    } = field;
    const path = ['defaultValue'];

    const getOptions = () => {
      return [{
        label: '<none>'
      }, ...values];
    };

    const setValue = value => {
      return editField(field, path, value.length ? value : undefined);
    };

    const getValue = () => {
      return defaultValue;
    };

    return SelectEntry({
      element: field,
      getOptions,
      getValue,
      id,
      label,
      setValue
    });
  }

  function DefaultValueTextfield(props) {
    const {
      editField,
      field,
      id,
      label
    } = props;
    const debounce = useService('debounce');
    const path = ['defaultValue'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label,
      setValue
    });
  } // helpers /////////////////


  function parseStringToBoolean(value) {
    if (value === 'true') {
      return true;
    }

    return false;
  }

  function parseBooleanToString(value) {
    if (value === true) {
      return 'true';
    }

    return 'false';
  }

  function DisabledEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (INPUTS.includes(type)) {
      entries.push({
        id: 'disabled',
        component: Disabled,
        editField: editField,
        field: field,
        isEdited: isEdited$6
      });
    }

    return entries;
  }

  function Disabled(props) {
    const {
      editField,
      field,
      id
    } = props;
    const path = ['disabled'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return CheckboxEntry({
      element: field,
      getValue,
      id,
      label: 'Disabled',
      setValue
    });
  }

  function IdEntry(props) {
    const {
      editField,
      field
    } = props;
    const entries = [];

    if (field.type === 'default') {
      entries.push({
        id: 'id',
        component: Id,
        editField: editField,
        field: field,
        isEdited: isEdited$1
      });
    }

    return entries;
  }

  function Id(props) {
    const {
      editField,
      field,
      id
    } = props;
    const formFieldRegistry = useService('formFieldRegistry');
    const debounce = useService('debounce');
    const path = ['id'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    const validate = value => {
      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      const assigned = formFieldRegistry._ids.assigned(value);

      if (assigned && assigned !== field) {
        return 'Must be unique.';
      }

      return validateId(value) || null;
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'ID',
      setValue,
      validate
    });
  } // id structural validation /////////////


  const SPACE_REGEX = /\s/; // for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar

  const QNAME_REGEX = /^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i; // for ID validation as per BPMN Schema (QName - Namespace)

  const ID_REGEX = /^[a-z_][\w-.]*$/i;

  function validateId(idValue) {
    if (containsSpace(idValue)) {
      return 'Must not contain spaces.';
    }

    if (!ID_REGEX.test(idValue)) {
      if (QNAME_REGEX.test(idValue)) {
        return 'Must not contain prefix.';
      }

      return 'Must be a valid QName.';
    }
  }

  function containsSpace(value) {
    return SPACE_REGEX.test(value);
  }

  function KeyEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (INPUTS.includes(type)) {
      entries.push({
        id: 'key',
        component: Key$1,
        editField: editField,
        field: field,
        isEdited: isEdited$1
      });
    }

    return entries;
  }

  function Key$1(props) {
    const {
      editField,
      field,
      id
    } = props;
    const formFieldRegistry = useService('formFieldRegistry');
    const debounce = useService('debounce');
    const path = ['key'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    const validate = value => {
      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      if (/\s/.test(value)) {
        return 'Must not contain spaces.';
      }

      const assigned = formFieldRegistry._keys.assigned(value);

      if (assigned && assigned !== field) {
        return 'Must be unique.';
      }

      return null;
    };

    return TextfieldEntry({
      debounce,
      description: 'Maps to a process variable',
      element: field,
      getValue,
      id,
      label: 'Key',
      setValue,
      validate
    });
  }

  function LabelEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (INPUTS.includes(type) || type === 'button') {
      entries.push({
        id: 'label',
        component: Label$1,
        editField: editField,
        field: field,
        isEdited: isEdited$1
      });
    }

    return entries;
  }

  function Label$1(props) {
    const {
      editField,
      field,
      id
    } = props;
    const debounce = useService('debounce');
    const path = ['label'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Field label',
      setValue
    });
  }

  function TextEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (type === 'text') {
      entries.push({
        id: 'text',
        component: Text,
        editField: editField,
        field: field,
        isEdited: isEdited$2
      });
    }

    return entries;
  }

  function Text(props) {
    const {
      editField,
      field,
      id
    } = props;
    const debounce = useService('debounce');
    const path = ['text'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return TextAreaEntry({
      debounce,
      description: 'Use Markdown or basic HTML to format.',
      element: field,
      getValue,
      id,
      label: 'Text',
      rows: 10,
      setValue
    });
  }

  function ValueEntry(props) {
    const {
      editField,
      field,
      idPrefix,
      index,
      validateFactory
    } = props;
    const entries = [{
      component: Label,
      editField,
      field,
      id: idPrefix + '-label',
      idPrefix,
      index,
      validateFactory
    }, {
      component: Value$1,
      editField,
      field,
      id: idPrefix + '-value',
      idPrefix,
      index,
      validateFactory
    }];
    return entries;
  }

  function Label(props) {
    const {
      editField,
      field,
      id,
      index,
      validateFactory
    } = props;
    const debounce = useService('debounce');

    const setValue = value => {
      const values = get(field, ['values']);
      return editField(field, 'values', set(values, [index, 'label'], value));
    };

    const getValue = () => {
      return get(field, ['values', index, 'label']);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Label',
      setValue,
      validate: validateFactory(getValue())
    });
  }

  function Value$1(props) {
    const {
      editField,
      field,
      id,
      index,
      validateFactory
    } = props;
    const debounce = useService('debounce');

    const setValue = value => {
      const values = get(field, ['values']);
      return editField(field, 'values', set(values, [index, 'value'], value));
    };

    const getValue = () => {
      return get(field, ['values', index, 'value']);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Value',
      setValue,
      validate: validateFactory(getValue())
    });
  }

  function CustomValueEntry(props) {
    const {
      editField,
      field,
      idPrefix,
      index,
      validateFactory
    } = props;
    const entries = [{
      component: Key,
      editField,
      field,
      id: idPrefix + '-key',
      idPrefix,
      index,
      validateFactory
    }, {
      component: Value,
      editField,
      field,
      id: idPrefix + '-value',
      idPrefix,
      index,
      validateFactory
    }];
    return entries;
  }

  function Key(props) {
    const {
      editField,
      field,
      id,
      index,
      validateFactory
    } = props;
    const debounce = useService('debounce');

    const setValue = value => {
      const properties = get(field, ['properties']);
      const key = Object.keys(properties)[index];
      return editField(field, 'properties', updateKey(properties, key, value));
    };

    const getValue = () => {
      return Object.keys(get(field, ['properties']))[index];
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Key',
      setValue,
      validate: validateFactory(getValue())
    });
  }

  function Value(props) {
    const {
      editField,
      field,
      id,
      index,
      validateFactory
    } = props;
    const debounce = useService('debounce');

    const setValue = value => {
      const properties = get(field, ['properties']);
      const key = Object.keys(properties)[index];
      editField(field, 'properties', updateValue(properties, key, value));
    };

    const getValue = () => {
      const properties = get(field, ['properties']);
      const key = Object.keys(properties)[index];
      return get(field, ['properties', key]);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Value',
      setValue,
      validate: validateFactory(getValue())
    });
  } // helpers //////////

  /**
   * Returns copy of object with updated value.
   *
   * @param {Object} properties
   * @param {string} key
   * @param {string} value
   *
   * @returns {Object}
   */


  function updateValue(properties, key, value) {
    return { ...properties,
      [key]: value
    };
  }
  /**
   * Returns copy of object with updated key.
   *
   * @param {Object} properties
   * @param {string} oldKey
   * @param {string} newKey
   *
   * @returns {Object}
   */


  function updateKey(properties, oldKey, newKey) {
    return Object.entries(properties).reduce((newProperties, entry) => {
      const [key, value] = entry;
      return { ...newProperties,
        [key === oldKey ? newKey : key]: value
      };
    }, {});
  }

  function HiddenEntry(props) {
    const {
      editField,
      field
    } = props;
    const {
      type
    } = field;
    const entries = [];

    if (INPUTS.includes(type) || type === 'button') {
      entries.push({
        id: 'hiddenFx',
        component: HiddenFx,
        editField: editField,
        field: field,
        isEdited: isEdited$1
      });
    }

    return entries;
  }

  function HiddenFx(props) {
    const {
      editField,
      field,
      id
    } = props;
    const debounce = useService('debounce');
    const path = ['hiddenFx'];

    const getValue = () => {
      return get(field, path, '');
    };

    const setValue = value => {
      return editField(field, path, value);
    };

    return TextfieldEntry({
      debounce,
      element: field,
      getValue,
      id,
      label: 'Should be hidden',
      setValue
    });
  }

  function GeneralGroup(field, editField) {
    const entries = [...IdEntry({
      field,
      editField
    }), ...LabelEntry({
      field,
      editField
    }), ...DescriptionEntry({
      field,
      editField
    }), ...KeyEntry({
      field,
      editField
    }), ...DefaultValueEntry({
      field,
      editField
    }), ...ActionEntry({
      field,
      editField
    }), ...ColumnsEntry({
      field,
      editField
    }), ...TextEntry({
      field,
      editField
    }), ...DisabledEntry({
      field,
      editField
    }), ...HiddenEntry({
      field,
      editField
    })];
    return {
      id: 'general',
      label: 'General',
      entries
    };
  }

  function ValidationGroup(field, editField) {
    const {
      type
    } = field;

    if (!(INPUTS.includes(type) && type !== 'checkbox' && type !== 'checklist' && type !== 'taglist')) {
      return null;
    }

    const onChange = key => {
      return value => {
        const validate = get(field, ['validate'], {});
        editField(field, ['validate'], set(validate, [key], value));
      };
    };

    const getValue = key => {
      return () => {
        return get(field, ['validate', key]);
      };
    };

    let entries = [{
      id: 'required',
      component: Required,
      getValue,
      field,
      isEdited: isEdited$6,
      onChange
    }];

    if (type === 'textfield') {
      entries.push({
        id: 'minLength',
        component: MinLength,
        getValue,
        field,
        isEdited: isEdited$5,
        onChange
      }, {
        id: 'maxLength',
        component: MaxLength,
        getValue,
        field,
        isEdited: isEdited$5,
        onChange
      }, {
        id: 'pattern',
        component: Pattern,
        getValue,
        field,
        isEdited: isEdited$1,
        onChange
      });
    }

    if (type === 'number') {
      entries.push({
        id: 'min',
        component: Min,
        getValue,
        field,
        isEdited: isEdited$5,
        onChange
      }, {
        id: 'max',
        component: Max,
        getValue,
        field,
        isEdited: isEdited$5,
        onChange
      });
    }

    return {
      id: 'validation',
      label: 'Validation',
      entries
    };
  }

  function Required(props) {
    const {
      field,
      getValue,
      id,
      onChange
    } = props;
    return CheckboxEntry({
      element: field,
      getValue: getValue('required'),
      id,
      label: 'Required',
      setValue: onChange('required')
    });
  }

  function MinLength(props) {
    const {
      field,
      getValue,
      id,
      onChange
    } = props;
    const debounce = useService('debounce');
    return NumberFieldEntry({
      debounce,
      element: field,
      getValue: getValue('minLength'),
      id,
      label: 'Minimum length',
      min: 0,
      setValue: onChange('minLength')
    });
  }

  function MaxLength(props) {
    const {
      field,
      getValue,
      id,
      onChange
    } = props;
    const debounce = useService('debounce');
    return NumberFieldEntry({
      debounce,
      element: field,
      getValue: getValue('maxLength'),
      id,
      label: 'Maximum length',
      min: 0,
      setValue: onChange('maxLength')
    });
  }

  function Pattern(props) {
    const {
      field,
      getValue,
      id,
      onChange
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('pattern'),
      id,
      label: 'Regular expression pattern',
      setValue: onChange('pattern')
    });
  }

  function Min(props) {
    const {
      field,
      getValue,
      id,
      onChange
    } = props;
    const debounce = useService('debounce');
    return NumberFieldEntry({
      debounce,
      element: field,
      getValue: getValue('min'),
      id,
      label: 'Minimum',
      min: 0,
      setValue: onChange('min')
    });
  }

  function Max(props) {
    const {
      field,
      getValue,
      id,
      onChange
    } = props;
    const debounce = useService('debounce');
    return NumberFieldEntry({
      debounce,
      element: field,
      getValue: getValue('max'),
      id,
      label: 'Maximum',
      min: 0,
      setValue: onChange('max')
    });
  }

  // (cf. https://github.com/bpmn-io/form-js/issues/197#issuecomment-1116047809)

  function ValuesGroup(field, editField) {
    const {
      values = [],
      type
    } = field;

    if (!OPTIONS_INPUTS.includes(type)) {
      return null;
    }

    const addEntry = event => {
      event.stopPropagation();
      const index = values.length + 1;
      const entry = {
        label: `Value ${index}`,
        value: `value${index}`
      };
      editField(field, ['values'], arrayAdd$1(values, values.length, entry));
    };

    const validateFactory = key => {
      return value => {
        if (value === key) {
          return;
        }

        if (isUndefined(value) || !value.length) {
          return 'Must not be empty.';
        }

        const isValueAssigned = values.find(entry => entry.value === value);

        if (isValueAssigned) {
          return 'Must be unique.';
        }
      };
    };

    const items = values.map((value, index) => {
      const {
        label
      } = value;

      const removeEntry = event => {
        event.stopPropagation();
        editField(field, ['values'], arrayRemove$1(values, index));
      };

      const id = `${field.id}-value-${index}`;
      return {
        autoFocusEntry: id + '-label',
        entries: ValueEntry({
          editField,
          field,
          idPrefix: id,
          index,
          validateFactory
        }),
        id,
        label: label || '',
        remove: removeEntry
      };
    });
    return {
      add: addEntry,
      component: ListGroup,
      id: 'values',
      items,
      label: 'Values',
      shouldSort: false
    };
  }

  function CustomValuesGroup(field, editField) {
    const {
      properties = {},
      type
    } = field;

    if (type === 'default') {
      return null;
    }

    const addEntry = event => {
      event.stopPropagation();
      const index = Object.keys(properties).length + 1;
      const key = `key${index}`,
            value = 'value';
      editField(field, ['properties'], { ...properties,
        [key]: value
      });
    };

    const validateFactory = key => {
      return value => {
        if (value === key) {
          return;
        }

        if (isUndefined(value) || !value.length) {
          return 'Must not be empty.';
        }

        if (has(properties, value)) {
          return 'Must be unique.';
        }
      };
    };

    const items = Object.keys(properties).map((key, index) => {
      const removeEntry = event => {
        event.stopPropagation();
        return editField(field, ['properties'], removeKey(properties, key));
      };

      const id = `${field.id}-property-${index}`;
      return {
        autoFocusEntry: id + '-key',
        entries: CustomValueEntry({
          editField,
          field,
          idPrefix: id,
          index,
          validateFactory
        }),
        id,
        label: key || '',
        remove: removeEntry
      };
    });
    return {
      add: addEntry,
      component: ListGroup,
      id: 'custom-values',
      items,
      label: 'Custom properties',
      shouldSort: false
    };
  } // helpers //////////

  /**
   * Returns copy of object without key.
   *
   * @param {Object} properties
   * @param {string} oldKey
   *
   * @returns {Object}
   */

  function removeKey(properties, oldKey) {
    return Object.entries(properties).reduce((newProperties, entry) => {
      const [key, value] = entry;

      if (key === oldKey) {
        return newProperties;
      }

      return { ...newProperties,
        [key]: value
      };
    }, {});
  }

  function IntegrationGroup(field, editField) {
    const {
      type
    } = field;

    if (!OPTIONS_INPUTS.includes(type) && type !== 'button' && type !== 'fileUpload') {
      return null;
    }

    const setDataSource = value => {
      return editField(field, 'dataSource', value);
    };

    const setTargetApi = value => {
      return editField(field, 'targetApi', value);
    };

    const setTargetApiVerb = value => {
      return editField(field, 'targetApiVerb', value);
    };

    const getValue = key => {
      return () => {
        return get(field, [key], '');
      };
    };

    let entries = [];

    if (type === 'button' || type === 'fileUpload') {
      entries.push({
        id: 'targetApi',
        component: TargetApi,
        getValue,
        field,
        isEdited: isEdited$1,
        setTargetApi
      }, {
        id: 'targetApiVerb',
        component: TargetApiVerb,
        getValue,
        field,
        isEdited: isEdited$1,
        setTargetApiVerb
      });
    } else {
      entries.push({
        id: 'dataSource',
        component: DataSource,
        getValue,
        field,
        isEdited: isEdited$1,
        setDataSource
      });
    }

    return {
      id: 'integration',
      label: 'Integration',
      entries
    };
  }

  function DataSource(props) {
    const {
      field,
      getValue,
      id,
      setDataSource
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('dataSource'),
      id,
      label: 'DataSource API',
      setValue: setDataSource
    });
  }

  function TargetApi(props) {
    const {
      field,
      getValue,
      id,
      setTargetApi
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('targetApi'),
      id,
      label: 'Target API',
      setValue: setTargetApi
    });
  }

  function TargetApiVerb(props) {
    const {
      field,
      getValue,
      id,
      setTargetApiVerb
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('targetApiVerb'),
      id,
      label: 'Target HTTP Verb',
      setValue: setTargetApiVerb
    });
  }

  function TableGroup(field, editField) {
    const {
      type
    } = field;

    if (type !== 'table') {
      return null;
    }

    const setHeaders = value => {
      return editField(field, 'headers', value);
    };

    const setHeadersNames = value => {
      return editField(field, 'headersNames', value);
    };

    const setEditableColumns = value => {
      return editField(field, 'editableColumns', value);
    };

    const setDynamicRows = value => {
      return editField(field, 'dynamicRows', value);
    };

    const getValue = key => {
      return () => {
        return get(field, [key], '');
      };
    };

    let entries = [{
      id: 'headers',
      component: Headers,
      getValue,
      field,
      isEdited: isEdited$1,
      setHeaders
    }, {
      id: 'headersNames',
      component: HeadersNames,
      getValue,
      field,
      isEdited: isEdited$1,
      setHeadersNames
    }, {
      id: 'editableColumns',
      component: EditableColumns,
      getValue,
      field,
      isEdited: isEdited$1,
      setEditableColumns
    }, {
      id: 'dynamicRows',
      component: DynamicRows,
      getValue,
      field,
      isEdited: isEdited$6,
      setDynamicRows
    }];
    return {
      id: 'tableDef',
      label: 'Table definition',
      entries
    };
  }

  function Headers(props) {
    const {
      field,
      getValue,
      id,
      setHeaders
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('headers'),
      id,
      label: 'Headers (coma separated)',
      setValue: setHeaders
    });
  }

  function HeadersNames(props) {
    const {
      field,
      getValue,
      id,
      setHeadersNames
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('headersNames'),
      id,
      label: 'Header names (coma separated)',
      setValue: setHeadersNames
    });
  }

  function EditableColumns(props) {
    const {
      field,
      getValue,
      id,
      setEditableColumns
    } = props;
    const debounce = useService('debounce');
    return TextfieldEntry({
      debounce,
      element: field,
      getValue: getValue('editableColumns'),
      id,
      label: 'Editable cols (header[type], header2[type])',
      setValue: setEditableColumns
    });
  }

  function DynamicRows(props) {
    const {
      field,
      getValue,
      id,
      setDynamicRows
    } = props;
    const debounce = useService('debounce');
    return CheckboxEntry({
      debounce,
      element: field,
      getValue: getValue('dynamicRows'),
      id,
      label: 'Dynamic rows',
      setValue: setDynamicRows
    });
  }

  function getGroups(field, editField) {
    if (!field) {
      return [];
    }

    const groups = [GeneralGroup(field, editField), IntegrationGroup(field, editField), ValuesGroup(field, editField), ValidationGroup(field, editField), CustomValuesGroup(field, editField), TableGroup(field, editField)]; // contract: if a group returns null, it should not be displayed at all

    return groups.filter(group => group !== null);
  }

  function FormPropertiesPanel(props) {
    const {
      editField,
      field
    } = props;
    const eventBus = useService('eventBus');

    const onFocus = () => eventBus.fire('propertiesPanel.focusin');

    const onBlur = () => eventBus.fire('propertiesPanel.focusout');

    return e$1("div", {
      class: "fjs-properties-panel",
      "data-field": field && field.id,
      onFocusCapture: onFocus,
      onBlurCapture: onBlur,
      children: e$1(PropertiesPanel, {
        element: field,
        eventBus: eventBus,
        groups: getGroups(field, editField),
        headerProvider: PropertiesPanelHeaderProvider,
        placeholderProvider: PropertiesPanelPlaceholderProvider
      })
    });
  }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
  var ListDeleteIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "11",
    height: "14"
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M10 4v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4h9zM8 6H3v4.8c0 .66.5 1.2 1.111 1.2H6.89C7.5 12 8 11.46 8 10.8V6zm3-5H8.5l-1-1h-4l-1 1H0v1.5h11V1z"
  })));

  function ContextPad(props) {
    if (!props.children) {
      return null;
    }

    return e$1("div", {
      class: "fjs-context-pad",
      children: props.children
    });
  }

  function Empty(props) {
    return null;
  }

  function Element$1(props) {
    const eventBus = useService('eventBus'),
          formEditor = useService('formEditor'),
          formFieldRegistry = useService('formFieldRegistry'),
          modeling = useService('modeling'),
          selection = useService('selection');
    const {
      field
    } = props;
    const {
      id,
      type
    } = field;
    const ref = s();

    function scrollIntoView({
      selection
    }) {
      if (!selection || selection.id !== id || !ref.current) {
        return;
      }

      const elementBounds = ref.current.getBoundingClientRect(),
            containerBounds = formEditor._container.getBoundingClientRect();

      if (elementBounds.top < 0 || elementBounds.top > containerBounds.bottom) {
        ref.current.scrollIntoView();
      }
    }

    y(() => {
      eventBus.on('selection.changed', scrollIntoView);
      return () => eventBus.off('selection.changed', scrollIntoView);
    }, [id]);

    function onClick(event) {
      event.stopPropagation();
      selection.toggle(field);
    }

    const classes = ['fjs-element'];

    if (props.class) {
      classes.push(...props.class.split(' '));
    }

    if (selection.isSelected(field)) {
      classes.push('fjs-editor-selected');
    }

    const onRemove = event => {
      event.stopPropagation();
      const parentField = formFieldRegistry.get(field._parent);
      const index = getFormFieldIndex(parentField, field);
      modeling.removeFormField(field, parentField, index);
    };

    return e$1("div", {
      class: classes.join(' '),
      "data-id": id,
      "data-field-type": type,
      onClick: onClick,
      ref: ref,
      children: [e$1(ContextPad, {
        children: selection.isSelected(field) && field.type !== 'default' ? e$1("button", {
          class: "fjs-context-pad-item",
          onClick: onRemove,
          children: e$1(ListDeleteIcon, {})
        }) : null
      }), props.children]
    });
  }

  function Children(props) {
    const {
      field
    } = props;
    const {
      id
    } = field;
    const classes = ['fjs-children', 'fjs-drag-container'];

    if (props.class) {
      classes.push(...props.class.split(' '));
    }

    return e$1("div", {
      class: classes.join(' '),
      "data-id": id,
      children: props.children
    });
  }

  function FormEditor$1(props) {
    const eventBus = useService('eventBus'),
          formEditor = useService('formEditor'),
          formFieldRegistry = useService('formFieldRegistry'),
          injector = useService('injector'),
          modeling = useService('modeling'),
          selection = useService('selection');

    const {
      schema
    } = formEditor._getState();

    const [selectedFormField, setSelection] = l$1(schema);
    y(() => {
      function handleSelectionChanged(event) {
        setSelection(event.selection || schema);
      }

      eventBus.on('selection.changed', handleSelectionChanged);
      setSelection(selection.get() || schema);
      return () => {
        eventBus.off('selection.changed', handleSelectionChanged);
      };
    }, [schema, selection]);
    const [drake, setDrake] = l$1(null);
    const dragAndDropContext = {
      drake
    };
    y(() => {
      const createDragulaInstance = () => {
        const dragulaInstance = dragula_1({
          isContainer(el) {
            return el.classList.contains('fjs-drag-container');
          },

          copy(el) {
            return el.classList.contains('fjs-drag-copy');
          },

          accepts(el, target) {
            return !target.classList.contains('fjs-no-drop');
          },

          slideFactorX: 10,
          slideFactorY: 5
        });
        dragulaInstance.on('drop', (el, target, source, sibling) => {
          dragulaInstance.remove();

          if (!target) {
            return;
          }

          const targetFormField = formFieldRegistry.get(target.dataset.id);
          const siblingFormField = sibling && formFieldRegistry.get(sibling.dataset.id),
                targetIndex = siblingFormField ? getFormFieldIndex(targetFormField, siblingFormField) : targetFormField.components.length;

          if (source.classList.contains('fjs-palette-fields')) {
            const type = el.dataset.fieldType;
            modeling.addFormField({
              type
            }, targetFormField, targetIndex);
          } else {
            const formField = formFieldRegistry.get(el.dataset.id),
                  sourceFormField = formFieldRegistry.get(source.dataset.id),
                  sourceIndex = getFormFieldIndex(sourceFormField, formField);
            modeling.moveFormField(formField, sourceFormField, targetFormField, sourceIndex, targetIndex);
          }
        });
        eventBus.fire('dragula.created');
        setDrake(dragulaInstance);
        return dragulaInstance;
      };

      let dragulaInstance = createDragulaInstance();

      const onDetach = () => {
        if (dragulaInstance) {
          dragulaInstance.destroy();
          eventBus.fire('dragula.destroyed');
        }
      };

      const onAttach = () => {
        onDetach();
        dragulaInstance = createDragulaInstance();
      };

      eventBus.on('attach', onAttach);
      eventBus.on('detach', onDetach);
      return () => {
        onDetach();
        eventBus.off('attach', onAttach);
        eventBus.off('detach', onDetach);
      };
    }, []);
    const formRenderContext = {
      Children,
      Element: Element$1,
      Empty
    };
    const formContext = {
      getService(type, strict = true) {
        // TODO(philippfromme): clean up
        if (type === 'formFieldRegistry') {
          return new Map();
        } else if (type === 'form') {
          return {
            _getState() {
              return {
                data: {},
                errors: {},
                properties: {
                  readOnly: true
                },
                schema
              };
            }

          };
        }

        return injector.get(type, strict);
      },

      formId: formEditor._id
    };
    const onSubmit = A$1(() => {}, []);
    const onReset = A$1(() => {}, []);
    const editField = A$1((formField, key, value) => modeling.editFormField(formField, key, value), [modeling]);
    return e$1("div", {
      class: "fjs-form-editor",
      children: [e$1(DragAndDropContext.Provider, {
        value: dragAndDropContext,
        children: [e$1("div", {
          class: "fjs-palette-container",
          children: e$1(Palette, {})
        }), e$1("div", {
          class: "fjs-form-container",
          children: e$1(FormContext.Provider, {
            value: formContext,
            children: e$1(FormRenderContext.Provider, {
              value: formRenderContext,
              children: e$1(FormComponent, {
                onSubmit: onSubmit,
                onReset: onReset
              })
            })
          })
        }), e$1(CreatePreview, {})]
      }), e$1("div", {
        class: "fjs-properties-container",
        children: e$1(FormPropertiesPanel, {
          field: selectedFormField,
          editField: editField
        })
      })]
    });
  }

  function getFormFieldIndex(parent, formField) {
    let fieldFormIndex = parent.components.length;
    parent.components.forEach(({
      id
    }, index) => {
      if (id === formField.id) {
        fieldFormIndex = index;
      }
    });
    return fieldFormIndex;
  }

  function CreatePreview(props) {
    const {
      drake
    } = F$1(DragAndDropContext);

    function handleCloned(clone, original, type) {
      const fieldType = clone.dataset.fieldType;
      const Icon = iconsByType[fieldType];

      if (fieldType) {
        clone.innerHTML = '';
        clone.class = 'gu-mirror';
        S$1(e$1(Icon, {}), clone);
      }
    }

    y(() => {
      if (!drake) {
        return;
      }

      drake.on('cloned', handleCloned);
      return () => drake.off('cloned', handleCloned);
    }, [drake]);
    return null;
  }

  class Renderer {
    constructor(renderConfig, eventBus, formEditor, injector) {
      const {
        container,
        compact = false
      } = renderConfig;

      const App = () => {
        const [state, setState] = l$1(formEditor._getState());
        const formEditorContext = {
          getService(type, strict = true) {
            return injector.get(type, strict);
          }

        };
        formEditor.on('changed', newState => {
          setState(newState);
        });
        const {
          schema
        } = state;

        if (!schema) {
          return null;
        }

        return e$1("div", {
          class: `fjs-container fjs-editor-container ${compact ? 'fjs-editor-compact' : ''}`,
          children: e$1(FormEditorContext.Provider, {
            value: formEditorContext,
            children: e$1(FormEditor$1, {})
          })
        });
      };

      eventBus.on('form.init', () => {
        S$1(e$1(App, {}), container);
      });
      eventBus.on('form.destroy', () => {
        S$1(null, container);
      });
    }

  }
  Renderer.$inject = ['config.renderer', 'eventBus', 'formEditor', 'injector'];

  var renderModule = {
    __init__: ['formFields', 'renderer'],
    formFields: ['type', FormFields],
    renderer: ['type', Renderer]
  };

  var core = {
    __depends__: [importModule, renderModule],
    eventBus: ['type', EventBus],
    formFieldRegistry: ['type', FormFieldRegistry],
    fieldFactory: ['type', FieldFactory],
    debounce: ['factory', DebounceFactory]
  };

  var NOT_REGISTERED_ERROR = 'is not a registered action',
      IS_REGISTERED_ERROR = 'is already registered';
  /**
   * An interface that provides access to modeling actions by decoupling
   * the one who requests the action to be triggered and the trigger itself.
   *
   * It's possible to add new actions by registering them with ´registerAction´
   * and likewise unregister existing ones with ´unregisterAction´.
   *
   *
   * ## Life-Cycle and configuration
   *
   * The editor actions will wait for diagram initialization before
   * registering default actions _and_ firing an `editorActions.init` event.
   *
   * Interested parties may listen to the `editorActions.init` event with
   * low priority to check, which actions got registered. Other components
   * may use the event to register their own actions via `registerAction`.
   *
   * @param {EventBus} eventBus
   * @param {Injector} injector
   */

  function EditorActions(eventBus, injector) {
    // initialize actions
    this._actions = {};
    var self = this;
    eventBus.on('diagram.init', function () {
      // all diagram modules got loaded; check which ones
      // are available and register the respective default actions
      self._registerDefaultActions(injector); // ask interested parties to register available editor
      // actions on diagram initialization


      eventBus.fire('editorActions.init', {
        editorActions: self
      });
    });
  }
  EditorActions.$inject = ['eventBus', 'injector'];
  /**
   * Register default actions.
   *
   * @param {Injector} injector
   */

  EditorActions.prototype._registerDefaultActions = function (injector) {
    // (1) retrieve optional components to integrate with
    var commandStack = injector.get('commandStack', false);
    var modeling = injector.get('modeling', false);
    var selection = injector.get('selection', false);
    var zoomScroll = injector.get('zoomScroll', false);
    var copyPaste = injector.get('copyPaste', false);
    var canvas = injector.get('canvas', false);
    var rules = injector.get('rules', false);
    var keyboardMove = injector.get('keyboardMove', false);
    var keyboardMoveSelection = injector.get('keyboardMoveSelection', false); // (2) check components and register actions

    if (commandStack) {
      this.register('undo', function () {
        commandStack.undo();
      });
      this.register('redo', function () {
        commandStack.redo();
      });
    }

    if (copyPaste && selection) {
      this.register('copy', function () {
        var selectedElements = selection.get();
        copyPaste.copy(selectedElements);
      });
    }

    if (copyPaste) {
      this.register('paste', function () {
        copyPaste.paste();
      });
    }

    if (zoomScroll) {
      this.register('stepZoom', function (opts) {
        zoomScroll.stepZoom(opts.value);
      });
    }

    if (canvas) {
      this.register('zoom', function (opts) {
        canvas.zoom(opts.value);
      });
    }

    if (modeling && selection && rules) {
      this.register('removeSelection', function () {
        var selectedElements = selection.get();

        if (!selectedElements.length) {
          return;
        }

        var allowed = rules.allowed('elements.delete', {
          elements: selectedElements
        }),
            removableElements;

        if (allowed === false) {
          return;
        } else if (isArray$1(allowed)) {
          removableElements = allowed;
        } else {
          removableElements = selectedElements;
        }

        if (removableElements.length) {
          modeling.removeElements(removableElements.slice());
        }
      });
    }

    if (keyboardMove) {
      this.register('moveCanvas', function (opts) {
        keyboardMove.moveCanvas(opts);
      });
    }

    if (keyboardMoveSelection) {
      this.register('moveSelection', function (opts) {
        keyboardMoveSelection.moveSelection(opts.direction, opts.accelerated);
      });
    }
  };
  /**
   * Triggers a registered action
   *
   * @param  {string} action
   * @param  {Object} opts
   *
   * @return {Unknown} Returns what the registered listener returns
   */


  EditorActions.prototype.trigger = function (action, opts) {
    if (!this._actions[action]) {
      throw error(action, NOT_REGISTERED_ERROR);
    }

    return this._actions[action](opts);
  };
  /**
   * Registers a collections of actions.
   * The key of the object will be the name of the action.
   *
   * @example
   * ´´´
   * var actions = {
   *   spaceTool: function() {
   *     spaceTool.activateSelection();
   *   },
   *   lassoTool: function() {
   *     lassoTool.activateSelection();
   *   }
   * ];
   *
   * editorActions.register(actions);
   *
   * editorActions.isRegistered('spaceTool'); // true
   * ´´´
   *
   * @param  {Object} actions
   */


  EditorActions.prototype.register = function (actions, listener) {
    var self = this;

    if (typeof actions === 'string') {
      return this._registerAction(actions, listener);
    }

    forEach(actions, function (listener, action) {
      self._registerAction(action, listener);
    });
  };
  /**
   * Registers a listener to an action key
   *
   * @param  {string} action
   * @param  {Function} listener
   */


  EditorActions.prototype._registerAction = function (action, listener) {
    if (this.isRegistered(action)) {
      throw error(action, IS_REGISTERED_ERROR);
    }

    this._actions[action] = listener;
  };
  /**
   * Unregister an existing action
   *
   * @param {string} action
   */


  EditorActions.prototype.unregister = function (action) {
    if (!this.isRegistered(action)) {
      throw error(action, NOT_REGISTERED_ERROR);
    }

    this._actions[action] = undefined;
  };
  /**
   * Returns the number of actions that are currently registered
   *
   * @return {number}
   */


  EditorActions.prototype.getActions = function () {
    return Object.keys(this._actions);
  };
  /**
   * Checks wether the given action is registered
   *
   * @param {string} action
   *
   * @return {boolean}
   */


  EditorActions.prototype.isRegistered = function (action) {
    return !!this._actions[action];
  };

  function error(action, message) {
    return new Error(action + ' ' + message);
  }

  var EditorActionsModule$1 = {
    __init__: ['editorActions'],
    editorActions: ['type', EditorActions]
  };

  class FormEditorActions extends EditorActions {
    constructor(eventBus, injector) {
      super(eventBus, injector);
      eventBus.on('form.init', () => {
        this._registerDefaultActions(injector);

        eventBus.fire('editorActions.init', {
          editorActions: this
        });
      });
    }

    _registerDefaultActions(injector) {
      const commandStack = injector.get('commandStack', false),
            formFieldRegistry = injector.get('formFieldRegistry', false),
            selection = injector.get('selection', false);

      if (commandStack) {
        // @ts-ignore
        this.register('undo', () => {
          commandStack.undo();
        }); // @ts-ignore

        this.register('redo', () => {
          commandStack.redo();
        });
      }

      if (formFieldRegistry && selection) {
        // @ts-ignore
        this.register('selectFormField', (options = {}) => {
          const {
            id
          } = options;

          if (!id) {
            return;
          }

          const formField = formFieldRegistry.get(id);

          if (formField) {
            selection.set(formField);
          }
        });
      }
    }

  }
  FormEditorActions.$inject = ['eventBus', 'injector'];

  var EditorActionsModule = {
    __depends__: [EditorActionsModule$1],
    editorActions: ['type', FormEditorActions]
  };

  /**
   * Returns true if event was triggered with any modifier
   * @param {KeyboardEvent} event
   */

  function hasModifier(event) {
    return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
  }
  /**
   * @param {KeyboardEvent} event
   */

  function isCmd(event) {
    // ensure we don't react to AltGr
    // (mapped to CTRL + ALT)
    if (event.altKey) {
      return false;
    }

    return event.ctrlKey || event.metaKey;
  }
  /**
   * Checks if key pressed is one of provided keys.
   *
   * @param {string|Array<string>} keys
   * @param {KeyboardEvent} event
   */

  function isKey(keys, event) {
    keys = isArray$1(keys) ? keys : [keys];
    return keys.indexOf(event.key) !== -1 || keys.indexOf(event.keyCode) !== -1;
  }
  /**
   * @param {KeyboardEvent} event
   */

  function isShift(event) {
    return event.shiftKey;
  }

  var KEYDOWN_EVENT = 'keyboard.keydown',
      KEYUP_EVENT = 'keyboard.keyup';
  var HANDLE_MODIFIER_ATTRIBUTE = 'input-handle-modified-keys';
  var DEFAULT_PRIORITY$1 = 1000;
  /**
   * A keyboard abstraction that may be activated and
   * deactivated by users at will, consuming key events
   * and triggering diagram actions.
   *
   * For keys pressed down, keyboard fires `keyboard.keydown` event.
   * The event context contains one field which is `KeyboardEvent` event.
   *
   * The implementation fires the following key events that allow
   * other components to hook into key handling:
   *
   *  - keyboard.bind
   *  - keyboard.unbind
   *  - keyboard.init
   *  - keyboard.destroy
   *
   * All events contain one field which is node.
   *
   * A default binding for the keyboard may be specified via the
   * `keyboard.bindTo` configuration option.
   *
   * @param {Config} config
   * @param {EventBus} eventBus
   */

  function Keyboard(config, eventBus) {
    var self = this;
    this._config = config || {};
    this._eventBus = eventBus;
    this._keydownHandler = this._keydownHandler.bind(this);
    this._keyupHandler = this._keyupHandler.bind(this); // properly clean dom registrations

    eventBus.on('diagram.destroy', function () {
      self._fire('destroy');

      self.unbind();
    });
    eventBus.on('diagram.init', function () {
      self._fire('init');
    });
    eventBus.on('attach', function () {
      if (config && config.bindTo) {
        self.bind(config.bindTo);
      }
    });
    eventBus.on('detach', function () {
      self.unbind();
    });
  }
  Keyboard.$inject = ['config.keyboard', 'eventBus'];

  Keyboard.prototype._keydownHandler = function (event) {
    this._keyHandler(event, KEYDOWN_EVENT);
  };

  Keyboard.prototype._keyupHandler = function (event) {
    this._keyHandler(event, KEYUP_EVENT);
  };

  Keyboard.prototype._keyHandler = function (event, type) {
    var eventBusResult;

    if (this._isEventIgnored(event)) {
      return;
    }

    var context = {
      keyEvent: event
    };
    eventBusResult = this._eventBus.fire(type || KEYDOWN_EVENT, context);

    if (eventBusResult) {
      event.preventDefault();
    }
  };

  Keyboard.prototype._isEventIgnored = function (event) {
    return isInput(event.target) && this._isModifiedKeyIgnored(event);
  };

  Keyboard.prototype._isModifiedKeyIgnored = function (event) {
    if (!isCmd(event)) {
      return true;
    }

    var allowedModifiers = this._getAllowedModifiers(event.target);

    return !allowedModifiers.includes(event.key);
  };

  Keyboard.prototype._getAllowedModifiers = function (element) {
    var modifierContainer = closest(element, '[' + HANDLE_MODIFIER_ATTRIBUTE + ']', true);

    if (!modifierContainer || this._node && !this._node.contains(modifierContainer)) {
      return [];
    }

    return modifierContainer.getAttribute(HANDLE_MODIFIER_ATTRIBUTE).split(',');
  };

  Keyboard.prototype.bind = function (node) {
    // make sure that the keyboard is only bound once to the DOM
    this.unbind();
    this._node = node; // bind key events

    componentEvent.bind(node, 'keydown', this._keydownHandler, true);
    componentEvent.bind(node, 'keyup', this._keyupHandler, true);

    this._fire('bind');
  };

  Keyboard.prototype.getBinding = function () {
    return this._node;
  };

  Keyboard.prototype.unbind = function () {
    var node = this._node;

    if (node) {
      this._fire('unbind'); // unbind key events


      componentEvent.unbind(node, 'keydown', this._keydownHandler, true);
      componentEvent.unbind(node, 'keyup', this._keyupHandler, true);
    }

    this._node = null;
  };

  Keyboard.prototype._fire = function (event) {
    this._eventBus.fire('keyboard.' + event, {
      node: this._node
    });
  };
  /**
   * Add a listener function that is notified with `KeyboardEvent` whenever
   * the keyboard is bound and the user presses a key. If no priority is
   * provided, the default value of 1000 is used.
   *
   * @param {number} [priority]
   * @param {Function} listener
   * @param {string} type
   */


  Keyboard.prototype.addListener = function (priority, listener, type) {
    if (isFunction(priority)) {
      type = listener;
      listener = priority;
      priority = DEFAULT_PRIORITY$1;
    }

    this._eventBus.on(type || KEYDOWN_EVENT, priority, listener);
  };

  Keyboard.prototype.removeListener = function (listener, type) {
    this._eventBus.off(type || KEYDOWN_EVENT, listener);
  };

  Keyboard.prototype.hasModifier = hasModifier;
  Keyboard.prototype.isCmd = isCmd;
  Keyboard.prototype.isShift = isShift;
  Keyboard.prototype.isKey = isKey; // helpers ///////

  function isInput(target) {
    return target && (matchesSelector(target, 'input, textarea') || target.contentEditable === 'true');
  }

  var LOW_PRIORITY$1 = 500;
  var KEYCODE_C = 67;
  var KEYCODE_V = 86;
  var KEYCODE_Y = 89;
  var KEYCODE_Z = 90;
  var KEYS_COPY = ['c', 'C', KEYCODE_C];
  var KEYS_PASTE = ['v', 'V', KEYCODE_V];
  var KEYS_REDO = ['y', 'Y', KEYCODE_Y];
  var KEYS_UNDO = ['z', 'Z', KEYCODE_Z];
  /**
   * Adds default keyboard bindings.
   *
   * This does not pull in any features will bind only actions that
   * have previously been registered against the editorActions component.
   *
   * @param {EventBus} eventBus
   * @param {Keyboard} keyboard
   */

  function KeyboardBindings(eventBus, keyboard) {
    var self = this;
    eventBus.on('editorActions.init', LOW_PRIORITY$1, function (event) {
      var editorActions = event.editorActions;
      self.registerBindings(keyboard, editorActions);
    });
  }
  KeyboardBindings.$inject = ['eventBus', 'keyboard'];
  /**
   * Register available keyboard bindings.
   *
   * @param {Keyboard} keyboard
   * @param {EditorActions} editorActions
   */

  KeyboardBindings.prototype.registerBindings = function (keyboard, editorActions) {
    /**
     * Add keyboard binding if respective editor action
     * is registered.
     *
     * @param {string} action name
     * @param {Function} fn that implements the key binding
     */
    function addListener(action, fn) {
      if (editorActions.isRegistered(action)) {
        keyboard.addListener(fn);
      }
    } // undo
    // (CTRL|CMD) + Z


    addListener('undo', function (context) {
      var event = context.keyEvent;

      if (isCmd(event) && !isShift(event) && isKey(KEYS_UNDO, event)) {
        editorActions.trigger('undo');
        return true;
      }
    }); // redo
    // CTRL + Y
    // CMD + SHIFT + Z

    addListener('redo', function (context) {
      var event = context.keyEvent;

      if (isCmd(event) && (isKey(KEYS_REDO, event) || isKey(KEYS_UNDO, event) && isShift(event))) {
        editorActions.trigger('redo');
        return true;
      }
    }); // copy
    // CTRL/CMD + C

    addListener('copy', function (context) {
      var event = context.keyEvent;

      if (isCmd(event) && isKey(KEYS_COPY, event)) {
        editorActions.trigger('copy');
        return true;
      }
    }); // paste
    // CTRL/CMD + V

    addListener('paste', function (context) {
      var event = context.keyEvent;

      if (isCmd(event) && isKey(KEYS_PASTE, event)) {
        editorActions.trigger('paste');
        return true;
      }
    }); // zoom in one step
    // CTRL/CMD + +

    addListener('stepZoom', function (context) {
      var event = context.keyEvent; // quirk: it has to be triggered by `=` as well to work on international keyboard layout
      // cf: https://github.com/bpmn-io/bpmn-js/issues/1362#issuecomment-722989754

      if (isKey(['+', 'Add', '='], event) && isCmd(event)) {
        editorActions.trigger('stepZoom', {
          value: 1
        });
        return true;
      }
    }); // zoom out one step
    // CTRL + -

    addListener('stepZoom', function (context) {
      var event = context.keyEvent;

      if (isKey(['-', 'Subtract'], event) && isCmd(event)) {
        editorActions.trigger('stepZoom', {
          value: -1
        });
        return true;
      }
    }); // zoom to the default level
    // CTRL + 0

    addListener('zoom', function (context) {
      var event = context.keyEvent;

      if (isKey('0', event) && isCmd(event)) {
        editorActions.trigger('zoom', {
          value: 1
        });
        return true;
      }
    }); // delete selected element
    // DEL

    addListener('removeSelection', function (context) {
      var event = context.keyEvent;

      if (isKey(['Backspace', 'Delete', 'Del'], event)) {
        editorActions.trigger('removeSelection');
        return true;
      }
    });
  };

  var KeyboardModule$1 = {
    __init__: ['keyboard', 'keyboardBindings'],
    keyboard: ['type', Keyboard],
    keyboardBindings: ['type', KeyboardBindings]
  };

  const LOW_PRIORITY = 500;
  class FormEditorKeyboardBindings {
    constructor(eventBus, keyboard) {
      eventBus.on('editorActions.init', LOW_PRIORITY, event => {
        const {
          editorActions
        } = event;
        this.registerBindings(keyboard, editorActions);
      });
    }

    registerBindings(keyboard, editorActions) {
      function addListener(action, fn) {
        if (editorActions.isRegistered(action)) {
          keyboard.addListener(fn);
        }
      } // undo
      // (CTRL|CMD) + Z


      addListener('undo', context => {
        const {
          keyEvent
        } = context;

        if (isCmd(keyEvent) && !isShift(keyEvent) && isKey(KEYS_UNDO, keyEvent)) {
          editorActions.trigger('undo');
          return true;
        }
      }); // redo
      // CTRL + Y
      // CMD + SHIFT + Z

      addListener('redo', context => {
        const {
          keyEvent
        } = context;

        if (isCmd(keyEvent) && (isKey(KEYS_REDO, keyEvent) || isKey(KEYS_UNDO, keyEvent) && isShift(keyEvent))) {
          editorActions.trigger('redo');
          return true;
        }
      });
    }

  }
  FormEditorKeyboardBindings.$inject = ['eventBus', 'keyboard'];

  var KeyboardModule = {
    __depends__: [KeyboardModule$1],
    __init__: ['keyboardBindings'],
    keyboardBindings: ['type', FormEditorKeyboardBindings]
  };

  function arrayAdd(array, index, item) {
    array.splice(index, 0, item);
    return array;
  }
  function arrayRemove(array, index) {
    array.splice(index, 1);
    return array;
  }
  function updatePath(formFieldRegistry, formField, index) {
    const parent = formFieldRegistry.get(formField._parent);
    formField._path = [...parent._path, 'components', index];
    return formField;
  }

  class AddFormFieldHandler {
    /**
     * @constructor
     * @param { import('../../../FormEditor').default } formEditor
     * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
     */
    constructor(formEditor, formFieldRegistry) {
      this._formEditor = formEditor;
      this._formFieldRegistry = formFieldRegistry;
    }

    execute(context) {
      const {
        formField,
        targetFormField,
        targetIndex
      } = context;

      const {
        schema
      } = this._formEditor._getState();

      const targetPath = [...targetFormField._path, 'components'];
      formField._parent = targetFormField.id; // (1) Add new form field

      arrayAdd(get(schema, targetPath), targetIndex, formField); // (2) Update paths of new form field and its siblings

      get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Add new form field to form field registry

      this._formFieldRegistry.add(formField); // TODO: Create updater/change support that automatically updates paths and schema on command execution


      this._formEditor._setState({
        schema
      });
    }

    revert(context) {
      const {
        formField,
        targetFormField,
        targetIndex
      } = context;

      const {
        schema
      } = this._formEditor._getState();

      const targetPath = [...targetFormField._path, 'components']; // (1) Remove new form field

      arrayRemove(get(schema, targetPath), targetIndex); // (2) Update paths of new form field and its siblings

      get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Remove new form field from form field registry

      this._formFieldRegistry.remove(formField); // TODO: Create updater/change support that automatically updates paths and schema on command execution


      this._formEditor._setState({
        schema
      });
    }

  }
  AddFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];

  class EditFormFieldHandler {
    /**
     * @constructor
     * @param { import('../../../FormEditor').default } formEditor
     * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
     */
    constructor(formEditor, formFieldRegistry) {
      this._formEditor = formEditor;
      this._formFieldRegistry = formFieldRegistry;
    }

    execute(context) {
      const {
        formField,
        properties
      } = context;

      let {
        schema
      } = this._formEditor._getState();

      const oldProperties = {};

      for (let key in properties) {
        oldProperties[key] = formField[key];
        const property = properties[key];

        if (key === 'id') {
          if (property !== formField.id) {
            this._formFieldRegistry.updateId(formField, property);
          }
        } else {
          formField[key] = property;
        }
      }

      context.oldProperties = oldProperties; // TODO: Create updater/change support that automatically updates paths and schema on command execution

      this._formEditor._setState({
        schema
      });

      return formField;
    }

    revert(context) {
      const {
        formField,
        oldProperties
      } = context;

      let {
        schema
      } = this._formEditor._getState();

      for (let key in oldProperties) {
        const property = oldProperties[key];

        if (key === 'id') {
          if (property !== formField.id) {
            this._formFieldRegistry.updateId(formField, property);
          }
        } else {
          formField[key] = property;
        }
      } // TODO: Create updater/change support that automatically updates paths and schema on command execution


      this._formEditor._setState({
        schema
      });

      return formField;
    }

  }
  EditFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];

  class MoveFormFieldHandler {
    /**
     * @constructor
     * @param { import('../../../FormEditor').default } formEditor
     * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
     */
    constructor(formEditor, formFieldRegistry) {
      this._formEditor = formEditor;
      this._formFieldRegistry = formFieldRegistry;
    }

    execute(context) {
      this.moveFormField(context);
    }

    revert(context) {
      let {
        sourceFormField,
        targetFormField,
        sourceIndex,
        targetIndex
      } = context;
      this.moveFormField({
        sourceFormField: targetFormField,
        targetFormField: sourceFormField,
        sourceIndex: targetIndex,
        targetIndex: sourceIndex
      }, true);
    }

    moveFormField(context, revert) {
      let {
        sourceFormField,
        targetFormField,
        sourceIndex,
        targetIndex
      } = context;

      let {
        schema
      } = this._formEditor._getState();

      const sourcePath = [...sourceFormField._path, 'components'];

      if (sourceFormField.id === targetFormField.id) {
        if (revert) {
          if (sourceIndex > targetIndex) {
            sourceIndex--;
          }
        } else {
          if (sourceIndex < targetIndex) {
            targetIndex--;
          }
        } // (1) Move form field


        mutate(get(schema, sourcePath), sourceIndex, targetIndex); // (2) Update paths of new form field and its siblings

        get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
      } else {
        const formField = get(schema, [...sourcePath, sourceIndex]);
        formField._parent = targetFormField.id; // (1) Remove form field

        arrayRemove(get(schema, sourcePath), sourceIndex); // (2) Update paths of siblings

        get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
        const targetPath = [...targetFormField._path, 'components']; // (3) Add form field

        arrayAdd(get(schema, targetPath), targetIndex, formField); // (4) Update paths of siblings

        get(schema, targetPath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index));
      } // TODO: Create updater/change support that automatically updates paths and schema on command execution


      this._formEditor._setState({
        schema
      });
    }

  }
  MoveFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];

  class RemoveFormFieldHandler {
    /**
     * @constructor
     * @param { import('../../../FormEditor').default } formEditor
     * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
     */
    constructor(formEditor, formFieldRegistry) {
      this._formEditor = formEditor;
      this._formFieldRegistry = formFieldRegistry;
    }

    execute(context) {
      const {
        sourceFormField,
        sourceIndex
      } = context;

      let {
        schema
      } = this._formEditor._getState();

      const sourcePath = [...sourceFormField._path, 'components'];
      const formField = context.formField = get(schema, [...sourcePath, sourceIndex]); // (1) Remove form field

      arrayRemove(get(schema, sourcePath), sourceIndex); // (2) Update paths of its siblings

      get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Remove form field from form field registry

      this._formFieldRegistry.remove(formField); // TODO: Create updater/change support that automatically updates paths and schema on command execution


      this._formEditor._setState({
        schema
      });
    }

    revert(context) {
      const {
        formField,
        sourceFormField,
        sourceIndex
      } = context;

      let {
        schema
      } = this._formEditor._getState();

      const sourcePath = [...sourceFormField._path, 'components']; // (1) Add form field

      arrayAdd(get(schema, sourcePath), sourceIndex, formField); // (2) Update paths of its siblings

      get(schema, sourcePath).forEach((formField, index) => updatePath(this._formFieldRegistry, formField, index)); // (3) Add form field to form field registry

      this._formFieldRegistry.add(formField); // TODO: Create updater/change support that automatically updates paths and schema on command execution


      this._formEditor._setState({
        schema
      });
    }

  }
  RemoveFormFieldHandler.$inject = ['formEditor', 'formFieldRegistry'];

  class UpdateIdClaimHandler {
    /**
     * @constructor
     * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
     */
    constructor(formFieldRegistry) {
      this._formFieldRegistry = formFieldRegistry;
    }

    execute(context) {
      const {
        claiming,
        formField,
        id
      } = context;

      if (claiming) {
        this._formFieldRegistry._ids.claim(id, formField);
      } else {
        this._formFieldRegistry._ids.unclaim(id);
      }
    }

    revert(context) {
      const {
        claiming,
        formField,
        id
      } = context;

      if (claiming) {
        this._formFieldRegistry._ids.unclaim(id);
      } else {
        this._formFieldRegistry._ids.claim(id, formField);
      }
    }

  }
  UpdateIdClaimHandler.$inject = ['formFieldRegistry'];

  class UpdateKeyClaimHandler {
    /**
     * @constructor
     * @param { import('../../../core/FormFieldRegistry').default } formFieldRegistry
     */
    constructor(formFieldRegistry) {
      this._formFieldRegistry = formFieldRegistry;
    }

    execute(context) {
      const {
        claiming,
        formField,
        key
      } = context;

      if (claiming) {
        this._formFieldRegistry._keys.claim(key, formField);
      } else {
        this._formFieldRegistry._keys.unclaim(key);
      }
    }

    revert(context) {
      const {
        claiming,
        formField,
        key
      } = context;

      if (claiming) {
        this._formFieldRegistry._keys.unclaim(key);
      } else {
        this._formFieldRegistry._keys.claim(key, formField);
      }
    }

  }
  UpdateKeyClaimHandler.$inject = ['formFieldRegistry'];

  class Modeling {
    constructor(commandStack, eventBus, formEditor, formFieldRegistry, fieldFactory) {
      this._commandStack = commandStack;
      this._formEditor = formEditor;
      this._formFieldRegistry = formFieldRegistry;
      this._fieldFactory = fieldFactory;
      eventBus.on('form.init', () => {
        this.registerHandlers();
      });
    }

    registerHandlers() {
      Object.entries(this.getHandlers()).forEach(([id, handler]) => {
        this._commandStack.registerHandler(id, handler);
      });
    }

    getHandlers() {
      return {
        'formField.add': AddFormFieldHandler,
        'formField.edit': EditFormFieldHandler,
        'formField.move': MoveFormFieldHandler,
        'formField.remove': RemoveFormFieldHandler,
        'id.updateClaim': UpdateIdClaimHandler,
        'key.updateClaim': UpdateKeyClaimHandler
      };
    }

    addFormField(attrs, targetFormField, targetIndex) {
      const formField = this._fieldFactory.create(attrs);

      const context = {
        formField,
        targetFormField,
        targetIndex
      };

      this._commandStack.execute('formField.add', context);

      return formField;
    }

    editFormField(formField, properties, value) {
      if (!isObject(properties)) {
        properties = {
          [properties]: value
        };
      }

      const context = {
        formField,
        properties
      };

      this._commandStack.execute('formField.edit', context);
    }

    moveFormField(formField, sourceFormField, targetFormField, sourceIndex, targetIndex) {
      const context = {
        formField,
        sourceFormField,
        targetFormField,
        sourceIndex,
        targetIndex
      };

      this._commandStack.execute('formField.move', context);
    }

    removeFormField(formField, sourceFormField, sourceIndex) {
      const context = {
        formField,
        sourceFormField,
        sourceIndex
      };

      this._commandStack.execute('formField.remove', context);
    }

    claimId(formField, id) {
      const context = {
        formField,
        id,
        claiming: true
      };

      this._commandStack.execute('id.updateClaim', context);
    }

    unclaimId(formField, id) {
      const context = {
        formField,
        id,
        claiming: false
      };

      this._commandStack.execute('id.updateClaim', context);
    }

    claimKey(formField, key) {
      const context = {
        formField,
        key,
        claiming: true
      };

      this._commandStack.execute('key.updateClaim', context);
    }

    unclaimKey(formField, key) {
      const context = {
        formField,
        key,
        claiming: false
      };

      this._commandStack.execute('key.updateClaim', context);
    }

  }
  Modeling.$inject = ['commandStack', 'eventBus', 'formEditor', 'formFieldRegistry', 'fieldFactory'];

  var DEFAULT_PRIORITY = 1000;
  /**
   * A utility that can be used to plug-in into the command execution for
   * extension and/or validation.
   *
   * @param {EventBus} eventBus
   *
   * @example
   *
   * import inherits from 'inherits';
   *
   * import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
   *
   * function CommandLogger(eventBus) {
   *   CommandInterceptor.call(this, eventBus);
   *
   *   this.preExecute(function(event) {
   *     console.log('command pre-execute', event);
   *   });
   * }
   *
   * inherits(CommandLogger, CommandInterceptor);
   *
   */

  function CommandInterceptor(eventBus) {
    this._eventBus = eventBus;
  }
  CommandInterceptor.$inject = ['eventBus'];

  function unwrapEvent(fn, that) {
    return function (event) {
      return fn.call(that || null, event.context, event.command, event);
    };
  }
  /**
   * Register an interceptor for a command execution
   *
   * @param {string|Array<string>} [events] list of commands to register on
   * @param {string} [hook] command hook, i.e. preExecute, executed to listen on
   * @param {number} [priority] the priority on which to hook into the execution
   * @param {Function} handlerFn interceptor to be invoked with (event)
   * @param {boolean} unwrap if true, unwrap the event and pass (context, command, event) to the
   *                          listener instead
   * @param {Object} [that] Pass context (`this`) to the handler function
   */


  CommandInterceptor.prototype.on = function (events, hook, priority, handlerFn, unwrap, that) {
    if (isFunction(hook) || isNumber(hook)) {
      that = unwrap;
      unwrap = handlerFn;
      handlerFn = priority;
      priority = hook;
      hook = null;
    }

    if (isFunction(priority)) {
      that = unwrap;
      unwrap = handlerFn;
      handlerFn = priority;
      priority = DEFAULT_PRIORITY;
    }

    if (isObject(unwrap)) {
      that = unwrap;
      unwrap = false;
    }

    if (!isFunction(handlerFn)) {
      throw new Error('handlerFn must be a function');
    }

    if (!isArray$1(events)) {
      events = [events];
    }

    var eventBus = this._eventBus;
    forEach(events, function (event) {
      // concat commandStack(.event)?(.hook)?
      var fullEvent = ['commandStack', event, hook].filter(function (e) {
        return e;
      }).join('.');
      eventBus.on(fullEvent, priority, unwrap ? unwrapEvent(handlerFn, that) : handlerFn, that);
    });
  };

  var hooks = ['canExecute', 'preExecute', 'preExecuted', 'execute', 'executed', 'postExecute', 'postExecuted', 'revert', 'reverted'];
  /*
   * Install hook shortcuts
   *
   * This will generate the CommandInterceptor#(preExecute|...|reverted) methods
   * which will in term forward to CommandInterceptor#on.
   */

  forEach(hooks, function (hook) {
    /**
     * {canExecute|preExecute|preExecuted|execute|executed|postExecute|postExecuted|revert|reverted}
     *
     * A named hook for plugging into the command execution
     *
     * @param {string|Array<string>} [events] list of commands to register on
     * @param {number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    CommandInterceptor.prototype[hook] = function (events, priority, handlerFn, unwrap, that) {
      if (isFunction(events) || isNumber(events)) {
        that = unwrap;
        unwrap = handlerFn;
        handlerFn = priority;
        priority = events;
        events = null;
      }

      this.on(events, hook, priority, handlerFn, unwrap, that);
    };
  });

  class IdBehavior extends CommandInterceptor {
    constructor(eventBus, modeling) {
      super(eventBus); // @ts-ignore-next-line

      this.preExecute('formField.remove', function (context) {
        const {
          formField
        } = context;
        const {
          id
        } = formField;
        modeling.unclaimId(formField, id);
      }, true); // @ts-ignore-next-line

      this.preExecute('formField.edit', function (context) {
        const {
          formField,
          properties
        } = context;

        if ('id' in properties) {
          modeling.unclaimId(formField, formField.id);
          modeling.claimId(formField, properties.id);
        }
      }, true);
    }

  }
  IdBehavior.$inject = ['eventBus', 'modeling'];

  class KeyBehavior extends CommandInterceptor {
    constructor(eventBus, modeling) {
      super(eventBus); // @ts-ignore-next-line

      this.preExecute('formField.remove', function (context) {
        const {
          formField
        } = context;
        const {
          key
        } = formField;

        if (key) {
          modeling.unclaimKey(formField, key);
        }
      }, true); // @ts-ignore-next-line

      this.preExecute('formField.edit', function (context) {
        const {
          formField,
          properties
        } = context;

        if ('key' in properties) {
          modeling.unclaimKey(formField, formField.key);
          modeling.claimKey(formField, properties.key);
        }
      }, true);
    }

  }
  KeyBehavior.$inject = ['eventBus', 'modeling'];

  var behaviorModule = {
    __init__: ['idBehavior', 'keyBehavior'],
    idBehavior: ['type', IdBehavior],
    keyBehavior: ['type', KeyBehavior]
  };

  /**
   * A service that offers un- and redoable execution of commands.
   *
   * The command stack is responsible for executing modeling actions
   * in a un- and redoable manner. To do this it delegates the actual
   * command execution to {@link CommandHandler}s.
   *
   * Command handlers provide {@link CommandHandler#execute(ctx)} and
   * {@link CommandHandler#revert(ctx)} methods to un- and redo a command
   * identified by a command context.
   *
   *
   * ## Life-Cycle events
   *
   * In the process the command stack fires a number of life-cycle events
   * that other components to participate in the command execution.
   *
   *    * preExecute
   *    * preExecuted
   *    * execute
   *    * executed
   *    * postExecute
   *    * postExecuted
   *    * revert
   *    * reverted
   *
   * A special event is used for validating, whether a command can be
   * performed prior to its execution.
   *
   *    * canExecute
   *
   * Each of the events is fired as `commandStack.{eventName}` and
   * `commandStack.{commandName}.{eventName}`, respectively. This gives
   * components fine grained control on where to hook into.
   *
   * The event object fired transports `command`, the name of the
   * command and `context`, the command context.
   *
   *
   * ## Creating Command Handlers
   *
   * Command handlers should provide the {@link CommandHandler#execute(ctx)}
   * and {@link CommandHandler#revert(ctx)} methods to implement
   * redoing and undoing of a command.
   *
   * A command handler _must_ ensure undo is performed properly in order
   * not to break the undo chain. It must also return the shapes that
   * got changed during the `execute` and `revert` operations.
   *
   * Command handlers may execute other modeling operations (and thus
   * commands) in their `preExecute` and `postExecute` phases. The command
   * stack will properly group all commands together into a logical unit
   * that may be re- and undone atomically.
   *
   * Command handlers must not execute other commands from within their
   * core implementation (`execute`, `revert`).
   *
   *
   * ## Change Tracking
   *
   * During the execution of the CommandStack it will keep track of all
   * elements that have been touched during the command's execution.
   *
   * At the end of the CommandStack execution it will notify interested
   * components via an 'elements.changed' event with all the dirty
   * elements.
   *
   * The event can be picked up by components that are interested in the fact
   * that elements have been changed. One use case for this is updating
   * their graphical representation after moving / resizing or deletion.
   *
   * @see CommandHandler
   *
   * @param {EventBus} eventBus
   * @param {Injector} injector
   */

  function CommandStack(eventBus, injector) {
    /**
     * A map of all registered command handlers.
     *
     * @type {Object}
     */
    this._handlerMap = {};
    /**
     * A stack containing all re/undoable actions on the diagram
     *
     * @type {Array<Object>}
     */

    this._stack = [];
    /**
     * The current index on the stack
     *
     * @type {number}
     */

    this._stackIdx = -1;
    /**
     * Current active commandStack execution
     *
     * @type {Object}
     * @property {Object[]} actions
     * @property {Object[]} dirty
     * @property { 'undo' | 'redo' | 'clear' | 'execute' | null } trigger the cause of the current excecution
     */

    this._currentExecution = {
      actions: [],
      dirty: [],
      trigger: null
    };
    this._injector = injector;
    this._eventBus = eventBus;
    this._uid = 1;
    eventBus.on(['diagram.destroy', 'diagram.clear'], function () {
      this.clear(false);
    }, this);
  }
  CommandStack.$inject = ['eventBus', 'injector'];
  /**
   * Execute a command
   *
   * @param {string} command the command to execute
   * @param {Object} context the environment to execute the command in
   */

  CommandStack.prototype.execute = function (command, context) {
    if (!command) {
      throw new Error('command required');
    }

    this._currentExecution.trigger = 'execute';
    var action = {
      command: command,
      context: context
    };

    this._pushAction(action);

    this._internalExecute(action);

    this._popAction(action);
  };
  /**
   * Ask whether a given command can be executed.
   *
   * Implementors may hook into the mechanism on two ways:
   *
   *   * in event listeners:
   *
   *     Users may prevent the execution via an event listener.
   *     It must prevent the default action for `commandStack.(<command>.)canExecute` events.
   *
   *   * in command handlers:
   *
   *     If the method {@link CommandHandler#canExecute} is implemented in a handler
   *     it will be called to figure out whether the execution is allowed.
   *
   * @param  {string} command the command to execute
   * @param  {Object} context the environment to execute the command in
   *
   * @return {boolean} true if the command can be executed
   */


  CommandStack.prototype.canExecute = function (command, context) {
    var action = {
      command: command,
      context: context
    };

    var handler = this._getHandler(command);

    var result = this._fire(command, 'canExecute', action); // handler#canExecute will only be called if no listener
    // decided on a result already


    if (result === undefined) {
      if (!handler) {
        return false;
      }

      if (handler.canExecute) {
        result = handler.canExecute(context);
      }
    }

    return result;
  };
  /**
   * Clear the command stack, erasing all undo / redo history
   */


  CommandStack.prototype.clear = function (emit) {
    this._stack.length = 0;
    this._stackIdx = -1;

    if (emit !== false) {
      this._fire('changed', {
        trigger: 'clear'
      });
    }
  };
  /**
   * Undo last command(s)
   */


  CommandStack.prototype.undo = function () {
    var action = this._getUndoAction(),
        next;

    if (action) {
      this._currentExecution.trigger = 'undo';

      this._pushAction(action);

      while (action) {
        this._internalUndo(action);

        next = this._getUndoAction();

        if (!next || next.id !== action.id) {
          break;
        }

        action = next;
      }

      this._popAction();
    }
  };
  /**
   * Redo last command(s)
   */


  CommandStack.prototype.redo = function () {
    var action = this._getRedoAction(),
        next;

    if (action) {
      this._currentExecution.trigger = 'redo';

      this._pushAction(action);

      while (action) {
        this._internalExecute(action, true);

        next = this._getRedoAction();

        if (!next || next.id !== action.id) {
          break;
        }

        action = next;
      }

      this._popAction();
    }
  };
  /**
   * Register a handler instance with the command stack
   *
   * @param {string} command
   * @param {CommandHandler} handler
   */


  CommandStack.prototype.register = function (command, handler) {
    this._setHandler(command, handler);
  };
  /**
   * Register a handler type with the command stack
   * by instantiating it and injecting its dependencies.
   *
   * @param {string} command
   * @param {Function} a constructor for a {@link CommandHandler}
   */


  CommandStack.prototype.registerHandler = function (command, handlerCls) {
    if (!command || !handlerCls) {
      throw new Error('command and handlerCls must be defined');
    }

    var handler = this._injector.instantiate(handlerCls);

    this.register(command, handler);
  };

  CommandStack.prototype.canUndo = function () {
    return !!this._getUndoAction();
  };

  CommandStack.prototype.canRedo = function () {
    return !!this._getRedoAction();
  }; // stack access  //////////////////////


  CommandStack.prototype._getRedoAction = function () {
    return this._stack[this._stackIdx + 1];
  };

  CommandStack.prototype._getUndoAction = function () {
    return this._stack[this._stackIdx];
  }; // internal functionality //////////////////////


  CommandStack.prototype._internalUndo = function (action) {
    var self = this;
    var command = action.command,
        context = action.context;

    var handler = this._getHandler(command); // guard against illegal nested command stack invocations


    this._atomicDo(function () {
      self._fire(command, 'revert', action);

      if (handler.revert) {
        self._markDirty(handler.revert(context));
      }

      self._revertedAction(action);

      self._fire(command, 'reverted', action);
    });
  };

  CommandStack.prototype._fire = function (command, qualifier, event) {
    if (arguments.length < 3) {
      event = qualifier;
      qualifier = null;
    }

    var names = qualifier ? [command + '.' + qualifier, qualifier] : [command],
        i,
        name,
        result;
    event = this._eventBus.createEvent(event);

    for (i = 0; name = names[i]; i++) {
      result = this._eventBus.fire('commandStack.' + name, event);

      if (event.cancelBubble) {
        break;
      }
    }

    return result;
  };

  CommandStack.prototype._createId = function () {
    return this._uid++;
  };

  CommandStack.prototype._atomicDo = function (fn) {
    var execution = this._currentExecution;
    execution.atomic = true;

    try {
      fn();
    } finally {
      execution.atomic = false;
    }
  };

  CommandStack.prototype._internalExecute = function (action, redo) {
    var self = this;
    var command = action.command,
        context = action.context;

    var handler = this._getHandler(command);

    if (!handler) {
      throw new Error('no command handler registered for <' + command + '>');
    }

    this._pushAction(action);

    if (!redo) {
      this._fire(command, 'preExecute', action);

      if (handler.preExecute) {
        handler.preExecute(context);
      }

      this._fire(command, 'preExecuted', action);
    } // guard against illegal nested command stack invocations


    this._atomicDo(function () {
      self._fire(command, 'execute', action);

      if (handler.execute) {
        // actual execute + mark return results as dirty
        self._markDirty(handler.execute(context));
      } // log to stack


      self._executedAction(action, redo);

      self._fire(command, 'executed', action);
    });

    if (!redo) {
      this._fire(command, 'postExecute', action);

      if (handler.postExecute) {
        handler.postExecute(context);
      }

      this._fire(command, 'postExecuted', action);
    }

    this._popAction(action);
  };

  CommandStack.prototype._pushAction = function (action) {
    var execution = this._currentExecution,
        actions = execution.actions;
    var baseAction = actions[0];

    if (execution.atomic) {
      throw new Error('illegal invocation in <execute> or <revert> phase (action: ' + action.command + ')');
    }

    if (!action.id) {
      action.id = baseAction && baseAction.id || this._createId();
    }

    actions.push(action);
  };

  CommandStack.prototype._popAction = function () {
    var execution = this._currentExecution,
        trigger = execution.trigger,
        actions = execution.actions,
        dirty = execution.dirty;
    actions.pop();

    if (!actions.length) {
      this._eventBus.fire('elements.changed', {
        elements: uniqueBy('id', dirty.reverse())
      });

      dirty.length = 0;

      this._fire('changed', {
        trigger: trigger
      });

      execution.trigger = null;
    }
  };

  CommandStack.prototype._markDirty = function (elements) {
    var execution = this._currentExecution;

    if (!elements) {
      return;
    }

    elements = isArray$1(elements) ? elements : [elements];
    execution.dirty = execution.dirty.concat(elements);
  };

  CommandStack.prototype._executedAction = function (action, redo) {
    var stackIdx = ++this._stackIdx;

    if (!redo) {
      this._stack.splice(stackIdx, this._stack.length, action);
    }
  };

  CommandStack.prototype._revertedAction = function (action) {
    this._stackIdx--;
  };

  CommandStack.prototype._getHandler = function (command) {
    return this._handlerMap[command];
  };

  CommandStack.prototype._setHandler = function (command, handler) {
    if (!command || !handler) {
      throw new Error('command and handler required');
    }

    if (this._handlerMap[command]) {
      throw new Error('overriding handler for command <' + command + '>');
    }

    this._handlerMap[command] = handler;
  };

  var commandModule = {
    commandStack: ['type', CommandStack]
  };

  var ModelingModule = {
    __depends__: [behaviorModule, commandModule],
    __init__: ['modeling'],
    modeling: ['type', Modeling]
  };

  class Selection {
    constructor(eventBus) {
      this._eventBus = eventBus;
      this._selection = null;
    }

    get() {
      return this._selection;
    }

    set(selection) {
      if (this._selection === selection) {
        return;
      }

      this._selection = selection;

      this._eventBus.fire('selection.changed', {
        selection: this._selection
      });
    }

    toggle(selection) {
      const newSelection = this._selection === selection ? null : selection;
      this.set(newSelection);
    }

    clear() {
      this.set(null);
    }

    isSelected(formField) {
      return this._selection === formField;
    }

  }
  Selection.$inject = ['eventBus'];

  class SelectionBehavior {
    constructor(eventBus, selection) {
      eventBus.on(['commandStack.formField.add.postExecuted', 'commandStack.formField.move.postExecuted'], ({
        context
      }) => {
        const {
          formField
        } = context;
        selection.set(formField);
      });
      eventBus.on('commandStack.formField.remove.postExecuted', ({
        context
      }) => {
        const {
          sourceFormField,
          sourceIndex
        } = context;
        const formField = sourceFormField.components[sourceIndex] || sourceFormField.components[sourceIndex - 1];

        if (formField) {
          selection.set(formField);
        } else {
          selection.clear();
        }
      });
      eventBus.on('formField.remove', ({
        formField
      }) => {
        if (selection.isSelected(formField)) {
          selection.clear();
        }
      });
    }

  }
  SelectionBehavior.$inject = ['eventBus', 'selection'];

  var SelectionModule = {
    __init__: ['selection', 'selectionBehavior'],
    selection: ['type', Selection],
    selectionBehavior: ['type', SelectionBehavior]
  };

  const ids = new Ids([32, 36, 1]);
  /**
   * @typedef { import('./types').Injector } Injector
   * @typedef { import('./types').Module } Module
   * @typedef { import('./types').Schema } Schema
   *
   * @typedef { import('./types').FormEditorOptions } FormEditorOptions
   * @typedef { import('./types').FormEditorProperties } FormEditorProperties
   *
   * @typedef { {
   *   properties: FormEditorProperties,
   *   schema: Schema
   * } } State
   *
   * @typedef { (type:string, priority:number, handler:Function) => void } OnEventWithPriority
   * @typedef { (type:string, handler:Function) => void } OnEventWithOutPriority
   * @typedef { OnEventWithPriority & OnEventWithOutPriority } OnEventType
   */

  /**
   * The form editor.
   */

  class FormEditor {
    /**
     * @constructor
     * @param {FormEditorOptions} options
     */
    constructor(options = {}) {
      /**
       * @public
       * @type {OnEventType}
       */
      this.on = this._onEvent;
      /**
       * @public
       * @type {String}
       */

      this._id = ids.next();
      /**
       * @private
       * @type {Element}
       */

      this._container = createFormContainer();

      this._container.setAttribute('input-handle-modified-keys', 'z,y');

      const {
        container,
        exporter,
        injector = this._createInjector(options, this._container),
        properties = {}
      } = options;
      /**
       * @private
       * @type {any}
       */

      this.exporter = exporter;
      /**
       * @private
       * @type {State}
       */

      this._state = {
        properties,
        schema: null
      };
      this.get = injector.get;
      this.invoke = injector.invoke;
      this.get('eventBus').fire('form.init');

      if (container) {
        this.attachTo(container);
      }
    }

    clear() {
      // clear form services
      this._emit('diagram.clear'); // clear diagram services (e.g. EventBus)


      this._emit('form.clear');
    }

    destroy() {
      // destroy form services
      this.get('eventBus').fire('form.destroy'); // destroy diagram services (e.g. EventBus)

      this.get('eventBus').fire('diagram.destroy');

      this._detach(false);
    }
    /**
     * @param {Schema} schema
     *
     * @return {Promise<{ warnings: Array<any> }>}
     */


    importSchema(schema) {
      return new Promise((resolve, reject) => {
        try {
          this.clear();
          const {
            schema: importedSchema,
            warnings
          } = this.get('importer').importSchema(schema);

          this._setState({
            schema: importedSchema
          });

          this._emit('import.done', {
            warnings
          });

          return resolve({
            warnings
          });
        } catch (error) {
          this._emit('import.done', {
            error: error,
            warnings: error.warnings || []
          });

          return reject(error);
        }
      });
    }
    /**
     * @returns {Schema}
     */


    saveSchema() {
      return this.getSchema();
    }
    /**
     * @returns {Schema}
     */


    getSchema() {
      const {
        schema
      } = this._getState();

      return exportSchema(schema, this.exporter, schemaVersion);
    }
    /**
     * @param {Element|string} parentNode
     */


    attachTo(parentNode) {
      if (!parentNode) {
        throw new Error('parentNode required');
      }

      this.detach();

      if (isString(parentNode)) {
        parentNode = document.querySelector(parentNode);
      }

      const container = this._container;
      parentNode.appendChild(container);

      this._emit('attach');
    }

    detach() {
      this._detach();
    }
    /**
     * @internal
     *
     * @param {boolean} [emit]
     */


    _detach(emit = true) {
      const container = this._container,
            parentNode = container.parentNode;

      if (!parentNode) {
        return;
      }

      if (emit) {
        this._emit('detach');
      }

      parentNode.removeChild(container);
    }
    /**
     * @param {any} property
     * @param {any} value
     */


    setProperty(property, value) {
      const properties = set(this._getState().properties, [property], value);

      this._setState({
        properties
      });
    }
    /**
     * @param {string} type
     * @param {Function} handler
     */


    off(type, handler) {
      this.get('eventBus').off(type, handler);
    }
    /**
     * @internal
     *
     * @param {FormEditorOptions} options
     * @param {Element} container
     *
     * @returns {Injector}
     */


    _createInjector(options, container) {
      const {
        additionalModules = [],
        modules = this._getModules(),
        renderer = {}
      } = options;
      const config = { ...options,
        renderer: { ...renderer,
          container
        }
      };
      return createInjector([{
        config: ['value', config]
      }, {
        formEditor: ['value', this]
      }, core, ...modules, ...additionalModules]);
    }
    /**
     * @internal
     */


    _emit(type, data) {
      this.get('eventBus').fire(type, data);
    }
    /**
     * @internal
     */


    _getState() {
      return this._state;
    }
    /**
     * @internal
     */


    _setState(state) {
      this._state = { ...this._state,
        ...state
      };

      this._emit('changed', this._getState());
    }
    /**
     * @internal
     */


    _getModules() {
      return [ModelingModule, EditorActionsModule, KeyboardModule, SelectionModule];
    }
    /**
     * @internal
     */


    _onEvent(type, priority, handler) {
      this.get('eventBus').on(type, priority, handler);
    }

  } // helpers //////////

  function exportSchema(schema, exporter, schemaVersion) {
    const exportDetails = exporter ? {
      exporter
    } : {};
    const cleanedSchema = clone(schema, (name, value) => {
      if (['_parent', '_path'].includes(name)) {
        return undefined;
      }

      return value;
    });
    return { ...cleanedSchema,
      ...exportDetails,
      schemaVersion
    };
  }

  /**
   * @typedef { import('./types').CreateFormEditorOptions } CreateFormEditorOptions
   */

  /**
   * Create a form editor.
   *
   * @param {CreateFormEditorOptions} options
   *
   * @return {Promise<FormEditor>}
   */

  function createFormEditor(options) {
    const {
      schema,
      ...rest
    } = options;
    const formEditor = new FormEditor(rest);
    return formEditor.importSchema(schema).then(() => {
      return formEditor;
    });
  }

  exports.FormEditor = FormEditor;
  exports.createFormEditor = createFormEditor;
  exports.schemaVersion = schemaVersion;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
