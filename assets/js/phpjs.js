function ini_set(varname, newvalue) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/ini_set/
    // original by: Brett Zamir (https://brett-zamir.me)
    //      note 1: This will not set a global_value or access level for the ini item
    //   example 1: ini_set('date.timezone', 'Asia/Hong_Kong')
    //   example 1: ini_set('date.timezone', 'America/Chicago')
    //   returns 1: 'Asia/Hong_Kong'

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    $locutus.php.ini = $locutus.php.ini || {}

    $locutus.php.ini = $locutus.php.ini || {}
    $locutus.php.ini[varname] = $locutus.php.ini[varname] || {}

    var oldval = $locutus.php.ini[varname].local_value

    var lowerStr = (newvalue + '').toLowerCase().trim()
    if (newvalue === true || lowerStr === 'on' || lowerStr === '1') {
        newvalue = 'on'
    }
    if (newvalue === false || lowerStr === 'off' || lowerStr === '0') {
        newvalue = 'off'
    }

    var _setArr = function (oldval) {
        // Although these are set individually, they are all accumulated
        if (typeof oldval === 'undefined') {
            $locutus.ini[varname].local_value = []
        }
        $locutus.ini[varname].local_value.push(newvalue)
    }

    switch (varname) {
        case 'extension':
            _setArr(oldval, newvalue)
            break
        default:
            $locutus.php.ini[varname].local_value = newvalue
            break
    }

    return oldval
}

ini_set('locutus.objectsAsArrays', 0);

function i18n_loc_get_default() { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/i18n_loc_get_default/
    // original by: Brett Zamir (http://brett-zamir.me)
    //      note 1: Renamed in PHP6 from locale_get_default(). Not listed yet at php.net.
    //      note 1: List of locales at <http://demo.icu-project.org/icu-bin/locexp>
    //      note 1: To be usable with sort() if it is passed the `SORT_LOCALE_STRING`
    //      note 1: sorting flag: http://php.net/manual/en/function.sort.php
    //   example 1: i18n_loc_get_default()
    //   returns 1: 'en_US_POSIX'
    //   example 2: i18n_loc_set_default('pt_PT')
    //   example 2: i18n_loc_get_default()
    //   returns 2: 'pt_PT'

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    $locutus.php.locales = $locutus.php.locales || {}

    return $locutus.php.locale_default || 'en_US_POSIX'
}

function i18n_loc_set_default(name) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/i18n_loc_set_default/
    // original by: Brett Zamir (http://brett-zamir.me)
    //      note 1: Renamed in PHP6 from locale_set_default(). Not listed yet at php.net
    //      note 1: List of locales at http://demo.icu-project.org/icu-bin/locexp (use for implementing other locales here)
    //      note 1: To be usable with sort() if it is passed the SORT_LOCALE_STRING sorting flag: http://php.net/manual/en/function.sort.php
    //   example 1: i18n_loc_set_default('pt_PT')
    //   returns 1: true

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    $locutus.php.locales = $locutus.php.locales || {}

    $locutus.php.locales.en_US_POSIX = {
        sorting: function (str1, str2) {
            // @todo: This one taken from strcmp, but need for other locales;
            // we don't use localeCompare since its locale is not settable
            return (str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1)
        }
    }

    $locutus.php.locale_default = name
    return true
}

function strcmp(str1, str2) {
    //  discuss at: http://locutus.io/php/strcmp/
    // original by: Waldo Malqui Silva (http://waldo.malqui.info)
    //    input by: Steve Hilder
    // improved by: Kevin van Zonneveld (http://kvz.io)
    //  revised by: gorthaur
    //   example 1: strcmp( 'waldo', 'owald' )
    //   returns 1: 1
    //   example 2: strcmp( 'owald', 'waldo' )
    //   returns 2: -1

    return ((str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1))
}

function _phpCastString(value) {
    // original by: Rafał Kukawski
    //   example 1: _phpCastString(true)
    //   returns 1: '1'
    //   example 2: _phpCastString(false)
    //   returns 2: ''
    //   example 3: _phpCastString('foo')
    //   returns 3: 'foo'
    //   example 4: _phpCastString(0/0)
    //   returns 4: 'NAN'
    //   example 5: _phpCastString(1/0)
    //   returns 5: 'INF'
    //   example 6: _phpCastString(-1/0)
    //   returns 6: '-INF'
    //   example 7: _phpCastString(null)
    //   returns 7: ''
    //   example 8: _phpCastString(undefined)
    //   returns 8: ''
    //   example 9: _phpCastString([])
    //   returns 9: 'Array'
    //   example 10: _phpCastString({})
    //   returns 10: 'Object'
    //   example 11: _phpCastString(0)
    //   returns 11: '0'
    //   example 12: _phpCastString(1)
    //   returns 12: '1'
    //   example 13: _phpCastString(3.14)
    //   returns 13: '3.14'

    var type = typeof value

    switch (type) {
        case 'boolean':
            return value ? '1' : ''
        case 'string':
            return value
        case 'number':
            if (isNaN(value)) {
                return 'NAN'
            }

            if (!isFinite(value)) {
                return (value < 0 ? '-' : '') + 'INF'
            }

            return value + ''
        case 'undefined':
            return ''
        case 'object':
            if (Array.isArray(value)) {
                return 'Array'
            }

            if (value !== null) {
                return 'Object'
            }

            return ''
        case 'function':
        // fall through
        default:
            throw new Error('Unsupported value type')
    }
}

function strnatcmp(a, b) {
    //       discuss at: http://locutus.io/php/strnatcmp/
    //      original by: Martijn Wieringa
    //      improved by: Michael White (http://getsprink.com)
    //      improved by: Jack
    //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // reimplemented by: Rafał Kukawski
    //        example 1: strnatcmp('abc', 'abc')
    //        returns 1: 0
    //        example 2: strnatcmp('a', 'b')
    //        returns 2: -1
    //        example 3: strnatcmp('10', '1')
    //        returns 3: 1
    //        example 4: strnatcmp('0000abc', '0abc')
    //        returns 4: 0
    //        example 5: strnatcmp('1239', '12345')
    //        returns 5: -1
    //        example 6: strnatcmp('t01239', 't012345')
    //        returns 6: 1
    //        example 7: strnatcmp('0A', '5N')
    //        returns 7: -1



    var leadingZeros = /^0+(?=\d)/
    var whitespace = /^\s/
    var digit = /^\d/

    if (arguments.length !== 2) {
        return null
    }

    a = _phpCastString(a)
    b = _phpCastString(b)

    if (!a.length || !b.length) {
        return a.length - b.length
    }

    var i = 0
    var j = 0

    a = a.replace(leadingZeros, '')
    b = b.replace(leadingZeros, '')

    while (i < a.length && j < b.length) {
        // skip consecutive whitespace
        while (whitespace.test(a.charAt(i)))
            i++
        while (whitespace.test(b.charAt(j)))
            j++

        var ac = a.charAt(i)
        var bc = b.charAt(j)
        var aIsDigit = digit.test(ac)
        var bIsDigit = digit.test(bc)

        if (aIsDigit && bIsDigit) {
            var bias = 0
            var fractional = ac === '0' || bc === '0'

            do {
                if (!aIsDigit) {
                    return -1
                } else if (!bIsDigit) {
                    return 1
                } else if (ac < bc) {
                    if (!bias) {
                        bias = -1
                    }

                    if (fractional) {
                        return -1
                    }
                } else if (ac > bc) {
                    if (!bias) {
                        bias = 1
                    }

                    if (fractional) {
                        return 1
                    }
                }

                ac = a.charAt(++i)
                bc = b.charAt(++j)

                aIsDigit = digit.test(ac)
                bIsDigit = digit.test(bc)
            } while (aIsDigit || bIsDigit)

            if (!fractional && bias) {
                return bias
            }

            continue
        }

        if (!ac || !bc) {
            continue
        } else if (ac < bc) {
            return -1
        } else if (ac > bc) {
            return 1
        }

        i++
        j++
    }

    var iBeforeStrEnd = i < a.length
    var jBeforeStrEnd = j < b.length

    // Check which string ended first
    // return -1 if a, 1 if b, 0 otherwise
    return (iBeforeStrEnd > jBeforeStrEnd) - (iBeforeStrEnd < jBeforeStrEnd)
}

function sprintf() {
    //  discuss at: http://phpjs.org/functions/sprintf/
    // original by: Ash Searle (http://hexmen.com/blog/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Dj
    // improved by: Allidylls
    //    input by: Paulo Freitas
    //    input by: Brett Zamir (http://brett-zamir.me)
    //   example 1: sprintf("%01.2f", 123.1);
    //   returns 1: 123.10
    //   example 2: sprintf("[%10s]", 'monkey');
    //   returns 2: '[    monkey]'
    //   example 3: sprintf("[%'#10s]", 'monkey');
    //   returns 3: '[####monkey]'
    //   example 4: sprintf("%d", 123456789012345);
    //   returns 4: '123456789012345'
    //   example 5: sprintf('%-03s', 'E');
    //   returns 5: 'E00'

    var regex = /%%|%(\d+\$)?([\-+\'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g
    var a = arguments
    var i = 0
    var format = a[i++]

    // pad()
    var pad = function (str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' '
        }
        var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
                .join(chr)
        return leftJustify ? str + padding : padding + str
    }

    // justify()
    var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify)
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length)
            }
        }
        return value
    }

    // formatBaseX()
    var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0
        prefix = (prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base]) || ''
        value = prefix + pad(number.toString(base), precision || 0, '0', false)
        return justify(value, prefix, leftJustify, minWidth, zeroPad)
    }

    // formatString()
    var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision !== null && precision !== undefined) {
            value = value.slice(0, precision)
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar)
    }

    // doFormat()
    var doFormat = function (substring, valueIndex, flags, minWidth, precision, type) {
        var number, prefix, method, textTransform, value

        if (substring === '%%') {
            return '%'
        }

        // parse flags
        var leftJustify = false
        var positivePrefix = ''
        var zeroPad = false
        var prefixBaseX = false
        var customPadChar = ' '
        var flagsl = flags.length
        var j
        for (j = 0; flags && j < flagsl; j++) {
            switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' '
                    break
                case '+':
                    positivePrefix = '+'
                    break
                case '-':
                    leftJustify = true
                    break
                case "'":
                    customPadChar = flags.charAt(j + 1)
                    break
                case '0':
                    zeroPad = true
                    customPadChar = '0'
                    break
                case '#':
                    prefixBaseX = true
                    break
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
            minWidth = 0
        } else if (minWidth === '*') {
            minWidth = +a[i++]
        } else if (minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)]
        } else {
            minWidth = +minWidth
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth
            leftJustify = true
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite')
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined
        } else if (precision === '*') {
            precision = +a[i++]
        } else if (precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)]
        } else {
            precision = +precision
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++]

        switch (type) {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar)
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad)
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                        .toUpperCase()
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'i':
            case 'd':
                number = +value || 0
                // Plain Math.round doesn't just truncate
                number = Math.round(number - number % 1)
                prefix = number < 0 ? '-' : positivePrefix
                value = prefix + pad(String(Math.abs(number)), precision, '0', false)
                return justify(value, prefix, leftJustify, minWidth, zeroPad)
            case 'e':
            case 'E':
            case 'f': // Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value
                prefix = number < 0 ? '-' : positivePrefix
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())]
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2]
                value = prefix + Math.abs(number)[method](precision)
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]()
            default:
                return substring
        }
    }

    return format.replace(regex, doFormat)
}

function addslashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function quoteattr(s, preserveCR) {
    preserveCR = preserveCR ? '&#13;' : '\n';
    return ('' + s) /* Forces the conversion to string. */
            .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
            .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            /*
             You may add other replacements here for HTML only 
             (but it's not necessary).
             Or for XML, only if the named entities are defined in its DTD.
             */
            .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
            .replace(/[\r\n]/g, preserveCR);
    ;
}

String.prototype.ucfirst = function ()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
}

function isset() {
    //  discuss at: http://locutus.io/php/isset/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: FremyCompany
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    //   example 1: isset( undefined, true)
    //   returns 1: false
    //   example 2: isset( 'Kevin van Zonneveld' )
    //   returns 2: true

    var a = arguments
    var l = a.length
    var i = 0
    var undef

    if (l === 0) {
        throw new Error('Empty isset')
    }

    while (i !== l) {
        if (a[i] === undef || a[i] === null) {
            return false
        }
        i++
    }

    return true
}

function is_callable(v, syntax_only, callable_name) {
    //  discuss at: http://phpjs.org/functions/is_callable/
    // original by: Brett Zamir (http://brett-zamir.me)
    //    input by: François
    // improved by: Brett Zamir (http://brett-zamir.me)
    //        note: The variable callable_name cannot work as a string variable passed by reference as in PHP (since JavaScript does not support passing strings by reference), but instead will take the name of a global variable and set that instead
    //        note: When used on an object, depends on a constructor property being kept on the object prototype
    //        test: skip
    //   example 1: is_callable('is_callable');
    //   returns 1: true
    //   example 2: is_callable('bogusFunction', true);
    //   returns 2: true // gives true because does not do strict checking
    //   example 3: function SomeClass () {}
    //   example 3: SomeClass.prototype.someMethod = function (){};
    //   example 3: var testObj = new SomeClass();
    //   example 3: is_callable([testObj, 'someMethod'], true, 'myVar');
    //   example 3: $result = myVar;
    //   returns 3: 'SomeClass::someMethod'
    //   example 4: is_callable(function () {});
    //   returns 4: true

    var name = '',
            obj = {},
            method = '';
    var getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/)
                .exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    };
    if (typeof v === 'string') {
        obj = this.window;
        method = v;
        name = v;
    } else if (typeof v === 'function') {
        return true;
    } else if (Object.prototype.toString.call(v) === '[object Array]' &&
            v.length === 2 && typeof v[0] === 'object' && typeof v[1] === 'string') {
        obj = v[0];
        method = v[1];
        name = (obj.constructor && getFuncName(obj.constructor)) + '::' + method;
    } else {
        return false;
    }
    if (syntax_only || typeof obj[method] === 'function') {
        if (callable_name) {
            this.window[callable_name] = name;
        }
        return true;
    }
    return false;
}

function md5(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function (x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    var _FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue = "",
                wordToHexValue_temp = "",
                lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
            k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22,
            S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20,
            S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23,
            S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
}

function uniqid(prefix, more_entropy) {
    //  discuss at: http://phpjs.org/functions/uniqid/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  revised by: Kankrelune (http://www.webfaktory.info/)
    //        note: Uses an internal counter (in php_js global) to avoid collision
    //        test: skip
    //   example 1: uniqid();
    //   returns 1: 'a30285b160c14'
    //   example 2: uniqid('foo');
    //   returns 2: 'fooa30285b1cd361'
    //   example 3: uniqid('bar', true);
    //   returns 3: 'bara20285b23dfd1.31879087'

    if (typeof prefix === 'undefined') {
        prefix = '';
    }

    var retId;
    var formatSeed = function (seed, reqWidth) {
        seed = parseInt(seed, 10)
                .toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) { // so short we pad
            return Array(1 + (reqWidth - seed.length))
                    .join('0') + seed;
        }
        return seed;
    };

    // BEGIN REDUNDANT
    if (!this.php_js) {
        this.php_js = {};
    }
    // END REDUNDANT
    if (!this.php_js.uniqidSeed) { // init seed with big random int
        this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }
    this.php_js.uniqidSeed++;

    retId = prefix; // start with prefix, add current milliseconds hex string
    retId += formatSeed(parseInt(new Date()
            .getTime() / 1000, 10), 8);
    retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10)
                .toFixed(8)
                .toString();
    }

    return retId;
}

function strip_tags(input, allowed) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Luke Godfrey
    // +      input by: Pul
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +      input by: Alex
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Marc Palau
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Eric Nagel
    // +      input by: Bobby Drake
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Tomasz Wesolowski
    // +      input by: Evertjan Garretsen
    // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
    // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
    // *     returns 2: '<p>Kevin van Zonneveld</p>'
    // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
    // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
    // *     example 4: strip_tags('1 < 5 5 > 1');
    // *     returns 4: '1 < 5 5 > 1'
    // *     example 5: strip_tags('1 <br/> 1');
    // *     returns 5: '1  1'
    // *     example 6: strip_tags('1 <br/> 1', '<br>');
    // *     returns 6: '1  1'
    // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
    // *     returns 7: '1 <br/> 1'
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

function next(arr) {
    //  discuss at: http://phpjs.org/functions/next/
    // original by: Brett Zamir (http://brett-zamir.me)
    //        note: Uses global: php_js to store the array pointer
    //   example 1: transport = ['foot', 'bike', 'car', 'plane'];
    //   example 1: next(transport);
    //   example 1: next(transport);
    //   returns 1: 'car'

    this.php_js = this.php_js || {};
    this.php_js.pointers = this.php_js.pointers || [];
    var indexOf = function (value) {
        for (var i = 0, length = this.length; i < length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    };
    // END REDUNDANT
    var pointers = this.php_js.pointers;
    if (!pointers.indexOf) {
        pointers.indexOf = indexOf;
    }
    if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0);
    }
    var arrpos = pointers.indexOf(arr);
    var cursor = pointers[arrpos + 1];
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        var ct = 0;
        for (var k in arr) {
            if (ct === cursor + 1) {
                pointers[arrpos + 1] += 1;
                return arr[k];
            }
            ct++;
        }
        return false; // End
    }
    if (arr.length === 0 || cursor === (arr.length - 1)) {
        return false;
    }
    pointers[arrpos + 1] += 1;
    return arr[pointers[arrpos + 1]];
}

function array_column(arr, column) {
    // Extract a column from an array of JavaScript objects.
    function reduction(previousValue, currentValue) {
        previousValue.push(currentValue[column]);
        return previousValue;
    }

    return arr.reduce(reduction, []);
}

function ksort(inputArr, sortFlags) {
    //  discuss at: http://locutus.io/php/ksort/
    // original by: GeekFG (http://geekfg.blogspot.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //      note 1: This function deviates from PHP in returning a copy of the array instead
    //      note 1: of acting by reference and returning true; this was necessary because
    //      note 1: IE does not allow deleting and re-adding of properties without caching
    //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
    //      note 1: get the PHP behavior, but use this only if you are in an environment
    //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
    //      note 1: property deletion is supported. Note that we intend to implement the PHP
    //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
    //      note 1: is by reference in PHP anyways
    //      note 1: Since JS objects' keys are always strings, and (the
    //      note 1: default) SORT_REGULAR flag distinguishes by key type,
    //      note 1: if the content is a numeric string, we treat the
    //      note 1: "original type" as numeric.
    //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
    //   example 1: ksort($data)
    //   example 1: var $result = $data
    //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
    //   example 2: ini_set('locutus.sortByReference', true)
    //   example 2: var $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
    //   example 2: ksort($data)
    //   example 2: var $result = $data
    //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}



    var tmpArr = {}
    var keys = []
    var sorter
    var i
    var k
    var sortByReference = false
    var populateArr = {}

    var $global = (typeof window !== 'undefined' ? window : global)
    $global.$locutus = $global.$locutus || {}
    var $locutus = $global.$locutus
    $locutus.php = $locutus.php || {}
    $locutus.php.locales = $locutus.php.locales || {}

    switch (sortFlags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return strnatcmp(b, a)
            }
            break
        case 'SORT_LOCALE_STRING':
            // compare items as strings, based on the current locale
            // (set with i18n_loc_set_default() as of PHP6)
            var loc = i18n_loc_get_default()
            sorter = $locutus.locales[loc].sorting
            break
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return ((a + 0) - (b + 0))
            }
            break
        default:
            // case 'SORT_REGULAR': // compare items normally (don't change types)
            sorter = function (a, b) {
                var aFloat = parseFloat(a)
                var bFloat = parseFloat(b)
                var aNumeric = aFloat + '' === a
                var bNumeric = bFloat + '' === b
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
                } else if (aNumeric && !bNumeric) {
                    return 1
                } else if (!aNumeric && bNumeric) {
                    return -1
                }
                return a > b ? 1 : a < b ? -1 : 0
            }
            break
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k)
        }
    }
    keys.sort(sorter)

    var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
    sortByReference = iniVal === 'on'
    populateArr = sortByReference ? inputArr : populateArr

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i]
        tmpArr[k] = inputArr[k]
        if (sortByReference) {
            delete inputArr[k]
        }
    }
    for (i in tmpArr) {
        if (tmpArr.hasOwnProperty(i)) {
            populateArr[i] = tmpArr[i]
        }
    }

    return sortByReference || populateArr
}

function is_array(mixedVar) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/is_array/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Legaev Andrey
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    // improved by: Nathan Sepulveda
    // improved by: Brett Zamir (https://brett-zamir.me)
    // bugfixed by: Cord
    // bugfixed by: Manish
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    //      note 1: In Locutus, javascript objects are like php associative arrays,
    //      note 1: thus JavaScript objects will also
    //      note 1: return true in this function (except for objects which inherit properties,
    //      note 1: being thus used as objects),
    //      note 1: unless you do ini_set('locutus.objectsAsArrays', 0),
    //      note 1: in which case only genuine JavaScript arrays
    //      note 1: will return true
    //   example 1: is_array(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: true
    //   example 2: is_array('Kevin van Zonneveld')
    //   returns 2: false
    //   example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
    //   returns 3: true
    //   example 4: ini_set('locutus.objectsAsArrays', 0)
    //   example 4: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
    //   returns 4: false
    //   example 5: is_array(function tmp_a (){ this.name = 'Kevin' })
    //   returns 5: false

    var _getFuncName = function (fn) {
        var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
        if (!name) {
            return '(Anonymous)'
        }
        return name[1]
    }
    var _isArray = function (mixedVar) {
        // return Object.prototype.toString.call(mixedVar) === '[object Array]';
        // The above works, but let's do the even more stringent approach:
        // (since Object.prototype.toString could be overridden)
        // Null, Not an object, no length property so couldn't be an Array (or String)
        if (!mixedVar || typeof mixedVar !== 'object' || typeof mixedVar.length !== 'number') {
            return false
        }
        var len = mixedVar.length
        mixedVar[mixedVar.length] = 'bogus'
        // The only way I can think of to get around this (or where there would be trouble)
        // would be to have an object defined
        // with a custom "length" getter which changed behavior on each call
        // (or a setter to mess up the following below) or a custom
        // setter for numeric properties, but even that would need to listen for
        // specific indexes; but there should be no false negatives
        // and such a false positive would need to rely on later JavaScript
        // innovations like __defineSetter__
        if (len !== mixedVar.length) {
            // We know it's an array since length auto-changed with the addition of a
            // numeric property at its length end, so safely get rid of our bogus element
            mixedVar.length -= 1
            return true
        }
        // Get rid of the property we added onto a non-array object; only possible
        // side-effect is if the user adds back the property later, it will iterate
        // this property in the older order placement in IE (an order which should not
        // be depended on anyways)
        delete mixedVar[mixedVar.length]
        return false
    }

    if (!mixedVar || typeof mixedVar !== 'object') {
        return false
    }

    var isArray = _isArray(mixedVar)

    if (isArray) {
        return true
    }

    var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.objectsAsArrays') : undefined) || 'on'
    if (iniVal === 'on') {
        var asString = Object.prototype.toString.call(mixedVar)
        var asFunc = _getFuncName(mixedVar.constructor)

        if (asString === '[object Object]' && asFunc === 'Object') {
            // Most likely a literal and intended as assoc. array
            return true
        }
    }

    return false
}

function in_array(needle, haystack, argStrict) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/in_array/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: vlado houba
    // improved by: Jonas Sciangula Street (Joni2Back)
    //    input by: Billy
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: true
    //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
    //   returns 2: false
    //   example 3: in_array(1, ['1', '2', '3'])
    //   example 3: in_array(1, ['1', '2', '3'], false)
    //   returns 3: true
    //   returns 3: true
    //   example 4: in_array(1, ['1', '2', '3'], true)
    //   returns 4: false

    var key = ''
    var strict = !!argStrict

    // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
    // in just one for, in order to improve the performance
    // deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) { // eslint-disable-line eqeqeq
                return true
            }
        }
    }

    return false
}

function array_pop(array) {
    // Pops an element off the end of the array  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/array_pop    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: array_pop([0,1,2]);    // *     returns 1: 2
    // *     example 2: data = {firstName: 'Kevin', surName: 'van Zonneveld'};
    // *     example 2: lastElem = array_pop(data);
    // *     returns 2: 'van Zonneveld'
    // *     results 2: data == {firstName: 'Kevin'}    var key = '', cnt = 0;

    if (array.hasOwnProperty('length')) {
        // Indexed
        if (!array.length) {            // Done popping, are we?
            return null;
        }
        return array.pop();
    } else {        // Associative
        for (key in array) {
            cnt++;
        }
        if (cnt) {
            delete(array[key]);
            return array[key];
        } else {
            return null;
        }
    }
}

function array_walk_recursive(array, funcname, userdata) { // eslint-disable-line camelcase
    // original by: Hugues Peccatte
    //      note 1: Only works with user-defined functions, not built-in functions like void()
    //   example 1: array_walk_recursive([3, 4], function () {}, 'userdata')
    //   returns 1: true
    //   example 2: array_walk_recursive([3, [4]], function () {}, 'userdata')
    //   returns 2: true
    //   example 3: array_walk_recursive([3, []], function () {}, 'userdata')
    //   returns 3: true

    if (!array || typeof array !== 'object') {
        return false
    }

    if (typeof funcname !== 'function') {
        return false
    }

    for (var key in array) {
        // apply "funcname" recursively only on arrays
        if (Object.prototype.toString.call(array[key]) === '[object Array]') {
            var funcArgs = [array[key], funcname]
            if (arguments.length > 2) {
                funcArgs.push(userdata)
            }
            if (array_walk_recursive.apply(null, funcArgs) === false) {
                return false
            }
            continue
        }
        try {
            if (arguments.length > 2) {
                funcname(array[key], key, userdata)
            } else {
                funcname(array[key], key)
            }
        } catch (e) {
            return false
        }
    }

    return true
}

function array_walk(array, funcname, userdata) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/array_walk/
    // original by: Johnny Mast (http://www.phpvrouwen.nl)
    // bugfixed by: David
    // improved by: Brett Zamir (http://brett-zamir.me)
    //      note 1: Only works with user-defined functions, not built-in functions like void()
    //   example 1: array_walk ([3, 4], function () {}, 'userdata')
    //   returns 1: true
    //   example 2: array_walk ('mystring', function () {})
    //   returns 2: false
    //   example 3: array_walk ({"title":"my title"}, function () {})
    //   returns 3: true

    if (!array || typeof array !== 'object') {
        return false
    }

    try {
        if (typeof funcname === 'function') {
            for (var key in array) {
                if (arguments.length > 2) {
                    funcname(array[key], key, userdata)
                } else {
                    funcname(array[key], key)
                }
            }
        } else {
            return false
        }
    } catch (e) {
        return false
    }

    return true
}

function implode(glue, pieces) {
    // Joins array elements placing glue string between items and return one string  
    // 
    // version: 911.718
    // discuss at: http://phpjs.org/functions/implode    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Waldo Malqui Silva
    // +   improved by: Itsacon (http://www.itsacon.net/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
    // *     returns 2: 'Kevin van Zonneveld'
    var i = '', retVal = '', tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof (pieces) === 'object') {
        if (pieces instanceof Array) {
            return pieces.join(glue);
        } else {
            for (i in pieces) {
                retVal += tGlue + pieces[i];
                tGlue = glue;
            }
            return retVal;
        }
    } else {
        return pieces;
    }
}

function utf8_encode(argString) {
    // Encodes an ISO-8859-1 string to UTF-8  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/utf8_encode    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'    
    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

function utf8_decode(str_data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
    var tmp_arr = [],
            i = 0,
            ac = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 > 191 && c1 < 224) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return tmp_arr.join('');
}

function base64_decode(data) {
    // Decodes string using MIME base64 algorithm  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/base64_decode    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_decode    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {    //    return btoa(data);
    //}

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
    if (!data) {
        return data;
    }
    data += '';

    do {  // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');
    dec = this.utf8_decode(dec);
    return dec;
}

function base64_encode(data) {
    // Encodes string using MIME base64 algorithm  
    // 
    // version: 909.322
    // discuss at: http://phpjs.org/functions/base64_encode    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];

    if (!data) {
        return data;
    }

    data = this.utf8_encode(data + '');

    do { // pack three octets into four hexets        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }
    return enc;
}

function urlencode(str) {
    //       discuss at: http://locutus.io/php/urlencode/
    //      original by: Philip Peterson
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Kevin van Zonneveld (http://kvz.io)
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      improved by: Lars Fischer
    //         input by: AJ
    //         input by: travc
    //         input by: Brett Zamir (http://brett-zamir.me)
    //         input by: Ratheous
    //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Joris
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //           note 1: This reflects PHP 5.3/6.0+ behavior
    //           note 1: Please be aware that this function
    //           note 1: expects to encode into UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: urlencode('Kevin van Zonneveld!')
    //        returns 1: 'Kevin+van+Zonneveld%21'
    //        example 2: urlencode('http://kvz.io/')
    //        returns 2: 'http%3A%2F%2Fkvz.io%2F'
    //        example 3: urlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
    //        returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'

    str = (str + '')

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
    // but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
}

function urldecode(str) {
    // Decodes URL-encoded string  
    // 
    // version: 1001.2911
    // discuss at: http://phpjs.org/functions/urldecode    // +   original by: Philip Peterson
    // %        note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // %        note 2: Please be aware that this function expects to decode from UTF-8 encoded strings, as found on    // %        note 2: pages served as UTF-8
    // *     example 1: urldecode('Kevin+van+Zonneveld%21');
    // *     returns 1: 'Kevin van Zonneveld!'
    // *     example 2: urldecode('http%3A%2F%2Fkevin.vanzonneveld.net%2F');
    // *     returns 2: 'http://kevin.vanzonneveld.net/'    // *     example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a');
    // *     returns 3: 'http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'

    return decodeURIComponent(str.replace(/\+/g, '%20'));
}

function varDump() {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Zahlii
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: echo
    // %        note 1: For returning a string, use var_export() with the second argument set to true
    // *     example 1: varDump(1);
    // *     returns 1: 'int(1)'

    var output = '',
            pad_char = ' ',
            pad_val = 4,
            lgth = 0,
            i = 0,
            d = this.window.document;
    var _getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    };

    var _repeat_char = function (len, pad_char) {
        var str = '';
        for (var i = 0; i < len; i++) {
            str += pad_char;
        }
        return str;
    };
    var _getInnerVal = function (val, thick_pad) {
        var ret = '';
        if (val === null) {
            ret = 'NULL';
        } else if (typeof val === 'boolean') {
            ret = 'bool(' + val + ')';
        } else if (typeof val === 'string') {
            ret = 'string(' + val.length + ') "' + val + '"';
        } else if (typeof val === 'number') {
            if (parseFloat(val) == parseInt(val, 10)) {
                ret = 'int(' + val + ')';
            } else {
                ret = 'float(' + val + ')';
            }
        }
        // The remaining are not PHP behavior because these values only exist in this exact form in JavaScript
        else if (typeof val === 'undefined') {
            ret = 'undefined';
        } else if (typeof val === 'function') {
            var funcLines = val.toString().split('\n');
            ret = '';
            for (var i = 0, fll = funcLines.length; i < fll; i++) {
                ret += (i !== 0 ? '\n' + thick_pad : '') + funcLines[i];
            }
        } else if (val instanceof Date) {
            ret = 'Date(' + val + ')';
        } else if (val instanceof RegExp) {
            ret = 'RegExp(' + val + ')';
        } else if (val.nodeName) { // Different than PHP's DOMElement
            switch (val.nodeType) {
                case 1:
                    if (typeof val.namespaceURI === 'undefined' || val.namespaceURI === 'http://www.w3.org/1999/xhtml') { // Undefined namespace could be plain XML, but namespaceURI not widely supported
                        ret = 'HTMLElement("' + val.nodeName + '")';
                    } else {
                        ret = 'XML Element("' + val.nodeName + '")';
                    }
                    break;
                case 2:
                    ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')';
                    break;
                case 3:
                    ret = 'TEXT_NODE(' + val.nodeValue + ')';
                    break;
                case 4:
                    ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')';
                    break;
                case 5:
                    ret = 'ENTITY_REFERENCE_NODE';
                    break;
                case 6:
                    ret = 'ENTITY_NODE';
                    break;
                case 7:
                    ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')';
                    break;
                case 8:
                    ret = 'COMMENT_NODE(' + val.nodeValue + ')';
                    break;
                case 9:
                    ret = 'DOCUMENT_NODE';
                    break;
                case 10:
                    ret = 'DOCUMENT_TYPE_NODE';
                    break;
                case 11:
                    ret = 'DOCUMENT_FRAGMENT_NODE';
                    break;
                case 12:
                    ret = 'NOTATION_NODE';
                    break;
            }
        }
        return ret;
    };

    var _formatArray = function (obj, cur_depth, pad_val, pad_char) {
        var someProp = '';
        if (cur_depth > 0) {
            cur_depth++;
        }

        var base_pad = _repeat_char(pad_val * (cur_depth - 1), pad_char);
        var thick_pad = _repeat_char(pad_val * (cur_depth + 1), pad_char);
        var str = '';
        var val = '';

        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor && _getFuncName(obj.constructor) === 'PHPJS_Resource') {
                return obj.varDump();
            }
            lgth = 0;
            for (someProp in obj) {
                lgth++;
            }
            str += 'array(' + lgth + ') {\n';
            for (var key in obj) {
                var objVal = obj[key];
                if (typeof objVal === 'object' && objVal !== null && !(objVal instanceof Date) && !(objVal instanceof RegExp) && !objVal.nodeName) {
                    str += thick_pad + '[' + key + '] =>\n' + thick_pad + _formatArray(objVal, cur_depth + 1, pad_val, pad_char);
                } else {
                    val = _getInnerVal(objVal, thick_pad);
                    str += thick_pad + '[' + key + '] =>\n' + thick_pad + val + '\n';
                }
            }
            str += base_pad + '}\n';
        } else {
            str = _getInnerVal(obj, thick_pad);
        }
        return str;
    };

    output = _formatArray(arguments[0], 0, pad_val, pad_char);
    for (i = 1; i < arguments.length; i++) {
        output += '\n' + _formatArray(arguments[i], 0, pad_val, pad_char);
    }

    if (d.body) {
        this.echo(output);
    } else {
        try {
            d = XULDocument; // We're in XUL, so appending as plain text won't work
            this.echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">' + output + '</pre>');
        } catch (e) {
            this.echo(output); // Outputting as plain text may work in some plain XML
        }
    }
}

function echo() {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: echo is bad
    // +   improved by: Nate
    // +    revised by: Der Simon (http://innerdom.sourceforge.net/)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Eugene Bulkin (http://doubleaw.com/)
    // +   input by: JB
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: EdorFaus
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: If browsers start to support DOM Level 3 Load and Save (parsing/serializing),
    // %        note 1: we wouldn't need any such long code (even most of the code below). See
    // %        note 1: link below for a cross-browser implementation in JavaScript. HTML5 might
    // %        note 1: possibly support DOMParser, but that is not presently a standard.
    // %        note 2: Although innerHTML is widely used and may become standard as of HTML5, it is also not ideal for
    // %        note 2: use with a temporary holder before appending to the DOM (as is our last resort below),
    // %        note 2: since it may not work in an XML context
    // %        note 3: Using innerHTML to directly add to the BODY is very dangerous because it will
    // %        note 3: break all pre-existing references to HTMLElements.
    // *     example 1: echo('<div><p>abc</p><p>abc</p></div>');
    // *     returns 1: undefined
    // Fix: This function really needs to allow non-XHTML input (unless in true XHTML mode) as in jQuery
    var arg = '',
            argc = arguments.length,
            argv = arguments,
            i = 0,
            holder, win = this.window,
            d = win.document,
            ns_xhtml = 'http://www.w3.org/1999/xhtml',
            ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'; // If we're in a XUL context
    var stringToDOM = function (str, parent, ns, container) {
        var extraNSs = '';
        if (ns === ns_xul) {
            extraNSs = ' xmlns:html="' + ns_xhtml + '"';
        }
        var stringContainer = '<' + container + ' xmlns="' + ns + '"' + extraNSs + '>' + str + '</' + container + '>';
        var dils = win.DOMImplementationLS,
                dp = win.DOMParser,
                ax = win.ActiveXObject;
        if (dils && dils.createLSInput && dils.createLSParser) {
            // Follows the DOM 3 Load and Save standard, but not
            // implemented in browsers at present; HTML5 is to standardize on innerHTML, but not for XML (though
            // possibly will also standardize with DOMParser); in the meantime, to ensure fullest browser support, could
            // attach http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.js (see http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.xhtml for a simple test file)
            var lsInput = dils.createLSInput();
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            lsInput.stringData = stringContainer;
            var lsParser = dils.createLSParser(1, null); // synchronous, no schema type
            return lsParser.parse(lsInput).firstChild;
        } else if (dp) {
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            try {
                var fc = new dp().parseFromString(stringContainer, 'text/xml');
                if (fc && fc.documentElement && fc.documentElement.localName !== 'parsererror' && fc.documentElement.namespaceURI !== 'http://www.mozilla.org/newlayout/xml/parsererror.xml') {
                    return fc.documentElement.firstChild;
                }
                // If there's a parsing error, we just continue on
            } catch (e) {
                // If there's a parsing error, we just continue on
            }
        } else if (ax) { // We don't bother with a holder in Explorer as it doesn't support namespaces
            var axo = new ax('MSXML2.DOMDocument');
            axo.loadXML(str);
            return axo.documentElement;
        }
        /*else if (win.XMLHttpRequest) { // Supposed to work in older Safari
         var req = new win.XMLHttpRequest;
         req.open('GET', 'data:application/xml;charset=utf-8,'+encodeURIComponent(str), false);
         if (req.overrideMimeType) {
         req.overrideMimeType('application/xml');
         }
         req.send(null);
         return req.responseXML;
         }*/
        // Document fragment did not work with innerHTML, so we create a temporary element holder
        // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
        //if (d.createElementNS && (d.contentType && d.contentType !== 'text/html')) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways)
        if (d.createElementNS && // Browser supports the method
                (d.documentElement.namespaceURI || // We can use if the document is using a namespace
                        d.documentElement.nodeName.toLowerCase() !== 'html' || // We know it's not HTML4 or less, if the tag is not HTML (even if the root namespace is null)
                        (d.contentType && d.contentType !== 'text/html') // We know it's not regular HTML4 or less if this is Mozilla (only browser supporting the attribute) and the content type is something other than text/html; other HTML5 roots (like svg) still have a namespace
                        )) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways); last test is for the sake of being in a pure XML document
            holder = d.createElementNS(ns, container);
        } else {
            holder = d.createElement(container); // Document fragment did not work with innerHTML
        }
        holder.innerHTML = str;
        while (holder.firstChild) {
            parent.appendChild(holder.firstChild);
        }
        return false;
        // throw 'Your browser does not support DOM parsing as required by echo()';
    };


    var ieFix = function (node) {
        if (node.nodeType === 1) {
            var newNode = d.createElement(node.nodeName);
            var i, len;
            if (node.attributes && node.attributes.length > 0) {
                for (i = 0, len = node.attributes.length; i < len; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }
            if (node.childNodes && node.childNodes.length > 0) {
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    newNode.appendChild(ieFix(node.childNodes[i]));
                }
            }
            return newNode;
        } else {
            return d.createTextNode(node.nodeValue);
        }
    };

    var replacer = function (s, m1, m2) {
        // We assume for now that embedded variables do not have dollar sign; to add a dollar sign, you currently must use {$$var} (We might change this, however.)
        // Doesn't cover all cases yet: see http://php.net/manual/en/language.types.string.php#language.types.string.syntax.double
        if (m1 !== '\\') {
            return m1 + eval(m2);
        } else {
            return s;
        }
    };

    this.php_js = this.php_js || {};
    var phpjs = this.php_js,
            ini = phpjs.ini,
            obs = phpjs.obs;
    for (i = 0; i < argc; i++) {
        arg = argv[i];
        if (ini && ini['phpjs.echo_embedded_vars']) {
            arg = arg.replace(/(.?)\{?\$(\w*?\}|\w*)/g, replacer);
        }

        if (!phpjs.flushing && obs && obs.length) { // If flushing we output, but otherwise presence of a buffer means caching output
            obs[obs.length - 1].buffer += arg;
            continue;
        }

        if (d.appendChild) {
            if (d.body) {
                if (win.navigator.appName === 'Microsoft Internet Explorer') { // We unfortunately cannot use feature detection, since this is an IE bug with cloneNode nodes being appended
                    d.body.appendChild(stringToDOM(ieFix(arg)));
                } else {
                    var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div').cloneNode(true); // We will not actually append the div tag (just using for providing XHTML namespace by default)
                    if (unappendedLeft) {
                        d.body.appendChild(unappendedLeft);
                    }
                }
            } else {
                d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description')); // We will not actually append the description tag (just using for providing XUL namespace by default)
            }
        } else if (d.write) {
            d.write(arg);
        }
        /* else { // This could recurse if we ever add print!
         print(arg);
         }*/
    }
}

function is_numeric(mixed_var) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: David
    // +   improved by: taith
    // +   bugfixed by: Tim de Koning
    // +   bugfixed by: WebDevHobo (http://webdevhobo.blogspot.com/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: is_numeric(186.31);
    // *     returns 1: true
    // *     example 2: is_numeric('Kevin van Zonneveld');
    // *     returns 2: false
    // *     example 3: is_numeric('+186.31e2');
    // *     returns 3: true
    // *     example 4: is_numeric('');
    // *     returns 4: false
    // *     example 4: is_numeric([]);
    // *     returns 4: false
    return (typeof (mixed_var) === 'number' || typeof (mixed_var) === 'string') && mixed_var !== '' && !isNaN(mixed_var);
}

function number_format(number, decimals, decPoint, thousandsSep) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault (https://github.com/Theriault)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56)
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ')
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '')
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.')
    //   returns 4: '67,00'
    //   example 5: number_format(1000)
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2)
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1)
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.')
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0)
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2)
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4)
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3)
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ')
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '')
    //  returns 14: '0.00000001'

    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''

    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
                .toFixed(prec)
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}

function json_decode(str_json) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: T.J. Leahy
    // +      improved by: Michael White
    // *        example 1: json_decode('[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]');
    // *        returns 1: ['e', {pluribus: 'unum'}]
    /*
     http://www.JSON.org/json2.js
     2008-11-19
     Public Domain.
     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     See http://www.JSON.org/js.html
     */

    var json = this.window.JSON;
    if (typeof json === 'object' && typeof json.parse === 'function') {
        try {
            return json.parse(str_json);
        } catch (err) {
            if (!(err instanceof SyntaxError)) {
                throw new Error('Unexpected error type in json_decode()');
            }
            this.php_js = this.php_js || {};
            this.php_js.last_error_json = 4; // usable by json_last_error()
            return null;
        }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var j;
    var text = str_json;

    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.
    cx.lastIndex = 0;
    if (cx.test(text)) {
        text = text.replace(cx, function (a) {
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.
    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    if ((/^[\],:{}\s]*$/).
            test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.
        j = eval('(' + text + ')');

        return j;
    }

    this.php_js = this.php_js || {};
    this.php_js.last_error_json = 4; // usable by json_last_error()
    return null;
}

function json_encode(mixed_val) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: Michael White
    // +      input by: felix
    // +      bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *        example 1: json_encode(['e', {pluribus: 'unum'}]);
    // *        returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'
    /*
     http://www.JSON.org/json2.js
     2008-11-19
     Public Domain.
     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     See http://www.JSON.org/js.html
     */
    var retVal, json = this.window.JSON;
    try {
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            //  (an instance of PHPJS_Resource) is used
            if (retVal === undefined) {
                throw new SyntaxError('json_encode');
            }
            return retVal;
        }

        var value = mixed_val;

        var quote = function (string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {// table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };

        var str = function (key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.
                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }
                    if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource)) {
                        throw new SyntaxError('json_encode');
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                case 'undefined':
                // Fall-through
                case 'function':
                // Fall-through
                default:
                    throw new SyntaxError('json_encode');
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });

    } catch (err) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
        // (i.e., when the JSON global is not available and there is an error)
        if (!(err instanceof SyntaxError)) {
            throw new Error('Unexpected error type in json_encode()');
        }
        this.php_js = this.php_js || {};
        this.php_js.last_error_json = 4; // usable by json_last_error()
        return null;
    }
}

function json_last_error() {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: json_last_error();
    // *     returns 1: 0
    /*
     JSON_ERROR_NONE = 0
     JSON_ERROR_DEPTH = 1 // max depth limit to be removed per PHP comments in json.c (not possible in JS?)
     JSON_ERROR_STATE_MISMATCH = 2 // internal use? also not documented
     JSON_ERROR_CTRL_CHAR = 3 // [\u0000-\u0008\u000B-\u000C\u000E-\u001F] if used directly within json_decode(),
     // but JSON functions auto-escape these, so error not possible in JavaScript
     JSON_ERROR_SYNTAX = 4
     */
    return this.php_js && this.php_js.last_error_json ? this.php_js.last_error_json : 0;
}

function round(value, precision, mode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Onno Marsman
    // +      input by: Greenseed
    // +    revised by: T.Wild
    // +      input by: meo
    // +      input by: William
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Josep Sanz (http://www.ws3.es/)
    // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    // %        note 1: Great work. Ideas for improvement:
    // %        note 1:  - code more compliant with developer guidelines
    // %        note 1:  - for implementing PHP constant arguments look at
    // %        note 1:  the pathinfo() function, it offers the greatest
    // %        note 1:  flexibility & compatibility possible
    // *     example 1: round(1241757, -3);
    // *     returns 1: 1242000
    // *     example 2: round(3.6);
    // *     returns 2: 4
    // *     example 3: round(2.835, 2);
    // *     returns 3: 2.84
    // *     example 4: round(1.1749999999999, 2);
    // *     returns 4: 1.17
    // *     example 5: round(58551.799999999996, 2);
    // *     returns 5: 58551.8
    var m, f, isHalf, sgn; // helper variables
    precision |= 0; // making sure precision is integer
    m = Math.pow(10, precision);
    value *= m;
    sgn = (value > 0) | -(value < 0); // sign of the number
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
        switch (mode) {
            case 'PHP_ROUND_HALF_DOWN':
                value = f + (sgn < 0); // rounds .5 toward zero
                break;
            case 'PHP_ROUND_HALF_EVEN':
                value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
                break;
            case 'PHP_ROUND_HALF_ODD':
                value = f + !(f % 2); // rounds .5 towards the next odd integer
                break;
            default:
                value = f + (sgn > 0); // rounds .5 away from zero
        }
    }

    return (isHalf ? value : Math.round(value)) / m;
}

function date(format, timestamp) {
    //  discuss at: http://phpjs.org/functions/date/
    // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // original by: gettimeofday
    //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: MeEtc (http://yass.meetcweb.com)
    // improved by: Brad Touesnard
    // improved by: Tim Wiel
    // improved by: Bryan Elliott
    // improved by: David Randall
    // improved by: Theriault
    // improved by: Theriault
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault
    // improved by: Thomas Beaucourt (http://www.webapp.fr)
    // improved by: JT
    // improved by: Theriault
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // improved by: Theriault
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: majak
    //    input by: Alex
    //    input by: Martin
    //    input by: Alex Wilson
    //    input by: Haravikk
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: majak
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
    // bugfixed by: Chris (http://www.devotis.nl/)
    //        note: Uses global: php_js to store the default timezone
    //        note: Although the function potentially allows timezone info (see notes), it currently does not set
    //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
    //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
    //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    //   returns 1: '09:09:40 m is month'
    //   example 2: date('F j, Y, g:i a', 1062462400);
    //   returns 2: 'September 2, 2003, 2:26 am'
    //   example 3: date('Y W o', 1062462400);
    //   returns 3: '2003 36 2003'
    //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
    //   example 4: (x+'').length == 10 // 2009 01 09
    //   returns 4: true
    //   example 5: date('W', 1104534000);
    //   returns 5: '53'
    //   example 6: date('B t', 1104534000);
    //   returns 6: '999 31'
    //   example 7: date('W U', 1293750000.82); // 2010-12-31
    //   returns 7: '52 1293750000'
    //   example 8: date('W', 1293836400); // 2011-01-01
    //   returns 8: '52'
    //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    //   returns 9: '52 2011-01-02'

    var that = this;
    var jsdate, f;
    // Keep this here (works, but for code commented-out below for file size reasons)
    // var tal= [];
    var txt_words = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    var _pad = function (n, c) {
        n = String(n);
        while (n.length < c) {
            n = '0' + n;
        }
        return n;
    };
    f = {
        // Day
        d: function () {
            // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () {
            // Shorthand day name; Mon...Sun
            return f.l()
                    .slice(0, 3);
        },
        j: function () {
            // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () {
            // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () {
            // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () {
            // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            var i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                i = 0;
            }
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function () {
            // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () {
            // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j());
            var b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },

        // Week
        W: function () {
            // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            var b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function () {
            // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () {
            // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () {
            // Shorthand month name; Jan...Dec
            return f.F()
                    .slice(0, 3);
        },
        n: function () {
            // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () {
            // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0))
                    .getDate();
        },

        // Year
        L: function () {
            // Is leap year?; 0 or 1
            var j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function () {
            // ISO-8601 year
            var n = f.n();
            var W = f.W();
            var Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function () {
            // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () {
            // Last two digits of year; 00...99
            return f.Y()
                    .toString()
                    .slice(-2);
        },

        // Time
        a: function () {
            // am or pm
            return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A: function () {
            // AM or PM
            return f.a()
                    .toUpperCase();
        },
        B: function () {
            // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2;
            // Hours
            var i = jsdate.getUTCMinutes() * 60;
            // Minutes
            // Seconds
            var s = jsdate.getUTCSeconds();
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () {
            // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () {
            // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () {
            // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () {
            // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () {
            // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () {
            // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () {
            // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () {
            // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return that.date_default_timezone_get();
             */
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () {
            // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0);
            // Jan 1
            var c = Date.UTC(f.Y(), 0);
            // Jan 1 UTC
            var b = new Date(f.Y(), 6);
            // Jul 1
            // Jul 1 UTC
            var d = Date.UTC(f.Y(), 6);
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function () {
            // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset();
            var a = Math.abs(tzo);
            return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () {
            // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T: function () {
            // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.
            /*              var abbr, i, os, _default;
             if (!tal.length) {
             tal = that.timezone_abbreviations_list();
             }
             if (that.php_js && that.php_js.default_timezone) {
             _default = that.php_js.default_timezone;
             for (abbr in tal) {
             for (i = 0; i < tal[abbr].length; i++) {
             if (tal[abbr][i].timezone_id === _default) {
             return abbr.toUpperCase();
             }
             }
             }
             }
             for (abbr in tal) {
             for (i = 0; i < tal[abbr].length; i++) {
             os = -jsdate.getTimezoneOffset() * 60;
             if (tal[abbr][i].offset === os) {
             return abbr.toUpperCase();
             }
             }
             }
             */
            return 'UTC';
        },
        Z: function () {
            // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () {
            // ISO-8601 date.
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () {
            // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () {
            // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
                (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
                );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function serialize(mixedValue) {
    //  discuss at: http://locutus.io/php/serialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Dino
    // improved by: Le Torbi (http://www.letorbi.de/)
    // improved by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Andrej Pavlovic
    // bugfixed by: Garagoth
    // bugfixed by: Russell Walker (http://www.nbill.co.uk/)
    // bugfixed by: Jamie Beck (http://www.terabit.ca/)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Ben (http://benblume.co.uk/)
    // bugfixed by: Codestar (http://codestarlive.com/)
    // bugfixed by: idjem (https://github.com/idjem)
    //    input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
    //    input by: Martin (http://www.erlenwiese.de/)
    //      note 1: We feel the main purpose of this function should be to ease
    //      note 1: the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
    //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
    //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'
    //   example 3: serialize( {'ü': 'ü', '四': '四', '𠜎': '𠜎'})
    //   returns 3: 'a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}'

    var val, key, okey
    var ktype = ''
    var vals = ''
    var count = 0

    var _utf8Size = function (str) {
        return ~-encodeURI(str).split(/%..|./).length
    }

    var _getType = function (inp) {
        var match
        var key
        var cons
        var types
        var type = typeof inp

        if (type === 'object' && !inp) {
            return 'null'
        }

        if (type === 'object') {
            if (!inp.constructor) {
                return 'object'
            }
            cons = inp.constructor.toString()
            match = cons.match(/(\w+)\(/)
            if (match) {
                cons = match[1].toLowerCase()
            }
            types = ['boolean', 'number', 'string', 'array']
            for (key in types) {
                if (cons === types[key]) {
                    type = types[key]
                    break
                }
            }
        }
        return type
    }

    var type = _getType(mixedValue)

    switch (type) {
        case 'function':
            val = ''
            break
        case 'boolean':
            val = 'b:' + (mixedValue ? '1' : '0')
            break
        case 'number':
            val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue
            break
        case 'string':
            val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"'
            break
        case 'array':
        case 'object':
            val = 'a'
            /*
             if (type === 'object') {
             var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
             if (objname === undefined) {
             return;
             }
             objname[1] = serialize(objname[1]);
             val = 'O' + objname[1].substring(1, objname[1].length - 1);
             }
             */

            for (key in mixedValue) {
                if (mixedValue.hasOwnProperty(key)) {
                    ktype = _getType(mixedValue[key])
                    if (ktype === 'function') {
                        continue
                    }

                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key)
                    vals += serialize(okey) + serialize(mixedValue[key])
                    count++
                }
            }
            val += ':' + count + ':{' + vals + '}'
            break
        case 'undefined':
        default:
            // Fall-through
            // if the JS object has a property which contains a null value,
            // the string cannot be unserialized by PHP
            val = 'N'
            break
    }
    if (type !== 'object' && type !== 'array') {
        val += ';'
    }

    return val
}

function unserialize(data) {
    //  discuss at: https://locutus.io/php/unserialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Pedro Tainha (https://www.pedrotainha.com)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Chris
    // improved by: James
    // improved by: Le Torbi
    // improved by: Eli Skeggs
    // bugfixed by: dptr1988
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    // bugfixed by: philippsimon (https://github.com/philippsimon/)
    //  revised by: d3x
    //    input by: Brett Zamir (https://brett-zamir.me)
    //    input by: Martin (https://www.erlenwiese.de/)
    //    input by: kilops
    //    input by: Jaroslaw Czarniak
    //    input by: lovasoa (https://github.com/lovasoa/)
    // improved by: Rafał Kukawski
    //      note 1: We feel the main purpose of this function should be
    //      note 1: to ease the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
    //   returns 1: ['Kevin', 'van', 'Zonneveld']
    //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
    //   returns 2: {firstName: 'Kevin', midName: 'van'}
    //   example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
    //   returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}
    //   example 4: unserialize(undefined)
    //   returns 4: false
    //   example 5: unserialize('O:8:"stdClass":1:{s:3:"foo";b:1;}')
    //   returns 5: { foo: true }

    var utf8Overhead = function (str) {
        var s = str.length
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i)
            if (code > 0x7f && code <= 0x7ff) {
                s++
            } else if (code > 0x7ff && code <= 0xffff) {
                s += 2
            }
            // trail surrogate
            if (code >= 0xDC00 && code <= 0xDFFF) {
                i--
            }
        }
        return s - 1
    }
    var readUntil = function (data, offset, stopchr) {
        var i = 2
        var buf = []
        var chr = data.slice(offset, offset + 1)

        while (chr !== stopchr) {
            if ((i + offset) > data.length) {
                throw Error('Invalid')
            }
            buf.push(chr)
            chr = data.slice(offset + (i - 1), offset + i)
            i += 1
        }
        return [buf.length, buf.join('')]
    }
    var readChrs = function (data, offset, length) {
        var i, chr, buf

        buf = []
        for (i = 0; i < length; i++) {
            chr = data.slice(offset + (i - 1), offset + i)
            buf.push(chr)
            length -= utf8Overhead(chr)
        }
        return [buf.length, buf.join('')]
    }
    function _unserialize(data, offset) {
        var dtype
        var dataoffset
        var keyandchrs
        var keys
        var contig
        var length
        var array
        var obj
        var readdata
        var readData
        var ccount
        var stringlength
        var i
        var key
        var kprops
        var kchrs
        var vprops
        var vchrs
        var value
        var chrs = 0
        var typeconvert = function (x) {
            return x
        }

        if (!offset) {
            offset = 0
        }
        dtype = (data.slice(offset, offset + 1))

        dataoffset = offset + 2

        switch (dtype) {
            case 'i':
                typeconvert = function (x) {
                    return parseInt(x, 10)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'b':
                typeconvert = function (x) {
                    const value = parseInt(x, 10)

                    switch (value) {
                        case 0:
                            return false
                        case 1:
                            return true
                        default:
                            throw SyntaxError('Invalid boolean value')
                    }
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'd':
                typeconvert = function (x) {
                    return parseFloat(x)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'n':
                readdata = null
                break
            case 's':
                ccount = readUntil(data, dataoffset, ':')
                chrs = ccount[0]
                stringlength = ccount[1]
                dataoffset += chrs + 2

                readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 2
                if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                    throw SyntaxError('String length mismatch')
                }
                break
            case 'a':
                readdata = {}

                keyandchrs = readUntil(data, dataoffset, ':')
                chrs = keyandchrs[0]
                keys = keyandchrs[1]
                dataoffset += chrs + 2

                length = parseInt(keys, 10)
                contig = true

                for (i = 0; i < length; i++) {
                    kprops = _unserialize(data, dataoffset)
                    kchrs = kprops[1]
                    key = kprops[2]
                    dataoffset += kchrs

                    vprops = _unserialize(data, dataoffset)
                    vchrs = vprops[1]
                    value = vprops[2]
                    dataoffset += vchrs

                    if (key !== i) {
                        contig = false
                    }

                    readdata[key] = value
                }

                if (contig) {
                    array = new Array(length)
                    for (i = 0; i < length; i++) {
                        array[i] = readdata[i]
                    }
                    readdata = array
                }

                dataoffset += 1
                break
            case 'O':
            {
                // O:<class name length>:"class name":<prop count>:{<props and values>}
                // O:8:"stdClass":2:{s:3:"foo";s:3:"bar";s:3:"bar";s:3:"baz";}
                readData = readUntil(data, dataoffset, ':') // read class name length
                dataoffset += readData[0] + 1
                readData = readUntil(data, dataoffset, ':')

                if (readData[1] !== '"stdClass"') {
                    throw Error('Unsupported object type: ' + readData[1])
                }

                dataoffset += readData[0] + 1 // skip ":"
                readData = readUntil(data, dataoffset, ':')
                keys = parseInt(readData[1], 10)

                dataoffset += readData[0] + 2 // skip ":{"
                obj = {}

                for (i = 0; i < keys; i++) {
                    readData = _unserialize(data, dataoffset)
                    key = readData[2]
                    dataoffset += readData[1]

                    readData = _unserialize(data, dataoffset)
                    dataoffset += readData[1]
                    obj[key] = readData[2]
                }

                dataoffset += 1 // skip "}"
                readdata = obj
                break
            }
            default:
                throw SyntaxError('Unknown / Unhandled data type(s): ' + dtype)
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)]
    }

    try {
        if (typeof data !== 'string') {
            return false
        }

        return _unserialize(data, 0)[2]
    } catch (err) {
        console.error(err)
        return false
    }
}