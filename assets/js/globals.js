
function alasqlBuildTable(name, data, options) {
    var defaults = {
        dropifExsists: true,
        regexGetChar: /\D/gm,
        autoCastData: true
    };
    var w = window;
    options = $.extend({}, defaults, options);
    if (options.autoCastData) {
        arrayCastRecursive(data);
    }
    if (options.window) {
        w = options.window;
    }   

    if (options.dropifExsists) {
        w.alasql('DROP TABLE IF EXISTS ' + name);
    }

    w.alasql('CREATE TABLE IF NOT EXISTS ' + name + '');

    w.alasql.tables[name].data = data;

    w.alasql.fn.CHARINDEX = function (field, value) {
        return (typeof field == 'string' || typeof field == 'number') && field.length ? field.indexOf(value) : -1;
    }

    w.alasql.fn.MD5 = function (x) {
        return md5(x);
    }

    w.alasql.fn.TRUNCATE_STR = function (field, max, ellips = '...') {
        var truncated = field.toString();
        if (truncated.length > max) {
            var _trunc = truncated.substring(0, max).split(' ');
            _trunc.pop();
            truncated = _trunc.join(' ');
            if (ellips.length) {
                truncated += ellips.toString();
            }
        }
        return truncated;
    }
    w.alasql.fn.DATE_FORMAT = function (DATE, format = "dd/MM/yy H:mm:s") {
        return luxon.DateTime.fromSQL(DATE).toFormat(format);
    }

    w.alasql.fn.EURO_FORMAT = function (value, options = {}) {
        return euroFormat(value, options);
    }

}

function arrayCastRecursive($array) {

    array_walk_recursive($array, function (e, i) {
        if ($array[i]) {
            if (typeof (e) == 'object' && Object.keys(e).length > 0) {
                return arrayCastRecursive($array[i]);
            }
            if (typeof (e) == 'string') {
                if (is_numeric(e)) {
                    $array[i] = parseFloat(e);
                }
            }
        }
    });
}
function setDefaultSelectize(selectize, formFilter) {
    var value = formFilter[selectize.prop("name")];

    if (value) {
        var isJsonString = IsJson(value);
        value = isJsonString ? isJsonString : value;
        if (jQuery.isArray(value)) {
            jQuery.each(value, function () {
                selectize[0].selectize.addItem(this, true);
            });
        } else {
            selectize[0].selectize.addItem(value, true);
        }
    }
    return selectize[0].selectize;
}


$.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] || this.name.indexOf("[]") != -1) {
            if (!o[this.name]) {
                o[this.name] = [];
            }
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


function coalesce() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        if (arguments[i] !== null && arguments[i] !== undefined) {
            return arguments[i];
        }
    }
    return null;
}


function IsJson(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////

var Timer = function (id) {
    var self = this;
    self.id = id;
    var _times = [];
    self.start = function () {
        var time = performance.now();
        console.log('[' + id + '] Start');
        _times.push(time);
    }
    self.lap = function (time) {

        time = time ? time : performance.now();
        console.log('[' + id + '] Lap ' + (time - _times[_times.length - 1]));
        _times.push(time);
    }
    self.stop = function () {
        var time = performance.now();
        if (_times.length > 1) {
            self.lap(time);
        }
        console.log('[' + id + '] Stop ' + (time - _times[0]));
        _times = [];
    }
}