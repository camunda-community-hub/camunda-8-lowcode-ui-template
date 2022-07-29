(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FormViewer = {}));
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

  function identity(arg) {
    return arg;
  }

  function toNum(arg) {
    return Number(arg);
  }
  /**
   * Bind function against target <this>.
   *
   * @param  {Function} fn
   * @param  {Object}   target
   *
   * @return {Function} bound function
   */

  function bind(fn, target) {
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

  function _extends$1() {
    _extends$1 = Object.assign || function (target) {
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

    return _extends$1.apply(this, arguments);
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

    return _extends$1.apply(void 0, [target].concat(others));
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

  var classnames = {exports: {}};

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
  }(classnames));

  var classNames = classnames.exports;

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

  var FN_REF = '__fn';
  var DEFAULT_PRIORITY = 1000;
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
      priority = DEFAULT_PRIORITY;
    }

    if (!isNumber(priority)) {
      throw new Error('priority must be a number');
    }

    var actualCallback = callback;

    if (that) {
      actualCallback = bind(callback, that); // make sure we remember and are able to remove
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
      priority = DEFAULT_PRIORITY;
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

  class Validator {
    validateField(field, value) {
      const {
        validate
      } = field;
      let errors = [];

      if (!validate) {
        return errors;
      }

      if (validate.pattern && value && !new RegExp(validate.pattern).test(value)) {
        errors = [...errors, `Field must match pattern ${validate.pattern}.`];
      }

      if (validate.required && (isNil(value) || value === '')) {
        errors = [...errors, 'Field is required.'];
      }

      if ('min' in validate && value && value < validate.min) {
        errors = [...errors, `Field must have minimum value of ${validate.min}.`];
      }

      if ('max' in validate && value && value > validate.max) {
        errors = [...errors, `Field must have maximum value of ${validate.max}.`];
      }

      if ('minLength' in validate && value && value.trim().length < validate.minLength) {
        errors = [...errors, `Field must have minimum length of ${validate.minLength}.`];
      }

      if ('maxLength' in validate && value && value.trim().length > validate.maxLength) {
        errors = [...errors, `Field must have maximum length of ${validate.maxLength}.`];
      }

      return errors;
    }

  }
  Validator.$inject = [];

  class FormFieldRegistry {
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
  FormFieldRegistry.$inject = ['eventBus'];

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
  const indices = {};
  function generateIndexForType(type) {
    if (type in indices) {
      indices[type]++;
    } else {
      indices[type] = 1;
    }

    return indices[type];
  }
  function generateIdForType(type) {
    return `${type}${generateIndexForType(type)}`;
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

  class Importer {
    /**
     * @constructor
     * @param { import('../core').FormFieldRegistry } formFieldRegistry
     * @param { import('../render/FormFields').default } formFields
     */
    constructor(formFieldRegistry, formFields) {
      this._formFieldRegistry = formFieldRegistry;
      this._formFields = formFields;
    }
    /**
     * Import schema adding `id`, `_parent` and `_path`
     * information to each field and adding it to the
     * form field registry.
     *
     * @param {any} schema
     * @param {any} [data]
     *
     * @return { { warnings: Array<any>, schema: any, data: any } }
     */


    importSchema(schema, data = {}) {
      // TODO: Add warnings
      const warnings = [];

      try {
        const importedSchema = this.importFormField(clone(schema)),
              importedData = this.importData(clone(data));
        return {
          warnings,
          schema: importedSchema,
          data: importedData
        };
      } catch (err) {
        err.warnings = warnings;
        throw err;
      }
    }
    /**
     * @param {any} formField
     * @param {string} [parentId]
     *
     * @return {any} importedField
     */


    importFormField(formField, parentId) {
      const {
        components,
        key,
        type,
        id = generateIdForType(type)
      } = formField;

      if (parentId) {
        // set form field parent
        formField._parent = parentId;
      }

      if (!this._formFields.get(type)) {
        throw new Error(`form field of type <${type}> not supported`);
      }

      if (key) {
        // validate <key> uniqueness
        if (this._formFieldRegistry._keys.assigned(key)) {
          throw new Error(`form field with key <${key}> already exists`);
        }

        this._formFieldRegistry._keys.claim(key, formField); // TODO: buttons should not have key


        if (type !== 'button') {
          // set form field path
          formField._path = [key];
        }
      }

      if (id) {
        // validate <id> uniqueness
        if (this._formFieldRegistry._ids.assigned(id)) {
          throw new Error(`form field with id <${id}> already exists`);
        }

        this._formFieldRegistry._ids.claim(id, formField);
      } // set form field ID


      formField.id = id;

      this._formFieldRegistry.add(formField);

      if (components) {
        this.importFormFields(components, id);
      }

      return formField;
    }

    importFormFields(components, parentId) {
      components.forEach(component => {
        this.importFormField(component, parentId);
      });
    }
    /**
     * @param {Object} data
     *
     * @return {Object} importedData
     */


    importData(data) {
      return this._formFieldRegistry.getAll().reduce((importedData, formField) => {
        const {
          defaultValue,
          _path,
          type
        } = formField;

        if (!_path) {
          return importedData;
        } // (1) try to get value from data
        // (2) try to get default value from form field
        // (3) get empty value from form field


        return { ...importedData,
          [_path[0]]: get(data, _path, isUndefined(defaultValue) ? this._formFields.get(type).emptyValue : defaultValue)
        };
      }, {});
    }

  }
  Importer.$inject = ['formFieldRegistry', 'formFields'];

  var importModule = {
    importer: ['type', Importer]
  };

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

  function getService(type, strict) {}

  const FormContext = D$1({
    getService,
    formId: null
  });

  function useService (type, strict) {
    const {
      getService
    } = F$1(FormContext);
    return getService(type, strict);
  }

  function getDataAsJson() {
    const form = useService('form');
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

  function Description(props) {
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

  function Label(props) {
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
  function Checkbox(props) {
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
      children: [e$1(Label, {
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
      }), e$1(Description, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Checkbox.create = function (options = {}) {
    return { ...options
    };
  };

  Checkbox.type = type$a;
  Checkbox.label = 'Checkbox';
  Checkbox.keyed = true;
  Checkbox.emptyValue = false;
  Checkbox.hiddenFx = 'false';

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
      children: [e$1(Label, {
        label: label
      }), myValues.map((v, index) => {
        return e$1(Label, {
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
      }), e$1(Description, {
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

  const noop$1 = () => false;

  function FormField(props) {
    const {
      field,
      onChange
    } = props;
    const {
      _path
    } = field;
    const formFields = useService('formFields'),
          form = useService('form');

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
        onChange: disabled ? noop$1 : onChange,
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

  const noop = () => {};

  function FormComponent(props) {
    const form = useService('form');

    const {
      schema
    } = form._getState();

    const {
      onSubmit = noop,
      onReset = noop,
      onChange = noop
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
      children: [e$1(Label, {
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
      }), e$1(Description, {
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
      children: [e$1(Label, {
        label: label,
        required: required
      }), values.map((v, index) => {
        return e$1(Label, {
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
      }), e$1(Description, {
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
  function Select(props) {
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
    console.log(dataFormStr);
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
      children: [e$1(Label, {
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
      }), e$1(Description, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Select.create = function (options = {}) {
    return {
      values: [{
        label: 'Value',
        value: 'value'
      }],
      ...options
    };
  };

  Select.type = type$6;
  Select.label = 'Select';
  Select.keyed = true;
  Select.emptyValue = null;
  Select.hiddenFx = 'false';

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
  var CloseIcon = (({
    styles = {},
    ...props
  }) => /*#__PURE__*/React.createElement("svg", _extends({
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
      children: [e$1(Label, {
        label: label,
        id: prefixId(id, formId)
      }), e$1("div", {
        class: classNames('fjs-taglist', {
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
      }), e$1(Description, {
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
  function Text(props) {
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

  Text.create = function (options = {}) {
    return {
      text: '# Text',
      ...options
    };
  };

  Text.type = type$4;
  Text.keyed = false;
  Text.hiddenFx = 'false';

  const type$3 = 'textfield';
  function Textfield(props) {
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
      children: [e$1(Label, {
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
      }), e$1(Description, {
        description: description
      }), e$1(Errors, {
        errors: errors
      })]
    });
  }

  Textfield.create = function (options = {}) {
    return { ...options
    };
  };

  Textfield.type = type$3;
  Textfield.label = 'Text Field';
  Textfield.keyed = true;
  Textfield.emptyValue = '';
  Textfield.hiddenFx = 'false';

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
      children: [e$1(Label, {
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
      }), e$1(Description, {
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
      children: [e$1(Label, {
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
      }), e$1(Description, {
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
          console.log(json);
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
      }), e$1(Description, {
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

  const formFields = [Button, Checkbox, Checklist, Default, Number$1, Radio, Select, Taglist, Text, Textfield, Datefield, Table, FileUpload];

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

  function Renderer(config, eventBus, form, injector) {
    const App = () => {
      const [state, setState] = l$1(form._getState());
      const formContext = {
        getService(type, strict = true) {
          return injector.get(type, strict);
        },

        formId: form._id
      };
      eventBus.on('changed', newState => {
        setState(newState);
      });
      const onChange = A$1(update => form._update(update), [form]);
      const {
        properties
      } = state;
      const {
        readOnly
      } = properties;
      const onSubmit = A$1(() => {
        if (!readOnly) {
          form.submit();
        }
      }, [form, readOnly]);
      const onReset = A$1(() => form.reset(), [form]);
      const {
        schema
      } = state;

      if (!schema) {
        return null;
      }

      return e$1(FormContext.Provider, {
        value: formContext,
        children: e$1(FormComponent, {
          onChange: onChange,
          onSubmit: onSubmit,
          onReset: onReset
        })
      });
    };

    const {
      container
    } = config;
    eventBus.on('form.init', () => {
      S$1(e$1(App, {}), container);
    });
    eventBus.on('form.destroy', () => {
      S$1(null, container);
    });
  }
  Renderer.$inject = ['config.renderer', 'eventBus', 'form', 'injector'];

  var renderModule = {
    __init__: ['formFields', 'renderer'],
    formFields: ['type', FormFields],
    renderer: ['type', Renderer]
  };

  var core = {
    __depends__: [importModule, renderModule],
    eventBus: ['type', EventBus],
    formFieldRegistry: ['type', FormFieldRegistry],
    validator: ['type', Validator]
  };

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

  const ids = new Ids([32, 36, 1]);
  /**
   * The form.
   */

  class Form {
    /**
     * @constructor
     * @param {FormOptions} options
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
      const {
        container,
        injector = this._createInjector(options, this._container),
        properties = {}
      } = options;
      /**
       * @private
       * @type {State}
       */

      this._state = {
        initialData: null,
        data: null,
        properties,
        errors: {},
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
    /**
     * Destroy the form, removing it from DOM,
     * if attached.
     */


    destroy() {
      // destroy form services
      this.get('eventBus').fire('form.destroy'); // destroy diagram services (e.g. EventBus)

      this.get('eventBus').fire('diagram.destroy');

      this._detach(false);
    }
    /**
     * Open a form schema with the given initial data.
     *
     * @param {Schema} schema
     * @param {Data} [data]
     *
     * @return Promise<{ warnings: Array<any> }>
     */


    importSchema(schema, data = {}) {
      return new Promise((resolve, reject) => {
        try {
          this.clear();
          const {
            schema: importedSchema,
            data: importedData,
            warnings
          } = this.get('importer').importSchema(schema, data);

          this._setState({
            data: importedData,
            errors: {},
            schema: importedSchema,
            initialData: clone(importedData)
          });

          this._emit('import.done', {
            warnings
          });

          return resolve({
            warnings
          });
        } catch (error) {
          this._emit('import.done', {
            error,
            warnings: error.warnings || []
          });

          return reject(error);
        }
      });
    }
    /**
     * Submit the form, triggering all field validations.
     *
     * @returns { { data: Data, errors: Errors } }
     */


    submit() {
      const {
        properties
      } = this._getState();

      if (properties.readOnly) {
        throw new Error('form is read-only');
      }

      const formFieldRegistry = this.get('formFieldRegistry');
      const data = formFieldRegistry.getAll().reduce((data, field) => {
        const {
          disabled,
          _path
        } = field; // do not submit disabled form fields

        if (disabled || !_path) {
          return data;
        }

        const value = get(this._getState().data, _path);
        return { ...data,
          [_path[0]]: value
        };
      }, {});
      const errors = this.validate();

      this._emit('submit', {
        data,
        errors
      });

      return {
        data,
        errors
      };
    }

    reset() {
      this._emit('reset');

      this._setState({
        data: clone(this._state.initialData),
        errors: {}
      });
    }
    /**
     * @returns {Errors}
     */


    validate() {
      const formFieldRegistry = this.get('formFieldRegistry'),
            validator = this.get('validator');

      const {
        data
      } = this._getState();

      let dataStr = JSON.stringify(data);
      const errors = formFieldRegistry.getAll().reduce((errors, field) => {
        const {
          disabled,
          hiddenFx,
          _path
        } = field;

        if (disabled) {
          return errors;
        }

        let hidden = false;

        try {
          hidden = Function("let data = " + dataStr + "; return " + hiddenFx).call();
        } catch (err) {
          hidden = false;
        }

        if (hidden) {
          return errors;
        }

        const value = get(data, _path);
        const fieldErrors = validator.validateField(field, value);
        return set(errors, [pathStringify(_path)], fieldErrors.length ? fieldErrors : undefined);
      },
      /** @type {Errors} */
      {});

      this._setState({
        errors
      });

      return errors;
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
     * @private
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
     * @param {FormProperty} property
     * @param {any} value
     */


    setProperty(property, value) {
      const properties = set(this._getState().properties, [property], value);

      this._setState({
        properties
      });
    }
    /**
     * @param {FormEvent} type
     * @param {Function} handler
     */


    off(type, handler) {
      this.get('eventBus').off(type, handler);
    }
    /**
     * @private
     *
     * @param {FormOptions} options
     * @param {Element} container
     *
     * @returns {Injector}
     */


    _createInjector(options, container) {
      const {
        additionalModules = [],
        modules = []
      } = options;
      const config = {
        renderer: {
          container
        }
      };
      return createInjector([{
        config: ['value', config]
      }, {
        form: ['value', this]
      }, core, ...modules, ...additionalModules]);
    }
    /**
     * @private
     */


    _emit(type, data) {
      this.get('eventBus').fire(type, data);
    }
    /**
     * @internal
     *
     * @param { { add?: boolean, field: any, remove?: number, value?: any } } update
     */


    _update(update) {
      const {
        field,
        value
      } = update;
      const {
        _path
      } = field;

      let {
        data,
        errors
      } = this._getState();

      const validator = this.get('validator');
      const fieldErrors = validator.validateField(field, value);
      set(data, _path, value);
      set(errors, [pathStringify(_path)], fieldErrors.length ? fieldErrors : undefined);

      this._setState({
        data: clone(data),
        errors: clone(errors)
      });
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


    _onEvent(type, priority, handler) {
      this.get('eventBus').on(type, priority, handler);
    }

  }

  const schemaVersion = 4;
  /**
   * @typedef { import('./types').CreateFormOptions } CreateFormOptions
   */

  /**
   * Create a form.
   *
   * @param {CreateFormOptions} options
   *
   * @return {Promise<Form>}
   */

  function createForm(options) {
    const {
      data,
      schema,
      ...rest
    } = options;
    const form = new Form(rest);
    return form.importSchema(schema, data).then(function () {
      return form;
    });
  }

  exports.Form = Form;
  exports.createForm = createForm;
  exports.schemaVersion = schemaVersion;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
