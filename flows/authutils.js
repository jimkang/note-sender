import { OAuth as oauth } from './oauth';

// The contents of CryptoJS's hmac-sha1.js file here. A client would
// normally make a script reference to it.
/*
  CryptoJS v3.1.2
  code.google.com/p/crypto-js
  (c) 2009-2013 by Jeff Mott. All rights reserved.
  code.google.com/p/crypto-js/wiki/License
  */
// eslint-disable-next-line
var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty('init')||(c.init=function(){c.$super.init.apply(this,arguments);});c.init.prototype=c;c.$super=this;return c;},create:function(){var a=this.extend();a.init.apply(a,arguments);return a;},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty('toString')&&(this.toString=a.toString);},clone:function(){return this.init.prototype.extend(this);}},
  p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length;},toString:function(a){return(a||n).stringify(this);},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this;},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
  32-8*(c%4);a.length=g.ceil(c/4);},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a;},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a);}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16));}return b.join('');},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
    2),16)<<24-4*(f%8);return new p.init(b,c/2);}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join('');},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c);}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)));}catch(c){throw Error('Malformed UTF-8 data');}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)));}},
  // eslint-disable-next-line
  r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0;},_append:function(a){'string'==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes;},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f;}return new p.init(k,f);},clone:function(){var a=k.clone.call(this);
    a._data=this._data.clone();return a;},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset();},reset:function(){r.reset.call(this);this._doReset();},update:function(a){this._append(a);this._process();return this;},finalize:function(a){a&&this._append(a);return this._doFinalize();},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b);};},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
  d)).finalize(b);};}});var s=e.algo={};return e;}(Math);
// eslint-disable-next-line
(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520]);},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31;}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
  g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c;}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0;},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash;},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e;}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l);})();
(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;'string'==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset();},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey);},update:function(e){this._hasher.update(e);return this;},finalize:function(e){var d=

  this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e));}});})();

// From CryptoJS enc-base64-min.js.
/*
  CryptoJS v3.1.2
  code.google.com/p/crypto-js
  (c) 2009-2013 by Jeff Mott. All rights reserved.
  code.google.com/p/crypto-js/wiki/License
  */
// eslint-disable-next-line
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join('');},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
  e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++;}return j.create(c,a);},_map:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='};})();


// From oauthorize. https://github.com/jaredhanson/oauthorize/

/**
   * Module dependencies.
   */
// var crypto = require('crypto');

/**
   * Return a unique identifier with the given `len`.
   *
   *     utils.uid(10);
   *     // => "FDaS435D2z"
   *
   * @param {Number} len
   * @return {String}
   * @api private
   */
export function uid(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
}

/**
   * Return a random int, used by `utils.uid()`
   *
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   * @api private
   */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
   * Percent-encodes `str` per RFC 3986.
   *
   * References:
   *  - [Percent Encoding](http://tools.ietf.org/html/rfc5849#section-3.6)
   *  - [Parameter Encoding](http://oauth.net/core/1.0a/#encoding_parameters)
   *  - [Parameter Encoding](http://oauth.net/core/1.0/#encoding_parameters)
   *
   * @param {String} str
   * @api private
   */
export function encode(str) {
  return encodeURIComponent(str)
    .replace(/!/g,'%21')
    .replace(/'/g,'%27')
    .replace(/\(/g,'%28')
    .replace(/\)/g,'%29')
    .replace(/\*/g,'%2A');
}


/**
   * Module dependencies.
   */
// var crypto = require('crypto');
// var url = require('url');

// From passport-http-oauth.

/**
   * Reconstructs the original URL of the request.
   *
   * This function builds a URL that corresponds the original URL requested by the
   * client, including the protocol (http or https) and host.
   *
   * If the request passed through any proxies that terminate SSL, the
   * `X-Forwarded-Proto` header is used to detect if the request was encrypted to
   * the proxy.
   *
   * @return {String}
   * @api private
   */
export function originalURL(req, defaultHost) {
  var headers = req.headers
    , protocol = (req.connection.encrypted || req.headers['x-forwarded-proto'] == 'https')
      ? 'https'
      : 'http'
    , host = defaultHost || headers.host
    , path = req.url || '';
  return protocol + '://' + host + path;
}

/**
   * Parse credentials in `Authorization` header into params hash.
   *
   * References:
   *  - [Authorization Header](http://tools.ietf.org/html/rfc5849#section-3.5.1)
   *  - [OAuth HTTP Authorization Scheme](http://oauth.net/core/1.0a/#auth_header)
   *  - [OAuth HTTP Authorization Scheme](http://oauth.net/core/1.0/#auth_header)
   *
   * @api private
   */
export function parseHeader(credentials) {
  var params = {}
    , comps = credentials.match(/(\w+)="([^"]+)"/g);

  if (comps) {
    for (var i = 0, len = comps.length; i < len; i++) {
      var comp = /(\w+)="([^"]+)"/.exec(comps[i])
        , name = decode(comp[1])
        , val = decode(comp[2]);

      // Some clients (I'm looking at you request) erroneously add non-protocol
      // params to the `Authorization` header.  This check filters those params
      // out.  It also filters out the `realm` parameter, which is valid to
      // include in the header, but should be excluded for purposes of
      // generating a signature.
      if (name.indexOf('oauth_') == 0) {
        params[name] = val;
      }
    }
  }
  return params;
}

/**
   * Percent-decodes `str` per RFC 3986.
   *
   * References:
   *  - [Percent Encoding](http://tools.ietf.org/html/rfc5849#section-3.6)
   *  - [Parameter Encoding](http://oauth.net/core/1.0a/#encoding_parameters)
   *  - [Parameter Encoding](http://oauth.net/core/1.0/#encoding_parameters)
   *
   * @param {String} str
   * @api private
   */
export function decode(str) {
  return decodeURIComponent(str);
}

/**
   * Construct base string by encoding and concatenating components.
   *
   * References:
   *  - [String Construction](http://tools.ietf.org/html/rfc5849#section-3.4.1.1)
   *  - [Concatenate Request Elements](http://oauth.net/core/1.0a/#anchor13)
   *  - [Concatenate Request Elements](http://oauth.net/core/1.0/#anchor14)
   *
   * @param {String} method
   * @param {String} uri
   * @param {String} params
   * @api private
   */
export function constructBaseString(method, uri, params) {
  return [ method.toUpperCase(), encode(uri), encode(params) ].join('&');
}

/**
   * Normalize base string URI, including scheme, authority, and path.
   *
   * References:
   *  - [Base String URI](http://tools.ietf.org/html/rfc5849#section-3.4.1.2)
   *  - [Construct Request URL](http://oauth.net/core/1.0a/#anchor13)
   *  - [Construct Request URL](http://oauth.net/core/1.0/#anchor14)
   *
   * @param {String} method
   * @param {String} uri
   * @param {String} params
   * @api private
   */
export function normalizeURL(uri) {
  // var parsed = url.parse(uri, true);
  // delete parsed.query;
  // delete parsed.search;
  // return url.format(parsed);
  
  // We're using a naive implementation of this for the tests.
  var parts = uri.split('?');
  return parts[0];
}

/**
   * Generate HMAC-SHA1 signature.
   *
   * References:
   *  - [HMAC-SHA1](http://oauth.net/core/1.0a/#anchor15)
   *  - [HMAC-SHA1](http://oauth.net/core/1.0/#anchor16)
   *
   * @param {String} key
   * @param {String} text
   * @return {String}
   * @api private
   */
export function hmacsha1(key, text) {
  // Progressive hashing does not work:
  // var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, key);
  // hmac.update(text);
  // var hash = hmac.finalize();
  // return hash.toString(CryptoJS.enc.Base64) + '=';

  // Encoding the hash toString like so does not work:
  // return CryptoJS.HmacSHA1(text, key).toString(CryptoJS.enc.Base64) + '=';
  
  // Encoding via Base64.stringify DOES work.
  var hash = CryptoJS.HmacSHA1(text, key);
  return CryptoJS.enc.Base64.stringify(hash);
}

/**
   * Generate PLAINTEXT signature.
   *
   * References:
   *  - [PLAINTEXT](http://oauth.net/core/1.0a/#anchor21)
   *  - [PLAINTEXT](http://oauth.net/core/1.0/#anchor22)
   *
   * @param {String} consumerSecret
   * @param {String} tokenSecret
   * @return {String}
   * @api private
   */
export function plaintext(consumerSecret, tokenSecret) {
  return encode([encode(consumerSecret), encode(tokenSecret)].join('&'));
}

// baseParams should contain oauth_version, oauth_consumer_key, 
// oauth_signature_method, username, and password.
// This function will add oauth_signature, oauth_nonce, and oauth_timestamp.

// Options:
// consumerSecret
// url: The request url.
// tokenSecret: Appended to the consumer secret.
// method: HTTP method.

export function prepareXAuthData(baseParams, options) {
  var dateNow = new Date();
  var preparedData = Object.assign({
    'oauth_nonce': uid(16),
    'oauth_timestamp': dateNow.getTime()
  },
  baseParams);
  
  preparedData.oauth_signature = signRequest(preparedData, options);
  
  return preparedData;
}

function signRequest(params, options) {
  var signature = null;
  if (!options.requestMethod) {
    options.requestMethod = 'POST';
  }
  
  switch (params.oauth_signature_method) {
  case 'PLAINTEXT':
    signature = (options.consumerSecret + '%26');
    if (options.tokenSecret) {
      signature += options.tokenSecret;
    }
    break;
  case 'HMAC-SHA1':
    //debugger;
    //var allParams = params;
      
    // Include query params in the hash.
    //var queryParams = getQueryParamsFromURL(options.url);
    //if (size(queryParams) > 0) {
    //  allParams = Object.assign(allParams, queryParams);
    //}
      
    var normalizedURL = normalizeURL(options.url);
    var normalizedParams = normalizeParams(params);
    //var normalizedQuery = null;
      
    var base = constructBaseString(
      options.requestMethod, normalizedURL, normalizedParams);
    var key = encode(options.consumerSecret) + '&';
    if (options.tokenSecret) {
      //debugger;
      key += encode(options.tokenSecret);
    }
      
    signature = hmacsha1(key, base);
            
    console.log('normalizedURL', normalizedURL);
    console.log('normalizedParams', normalizedParams);
    console.log('consumerSecret', options.consumerSecret);
    if (options.tokenSecret) {
      console.log('tokenSecret', options.tokenSecret);
    }
    console.log('key', key);
    console.log('base', base);
    console.log('signature', signature);     
      
    break;
  }
  return signature;
}

function normalizeParams(paramDict) {
  var sortedParamKeys = Object.keys(paramDict).sort();
  var encodedParamArray = sortedParamKeys.map(key =>
    encodeURIComponent(key) + '=' + encodeURIComponent(paramDict[key]));
  return encodedParamArray.join('&');
}

export function makeAuthHeaderFromParamsObject(authParamsObject) {
  var paramArray = Object.keys(authParamsObject).map(
    function convertPairTo2ElementArray(key) {
      return [key, authParamsObject[key]];
    });
  return oauth.getAuthorizationHeader('', paramArray);
}

