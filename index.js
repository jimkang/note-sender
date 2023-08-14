
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var utils = createCommonjsModule(function (module, exports) {

	var has = Object.prototype.hasOwnProperty;

	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }

	    return array;
	}());

	var compactQueue = function compactQueue(queue) {
	    var obj;

	    while (queue.length) {
	        var item = queue.pop();
	        obj = item.obj[item.prop];

	        if (Array.isArray(obj)) {
	            var compacted = [];

	            for (var j = 0; j < obj.length; ++j) {
	                if (typeof obj[j] !== 'undefined') {
	                    compacted.push(obj[j]);
	                }
	            }

	            item.obj[item.prop] = compacted;
	        }
	    }

	    return obj;
	};

	exports.arrayToObject = function arrayToObject(source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	exports.merge = function merge(target, source, options) {
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        } else if (typeof target === 'object') {
	            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (typeof target !== 'object') {
	        return [target].concat(source);
	    }

	    var mergeTarget = target;
	    if (Array.isArray(target) && !Array.isArray(source)) {
	        mergeTarget = exports.arrayToObject(target, options);
	    }

	    if (Array.isArray(target) && Array.isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                if (target[i] && typeof target[i] === 'object') {
	                    target[i] = exports.merge(target[i], item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (has.call(acc, key)) {
	            acc[key] = exports.merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};

	exports.assign = function assignSingleSource(target, source) {
	    return Object.keys(source).reduce(function (acc, key) {
	        acc[key] = source[key];
	        return acc;
	    }, target);
	};

	exports.decode = function (str) {
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};

	exports.encode = function encode(str) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = typeof str === 'string' ? str : String(str);

	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);

	        if (
	            c === 0x2D // -
	            || c === 0x2E // .
	            || c === 0x5F // _
	            || c === 0x7E // ~
	            || (c >= 0x30 && c <= 0x39) // 0-9
	            || (c >= 0x41 && c <= 0x5A) // a-z
	            || (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }

	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)]
	            + hexTable[0x80 | ((c >> 12) & 0x3F)]
	            + hexTable[0x80 | ((c >> 6) & 0x3F)]
	            + hexTable[0x80 | (c & 0x3F)];
	    }

	    return out;
	};

	exports.compact = function compact(value) {
	    var queue = [{ obj: { o: value }, prop: 'o' }];
	    var refs = [];

	    for (var i = 0; i < queue.length; ++i) {
	        var item = queue[i];
	        var obj = item.obj[item.prop];

	        var keys = Object.keys(obj);
	        for (var j = 0; j < keys.length; ++j) {
	            var key = keys[j];
	            var val = obj[key];
	            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
	                queue.push({ obj: obj, prop: key });
	                refs.push(val);
	            }
	        }
	    }

	    return compactQueue(queue);
	};

	exports.isRegExp = function isRegExp(obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	exports.isBuffer = function isBuffer(obj) {
	    if (obj === null || typeof obj === 'undefined') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};
	});

	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;

	var formats = {
	    'default': 'RFC3986',
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return value;
	        }
	    },
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
	        return prefix + '[]';
	    },
	    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
	        return prefix;
	    }
	};

	var toISO = Date.prototype.toISOString;

	var defaults = {
	    delimiter: '&',
	    encode: true,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};

	var stringify = function stringify( // eslint-disable-line func-name-matching
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    formatter,
	    encodeValuesOnly
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
	        }

	        obj = '';
	    }

	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (Array.isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        if (Array.isArray(obj)) {
	            values = values.concat(stringify(
	                obj[key],
	                generateArrayPrefix(prefix, key),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        } else {
	            values = values.concat(stringify(
	                obj[key],
	                prefix + (allowDots ? '.' + key : '[' + key + ']'),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        }
	    }

	    return values;
	};

	var stringify_1 = function (object, opts) {
	    var obj = object;
	    var options = opts ? utils.assign({}, opts) : {};

	    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
	    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
	    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
	    var sort = typeof options.sort === 'function' ? options.sort : null;
	    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
	    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
	    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
	    if (typeof options.format === 'undefined') {
	        options.format = formats['default'];
	    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
	        throw new TypeError('Unknown format option provided.');
	    }
	    var formatter = formats.formatters[options.format];
	    var objKeys;
	    var filter;

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (Array.isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var arrayFormat;
	    if (options.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    } else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (sort) {
	        objKeys.sort(sort);
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        keys = keys.concat(stringify(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            strictNullHandling,
	            skipNulls,
	            encode ? encoder : null,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            formatter,
	            encodeValuesOnly
	        ));
	    }

	    var joined = keys.join(delimiter);
	    var prefix = options.addQueryPrefix === true ? '?' : '';

	    return joined.length > 0 ? prefix + joined : '';
	};

	var has = Object.prototype.hasOwnProperty;

	var defaults$1 = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    parameterLimit: 1000,
	    plainObjects: false,
	    strictNullHandling: false
	};

	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
	    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
	    var parts = cleanStr.split(options.delimiter, limit);

	    for (var i = 0; i < parts.length; ++i) {
	        var part = parts[i];

	        var bracketEqualsPos = part.indexOf(']=');
	        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part, defaults$1.decoder);
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos), defaults$1.decoder);
	            val = options.decoder(part.slice(pos + 1), defaults$1.decoder);
	        }
	        if (has.call(obj, key)) {
	            obj[key] = [].concat(obj[key]).concat(val);
	        } else {
	            obj[key] = val;
	        }
	    }

	    return obj;
	};

	var parseObject = function (chain, val, options) {
	    var leaf = val;

	    for (var i = chain.length - 1; i >= 0; --i) {
	        var obj;
	        var root = chain[i];

	        if (root === '[]') {
	            obj = [];
	            obj = obj.concat(leaf);
	        } else {
	            obj = options.plainObjects ? Object.create(null) : {};
	            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	            var index = parseInt(cleanRoot, 10);
	            if (
	                !isNaN(index)
	                && root !== cleanRoot
	                && String(index) === cleanRoot
	                && index >= 0
	                && (options.parseArrays && index <= options.arrayLimit)
	            ) {
	                obj = [];
	                obj[index] = leaf;
	            } else {
	                obj[cleanRoot] = leaf;
	            }
	        }

	        leaf = obj;
	    }

	    return leaf;
	};

	var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }

	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

	    // The regex chunks

	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;

	    // Get the parent

	    var segment = brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;

	    // Stash the parent if it exists

	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(parent);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return parseObject(keys, val, options);
	};

	var parse = function (str, opts) {
	    var options = opts ? utils.assign({}, opts) : {};

	    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
	    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$1.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : defaults$1.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$1.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$1.decoder;
	    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults$1.allowDots;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$1.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$1.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$1.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = utils.merge(obj, newObj, options);
	    }

	    return utils.compact(obj);
	};

	var lib = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify_1
	};

	var lodash_clonedeep = createCommonjsModule(function (module, exports) {
	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Detect free variable `exports`. */
	var freeExports =  exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/**
	 * Adds the key-value `pair` to `map`.
	 *
	 * @private
	 * @param {Object} map The map to modify.
	 * @param {Array} pair The key-value pair to add.
	 * @returns {Object} Returns `map`.
	 */
	function addMapEntry(map, pair) {
	  // Don't return `map.set` because it's not chainable in IE 11.
	  map.set(pair[0], pair[1]);
	  return map;
	}

	/**
	 * Adds `value` to `set`.
	 *
	 * @private
	 * @param {Object} set The set to modify.
	 * @param {*} value The value to add.
	 * @returns {Object} Returns `set`.
	 */
	function addSetEntry(set, value) {
	  // Don't return `set.add` because it's not chainable in IE 11.
	  set.add(value);
	  return set;
	}

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array ? array.length : 0;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    Symbol = root.Symbol,
	    Uint8Array = root.Uint8Array,
	    getPrototype = overArg(Object.getPrototypeOf, Object),
	    objectCreate = Object.create,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols,
	    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
	    nativeKeys = overArg(Object.keys, Object);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView'),
	    Map = getNative(root, 'Map'),
	    Promise = getNative(root, 'Promise'),
	    Set = getNative(root, 'Set'),
	    WeakMap = getNative(root, 'WeakMap'),
	    nativeCreate = getNative(Object, 'create');

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  return this.__data__['delete'](key);
	}

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var cache = this.__data__;
	  if (cache instanceof ListCache) {
	    var pairs = cache.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      return this;
	    }
	    cache = this.__data__ = new MapCache(pairs);
	  }
	  cache.set(key, value);
	  return this;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  // Safari 9 makes `arguments.length` enumerable in strict mode.
	  var result = (isArray(value) || isArguments(value))
	    ? baseTimes(value.length, String)
	    : [];

	  var length = result.length,
	      skipIndexes = !!length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    object[key] = value;
	  }
	}

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && copyObject(source, keys(source), object);
	}

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @param {boolean} [isFull] Specify a clone including symbols.
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
	  var result;
	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return copyArray(value, result);
	    }
	  } else {
	    var tag = getTag(value),
	        isFunc = tag == funcTag || tag == genTag;

	    if (isBuffer(value)) {
	      return cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	      if (isHostObject(value)) {
	        return object ? value : {};
	      }
	      result = initCloneObject(isFunc ? {} : value);
	      if (!isDeep) {
	        return copySymbols(value, baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = initCloneByTag(value, tag, baseClone, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (!isArr) {
	    var props = isFull ? getAllKeys(value) : keys(value);
	  }
	  arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
	  });
	  return result;
	}

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} prototype The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	function baseCreate(proto) {
	  return isObject(proto) ? objectCreate(proto) : {};
	}

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	/**
	 * The base implementation of `getTag`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  return objectToString.call(value);
	}

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var result = new buffer.constructor(buffer.length);
	  buffer.copy(result);
	  return result;
	}

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	/**
	 * Creates a clone of `map`.
	 *
	 * @private
	 * @param {Object} map The map to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned map.
	 */
	function cloneMap(map, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
	  return arrayReduce(array, addMapEntry, new map.constructor);
	}

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	/**
	 * Creates a clone of `set`.
	 *
	 * @private
	 * @param {Object} set The set to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned set.
	 */
	function cloneSet(set, isDeep, cloneFunc) {
	  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
	  return arrayReduce(array, addSetEntry, new set.constructor);
	}

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    assignValue(object, key, newValue === undefined ? source[key] : newValue);
	  }
	  return object;
	}

	/**
	 * Copies own symbol properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return copyObject(source, getSymbols(source), object);
	}

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	/**
	 * Creates an array of the own enumerable symbol properties of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge < 14, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {Function} cloneFunc The function to clone values.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, cloneFunc, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return cloneArrayBuffer(object);

	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);

	    case dataViewTag:
	      return cloneDataView(object, isDeep);

	    case float32Tag: case float64Tag:
	    case int8Tag: case int16Tag: case int32Tag:
	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	      return cloneTypedArray(object, isDeep);

	    case mapTag:
	      return cloneMap(object, isDeep, cloneFunc);

	    case numberTag:
	    case stringTag:
	      return new Ctor(object);

	    case regexpTag:
	      return cloneRegExp(object);

	    case setTag:
	      return cloneSet(object, isDeep, cloneFunc);

	    case symbolTag:
	      return cloneSymbol(object);
	  }
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return baseClone(value, true, true);
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	module.exports = cloneDeep;
	});

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  // Safari 9 makes `arguments.length` enumerable in strict mode.
	  var result = (isArray(value) || isArguments(value))
	    ? baseTimes(value.length, String)
	    : [];

	  var length = result.length,
	      skipIndexes = !!length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Used by `_.defaults` to customize its `_.assignIn` use.
	 *
	 * @private
	 * @param {*} objValue The destination value.
	 * @param {*} srcValue The source value.
	 * @param {string} key The key of the property to assign.
	 * @param {Object} object The parent object of `objValue`.
	 * @returns {*} Returns the value to assign.
	 */
	function assignInDefaults(objValue, srcValue, key, object) {
	  if (objValue === undefined ||
	      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	    return srcValue;
	  }
	  return objValue;
	}

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    object[key] = value;
	  }
	}

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = array;
	    return apply(func, this, otherArgs);
	  };
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    assignValue(object, key, newValue === undefined ? source[key] : newValue);
	  }
	  return object;
	}

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * This method is like `_.assignIn` except that it accepts `customizer`
	 * which is invoked to produce the assigned values. If `customizer` returns
	 * `undefined`, assignment is handled by the method instead. The `customizer`
	 * is invoked with five arguments: (objValue, srcValue, key, object, source).
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @alias extendWith
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} sources The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 * @see _.assignWith
	 * @example
	 *
	 * function customizer(objValue, srcValue) {
	 *   return _.isUndefined(objValue) ? srcValue : objValue;
	 * }
	 *
	 * var defaults = _.partialRight(_.assignInWith, customizer);
	 *
	 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
	  copyObject(source, keysIn(source), object, customizer);
	});

	/**
	 * Assigns own and inherited enumerable string keyed properties of source
	 * objects to the destination object for all destination properties that
	 * resolve to `undefined`. Source objects are applied from left to right.
	 * Once a property is set, additional values of the same property are ignored.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.defaultsDeep
	 * @example
	 *
	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var defaults$2 = baseRest(function(args) {
	  args.push(undefined, assignInDefaults);
	  return apply(assignInWith, undefined, args);
	});

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}

	var lodash_defaults = defaults$2;

	// Gets, sets, syncs route state. Does not actually execute app flows based on route changes.
	// That's followRoute's job.

	function RouteState(opts) {
	  var followRoute;
	  var windowObject;

	  if (opts) {
	    followRoute = opts.followRoute;
	    windowObject = opts.windowObject;
	  }

	  windowObject.onhashchange = routeFromHash;

	  return {
	    addToRoute: addToRoute,
	    overwriteRouteEntirely: overwriteRouteEntirely,
	    routeFromHash: routeFromHash,
	    unpackEncodedRoute: unpackEncodedRoute
	  };

	  function routeFromHash() {
	    followRoute(getRouteFromHash());
	  }

	  function getRouteFromHash() {
	    // Skip the # part of the hash.
	    return lib.parse(windowObject.location.hash.slice(1));
	  }

	  function addToRoute(updateDict) {
	    var routeDict = lodash_defaults(lodash_clonedeep(updateDict), getRouteFromHash());
	    syncHashToRoute(routeDict);
	    followRoute(routeDict);
	  }

	  function overwriteRouteEntirely(newDict) {
	    syncHashToRoute(newDict);
	    followRoute(newDict);
	  }

	  function syncHashToRoute(routeDict) {
	    var updatedURL = windowObject.location.protocol + '//' + windowObject.location.host +
	      windowObject.location.pathname + '#' + lib.stringify(routeDict);
	    // Sync URL without triggering onhashchange.
	    windowObject.history.pushState(null, null, updatedURL);
	  }

	  function unpackEncodedRoute(encodedStateFromRedirect) {
	    var routeDict =  lib.parse(decodeURIComponent(encodedStateFromRedirect));
	    syncHashToRoute(routeDict);
	    followRoute(routeDict);
	  }
	}

	var routeState = RouteState;

	function handleError(error) {
	  if (error) {
	    console.error(error, error.stack);
	    var text = '';

	    if (error.name) {
	      text += error.name + ': ';
	    }

	    text += error.message;

	    if (error.stack) {
	      text += ' | ' + error.stack.toString();
	    }
	    updateStatusMessage(text);
	  }
	}

	function updateStatusMessage(text) {
	  var statusMessage = document.getElementById('status-message');
	  statusMessage.textContent = text;
	  statusMessage.classList.remove('hidden');
	}

	var handleErrorWeb = handleError;

	function OneListenerPerElement() {
	  var oldListeners = {};

	  return {
	    setListener,
	    on
	  };

	  // Makes sure there is one listener per element-event combination.
	  // Depends on elements with ids and listener functions with names.
	  function setListener({ eventName, listener, element }) {
	    const listenerKey = `${element.id}|${eventName}`;
	    var oldListener = oldListeners[listenerKey];
	    if (oldListener) {
	      element.removeEventListener(eventName, oldListener);
	    }
	    element.addEventListener(eventName, listener);
	    oldListeners[listenerKey] = listener;
	  }

	  // Shorthand for setListener
	  function on(selector, eventName, listener) {
	    setListener({ eventName, listener, element: document.querySelector(selector) });
	  }
	}

	var oneListenerPerElement = OneListenerPerElement;

	function ObjectFromDOM({
	  dataAttribute = 'of',
	  dataTypeAttribute = 'oftype',
	  getValueFromElement = defaultGetValueFromElement
	}) {
	  return objectFromDOM;

	  function objectFromDOM(domRoot) {
	    var formEls = domRoot.querySelectorAll(`[data-${dataAttribute}]`);
	    var obj = {};
	    for (let i = 0; i < formEls.length; ++i) {
	      putFormElValueInObject(formEls[i]);
	    }
	    return obj;

	    function putFormElValueInObject(formEl) {
	      let ofProp = formEl.dataset[dataAttribute];
	      let ofType = formEl.dataset[dataTypeAttribute] || 'string';
	      let path = ofProp.split('/');
	      let subObject = obj;
	      for (let j = 0; j < path.length; ++j) {
	        let segment = path[j];
	        if (j === path.length - 1) {
	          // This is the last path segment, so assign the value here.
	          assignValueToObject(subObject, segment, ofType, getValueFromElement(formEl));
	        } else {
	          if (subObject[segment]) {
	            subObject = subObject[segment];
	          } else {
	            subObject[segment] = {};
	            subObject = subObject[segment];
	          }
	        }
	      }
	    }

	    function assignValueToObject(obj, key, type, value) {
	      if (type === 'array') {
	        var array = obj[key];
	        if (!array) {
	          array = [];
	          obj[key] = array;
	        }
	        array.push(value);
	      } else {
	        if (type === 'int') {
	          obj[key] = parseInt(value, 10);
	        } else {
	          obj[key] = value;
	        }
	      }
	    }
	  }
	}

	function defaultGetValueFromElement(el) {
	  return el.value || el.textContent;
	}

	var objectForm = {
	  ObjectFromDOM
	};

	// Polyfill for canvas.toBlob from MDN.
	if (!HTMLCanvasElement.prototype.toBlob) {
	  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
	    value: function(callback, type, quality) {
	      var canvas = this;
	      setTimeout(function() {
	        var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
	          len = binStr.length,
	          arr = new Uint8Array(len);

	        for (var i = 0; i < len; i++) {
	          arr[i] = binStr.charCodeAt(i);
	        }

	        callback(new Blob([arr], { type: type || 'image/png' }));
	      });
	    }
	  });
	}

	function CanvasImageOps({ rootSel }) {
	  var canvas = document.querySelector(`${rootSel} .resize-canvas`);
	  var thumbnailCanvas = document.querySelector(`${rootSel} .thumbnail-canvas`);
	  var ctx = canvas.getContext('2d');
	  var thumbCtx = thumbnailCanvas.getContext('2d');
	  var img;
	  var rotations = 0;

	  var loadedImageMIMEType;
	  var imageIsLoaded = false;

	  return {
	    loadFileToCanvas,
	    getImageFromCanvas,
	    canvasHasImage,
	    rotateImage,
	    clearCanvases
	  };

	  function loadFileToCanvas({ mimeType, maxSideLength, file }) {
	    img = new Image();
	    img.addEventListener('load', drawToCanvas);
	    img.src = URL.createObjectURL(file);

	    function drawToCanvas() {
	      rotations = 0;
	      var originalWidth = img.width;
	      var originalHeight = img.height;

	      var newWidth;
	      var newHeight;
	      if (originalWidth > originalHeight) {
	        newWidth = maxSideLength;
	        newHeight = (originalHeight * newWidth) / originalWidth;
	      } else {
	        newHeight = maxSideLength;
	        newWidth = (originalWidth * newHeight) / originalHeight;
	      }

	      canvas.width = newWidth;
	      canvas.height = newHeight;
	      drawImageToCanvases(img, newWidth, newHeight);

	      loadedImageMIMEType = mimeType;
	      imageIsLoaded = true;
	    }
	  }

	  function getImageFromCanvas(done) {
	    canvas.toBlob(passBlob, loadedImageMIMEType, 0.7);

	    function passBlob(blob) {
	      done(null, blob);
	    }
	  }

	  function canvasHasImage() {
	    return imageIsLoaded;
	  }

	  function rotateImage() {
	    if (!canvasHasImage()) {
	      return;
	    }
	    rotations += 1;
	    ctx.clearRect(0, 0, canvas.width, canvas.height);

	    var oldWidth = canvas.width;
	    var oldHeight = canvas.height;
	    canvas.width = oldHeight;
	    canvas.height = oldWidth;
	    console.log(canvas.width, canvas.height);
	    var angle = (rotations * Math.PI) / 2;
	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    ctx.rotate(angle);

	    // Sadly, I'm not entirely sure why this works.
	    if (rotations % 2 === 1) {
	      ctx.translate(-oldWidth / 2, -oldHeight / 2);
	      drawImageToCanvases(img, canvas.height, canvas.width);
	    } else {
	      ctx.translate(-canvas.width / 2, -canvas.height / 2);
	      drawImageToCanvases(img, canvas.width, canvas.height);
	    }
	  }

	  function drawImageToCanvases(img, width, height) {
	    ctx.drawImage(img, 0, 0, width, height);
	    // Copy stuff to the thumbnail canvas.
	    // TODO: Scale thumbnail appropriately.
	    thumbnailCanvas.width = 300;
	    thumbnailCanvas.height = 200;
	    thumbCtx.drawImage(
	      canvas,
	      0,
	      0,
	      canvas.width,
	      canvas.height,
	      0,
	      0,
	      300,
	      200
	    );
	  }

	  function clearCanvases() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    thumbCtx.clearRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
	  }
	}

	const entryBase = `<h4>Note</h4>
<section class="note-form ccol">
  <textarea class="note-area" data-of="caption"></textarea>
  <span>
    <button class="insert-link-button">Insert link</button>
    <button class="insert-bq-button">Insert blockquote</button>
  </span>
  <h5>Media controls</h5>
  <canvas class="resize-canvas hidden"></canvas>
  <div class="image-controls hidden">
    <canvas class="thumbnail-canvas hidden"></canvas>
    <button class="rotate-button">Rotate image</button>
    <h5>Resize to this maximum length for image side</h5>
    (Set it to "unlimited" to not resize at all)
    <input type="text" class="max-image-side-length" value="2016" />
    <video class="video-preview hidden" controls></video>
    <audio class="audio-preview hidden" controls></audio>
    <button class="remove-image-button">Remove media </button>
    <button class="scan-button">Scan text into note body</button>
    <input class="send-image-raw-checkbox" type="checkbox" />
    <label for="send-image-raw-checkbox"
      >Send the image raw without resizing</label
    >
    <div class="scan-message progress-message hidden">Scanning…</div>
  </div>

  <button class="submit-note-button">Note!</button>
  <div class="saving-message progress-message hidden">Saving…</div>
</section>`;

	function renderEntry(parentEl, id) {
	  var li = document.createElement('li');
	  li.setAttribute('id', id);
	  li.setAttribute('class', 'entry-container');
	  parentEl.append(li);
	  li.innerHTML = entryBase;
	}

	var basicrequest = createCommonjsModule(function (module) {
	function createRequestMaker() {
	  // WARNING: onData does NOT work with binary data right now!

	  function makeRequest(opts, done) {
	    var jsonMode = opts.json || opts.mimeType === 'application/json';

	    var xhr = new XMLHttpRequest();
	    xhr.open(opts.method, opts.url);
	    if (opts.mimeType) {
	      xhr.setRequestHeader('content-type', opts.mimeType);
	    }
	    if (jsonMode) {
	      xhr.setRequestHeader('accept', 'application/json');
	    }

	    if (typeof opts.headers === 'object') {
	      for (var headerName in opts.headers) {
	        xhr.setRequestHeader(headerName, opts.headers[headerName]);
	      }
	    }

	    if (opts.binary) {
	      xhr.responseType = 'arraybuffer';
	    }

	    if (jsonMode && typeof opts.body === 'object') {
	      opts.body = JSON.stringify(opts.body);
	    }

	    var timeoutKey = null;

	    xhr.onload = function requestDone() {
	      clearTimeout(timeoutKey);

	      var responseObject = {
	        statusCode: this.status,
	        statusMessage: xhr.statusText,
	        responseURL: xhr.responseURL,
	        rawResponse: xhr.response,
	        xhr: xhr
	      };

	      if (opts.binary) {
	        done(null, responseObject, xhr.response);
	      } else {
	        var resultObject = this.responseText;
	        if (jsonMode) {
	          try {
	            resultObject = JSON.parse(resultObject);
	          } catch (e) {
	            responseObject.jsonParseError = e;
	          }
	        }
	        done(null, responseObject, resultObject);
	      }
	    };

	    var lastReadIndex = 0;
	    if (opts.onData) {
	      xhr.onreadystatechange = stateChanged;
	    }
	    xhr.onerror = handleError;

	    xhr.send(opts.formData || opts.body);

	    if (opts.timeLimit > 0) {
	      timeoutKey = setTimeout(cancelRequest, opts.timeLimit);
	    }

	    function cancelRequest() {
	      xhr.abort();
	      clearTimeout(timeoutKey);
	      done();
	    }

	    function stateChanged() {
	      if (xhr.readyState === 3) {
	        opts.onData(this.responseText.substr(lastReadIndex));
	        lastReadIndex = this.responseText.length;
	      }
	    }

	    // handleError is passed a progressEvent, but it has no useful information.
	    function handleError() {
	      var error = new Error('There is a problem with the network.');
	      error.name = 'XHR network error';
	      done(error);
	    }

	    return {
	      url: opts.url,
	      cancelRequest: cancelRequest
	    };
	  }

	  return {
	    makeRequest: makeRequest
	  };
	}

	{
	  var requestMaker = createRequestMaker();
	  module.exports = requestMaker.makeRequest;
	}
	});

	function createOKNOKCallback({ ok, nok, log = console.log }) {
	  return function standardBailCallback(error) {
	    if (error) {
	      if (log) {
	        if (error.stack) {
	          log(error, error.stack);
	        } else {
	          log(error);
	        }
	      }
	      if (nok) {
	        nok(error);
	      }
	    } else if (ok) {
	      var okArgs = Array.prototype.slice.call(arguments, 1);
	      if (nok) {
	        okArgs.push(nok);
	      }
	      ok.apply(ok, okArgs);
	    }
	  };
	}

	var oknok = createOKNOKCallback;

	function renderMessage({ sel, message }) {
	  var slate = document.querySelector(sel);
	  slate.textContent = message;
	  slate.classList.remove('hidden');
	}

	function resetFields() {
	  var fileInput = document.getElementById('media-file');
	  var textArea = document.querySelector('textarea');
	  fileInput.value = null;
	  textArea.value = null;
	}

	var asyncWaterfall = createCommonjsModule(function (module) {
	// MIT license (by Elan Shanker).
	(function(globals) {

	  var nextTick = function (fn) {
	    if (typeof setImmediate === 'function') {
	      setImmediate(fn);
	    } else if (typeof process !== 'undefined' && process.nextTick) {
	      process.nextTick(fn);
	    } else {
	      setTimeout(fn, 0);
	    }
	  };

	  var makeIterator = function (tasks) {
	    var makeCallback = function (index) {
	      var fn = function () {
	        if (tasks.length) {
	          tasks[index].apply(null, arguments);
	        }
	        return fn.next();
	      };
	      fn.next = function () {
	        return (index < tasks.length - 1) ? makeCallback(index + 1): null;
	      };
	      return fn;
	    };
	    return makeCallback(0);
	  };
	  
	  var _isArray = Array.isArray || function(maybeArray){
	    return Object.prototype.toString.call(maybeArray) === '[object Array]';
	  };

	  var waterfall = function (tasks, callback) {
	    callback = callback || function () {};
	    if (!_isArray(tasks)) {
	      var err = new Error('First argument to waterfall must be an array of functions');
	      return callback(err);
	    }
	    if (!tasks.length) {
	      return callback();
	    }
	    var wrapIterator = function (iterator) {
	      return function (err) {
	        if (err) {
	          callback.apply(null, arguments);
	          callback = function () {};
	        } else {
	          var args = Array.prototype.slice.call(arguments, 1);
	          var next = iterator.next();
	          if (next) {
	            args.push(wrapIterator(next));
	          } else {
	            args.push(callback);
	          }
	          nextTick(function () {
	            iterator.apply(null, args);
	          });
	        }
	      };
	    };
	    wrapIterator(makeIterator(tasks))();
	  };

	  if ( module.exports) {
	    module.exports = waterfall; // CommonJS
	  } else {
	    globals.asyncWaterfall = waterfall; // <script>
	  }
	})(commonjsGlobal);
	});

	const apiServerBaseURL = 'https://smidgeo.com/note-taker/note';
	// const apiServerBaseURL = 'http://localhost:5678/note';
	var lineBreakRegex = /\n/g;

	function SaveNoteFlow({ rootSel }) {
	  var savingMessage = document.querySelector(`${rootSel} .saving-message`);

	  return saveNoteFlow;

	  function saveNoteFlow({
	    note,
	    archive,
	    password,
	    file,
	    canvasImageOps,
	    sendImageRaw
	  }) {
	    savingMessage.textContent = 'Saving…';
	    savingMessage.classList.remove('hidden');

	    note.caption = note.caption.replace(lineBreakRegex, '<br>');

	    var reqOpts = {
	      method: 'POST',
	      url: apiServerBaseURL,
	      json: true,
	      headers: {
	        Authorization: `Key ${password}`,
	        'X-Note-Archive': archive
	      }
	    };
	    if (file) {
	      postFormData(reqOpts);
	    } else {
	      reqOpts.headers['Content-Type'] = 'application/json';
	      reqOpts.body = note;
	      basicrequest(reqOpts, oknok({ ok: onSaved, nok: handleErrorWeb }));
	    }

	    // This function assumes we have a file.
	    function postFormData(reqOpts) {
	      let formData = new FormData();
	      for (let key in note) {
	        formData.append(key, note[key]);
	      }
	      formData.append('mediaFilename', file.name);
	      formData.append('altText', note.caption.slice(0, 100));
	      if (file.type.startsWith('video/')) {
	        formData.append('isVideo', true);
	        appendAndSend(file, oknok({ ok: onSaved, nok: handleErrorWeb }));
	      } else if (
	        file.type.startsWith('audio/') ||
	        ['.mp3', '.wav', '.ogg', 'm4a'].some(ext =>
	          file.name.toLowerCase().endsWith(ext)
	        )
	      ) {
	        formData.append('isAudio', true);
	        appendAndSend(file, oknok({ ok: onSaved, nok: handleErrorWeb }));
	      } else if (sendImageRaw) {
	        appendAndSend(file, oknok({ ok: onSaved, nok: handleErrorWeb }));
	      } else if (canvasImageOps.canvasHasImage()) {
	        asyncWaterfall(
	          [
	            canvasImageOps.getImageFromCanvas,
	            // writeToDebugImage,
	            appendAndSend,
	            onSaved
	          ],
	          handleErrorWeb
	        );
	      } else {
	        const errorMessage =
	          'Unknown file: No image is loaded to canvas, nor is the file a video.';
	        renderMessage({
	          message: `Could not save note. ${errorMessage}`,
	          sel: `${rootSel} .saving-message`
	        });
	        throw new Error(errorMessage);
	      }

	      function appendAndSend(fileBlob, done) {
	        formData.append('buffer', fileBlob);
	        reqOpts.formData = formData;
	        basicrequest(reqOpts, done);
	      }
	    }

	    function onSaved(res, body) {
	      if (res.statusCode < 300 && res.statusCode > 199) {
	        renderMessage({
	          message: `Saved note: "${note.caption}".`,
	          sel: `${rootSel} .saving-message`
	        });
	        resetFields();
	      } else {
	        renderMessage({
	          message: `Could not save note. ${res.statusCode}: ${body.message}`,
	          sel: `${rootSel} .saving-message`
	        });
	      }
	    }
	  }
	}

	/* global Tesseract */
	var alphaCharsAroundNewline = /(\w)\n(\w)/g;

	function scanFlow({ rootSel, file }) {
	  var noteArea = document.querySelector(`${rootSel} .note-area`);
	  var scanMessage = document.querySelector(`${rootSel} .scan-message`);

	  scanMessage.textContent = 'Scanning…';
	  scanMessage.classList.remove('hidden');
	  Tesseract.recognize(file, 'eng').then(insertText, handleScanError);

	  function insertText(scanResult) {
	    scanMessage.classList.add('hidden');
	    //console.log(scanResult);
	    if (scanResult.text) {
	      const scannedText = scanResult.text
	        .trim()
	        .replace(alphaCharsAroundNewline, '$1 $2');
	      noteArea.value =
	        noteArea.value + `\n<blockquote>${scannedText}</blockquote>\n`;
	    }
	  }

	  function handleScanError(error) {
	    scanMessage.textContent = error.message;
	    scanMessage.classList.remove('hidden');
	  }
	}

	var probable_1 = createCommonjsModule(function (module) {
	function createProbable(opts) {
	  var random = Math.random;
	  var shouldRecurse = true;

	  if (opts) {
	    if (opts.random) {
	      random = opts.random;
	    }
	    if (opts.recurse !== undefined) {
	      shouldRecurse = opts.recurse;
	    }
	  }

	  // Rolls a die.
	  // ~~ is faster than Math.floor but doesn't work as a floor with very high
	  // numbers.
	  function roll(sides) {
	    return Math.floor(random() * sides);
	  }

	  // This is like `roll`, but it is 1-based, like traditional dice.
	  function rollDie(sides) {
	    if (sides === 0) {
	      return 0;
	    } else {
	      return roll(sides) + 1;
	    }
	  }

	  // Makes a table that maps probability ranges to outcomes.
	  //
	  // rangesAndOutcomePairs should look like this:
	  // [
	  //  [[0, 80], 'a'],
	  //  [[81, 95], 'b'],
	  //  [[96, 100], 'c']
	  // ]
	  //
	  function createRangeTable(rangesAndOutcomePairs) {
	    var rangesAndOutcomes = rangesAndOutcomePairs;
	    var length =
	      rangesAndOutcomes[rangesAndOutcomes.length - 1][0][1] -
	      rangesAndOutcomes[0][0][0] +
	      1;

	    function curriedOutcomeAtIndex(index) {
	      return outcomeAtIndex(rangesAndOutcomes, index);
	    }

	    function probable_rollOnTable() {
	      var outcome = curriedOutcomeAtIndex(roll(length));

	      if (
	        typeof outcome === 'function' &&
	        (outcome.name === 'probable_rollOnTable' ||
	          outcome.name === 'probable_pick')
	      ) {
	        return outcome();
	      } else {
	        return outcome;
	      }
	    }

	    function getRangesAndOutcomesArray() {
	      return rangesAndOutcomes;
	    }

	    return {
	      outcomeAtIndex: curriedOutcomeAtIndex,
	      roll: probable_rollOnTable,
	      length: length,
	      getRangesAndOutcomesArray: getRangesAndOutcomesArray
	    };
	  }

	  // Looks up what outcome corresponds to the given index. Returns undefined
	  // if the index is not inside any range.
	  function outcomeAtIndex(rangesAndOutcomes, index) {
	    index = +index;

	    for (var i = 0; i < rangesAndOutcomes.length; ++i) {
	      var rangeOutcomePair = rangesAndOutcomes[i];
	      var range = rangeOutcomePair[0];
	      if (index >= range[0] && index <= range[1]) {
	        return rangeOutcomePair[1];
	      }
	    }
	  }

	  // A shorthand way to create a range table object. Given a hash of outcomes
	  // and the *size* of the probability range that they occupy, this function
	  // generates the ranges for createRangeTable.
	  // It's handy, but if you're doing this a lot, keep in mind that it's much
	  // slower than createRangeTable.

	  function createRangeTableFromDict(outcomesAndLikelihoods) {
	    return createRangeTable(
	      convertDictToRangesAndOutcomePairs(outcomesAndLikelihoods)
	    );
	  }

	  // outcomesAndLikelihoods format:
	  // {
	  //   failure: 30,
	  //   success: 20,
	  //   doover: 5
	  // }
	  //
	  // Returns an array in this kind of format:
	  // [
	  //  [[0, 29], 'failure'],
	  //  [[30, 49], 'success'],
	  //  [[50, 54], 'doover']
	  // ]

	  function convertDictToRangesAndOutcomePairs(outcomesAndLikelihoods) {
	    var rangesAndOutcomes = [];
	    var endOfLastUsedRange = -1;

	    var loArray = convertOLPairDictToLOArray(outcomesAndLikelihoods);
	    loArray = loArray.sort(compareLikelihoodSizeInPairsDesc);

	    loArray.forEach(function addRangeOutcomePair(loPair) {
	      var likelihood = loPair[0];
	      var outcome = loPair[1];
	      var start = endOfLastUsedRange + 1;
	      var endOfNewRange = start + likelihood - 1;
	      rangesAndOutcomes.push([[start, endOfNewRange], outcome]);

	      endOfLastUsedRange = endOfNewRange;
	    });

	    return rangesAndOutcomes;
	  }

	  function convertOLPairDictToLOArray(outcomesAndLikelihoods) {
	    var loArray = [];

	    for (var key in outcomesAndLikelihoods) {
	      var probability = outcomesAndLikelihoods[key];
	      loArray.push([probability, key]);
	    }

	    return loArray;
	  }

	  function compareLikelihoodSizeInPairsDesc(pairA, pairB) {
	    return pairA[0] > pairB[0] ? -1 : 1;
	  }

	  //  [[0, 80], 'a'],
	  //  [[81, 95], 'b'],
	  //  [[96, 100], 'c']

	  // Table defs will be objects like this:
	  // {
	  //   '0-24': 'Bulbasaur',
	  //   '25-66': 'Squirtle',
	  //   '67-99': 'Charmander'
	  // }
	  // The values can be other other objects, in which case those outcomes are
	  // considered recursive rolls. e.g.
	  //
	  // {
	  //   '0-39': {
	  //     '0-24': 'Bulbasaur',
	  //     '25-66': 'Squirtle',
	  //     '67-99': 'Charmander'
	  //   },
	  //   '40-55': 'Human',
	  //   '56-99': 'Rock'
	  // }
	  //
	  // When 0-39 is rolled on the outer table, another roll is made on that inner
	  // table.
	  //
	  // It will not detect cycles.

	  function createTableFromDef(def) {
	    var rangeOutcomePairs = rangeOutcomePairsFromDef(def);
	    return createRangeTable(rangeOutcomePairs);
	  }

	  function rangeOutcomePairsFromDef(def) {
	    var rangeOutcomePairs = [];
	    for (var rangeString in def) {
	      var range = rangeStringToRange(rangeString);
	      var outcome = def[rangeString];
	      if (typeof outcome === 'object') {
	        if (Array.isArray(outcome)) {
	          outcome = createCustomPickFromArray(outcome);
	        } else {
	          if (shouldRecurse) {
	            // Recurse.
	            var subtable = createTableFromDef(outcome);
	            if (typeof subtable.roll == 'function') {
	              outcome = subtable.roll;
	            }
	          }
	        }
	      }
	      rangeOutcomePairs.push([range, outcome]);
	    }

	    return rangeOutcomePairs.sort(compareStartOfRangeAsc);
	  }

	  function compareStartOfRangeAsc(rangeOutcomePairA, rangeOutcomePairB) {
	    return rangeOutcomePairA[0][0] < rangeOutcomePairB[0][0] ? -1 : 1;
	  }

	  function rangeStringToRange(s) {
	    var bounds = s.split('-');
	    if (bounds.length > 2) {
	      return undefined;
	    }
	    if (bounds.length === 1) {
	      return [+s, +s];
	    } else {
	      return [+bounds[0], +bounds[1]];
	    }
	  }

	  function createTableFromSizes(def) {
	    var rangeOutcomePairs = rangeOutcomePairsFromSizesDef(def);
	    return createRangeTable(rangeOutcomePairs);
	  }

	  function rangeOutcomePairsFromSizesDef(def) {
	    var nextLowerBound = 0;

	    return def.map(sizeOutcomePairToRangeOutcomePair);

	    function sizeOutcomePairToRangeOutcomePair(sizeOutcomePair) {
	      var size = sizeOutcomePair[0];
	      var outcome = sizeOutcomePair[1];

	      var upperBound = nextLowerBound + size - 1;
	      var range = [nextLowerBound, upperBound];
	      nextLowerBound = upperBound + 1;

	      if (Array.isArray(outcome)) {
	        if (objectIsASizeDef(outcome)) {
	          // Recurse.
	          var subtable = createTableFromSizes(outcome);
	          if (typeof subtable.roll == 'function') {
	            outcome = subtable.roll;
	          }
	        } else {
	          outcome = createCustomPickFromArray(outcome);
	        }
	      }
	      return [range, outcome];
	    }
	  }

	  // Checks to see if def is a nested array, and if the first element is a pair with
	  // a number as the first element.
	  function objectIsASizeDef(def) {
	    return (
	      Array.isArray(def) &&
	      def.length > 0 &&
	      Array.isArray(def[0]) &&
	      def[0].length === 2 &&
	      typeof def[0][0] === 'number'
	    );
	  }

	  // Picks randomly from an array.
	  function pickFromArray(array, emptyArrayDefault) {
	    if (!array || typeof array.length !== 'number' || array.length < 1) {
	      return emptyArrayDefault;
	    } else {
	      return array[roll(array.length)];
	    }
	  }

	  function createCustomPickFromArray(array, emptyArrayDefault) {
	    return function probable_pick() {
	      return pickFromArray(array, emptyArrayDefault);
	    };
	  }

	  // Combines every element in A with every element in B.
	  function crossArrays(arrayA, arrayB) {
	    var combos = [];
	    arrayA.forEach(function combineElementWithArrayB(aElement) {
	      arrayB.forEach(function combineBElementWithAElement(bElement) {
	        if (Array.isArray(aElement) || Array.isArray(bElement)) {
	          combos.push(aElement.concat(bElement));
	        } else {
	          combos.push([aElement, bElement]);
	        }
	      });
	    });
	    return combos;
	  }

	  function getCartesianProduct(arrays) {
	    return arrays.slice(1).reduce(crossArrays, arrays[0]);
	  }

	  // From Underscore.js, except we are using the random function specified in
	  // our constructor instead of Math.random, necessarily.
	  function shuffle(array) {
	    var length = array.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = roll(index + 1);
	      if (rand !== index) {
	        shuffled[index] = shuffled[rand];
	      }
	      shuffled[rand] = array[index];
	    }
	    return shuffled;
	  }

	  function sample(array, sampleSize) {
	    return shuffle(array).slice(0, sampleSize);
	  }

	  return {
	    roll: roll,
	    rollDie: rollDie,
	    createRangeTable: createRangeTable,
	    createRangeTableFromDict: createRangeTableFromDict,
	    createTableFromDef: createTableFromDef,
	    createTableFromSizes: createTableFromSizes,
	    convertDictToRangesAndOutcomePairs: convertDictToRangesAndOutcomePairs,
	    pickFromArray: pickFromArray,
	    pick: pickFromArray,
	    crossArrays: crossArrays,
	    getCartesianProduct: getCartesianProduct,
	    shuffle: shuffle,
	    sample: sample,
	    randomFn: random
	  };
	}

	var probable = createProbable();

	{
	  module.exports = probable;
	  module.exports.createProbable = createProbable;
	}
	});

	var Probable = probable_1.createProbable;
	const defaultIdChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
	  ''
	);

	function RandomId(opts) {
	  var probable;
	  var idChars = defaultIdChars;
	  if (opts) {
	    let { random } = opts;
	    probable = Probable({ random });
	    if (opts.idChars) {
	      idChars = opts.idChars;
	    }
	    if (opts.onlyLowercase) {
	      idChars = 'abcdefghijklmnopqrstuvwxyz';
	    }
	  } else {
	    probable = Probable();
	  }

	  return randomId;

	  // Creates a string of random characters of the length specified.
	  function randomId(len) {
	    var id = '';
	    for (var i = 0; i < len; ++i) {
	      id += probable.pickFromArray(idChars);
	    }
	    return id;
	  }
	}

	var randomid = RandomId;

	const flickrConsumerKey = '4c09ff7e73defdb72daa6988fadb3987';
	const flickrConsumerSecret = '433c77133ed3c17d';

	/*
	 * Copyright 2008 Netflix, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/* Here's some JavaScript software for implementing OAuth.

	   This isn't as useful as you might hope.  OAuth is based around
	   allowing tools and websites to talk to each other.  However,
	   JavaScript running in web browsers is hampered by security
	   restrictions that prevent code running on one website from
	   accessing data stored or served on another.

	   Before you start hacking, make sure you understand the limitations
	   posed by cross-domain XMLHttpRequest.

	   On the bright side, some platforms use JavaScript as their
	   language, but enable the programmer to access other web sites.
	   Examples include Google Gadgets, and Microsoft Vista Sidebar.
	   For those platforms, this library should come in handy.
	*/

	// The HMAC-SHA1 signature method calls b64_hmac_sha1, defined by
	// http://pajhome.org.uk/crypt/md5/sha1.js

	/* An OAuth message is represented as an object like this:
	   {method: "GET", action: "http://server.com/path", parameters: ...}

	   The parameters may be either a map {name: value, name2: value2}
	   or an Array of name-value pairs [[name, value], [name2, value2]].
	   The latter representation is more powerful: it supports parameters
	   in a specific sequence, or several parameters with the same name;
	   for example [["a", 1], ["b", 2], ["a", 3]].

	   Parameter names and values are NOT percent-encoded in an object.
	   They must be encoded before transmission and decoded after reception.
	   For example, this message object:
	   {method: "GET", action: "http://server/path", parameters: {p: "x y"}}
	   ... can be transmitted as an HTTP request that begins:
	   GET /path?p=x%20y HTTP/1.0
	   (This isn't a valid OAuth request, since it lacks a signature etc.)
	   Note that the object "x y" is transmitted as x%20y.  To encode
	   parameters, you can call OAuth.addToURL, OAuth.formEncode or
	   OAuth.getAuthorization.

	   This message object model harmonizes with the browser object model for
	   input elements of an form, whose value property isn't percent encoded.
	   The browser encodes each value before transmitting it. For example,
	   see consumer.setInputs in example/consumer.js.
	 */

	/* This script needs to know what time it is. By default, it uses the local
	   clock (new Date), which is apt to be inaccurate in browsers. To do
	   better, you can load this script from a URL whose query string contains
	   an oauth_timestamp parameter, whose value is a current Unix timestamp.
	   For example, when generating the enclosing document using PHP:

	   <script src="oauth.js?oauth_timestamp=<?=time()?>" ...

	   Another option is to call OAuth.correctTimestamp with a Unix timestamp.
	 */

	var OAuth; if (OAuth == null) OAuth = {};

	OAuth.setProperties = function setProperties(into, from) {
	  if (into != null && from != null) {
	    for (var key in from) {
	      into[key] = from[key];
	    }
	  }
	  return into;
	};

	OAuth.setProperties(OAuth, // utility functions
	  {
	    percentEncode: function percentEncode(s) {
	      if (s == null) {
	        return '';
	      }
	      if (s instanceof Array) {
	        var e = '';
	        for (var i = 0; i < s.length; ++s) {
	          if (e != '') e += '&';
	          e += OAuth.percentEncode(s[i]);
	        }
	        return e;
	      }
	      s = encodeURIComponent(s);
	      // Now replace the values which encodeURIComponent doesn't do
	      // encodeURIComponent ignores: - _ . ! ~ * ' ( )
	      // OAuth dictates the only ones you can ignore are: - _ . ~
	      // Source: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
	      s = s.replace(/!/g, '%21');
	      s = s.replace(/\*/g, '%2A');
	      s = s.replace(/'/g, '%27');
	      s = s.replace(/\(/g, '%28');
	      s = s.replace(/\)/g, '%29');
	      return s;
	    }
	    ,
	    decodePercent: function decodePercent(s) {
	      if (s != null) {
	        // Handle application/x-www-form-urlencoded, which is defined by
	        // http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1
	        s = s.replace(/\+/g, ' ');
	      }
	      return decodeURIComponent(s);
	    }
	    ,
	    /** Convert the given parameters to an Array of name-value pairs. */
	    getParameterList: function getParameterList(parameters) {
	      if (parameters == null) {
	        return [];
	      }
	      if (typeof parameters != 'object') {
	        return OAuth.decodeForm(parameters + '');
	      }
	      if (parameters instanceof Array) {
	        return parameters;
	      }
	      var list = [];
	      for (var p in parameters) {
	        list.push([p, parameters[p]]);
	      }
	      return list;
	    }
	    ,
	    /** Convert the given parameters to a map from name to value. */
	    getParameterMap: function getParameterMap(parameters) {
	      if (parameters == null) {
	        return {};
	      }
	      if (typeof parameters != 'object') {
	        return OAuth.getParameterMap(OAuth.decodeForm(parameters + ''));
	      }
	      if (parameters instanceof Array) {
	        var map = {};
	        for (var p = 0; p < parameters.length; ++p) {
	          var key = parameters[p][0];
	          if (map[key] === undefined) { // first value wins
	            map[key] = parameters[p][1];
	          }
	        }
	        return map;
	      }
	      return parameters;
	    }
	    ,
	    getParameter: function getParameter(parameters, name) {
	      if (parameters instanceof Array) {
	        for (var p = 0; p < parameters.length; ++p) {
	          if (parameters[p][0] == name) {
	            return parameters[p][1]; // first value wins
	          }
	        }
	      } else {
	        return OAuth.getParameterMap(parameters)[name];
	      }
	      return null;
	    }
	    ,
	    formEncode: function formEncode(parameters) {
	      var form = '';
	      var list = OAuth.getParameterList(parameters);
	      for (var p = 0; p < list.length; ++p) {
	        var value = list[p][1];
	        if (value == null) value = '';
	        if (form != '') form += '&';
	        form += OAuth.percentEncode(list[p][0])
	              +'='+ OAuth.percentEncode(value);
	      }
	      return form;
	    }
	    ,
	    decodeForm: function decodeForm(form) {
	      var list = [];
	      var nvps = form.split('&');
	      for (var n = 0; n < nvps.length; ++n) {
	        var nvp = nvps[n];
	        if (nvp == '') {
	          continue;
	        }
	        var equals = nvp.indexOf('=');
	        var name;
	        var value;
	        if (equals < 0) {
	          name = OAuth.decodePercent(nvp);
	          value = null;
	        } else {
	          name = OAuth.decodePercent(nvp.substring(0, equals));
	          value = OAuth.decodePercent(nvp.substring(equals + 1));
	        }
	        list.push([name, value]);
	      }
	      return list;
	    }
	    ,
	    setParameter: function setParameter(message, name, value) {
	      var parameters = message.parameters;
	      if (parameters instanceof Array) {
	        for (var p = 0; p < parameters.length; ++p) {
	          if (parameters[p][0] == name) {
	            if (value === undefined) {
	              parameters.splice(p, 1);
	            } else {
	              parameters[p][1] = value;
	              value = undefined;
	            }
	          }
	        }
	        if (value !== undefined) {
	          parameters.push([name, value]);
	        }
	      } else {
	        parameters = OAuth.getParameterMap(parameters);
	        parameters[name] = value;
	        message.parameters = parameters;
	      }
	    }
	    ,
	    setParameters: function setParameters(message, parameters) {
	      var list = OAuth.getParameterList(parameters);
	      for (var i = 0; i < list.length; ++i) {
	        OAuth.setParameter(message, list[i][0], list[i][1]);
	      }
	    }
	    ,
	    /** Fill in parameters to help construct a request message.
	        This function doesn't fill in every parameter.
	        The accessor object should be like:
	        {consumerKey:'foo', consumerSecret:'bar', accessorSecret:'nurn', token:'krelm', tokenSecret:'blah'}
	        The accessorSecret property is optional.
	     */
	    completeRequest: function completeRequest(message, accessor) {
	      if (message.method == null) {
	        message.method = 'GET';
	      }
	      var map = OAuth.getParameterMap(message.parameters);
	      if (map.oauth_consumer_key == null) {
	        OAuth.setParameter(message, 'oauth_consumer_key', accessor.consumerKey || '');
	      }
	      if (map.oauth_token == null && accessor.token != null) {
	        OAuth.setParameter(message, 'oauth_token', accessor.token);
	      }
	      if (map.oauth_version == null) {
	        OAuth.setParameter(message, 'oauth_version', '1.0');
	      }
	      if (map.oauth_timestamp == null) {
	        OAuth.setParameter(message, 'oauth_timestamp', OAuth.timestamp());
	      }
	      if (map.oauth_nonce == null) {
	        OAuth.setParameter(message, 'oauth_nonce', OAuth.nonce(6));
	      }
	      OAuth.SignatureMethod.sign(message, accessor);
	    }
	    ,
	    setTimestampAndNonce: function setTimestampAndNonce(message) {
	      OAuth.setParameter(message, 'oauth_timestamp', OAuth.timestamp());
	      OAuth.setParameter(message, 'oauth_nonce', OAuth.nonce(6));
	    }
	    ,
	    addToURL: function addToURL(url, parameters) {
	      var newURL = url;
	      if (parameters != null) {
	        var toAdd = OAuth.formEncode(parameters);
	        if (toAdd.length > 0) {
	          var q = url.indexOf('?');
	          if (q < 0) newURL += '?';
	          else       newURL += '&';
	          newURL += toAdd;
	        }
	      }
	      return newURL;
	    }
	    ,
	    /** Construct the value of the Authorization header for an HTTP request. */
	    getAuthorizationHeader: function getAuthorizationHeader(realm, parameters) {
	      var header = 'OAuth realm="' + OAuth.percentEncode(realm) + '"';
	      var list = OAuth.getParameterList(parameters);
	      for (var p = 0; p < list.length; ++p) {
	        var parameter = list[p];
	        var name = parameter[0];
	        if (name.indexOf('oauth_') == 0) {
	          header += ',' + OAuth.percentEncode(name) + '="' + OAuth.percentEncode(parameter[1]) + '"';
	        }
	      }
	      return header;
	    }
	    ,
	    /** Correct the time using a parameter from the URL from which the last script was loaded. */
	    correctTimestampFromSrc: function correctTimestampFromSrc(parameterName) {
	      parameterName = parameterName || 'oauth_timestamp';
	      var scripts = document.getElementsByTagName('script');
	      if (scripts == null || !scripts.length) return;
	      var src = scripts[scripts.length-1].src;
	      if (!src) return;
	      var q = src.indexOf('?');
	      if (q < 0) return;
	      var parameters = OAuth.getParameterMap(OAuth.decodeForm(src.substring(q+1)));
	      var t = parameters[parameterName];
	      if (t == null) return;
	      OAuth.correctTimestamp(t);
	    }
	    ,
	    /** Generate timestamps starting with the given value. */
	    correctTimestamp: function correctTimestamp(timestamp) {
	      OAuth.timeCorrectionMsec = (timestamp * 1000) - (new Date()).getTime();
	    }
	    ,
	    /** The difference between the correct time and my clock. */
	    timeCorrectionMsec: 0
	    ,
	    timestamp: function timestamp() {
	      var t = (new Date()).getTime() + OAuth.timeCorrectionMsec;
	      return Math.floor(t / 1000);
	    }
	    ,
	    nonce: function nonce(length) {
	      var chars = OAuth.nonce.CHARS;
	      var result = '';
	      for (var i = 0; i < length; ++i) {
	        var rnum = Math.floor(Math.random() * chars.length);
	        result += chars.substring(rnum, rnum+1);
	      }
	      return result;
	    }
	  });

	OAuth.nonce.CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

	/** Define a constructor function,
	    without causing trouble to anyone who was using it as a namespace.
	    That is, if parent[name] already existed and had properties,
	    copy those properties into the new constructor.
	 */
	OAuth.declareClass = function declareClass(parent, name, newConstructor) {
	  var previous = parent[name];
	  parent[name] = newConstructor;
	  if (newConstructor != null && previous != null) {
	    for (var key in previous) {
	      if (key != 'prototype') {
	        newConstructor[key] = previous[key];
	      }
	    }
	  }
	  return newConstructor;
	};

	/** An abstract algorithm for signing messages. */
	OAuth.declareClass(OAuth, 'SignatureMethod', function OAuthSignatureMethod(){});

	OAuth.setProperties(OAuth.SignatureMethod.prototype, // instance members
	  {
	    /** Add a signature to the message. */
	    sign: function sign(message) {
	      var baseString = OAuth.SignatureMethod.getBaseString(message);
	      var signature = this.getSignature(baseString);
	      OAuth.setParameter(message, 'oauth_signature', signature);
	      return signature; // just in case someone's interested
	    }
	    ,
	    /** Set the key string for signing. */
	    initialize: function initialize(name, accessor) {
	      var consumerSecret;
	      if (accessor.accessorSecret != null
	            && name.length > 9
	            && name.substring(name.length-9) == '-Accessor')
	      {
	        consumerSecret = accessor.accessorSecret;
	      } else {
	        consumerSecret = accessor.consumerSecret;
	      }
	      this.key = OAuth.percentEncode(consumerSecret)
	             +'&'+ OAuth.percentEncode(accessor.tokenSecret);
	    }
	  });

	/* SignatureMethod expects an accessor object to be like this:
	   {tokenSecret: "lakjsdflkj...", consumerSecret: "QOUEWRI..", accessorSecret: "xcmvzc..."}
	   The accessorSecret property is optional.
	 */
	// Class members:
	OAuth.setProperties(OAuth.SignatureMethod, // class members
	  {
	    sign: function sign(message, accessor) {
	      var name = OAuth.getParameterMap(message.parameters).oauth_signature_method;
	      if (name == null || name == '') {
	        name = 'HMAC-SHA1';
	        OAuth.setParameter(message, 'oauth_signature_method', name);
	      }
	      OAuth.SignatureMethod.newMethod(name, accessor).sign(message);
	    }
	    ,
	    /** Instantiate a SignatureMethod for the given method name. */
	    newMethod: function newMethod(name, accessor) {
	      var impl = OAuth.SignatureMethod.REGISTERED[name];
	      if (impl != null) {
	        var method = new impl();
	        method.initialize(name, accessor);
	        return method;
	      }
	      var err = new Error('signature_method_rejected');
	      var acceptable = '';
	      for (var r in OAuth.SignatureMethod.REGISTERED) {
	        if (acceptable != '') acceptable += '&';
	        acceptable += OAuth.percentEncode(r);
	      }
	      err.oauth_acceptable_signature_methods = acceptable;
	      throw err;
	    }
	    ,
	    /** A map from signature method name to constructor. */
	    REGISTERED : {}
	    ,
	    /** Subsequently, the given constructor will be used for the named methods.
	        The constructor will be called with no parameters.
	        The resulting object should usually implement getSignature(baseString).
	        You can easily define such a constructor by calling makeSubclass, below.
	     */
	    registerMethodClass: function registerMethodClass(names, classConstructor) {
	      for (var n = 0; n < names.length; ++n) {
	        OAuth.SignatureMethod.REGISTERED[names[n]] = classConstructor;
	      }
	    }
	    ,
	    /** Create a subclass of OAuth.SignatureMethod, with the given getSignature function. */
	    makeSubclass: function makeSubclass(getSignatureFunction) {
	      var superClass = OAuth.SignatureMethod;
	      var subClass = function() {
	        superClass.call(this);
	      };
	      subClass.prototype = new superClass();
	      // Delete instance variables from prototype:
	      // delete subclass.prototype... There aren't any.
	      subClass.prototype.getSignature = getSignatureFunction;
	      subClass.prototype.constructor = subClass;
	      return subClass;
	    }
	    ,
	    getBaseString: function getBaseString(message) {
	      var URL = message.action;
	      var q = URL.indexOf('?');
	      var parameters;
	      if (q < 0) {
	        parameters = message.parameters;
	      } else {
	        // Combine the URL query string with the other parameters:
	        parameters = OAuth.decodeForm(URL.substring(q + 1));
	        var toAdd = OAuth.getParameterList(message.parameters);
	        for (var a = 0; a < toAdd.length; ++a) {
	          parameters.push(toAdd[a]);
	        }
	      }
	      return OAuth.percentEncode(message.method.toUpperCase())
	         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(URL))
	         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(parameters));
	    }
	    ,
	    normalizeUrl: function normalizeUrl(url) {
	      var uri = OAuth.SignatureMethod.parseUri(url);
	      var scheme = uri.protocol.toLowerCase();
	      var authority = uri.authority.toLowerCase();
	      var dropPort = (scheme == 'http' && uri.port == 80)
	                    || (scheme == 'https' && uri.port == 443);
	      if (dropPort) {
	        // find the last : in the authority
	        var index = authority.lastIndexOf(':');
	        if (index >= 0) {
	          authority = authority.substring(0, index);
	        }
	      }
	      var path = uri.path;
	      if (!path) {
	        path = '/'; // conforms to RFC 2616 section 3.2.2
	      }
	      // we know that there is no query and no fragment here.
	      return scheme + '://' + authority + path;
	    }
	    ,
	    parseUri: function parseUri (str) {
	      /* This function was adapted from parseUri 1.2.1
	           http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
	         */
	      var o = {key: ['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'],
	        parser: {strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/ }};
	      var m = o.parser.strict.exec(str);
	      var uri = {};
	      var i = 14;
	      while (i--) uri[o.key[i]] = m[i] || '';
	      return uri;
	    }
	    ,
	    normalizeParameters: function normalizeParameters(parameters) {
	      if (parameters == null) {
	        return '';
	      }
	      var list = OAuth.getParameterList(parameters);
	      var sortable = [];
	      for (var p = 0; p < list.length; ++p) {
	        var nvp = list[p];
	        if (nvp[0] != 'oauth_signature') {
	          sortable.push([ OAuth.percentEncode(nvp[0])
	                              + ' ' // because it comes before any character that can appear in a percentEncoded string.
	                              + OAuth.percentEncode(nvp[1])
	          , nvp]);
	        }
	      }
	      sortable.sort(function(a,b) {
	        if (a[0] < b[0]) return  -1;
	        if (a[0] > b[0]) return 1;
	        return 0;
	      });
	      var sorted = [];
	      for (var s = 0; s < sortable.length; ++s) {
	        sorted.push(sortable[s][1]);
	      }
	      return OAuth.formEncode(sorted);
	    }
	  });

	OAuth.SignatureMethod.registerMethodClass(['PLAINTEXT', 'PLAINTEXT-Accessor'],
	  OAuth.SignatureMethod.makeSubclass(
	    function getSignature(baseString) {
	      return this.key;
	    }
	  ));

	OAuth.SignatureMethod.registerMethodClass(['HMAC-SHA1', 'HMAC-SHA1-Accessor'],
	  OAuth.SignatureMethod.makeSubclass(
	    function getSignature(baseString) {
	      //var b64pad = '=';
	      var signature = b64_hmac_sha1(this.key, baseString);
	      return signature;
	    }
	  ));

	try {
	  OAuth.correctTimestampFromSrc();
	} catch(e) {
	}

	// Make the export assignments for the client side.
	if (typeof module !== 'undefined') {
	  exports.oauth = OAuth;	
	}

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
	  p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length;},toString:function(a){return (a||n).stringify(this);},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this;},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
	  32-8*(c%4);a.length=g.ceil(c/4);},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a;},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a);}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16));}return b.join('');},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
	    2),16)<<24-4*(f%8);return new p.init(b,c/2);}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join('');},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c);}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)));}catch(c){throw Error('Malformed UTF-8 data');}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)));}},
	  // eslint-disable-next-line
	  r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0;},_append:function(a){'string'==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes;},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f;}return new p.init(k,f);},clone:function(){var a=k.clone.call(this);
	    a._data=this._data.clone();return a;},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset();},reset:function(){r.reset.call(this);this._doReset();},update:function(a){this._append(a);this._process();return this;},finalize:function(a){a&&this._append(a);return this._doFinalize();},blockSize:16,_createHelper:function(a){return function(b,d){return (new a.init(d)).finalize(b);};},_createHmacHelper:function(a){return function(b,d){return (new s.HMAC.init(a,
	  d)).finalize(b);};}});var s=e.algo={};return e;}(Math);
	// eslint-disable-next-line
	(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520]);},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else {var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31;}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
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
	function hmacsha1(key, text) {
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

	const appURL = 'http://0.0.0.0:5000/';
	var randomId = randomid();

	const requestTokenBaseURL = 'https://smidgeo.com/flickr/services/oauth/request_token';

	async function getFromFlickrFlow() {
	  const requestTokenURL = requestTokenBaseURL+ '?' +
	      `oauth_callback=${encodeURIComponent(appURL)}&` +
	      `oauth_consumer_key=${flickrConsumerKey}&` +
	      `oauth_nonce=${randomId(16)}&` +
	      'oauth_signature_method=HMAC-SHA1&' +
	      `oauth_timestamp=${new Date().getTime()}&` +
	      'oauth_version=1.0';
	  const baseString = `GET&${encodeURIComponent(requestTokenURL)}`;
	  const key = flickrConsumerKey + '&' + flickrConsumerSecret;
	  const oauthSig = hmacsha1(key, baseString);

	  try {
	    var res = await fetch(requestTokenURL +
	      `&oauth_signature=${oauthSig}`,
	    { mode: 'cors' }
	    );
	    if (!res.ok) {
	      throw new Error(`Could not get request token: ${res.statusText}`);
	    }
	    console.log(res.status);
	  } catch (error) {
	    handleErrorWeb(error);
	  }

	  // Emit images
	}

	var { on } = oneListenerPerElement();

	var objectFromDOM = objectForm.ObjectFromDOM({});
	var entriesRootEl = document.getElementById('entries');

	function wireControlsGlobal() {
	  on(
	    '#clear-entries-button',
	    'click',
	    () => clearEntries() && renderEntry(entriesRootEl, 'base-entry')
	  );
	  on('#media-file', 'change', onMediaFileChange);
	  on('#get-from-flickr-button', 'click', getFromFlickrFlow);

	  wireControls({ rootSel: '#base-entry' });
	  // If there are files already selected from a
	  // previous load of this page, load them into
	  // the entries.
	  onMediaFileChange.bind(document.getElementById('media-file'))();

	  function onMediaFileChange() {
	    var files = this.files;
	    if (files.length < 1) {
	      return;
	    }
	    clearEntries();
	    for (var i = 0; i < files.length; ++i) {
	      loadFile(files[i], i);
	    }
	  }

	  function loadFile(file, i) {
	    // Create an entry for this.
	    var id = `media-entry-${i}`;
	    renderEntry(entriesRootEl, id);
	    wireControls({
	      rootSel: `#${id}`,
	      file
	    });
	  }

	  function clearEntries() {
	    entriesRootEl.innerHTML = '';
	    return true;
	  }
	}

	function wireControls({ rootSel, file }) {
	  var saveNoteFlow = SaveNoteFlow({ rootSel });
	  var canvasImageOps = CanvasImageOps({ rootSel });

	  var noteArea = document.querySelector(`${rootSel} .note-area`);
	  var maxSideLengthField = document.querySelector(
	    `${rootSel} .max-image-side-length`
	  );
	  var imageControls = document.querySelector(`${rootSel} .image-controls`);
	  var videoPreviewEl = document.querySelector(`${rootSel} .video-preview`);
	  var audioPreviewEl = document.querySelector(`${rootSel} .audio-preview`);
	  var thumbnailEl = document.querySelector(`${rootSel} .thumbnail-canvas`);

	  on(`${rootSel} .submit-note-button`, 'click', onSaveNote);
	  on(
	    `${rootSel} .insert-link-button`,
	    'click',
	    insertIntoTextarea('<a href="URL"></a>')
	  );
	  on(
	    `${rootSel} .insert-bq-button`,
	    'click',
	    insertIntoTextarea('<blockquote></blockquote>')
	  );
	  on(`${rootSel} .rotate-button`, 'click', canvasImageOps.rotateImage);
	  on(`${rootSel} .scan-button`, 'click', onScanClick);

	  on(`${rootSel} .remove-image-button`, 'click', onRemoveImage);

	  var maxSideLength = +maxSideLengthField.value;
	  if (file) {
	    imageControls.classList.remove('hidden');

	    if (file.type.startsWith('image/') && !isNaN(maxSideLength)) {
	      canvasImageOps.loadFileToCanvas({
	        file,
	        mimeType: file.type,
	        maxSideLength
	      });
	      thumbnailEl.classList.remove('hidden');
	    } else if (file.type.startsWith('video/')) {
	      videoPreviewEl.setAttribute('src', URL.createObjectURL(file));
	      videoPreviewEl.classList.remove('hidden');
	    } else if (file.type.startsWith('audio/')) {
	      audioPreviewEl.setAttribute('src', URL.createObjectURL(file));
	      audioPreviewEl.classList.remove('hidden');
	    }
	  }

	  function onSaveNote() {
	    var note = objectFromDOM(document.querySelector(`${rootSel} .note-form`));
	    var archive = document.getElementById('archive').value;
	    var password = document.getElementById('password').value;
	    saveNoteFlow({
	      note,
	      archive,
	      password,
	      file,
	      canvasImageOps, // TODO: Just pass image?
	      sendImageRaw: document.querySelector(
	        `${rootSel} .send-image-raw-checkbox`
	      ).checked
	    });
	  }

	  function onScanClick() {
	    if (scanFlow) {
	      scanFlow({ rootSel, file });
	    }
	  }

	  function onRemoveImage() {
	    canvasImageOps.clearCanvases();
	    imageControls.classList.add('hidden');
	  }

	  function insertIntoTextarea(text) {
	    return function insertIntoTextarea() {
	      noteArea.value = noteArea.value + text;
	    };
	  }
	}

	var version = "2.1.1";

	var routeState$1 = routeState({
	  followRoute,
	  windowObject: window
	});

	(async function go() {
	  renderVersion();
	  window.onerror = reportTopLevelError;
	  routeState$1.routeFromHash();
	})();

	function reportTopLevelError(msg, url, lineNo, columnNo, error) {
	  handleErrorWeb(error);
	}

	function followRoute() {
	  renderEntry(document.getElementById('entries'), 'base-entry');
	  wireControlsGlobal();
	}

	function renderVersion() {
	  var versionInfo = document.getElementById('version-info');
	  versionInfo.textContent = version;
	}

}());
//# sourceMappingURL=index.js.map
