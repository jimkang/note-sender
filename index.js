!function(){"use strict";var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function t(e,t,n){return e(n={path:t,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&n.path)}},n.exports),n.exports}var n=t((function(e,t){var n=Object.prototype.hasOwnProperty,r=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}();t.arrayToObject=function(e,t){for(var n=t&&t.plainObjects?Object.create(null):{},r=0;r<e.length;++r)void 0!==e[r]&&(n[r]=e[r]);return n},t.merge=function(e,r,o){if(!r)return e;if("object"!=typeof r){if(Array.isArray(e))e.push(r);else{if("object"!=typeof e)return[e,r];(o.plainObjects||o.allowPrototypes||!n.call(Object.prototype,r))&&(e[r]=!0)}return e}if("object"!=typeof e)return[e].concat(r);var a=e;return Array.isArray(e)&&!Array.isArray(r)&&(a=t.arrayToObject(e,o)),Array.isArray(e)&&Array.isArray(r)?(r.forEach((function(r,a){n.call(e,a)?e[a]&&"object"==typeof e[a]?e[a]=t.merge(e[a],r,o):e.push(r):e[a]=r})),e):Object.keys(r).reduce((function(e,a){var i=r[a];return n.call(e,a)?e[a]=t.merge(e[a],i,o):e[a]=i,e}),a)},t.assign=function(e,t){return Object.keys(t).reduce((function(e,n){return e[n]=t[n],e}),e)},t.decode=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(t){return e}},t.encode=function(e){if(0===e.length)return e;for(var t="string"==typeof e?e:String(e),n="",o=0;o<t.length;++o){var a=t.charCodeAt(o);45===a||46===a||95===a||126===a||a>=48&&a<=57||a>=65&&a<=90||a>=97&&a<=122?n+=t.charAt(o):a<128?n+=r[a]:a<2048?n+=r[192|a>>6]+r[128|63&a]:a<55296||a>=57344?n+=r[224|a>>12]+r[128|a>>6&63]+r[128|63&a]:(o+=1,a=65536+((1023&a)<<10|1023&t.charCodeAt(o)),n+=r[240|a>>18]+r[128|a>>12&63]+r[128|a>>6&63]+r[128|63&a])}return n},t.compact=function(e){for(var t=[{obj:{o:e},prop:"o"}],n=[],r=0;r<t.length;++r)for(var o=t[r],a=o.obj[o.prop],i=Object.keys(a),c=0;c<i.length;++c){var u=i[c],s=a[u];"object"==typeof s&&null!==s&&-1===n.indexOf(s)&&(t.push({obj:a,prop:u}),n.push(s))}return function(e){for(var t;e.length;){var n=e.pop();if(t=n.obj[n.prop],Array.isArray(t)){for(var r=[],o=0;o<t.length;++o)void 0!==t[o]&&r.push(t[o]);n.obj[n.prop]=r}}return t}(t)},t.isRegExp=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},t.isBuffer=function(e){return null!=e&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))}})),r=String.prototype.replace,o=/%20/g,a={default:"RFC3986",formatters:{RFC1738:function(e){return r.call(e,o,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"},i={brackets:function(e){return e+"[]"},indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},c=Date.prototype.toISOString,u={delimiter:"&",encode:!0,encoder:n.encode,encodeValuesOnly:!1,serializeDate:function(e){return c.call(e)},skipNulls:!1,strictNullHandling:!1},s=function e(t,r,o,a,i,c,s,l,f,d,p,y){var h=t;if("function"==typeof s)h=s(r,h);else if(h instanceof Date)h=d(h);else if(null===h){if(a)return c&&!y?c(r,u.encoder):r;h=""}if("string"==typeof h||"number"==typeof h||"boolean"==typeof h||n.isBuffer(h))return c?[p(y?r:c(r,u.encoder))+"="+p(c(h,u.encoder))]:[p(r)+"="+p(String(h))];var v,m=[];if(void 0===h)return m;if(Array.isArray(s))v=s;else{var g=Object.keys(h);v=l?g.sort(l):g}for(var b=0;b<v.length;++b){var w=v[b];i&&null===h[w]||(m=Array.isArray(h)?m.concat(e(h[w],o(r,w),o,a,i,c,s,l,f,d,p,y)):m.concat(e(h[w],r+(f?"."+w:"["+w+"]"),o,a,i,c,s,l,f,d,p,y)))}return m},l=Object.prototype.hasOwnProperty,f={allowDots:!1,allowPrototypes:!1,arrayLimit:20,decoder:n.decode,delimiter:"&",depth:5,parameterLimit:1e3,plainObjects:!1,strictNullHandling:!1},d=function(e,t,n){if(e){var r=n.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,o=/(\[[^[\]]*])/g,a=/(\[[^[\]]*])/.exec(r),i=a?r.slice(0,a.index):r,c=[];if(i){if(!n.plainObjects&&l.call(Object.prototype,i)&&!n.allowPrototypes)return;c.push(i)}for(var u=0;null!==(a=o.exec(r))&&u<n.depth;){if(u+=1,!n.plainObjects&&l.call(Object.prototype,a[1].slice(1,-1))&&!n.allowPrototypes)return;c.push(a[1])}return a&&c.push("["+r.slice(a.index)+"]"),function(e,t,n){for(var r=t,o=e.length-1;o>=0;--o){var a,i=e[o];if("[]"===i)a=(a=[]).concat(r);else{a=n.plainObjects?Object.create(null):{};var c="["===i.charAt(0)&&"]"===i.charAt(i.length-1)?i.slice(1,-1):i,u=parseInt(c,10);!isNaN(u)&&i!==c&&String(u)===c&&u>=0&&n.parseArrays&&u<=n.arrayLimit?(a=[])[u]=r:a[c]=r}r=a}return r}(c,t,n)}},p=function(e,t){var r=t?n.assign({},t):{};if(null!==r.decoder&&void 0!==r.decoder&&"function"!=typeof r.decoder)throw new TypeError("Decoder has to be a function.");if(r.ignoreQueryPrefix=!0===r.ignoreQueryPrefix,r.delimiter="string"==typeof r.delimiter||n.isRegExp(r.delimiter)?r.delimiter:f.delimiter,r.depth="number"==typeof r.depth?r.depth:f.depth,r.arrayLimit="number"==typeof r.arrayLimit?r.arrayLimit:f.arrayLimit,r.parseArrays=!1!==r.parseArrays,r.decoder="function"==typeof r.decoder?r.decoder:f.decoder,r.allowDots="boolean"==typeof r.allowDots?r.allowDots:f.allowDots,r.plainObjects="boolean"==typeof r.plainObjects?r.plainObjects:f.plainObjects,r.allowPrototypes="boolean"==typeof r.allowPrototypes?r.allowPrototypes:f.allowPrototypes,r.parameterLimit="number"==typeof r.parameterLimit?r.parameterLimit:f.parameterLimit,r.strictNullHandling="boolean"==typeof r.strictNullHandling?r.strictNullHandling:f.strictNullHandling,""===e||null==e)return r.plainObjects?Object.create(null):{};for(var o="string"==typeof e?function(e,t){for(var n={},r=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,o=t.parameterLimit===1/0?void 0:t.parameterLimit,a=r.split(t.delimiter,o),i=0;i<a.length;++i){var c,u,s=a[i],d=s.indexOf("]="),p=-1===d?s.indexOf("="):d+1;-1===p?(c=t.decoder(s,f.decoder),u=t.strictNullHandling?null:""):(c=t.decoder(s.slice(0,p),f.decoder),u=t.decoder(s.slice(p+1),f.decoder)),l.call(n,c)?n[c]=[].concat(n[c]).concat(u):n[c]=u}return n}(e,r):e,a=r.plainObjects?Object.create(null):{},i=Object.keys(o),c=0;c<i.length;++c){var u=i[c],s=d(u,o[u],r);a=n.merge(a,s,r)}return n.compact(a)},y=function(e,t){var r=e,o=t?n.assign({},t):{};if(null!==o.encoder&&void 0!==o.encoder&&"function"!=typeof o.encoder)throw new TypeError("Encoder has to be a function.");var c=void 0===o.delimiter?u.delimiter:o.delimiter,l="boolean"==typeof o.strictNullHandling?o.strictNullHandling:u.strictNullHandling,f="boolean"==typeof o.skipNulls?o.skipNulls:u.skipNulls,d="boolean"==typeof o.encode?o.encode:u.encode,p="function"==typeof o.encoder?o.encoder:u.encoder,y="function"==typeof o.sort?o.sort:null,h=void 0!==o.allowDots&&o.allowDots,v="function"==typeof o.serializeDate?o.serializeDate:u.serializeDate,m="boolean"==typeof o.encodeValuesOnly?o.encodeValuesOnly:u.encodeValuesOnly;if(void 0===o.format)o.format=a.default;else if(!Object.prototype.hasOwnProperty.call(a.formatters,o.format))throw new TypeError("Unknown format option provided.");var g,b,w=a.formatters[o.format];"function"==typeof o.filter?r=(b=o.filter)("",r):Array.isArray(o.filter)&&(g=b=o.filter);var j,_=[];if("object"!=typeof r||null===r)return"";j=o.arrayFormat in i?o.arrayFormat:"indices"in o?o.indices?"indices":"repeat":"indices";var O=i[j];g||(g=Object.keys(r)),y&&g.sort(y);for(var x=0;x<g.length;++x){var A=g[x];f&&null===r[A]||(_=_.concat(s(r[A],A,O,l,f,d?p:null,b,y,h,v,w,m)))}var k=_.join(c),E=!0===o.addQueryPrefix?"?":"";return k.length>0?E+k:""},h=t((function(t,n){var r="__lodash_hash_undefined__",o=9007199254740991,a="[object Arguments]",i="[object Boolean]",c="[object Date]",u="[object Function]",s="[object GeneratorFunction]",l="[object Map]",f="[object Number]",d="[object Object]",p="[object Promise]",y="[object RegExp]",h="[object Set]",v="[object String]",m="[object Symbol]",g="[object WeakMap]",b="[object ArrayBuffer]",w="[object DataView]",j="[object Float32Array]",_="[object Float64Array]",O="[object Int8Array]",x="[object Int16Array]",A="[object Int32Array]",k="[object Uint8Array]",E="[object Uint8ClampedArray]",I="[object Uint16Array]",T="[object Uint32Array]",C=/\w*$/,R=/^\[object .+?Constructor\]$/,L=/^(?:0|[1-9]\d*)$/,S={};S[a]=S["[object Array]"]=S[b]=S[w]=S[i]=S[c]=S[j]=S[_]=S[O]=S[x]=S[A]=S[l]=S[f]=S[d]=S[y]=S[h]=S[v]=S[m]=S[k]=S[E]=S[I]=S[T]=!0,S["[object Error]"]=S[u]=S[g]=!1;var F="object"==typeof e&&e&&e.Object===Object&&e,B="object"==typeof self&&self&&self.Object===Object&&self,N=F||B||Function("return this")(),D=n&&!n.nodeType&&n,P=D&&t&&!t.nodeType&&t,H=P&&P.exports===D;function q(e,t){return e.set(t[0],t[1]),e}function $(e,t){return e.add(t),e}function U(e,t,n,r){var o=-1,a=e?e.length:0;for(r&&a&&(n=e[++o]);++o<a;)n=t(n,e[o],o,e);return n}function M(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}function z(e){var t=-1,n=Array(e.size);return e.forEach((function(e,r){n[++t]=[r,e]})),n}function V(e,t){return function(n){return e(t(n))}}function W(e){var t=-1,n=Array(e.size);return e.forEach((function(e){n[++t]=e})),n}var Q,X=Array.prototype,G=Function.prototype,J=Object.prototype,K=N["__core-js_shared__"],Y=(Q=/[^.]+$/.exec(K&&K.keys&&K.keys.IE_PROTO||""))?"Symbol(src)_1."+Q:"",Z=G.toString,ee=J.hasOwnProperty,te=J.toString,ne=RegExp("^"+Z.call(ee).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),re=H?N.Buffer:void 0,oe=N.Symbol,ae=N.Uint8Array,ie=V(Object.getPrototypeOf,Object),ce=Object.create,ue=J.propertyIsEnumerable,se=X.splice,le=Object.getOwnPropertySymbols,fe=re?re.isBuffer:void 0,de=V(Object.keys,Object),pe=Pe(N,"DataView"),ye=Pe(N,"Map"),he=Pe(N,"Promise"),ve=Pe(N,"Set"),me=Pe(N,"WeakMap"),ge=Pe(Object,"create"),be=Me(pe),we=Me(ye),je=Me(he),_e=Me(ve),Oe=Me(me),xe=oe?oe.prototype:void 0,Ae=xe?xe.valueOf:void 0;function ke(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Ee(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Ie(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Te(e){this.__data__=new Ee(e)}function Ce(e,t){var n=Ve(e)||function(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&We(e)}(e)&&ee.call(e,"callee")&&(!ue.call(e,"callee")||te.call(e)==a)}(e)?function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}(e.length,String):[],r=n.length,o=!!r;for(var i in e)!t&&!ee.call(e,i)||o&&("length"==i||$e(i,r))||n.push(i);return n}function Re(e,t,n){var r=e[t];ee.call(e,t)&&ze(r,n)&&(void 0!==n||t in e)||(e[t]=n)}function Le(e,t){for(var n=e.length;n--;)if(ze(e[n][0],t))return n;return-1}function Se(e,t,n,r,o,p,g){var R;if(r&&(R=p?r(e,o,p,g):r(e)),void 0!==R)return R;if(!Ge(e))return e;var L=Ve(e);if(L){if(R=function(e){var t=e.length,n=e.constructor(t);t&&"string"==typeof e[0]&&ee.call(e,"index")&&(n.index=e.index,n.input=e.input);return n}(e),!t)return function(e,t){var n=-1,r=e.length;t||(t=Array(r));for(;++n<r;)t[n]=e[n];return t}(e,R)}else{var F=qe(e),B=F==u||F==s;if(Qe(e))return function(e,t){if(t)return e.slice();var n=new e.constructor(e.length);return e.copy(n),n}(e,t);if(F==d||F==a||B&&!p){if(M(e))return p?e:{};if(R=function(e){return"function"!=typeof e.constructor||Ue(e)?{}:(t=ie(e),Ge(t)?ce(t):{});var t}(B?{}:e),!t)return function(e,t){return Ne(e,He(e),t)}(e,function(e,t){return e&&Ne(t,Je(t),e)}(R,e))}else{if(!S[F])return p?e:{};R=function(e,t,n,r){var o=e.constructor;switch(t){case b:return Be(e);case i:case c:return new o(+e);case w:return function(e,t){var n=t?Be(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,r);case j:case _:case O:case x:case A:case k:case E:case I:case T:return function(e,t){var n=t?Be(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}(e,r);case l:return function(e,t,n){return U(t?n(z(e),!0):z(e),q,new e.constructor)}(e,r,n);case f:case v:return new o(e);case y:return function(e){var t=new e.constructor(e.source,C.exec(e));return t.lastIndex=e.lastIndex,t}(e);case h:return function(e,t,n){return U(t?n(W(e),!0):W(e),$,new e.constructor)}(e,r,n);case m:return a=e,Ae?Object(Ae.call(a)):{}}var a}(e,F,Se,t)}}g||(g=new Te);var N=g.get(e);if(N)return N;if(g.set(e,R),!L)var D=n?function(e){return function(e,t,n){var r=t(e);return Ve(e)?r:function(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}(r,n(e))}(e,Je,He)}(e):Je(e);return function(e,t){for(var n=-1,r=e?e.length:0;++n<r&&!1!==t(e[n],n,e););}(D||e,(function(o,a){D&&(o=e[a=o]),Re(R,a,Se(o,t,n,r,a,e,g))})),R}function Fe(e){return!(!Ge(e)||(t=e,Y&&Y in t))&&(Xe(e)||M(e)?ne:R).test(Me(e));var t}function Be(e){var t=new e.constructor(e.byteLength);return new ae(t).set(new ae(e)),t}function Ne(e,t,n,r){n||(n={});for(var o=-1,a=t.length;++o<a;){var i=t[o],c=r?r(n[i],e[i],i,n,e):void 0;Re(n,i,void 0===c?e[i]:c)}return n}function De(e,t){var n,r,o=e.__data__;return("string"==(r=typeof(n=t))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof t?"string":"hash"]:o.map}function Pe(e,t){var n=function(e,t){return null==e?void 0:e[t]}(e,t);return Fe(n)?n:void 0}ke.prototype.clear=function(){this.__data__=ge?ge(null):{}},ke.prototype.delete=function(e){return this.has(e)&&delete this.__data__[e]},ke.prototype.get=function(e){var t=this.__data__;if(ge){var n=t[e];return n===r?void 0:n}return ee.call(t,e)?t[e]:void 0},ke.prototype.has=function(e){var t=this.__data__;return ge?void 0!==t[e]:ee.call(t,e)},ke.prototype.set=function(e,t){return this.__data__[e]=ge&&void 0===t?r:t,this},Ee.prototype.clear=function(){this.__data__=[]},Ee.prototype.delete=function(e){var t=this.__data__,n=Le(t,e);return!(n<0)&&(n==t.length-1?t.pop():se.call(t,n,1),!0)},Ee.prototype.get=function(e){var t=this.__data__,n=Le(t,e);return n<0?void 0:t[n][1]},Ee.prototype.has=function(e){return Le(this.__data__,e)>-1},Ee.prototype.set=function(e,t){var n=this.__data__,r=Le(n,e);return r<0?n.push([e,t]):n[r][1]=t,this},Ie.prototype.clear=function(){this.__data__={hash:new ke,map:new(ye||Ee),string:new ke}},Ie.prototype.delete=function(e){return De(this,e).delete(e)},Ie.prototype.get=function(e){return De(this,e).get(e)},Ie.prototype.has=function(e){return De(this,e).has(e)},Ie.prototype.set=function(e,t){return De(this,e).set(e,t),this},Te.prototype.clear=function(){this.__data__=new Ee},Te.prototype.delete=function(e){return this.__data__.delete(e)},Te.prototype.get=function(e){return this.__data__.get(e)},Te.prototype.has=function(e){return this.__data__.has(e)},Te.prototype.set=function(e,t){var n=this.__data__;if(n instanceof Ee){var r=n.__data__;if(!ye||r.length<199)return r.push([e,t]),this;n=this.__data__=new Ie(r)}return n.set(e,t),this};var He=le?V(le,Object):function(){return[]},qe=function(e){return te.call(e)};function $e(e,t){return!!(t=null==t?o:t)&&("number"==typeof e||L.test(e))&&e>-1&&e%1==0&&e<t}function Ue(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||J)}function Me(e){if(null!=e){try{return Z.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function ze(e,t){return e===t||e!=e&&t!=t}(pe&&qe(new pe(new ArrayBuffer(1)))!=w||ye&&qe(new ye)!=l||he&&qe(he.resolve())!=p||ve&&qe(new ve)!=h||me&&qe(new me)!=g)&&(qe=function(e){var t=te.call(e),n=t==d?e.constructor:void 0,r=n?Me(n):void 0;if(r)switch(r){case be:return w;case we:return l;case je:return p;case _e:return h;case Oe:return g}return t});var Ve=Array.isArray;function We(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=o}(e.length)&&!Xe(e)}var Qe=fe||function(){return!1};function Xe(e){var t=Ge(e)?te.call(e):"";return t==u||t==s}function Ge(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function Je(e){return We(e)?Ce(e):function(e){if(!Ue(e))return de(e);var t=[];for(var n in Object(e))ee.call(e,n)&&"constructor"!=n&&t.push(n);return t}(e)}t.exports=function(e){return Se(e,!0,!0)}})),v=9007199254740991,m="[object Arguments]",g="[object Function]",b="[object GeneratorFunction]",w=/^(?:0|[1-9]\d*)$/;function j(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}var _=Object.prototype,O=_.hasOwnProperty,x=_.toString,A=_.propertyIsEnumerable,k=Math.max;function E(e,t){var n=F(e)||function(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&B(e)}(e)&&O.call(e,"callee")&&(!A.call(e,"callee")||x.call(e)==m)}(e)?function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}(e.length,String):[],r=n.length,o=!!r;for(var a in e)!t&&!O.call(e,a)||o&&("length"==a||L(a,r))||n.push(a);return n}function I(e,t,n,r){return void 0===e||S(e,_[n])&&!O.call(r,n)?t:e}function T(e,t,n){var r=e[t];O.call(e,t)&&S(r,n)&&(void 0!==n||t in e)||(e[t]=n)}function C(e){if(!N(e))return function(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}(e);var t,n,r,o=(n=(t=e)&&t.constructor,r="function"==typeof n&&n.prototype||_,t===r),a=[];for(var i in e)("constructor"!=i||!o&&O.call(e,i))&&a.push(i);return a}function R(e,t){return t=k(void 0===t?e.length-1:t,0),function(){for(var n=arguments,r=-1,o=k(n.length-t,0),a=Array(o);++r<o;)a[r]=n[t+r];r=-1;for(var i=Array(t+1);++r<t;)i[r]=n[r];return i[t]=a,j(e,this,i)}}function L(e,t){return!!(t=null==t?v:t)&&("number"==typeof e||w.test(e))&&e>-1&&e%1==0&&e<t}function S(e,t){return e===t||e!=e&&t!=t}var F=Array.isArray;function B(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=v}(e.length)&&!function(e){var t=N(e)?x.call(e):"";return t==g||t==b}(e)}function N(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}var D,P=(D=function(e,t,n,r){!function(e,t,n,r){n||(n={});for(var o=-1,a=t.length;++o<a;){var i=t[o],c=r?r(n[i],e[i],i,n,e):void 0;T(n,i,void 0===c?e[i]:c)}}(t,function(e){return B(e)?E(e,!0):C(e)}(t),e,r)},R((function(e,t){var n=-1,r=t.length,o=r>1?t[r-1]:void 0,a=r>2?t[2]:void 0;for(o=D.length>3&&"function"==typeof o?(r--,o):void 0,a&&function(e,t,n){if(!N(n))return!1;var r=typeof t;return!!("number"==r?B(n)&&L(t,n.length):"string"==r&&t in n)&&S(n[t],e)}(t[0],t[1],a)&&(o=r<3?void 0:o,r=1),e=Object(e);++n<r;){var i=t[n];i&&D(e,i,n,o)}return e})));var H=R((function(e){return e.push(void 0,I),j(P,void 0,e)}));var q=function(e){var t,n;return e&&(t=e.followRoute,n=e.windowObject),n.onhashchange=r,{addToRoute:function(e){var n=H(h(e),o());a(n),t(n)},overwriteRouteEntirely:function(e){a(e),t(e)},routeFromHash:r,unpackEncodedRoute:function(e){var n=p(decodeURIComponent(e));a(n),t(n)}};function r(){t(o())}function o(){return p(n.location.hash.slice(1))}function a(e){var t=n.location.protocol+"//"+n.location.host+n.location.pathname+"#"+y(e);n.history.pushState(null,null,t)}};var $=function(e){if(e){console.error(e,e.stack);var t="";e.name&&(t+=e.name+": "),t+=e.message,e.stack&&(t+=" | "+e.stack.toString()),function(e){var t=document.getElementById("status-message");t.textContent=e,t.classList.remove("hidden")}(t)}};var U=function(){var e={};return{setListener:t,on:function(e,n,r){t({eventName:n,listener:r,element:document.querySelector(e)})}};function t({eventName:t,listener:n,element:r}){const o=`${r.id}|${t}`;var a=e[o];a&&r.removeEventListener(t,a),r.addEventListener(t,n),e[o]=n}};function M(e){return e.value||e.textContent}var z={ObjectFromDOM:function({dataAttribute:e="of",dataTypeAttribute:t="oftype",getValueFromElement:n=M}){return function(r){var o=r.querySelectorAll(`[data-${e}]`),a={};for(let e=0;e<o.length;++e)i(o[e]);return a;function i(r){let o=r.dataset[e],i=r.dataset[t]||"string",u=o.split("/"),s=a;for(let e=0;e<u.length;++e){let t=u[e];e===u.length-1?c(s,t,i,n(r)):(s[t]||(s[t]={}),s=s[t])}}function c(e,t,n,r){if("array"===n){var o=e[t];o||(o=[],e[t]=o),o.push(r)}else e[t]="int"===n?parseInt(r,10):r}}}},{on:V}=U(),W=!1,Q=z.ObjectFromDOM({}),X=document.getElementById("note-area"),G=document.getElementById("max-image-side-length"),J=document.getElementById("image-controls");function K(e){return function(){X.value=X.value+e}}function Y(){var e,t=document.getElementById("media-file").files;return t.length>0&&(e=t[0]),e}var Z=t((function(e){var t={makeRequest:function(e,t){var n=e.json||"application/json"===e.mimeType,r=new XMLHttpRequest;if(r.open(e.method,e.url),e.mimeType&&r.setRequestHeader("content-type",e.mimeType),n&&r.setRequestHeader("accept","application/json"),"object"==typeof e.headers)for(var o in e.headers)r.setRequestHeader(o,e.headers[o]);e.binary&&(r.responseType="arraybuffer"),n&&"object"==typeof e.body&&(e.body=JSON.stringify(e.body));var a=null;r.onload=function(){clearTimeout(a);var o={statusCode:this.status,statusMessage:r.statusText,responseURL:r.responseURL,rawResponse:r.response,xhr:r};if(e.binary)t(null,o,r.response);else{var i=this.responseText;if(n)try{i=JSON.parse(i)}catch(e){o.jsonParseError=e}t(null,o,i)}};var i=0;function c(){r.abort(),clearTimeout(a),t()}return e.onData&&(r.onreadystatechange=function(){3===r.readyState&&(e.onData(this.responseText.substr(i)),i=this.responseText.length)}),r.onerror=function(){var e=new Error("There is a problem with the network.");e.name="XHR network error",t(e)},r.send(e.formData||e.body),e.timeLimit>0&&(a=setTimeout(c,e.timeLimit)),{url:e.url,cancelRequest:c}}};e.exports=t.makeRequest}));var ee=function({ok:e,nok:t,log:n=console.log}){return function(r){if(r)n&&(r.stack?n(r,r.stack):n(r)),t&&t(r);else if(e){var o=Array.prototype.slice.call(arguments,1);t&&o.push(t),e.apply(e,o)}}};function te({messageType:e,message:t}){var n=document.getElementById(e);n.textContent=t,n.classList.remove("hidden")}var ne=t((function(t){var n,r,o,a;n=e,r=function(e){"function"==typeof setImmediate?setImmediate(e):"undefined"!=typeof process&&process.nextTick?process.nextTick(e):setTimeout(e,0)},o=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},a=function(e,t){if(t=t||function(){},!o(e)){var n=new Error("First argument to waterfall must be an array of functions");return t(n)}if(!e.length)return t();var a=function(e){return function(n){if(n)t.apply(null,arguments),t=function(){};else{var o=Array.prototype.slice.call(arguments,1),i=e.next();i?o.push(a(i)):o.push(t),r((function(){e.apply(null,o)}))}}};a(function(e){var t=function(n){var r=function(){return e.length&&e[n].apply(null,arguments),r.next()};return r.next=function(){return n<e.length-1?t(n+1):null},r};return t(0)}(e))()},t.exports?t.exports=a:n.asyncWaterfall=a})),re=document.getElementById("saving-message");var oe=/\n/g;function ae({imageCanvasOps:e}){return function({note:t,archive:n,password:r,file:o,sendImageRaw:a}){re.textContent="Saving…",re.classList.remove("hidden"),t.caption=t.caption.replace(oe,"<br>");var i={method:"POST",url:"https://smidgeo.com/note-taker/note",json:!0,headers:{Authorization:"Key "+r,"X-Note-Archive":n}};o?function(n){let r=new FormData;for(let e in t)r.append(e,t[e]);if(r.append("mediaFilename",o.name),r.append("altText",t.caption.slice(0,100)),o.type.startsWith("video/"))r.append("isVideo",!0),i(o,ee({ok:c,nok:$}));else if(a)i(o,ee({ok:c,nok:$}));else{if(!e.canvasHasImage()){const e="Unknown file: No image is loaded to canvas, nor is the file a video.";throw te({message:"Could not save note. "+e,messageType:"saving-message"}),new Error(e)}ne([e.getImageFromCanvas,i,c],$)}function i(e,t){r.append("buffer",e),n.formData=r,Z(n,t)}}(i):(i.headers["Content-Type"]="application/json",i.body=t,Z(i,ee({ok:c,nok:$})));function c(e,n){var r,o;e.statusCode<300&&e.statusCode>199?(te({message:`Saved note: "${t.caption}".`,messageType:"saving-message"}),r=document.getElementById("media-file"),o=document.querySelector("textarea"),r.value=null,o.value=null):te({message:`Could not save note. ${e.statusCode}: ${n.message}`,messageType:"saving-message"})}}}var ie=document.getElementById("note-area"),ce=document.getElementById("scan-message"),ue=/(\w)\n(\w)/g;function se({file:e}){ce.textContent="Scanning…",ce.classList.remove("hidden"),Tesseract.recognize(e,"eng").then((function(e){if(ce.classList.add("hidden"),e.text){const t=e.text.trim().replace(ue,"$1 $2");ie.value=ie.value+`\n<blockquote>${t}</blockquote>\n`}}),(function(e){ce.textContent=e.message,ce.classList.remove("hidden")}))}var le="1.0.4";HTMLCanvasElement.prototype.toBlob||Object.defineProperty(HTMLCanvasElement.prototype,"toBlob",{value:function(e,t,n){var r=this;setTimeout((function(){for(var o=atob(r.toDataURL(t,n).split(",")[1]),a=o.length,i=new Uint8Array(a),c=0;c<a;c++)i[c]=o.charCodeAt(c);e(new Blob([i],{type:t||"image/png"}))}))}});var fe=function({canvas:e,thumbnailCanvas:t}){var n,r,o=e.getContext("2d");t&&(n=t.getContext("2d"));var a,i=0,c=!1;function u(){return c}function s(r,a,i){o.drawImage(r,0,0,a,i),n&&t&&(t.width=300,t.height=200,n.drawImage(e,0,0,e.width,e.height,0,0,300,200))}return{loadFileToCanvas:function({mimeType:t,maxSideLength:n,file:o}){(r=new Image).addEventListener("load",(function(){i=0;var o,u,l=r.width,f=r.height;l>f?u=f*(o=n)/l:o=l*(u=n)/f;e.width=o,e.height=u,s(r,o,u),a=t,c=!0})),r.src=URL.createObjectURL(o)},getImageFromCanvas:function(t){try{e.toBlob((function(e){t(null,e)}),a,.7)}catch(e){t(e)}},canvasHasImage:u,rotateImage:function(){if(u()){i+=1,o.clearRect(0,0,e.width,e.height);var t=e.width,n=e.height;e.width=n,e.height=t,console.log(e.width,e.height);var a=i*Math.PI/2;o.translate(e.width/2,e.height/2),o.rotate(a),i%2==1?(o.translate(-t/2,-n/2),s(r,e.height,e.width)):(o.translate(-e.width/2,-e.height/2),s(r,e.width,e.height))}},clearCanvases:function(){o.clearRect(0,0,e.width,e.height),n.clearRect(0,0,t.width,t.height)}}}({canvas:document.getElementById("resize-canvas"),thumbnailCanvas:document.getElementById("thumbnail-canvas")}),de=q({followRoute:function(){e=document.getElementById("entries"),e.innerHTML=e.innerHTML+'<li><h4>Note</h4>\n  <textarea id="note-area" data-of="caption"></textarea>\n  <span>\n    <button id="insert-link-button">Insert link</button>\n    <button id="insert-bq-button">Insert blockquote</button>\n  </span>\n  <h4>Media</h4>\n  <input type="file" id="media-file" accept="image/*, video/*" />\n  <div id="image-controls" class="hidden">\n    <canvas id="thumbnail-canvas"></canvas>\n    <button id="rotate-button">Rotate image</button>\n    <h5>Resize to this maximum length for image side</h5>\n    (Set it to "unlimited" to not resize at all)\n    <input type="text" id="max-image-side-length" value="2016" />\n    <button id="remove-image-button">Remove image</button>\n    <button id="scan-button">Scan text into note body</button>\n    <input id="send-image-raw-checkbox" type="checkbox" />\n    <label for="send-image-raw-checkbox"\n      >Send the image raw without resizing</label\n    >\n    <div id="scan-message" class="progress-message hidden">Scanning…</div>\n  </div></li>',function({saveNoteFlow:e,scanFlow:t,imageCanvasOps:n}){if(!W){W=!0,V("#submit-note-button","click",(function(){var t=Q(document.getElementById("note-form")),n=document.getElementById("archive").value,r=document.getElementById("password").value;e({note:t,archive:n,password:r,file:Y(),sendImageRaw:document.getElementById("send-image-raw-checkbox").checked})})),V("#insert-link-button","click",K('<a href="URL"></a>')),V("#insert-bq-button","click",K("<blockquote></blockquote>")),V("#media-file","change",(function(){o(this.files[0])})),V("#rotate-button","click",n.rotateImage),V("#scan-button","click",(function(){t&&t({file:Y()})})),V("#remove-image-button","click",(function(){document.getElementById("media-file").value="",n.clearCanvases(),J.classList.add("hidden")}));var r=Y();r&&o(r)}function o(e){J.classList.remove("hidden");var t=+G.value;e&&e.type.startsWith("image/")&&!isNaN(t)&&n.loadFileToCanvas({file:e,mimeType:e.type,maxSideLength:t})}}({addToRoute:de.addToRoute,saveNoteFlow:ae({imageCanvasOps:fe}),scanFlow:se,imageCanvasOps:fe});var e},windowObject:window});function pe(e,t,n,r,o){$(o)}!async function(){document.getElementById("version-info").textContent=le,window.onerror=pe,de.routeFromHash()}()}();
//# sourceMappingURL=index.js.map
