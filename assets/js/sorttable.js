var stIsIE = !1;
sorttable = {
    init: function() {
        arguments.callee.done ||
            ((arguments.callee.done = !0),
            _timer && clearInterval(_timer),
            document.createElement &&
                document.getElementsByTagName &&
                ((sorttable.DATE_RE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/),
                forEach(document.getElementsByTagName("table"), function(a) {
                    -1 != a.className.search(/\bsortable\b/) &&
                        sorttable.makeSortable(a);
                })));
    },
    makeSortable: function(a) {
        0 == a.getElementsByTagName("thead").length &&
            ((the = document.createElement("thead")),
            the.appendChild(a.rows[0]),
            a.insertBefore(the, a.firstChild));
        null == a.tHead && (a.tHead = a.getElementsByTagName("thead")[0]);
        if (1 == a.tHead.rows.length) {
            sortbottomrows = [];
            for (var b = 0; b < a.rows.length; b++)
                -1 != a.rows[b].className.search(/\bsortbottom\b/) &&
                    (sortbottomrows[sortbottomrows.length] = a.rows[b]);
            if (sortbottomrows) {
                null == a.tFoot &&
                    ((tfo = document.createElement("tfoot")),
                    a.appendChild(tfo));
                for (b = 0; b < sortbottomrows.length; b++)
                    tfo.appendChild(sortbottomrows[b]);
                delete sortbottomrows;
            }
            headrow = a.tHead.rows[0].cells;
            for (b = 0; b < headrow.length; b++)
                headrow[b].className.match(/\bsorttable_nosort\b/) ||
                    ((mtch = headrow[b].className.match(
                        /\bsorttable_([a-z0-9]+)\b/
                    )) && (override = mtch[1]),
                    (headrow[b].sorttable_sortfunction =
                        mtch &&
                        "function" == typeof sorttable["sort_" + override]
                            ? sorttable["sort_" + override]
                            : sorttable.guessType(a, b)),
                    (headrow[b].sorttable_columnindex = b),
                    (headrow[b].sorttable_tbody = a.tBodies[0]),
                    dean_addEvent(
                        headrow[b],
                        "click",
                        (sorttable.innerSortFunction = function(a) {
                            if (
                                -1 !=
                                this.className.search(/\bsorttable_sorted\b/)
                            )
                                sorttable.reverse(this.sorttable_tbody),
                                    (this.className = this.className.replace(
                                        "sorttable_sorted",
                                        "sorttable_sorted_reverse"
                                    )),
                                    this.removeChild(
                                        document.getElementById(
                                            "sorttable_sortfwdind"
                                        )
                                    ),
                                    (sortrevind = document.createElement(
                                        "span"
                                    )),
                                    (sortrevind.id = "sorttable_sortrevind"),
                                    (sortrevind.innerHTML = stIsIE
                                        ? '&nbsp<font face="webdings">5</font>'
                                        : "&nbsp;&#x25B4;"),
                                    this.appendChild(sortrevind);
                            else if (
                                -1 !=
                                this.className.search(
                                    /\bsorttable_sorted_reverse\b/
                                )
                            )
                                sorttable.reverse(this.sorttable_tbody),
                                    (this.className = this.className.replace(
                                        "sorttable_sorted_reverse",
                                        "sorttable_sorted"
                                    )),
                                    this.removeChild(
                                        document.getElementById(
                                            "sorttable_sortrevind"
                                        )
                                    ),
                                    (sortfwdind = document.createElement(
                                        "span"
                                    )),
                                    (sortfwdind.id = "sorttable_sortfwdind"),
                                    (sortfwdind.innerHTML = stIsIE
                                        ? '&nbsp<font face="webdings">6</font>'
                                        : "&nbsp;&#x25BE;"),
                                    this.appendChild(sortfwdind);
                            else {
                                theadrow = this.parentNode;
                                forEach(theadrow.childNodes, function(a) {
                                    1 == a.nodeType &&
                                        ((a.className = a.className.replace(
                                            "sorttable_sorted_reverse",
                                            ""
                                        )),
                                        (a.className = a.className.replace(
                                            "sorttable_sorted",
                                            ""
                                        )));
                                });
                                (sortfwdind = document.getElementById(
                                    "sorttable_sortfwdind"
                                )) &&
                                    sortfwdind.parentNode.removeChild(
                                        sortfwdind
                                    );
                                (sortrevind = document.getElementById(
                                    "sorttable_sortrevind"
                                )) &&
                                    sortrevind.parentNode.removeChild(
                                        sortrevind
                                    );
                                this.className += " sorttable_sorted";
                                sortfwdind = document.createElement("span");
                                sortfwdind.id = "sorttable_sortfwdind";
                                sortfwdind.innerHTML = stIsIE
                                    ? '&nbsp<font face="webdings">6</font>'
                                    : "&nbsp;&#x25BE;";
                                this.appendChild(sortfwdind);
                                row_array = [];
                                col = this.sorttable_columnindex;
                                rows = this.sorttable_tbody.rows;
                                for (a = 0; a < rows.length; a++)
                                    row_array[row_array.length] = [
                                        sorttable.getInnerText(
                                            rows[a].cells[col]
                                        ),
                                        rows[a]
                                    ];
                                row_array.sort(this.sorttable_sortfunction);
                                row_array.reverse();
                                tb = this.sorttable_tbody;
                                for (a = 0; a < row_array.length; a++)
                                    tb.appendChild(row_array[a][1]);
                                delete row_array;
                            }
                        })
                    ));
        }
    },
    guessType: function(a, b) {
        sortfn = sorttable.sort_alpha;
        for (var c = 0; c < a.tBodies[0].rows.length; c++)
            if (
                ((text = sorttable.getInnerText(a.tBodies[0].rows[c].cells[b])),
                "" != text)
            ) {
                if (text.match(/^-?[\u00a3$\u00a4]?[\d,.]+%?$/))
                    return sorttable.sort_numeric;
                if ((possdate = text.match(sorttable.DATE_RE))) {
                    first = parseInt(possdate[1]);
                    second = parseInt(possdate[2]);
                    if (12 < first) return sorttable.sort_ddmm;
                    if (12 < second) return sorttable.sort_mmdd;
                    sortfn = sorttable.sort_ddmm;
                }
            }
        return sortfn;
    },
    getInnerText: function(a) {
        if (!a) return "";
        hasInputs =
            "function" == typeof a.getElementsByTagName &&
            a.getElementsByTagName("input").length;
        if (null != a.getAttribute("sorttable_customkey"))
            return a.getAttribute("sorttable_customkey");
        if ("undefined" == typeof a.textContent || hasInputs)
            if ("undefined" == typeof a.innerText || hasInputs)
                if ("undefined" == typeof a.text || hasInputs)
                    switch (a.nodeType) {
                        case 3:
                            if ("input" == a.nodeName.toLowerCase())
                                return a.value.replace(/^\s+|\s+$/g, "");
                        case 4:
                            return a.nodeValue.replace(/^\s+|\s+$/g, "");
                        case 1:
                        case 11:
                            for (
                                var b = "", c = 0;
                                c < a.childNodes.length;
                                c++
                            )
                                b += sorttable.getInnerText(a.childNodes[c]);
                            return b.replace(/^\s+|\s+$/g, "");
                        default:
                            return "";
                    }
                else return a.text.replace(/^\s+|\s+$/g, "");
            else return a.innerText.replace(/^\s+|\s+$/g, "");
        else return a.textContent.replace(/^\s+|\s+$/g, "");
    },
    reverse: function(a) {
        newrows = [];
        for (var b = 0; b < a.rows.length; b++)
            newrows[newrows.length] = a.rows[b];
        for (b = newrows.length - 1; 0 <= b; b--) a.appendChild(newrows[b]);
        delete newrows;
    },
    sort_numeric: function(a, b) {
        aa = parseFloat(a[0].replace(/[^0-9.-]/g, ""));
        isNaN(aa) && (aa = 0);
        bb = parseFloat(b[0].replace(/[^0-9.-]/g, ""));
        isNaN(bb) && (bb = 0);
        return aa - bb;
    },
    sort_alpha: function(a, b) {
        return a[0] == b[0] ? 0 : a[0] < b[0] ? -1 : 1;
    },
    sort_ddmm: function(a, b) {
        mtch = a[0].match(sorttable.DATE_RE);
        y = mtch[3];
        m = mtch[2];
        d = mtch[1];
        1 == m.length && (m = "0" + m);
        1 == d.length && (d = "0" + d);
        dt1 = y + m + d;
        mtch = b[0].match(sorttable.DATE_RE);
        y = mtch[3];
        m = mtch[2];
        d = mtch[1];
        1 == m.length && (m = "0" + m);
        1 == d.length && (d = "0" + d);
        dt2 = y + m + d;
        return dt1 == dt2 ? 0 : dt1 < dt2 ? -1 : 1;
    },
    sort_mmdd: function(a, b) {
        mtch = a[0].match(sorttable.DATE_RE);
        y = mtch[3];
        d = mtch[2];
        m = mtch[1];
        1 == m.length && (m = "0" + m);
        1 == d.length && (d = "0" + d);
        dt1 = y + m + d;
        mtch = b[0].match(sorttable.DATE_RE);
        y = mtch[3];
        d = mtch[2];
        m = mtch[1];
        1 == m.length && (m = "0" + m);
        1 == d.length && (d = "0" + d);
        dt2 = y + m + d;
        return dt1 == dt2 ? 0 : dt1 < dt2 ? -1 : 1;
    },
    shaker_sort: function(a, b) {
        for (var c = 0, e = a.length - 1, g = !0; g; ) {
            for (var g = !1, f = c; f < e; ++f)
                0 < b(a[f], a[f + 1]) &&
                    ((g = a[f]), (a[f] = a[f + 1]), (a[f + 1] = g), (g = !0));
            e--;
            if (!g) break;
            for (f = e; f > c; --f)
                0 > b(a[f], a[f - 1]) &&
                    ((g = a[f]), (a[f] = a[f - 1]), (a[f - 1] = g), (g = !0));
            c++;
        }
    }
};
document.addEventListener &&
    document.addEventListener("DOMContentLoaded", sorttable.init, !1);
if (/WebKit/i.test(navigator.userAgent))
    var _timer = setInterval(function() {
        /loaded|complete/.test(document.readyState) && sorttable.init();
    }, 10);
window.onload = sorttable.init;
function dean_addEvent(a, b, c) {
    if (a.addEventListener) a.addEventListener(b, c, !1);
    else {
        c.$$guid || (c.$$guid = dean_addEvent.guid++);
        a.events || (a.events = {});
        var e = a.events[b];
        e || ((e = a.events[b] = {}), a["on" + b] && (e[0] = a["on" + b]));
        e[c.$$guid] = c;
        a["on" + b] = handleEvent;
    }
}
dean_addEvent.guid = 1;
function removeEvent(a, b, c) {
    a.removeEventListener
        ? a.removeEventListener(b, c, !1)
        : a.events && a.events[b] && delete a.events[b][c.$$guid];
}
function handleEvent(a) {
    var b = !0;
    a =
        a ||
        fixEvent(
            ((this.ownerDocument || this.document || this).parentWindow ||
                window
            ).event
        );
    var c = this.events[a.type],
        e;
    for (e in c)
        (this.$$handleEvent = c[e]), !1 === this.$$handleEvent(a) && (b = !1);
    return b;
}
function fixEvent(a) {
    a.preventDefault = fixEvent.preventDefault;
    a.stopPropagation = fixEvent.stopPropagation;
    return a;
}
fixEvent.preventDefault = function() {
    this.returnValue = !1;
};
fixEvent.stopPropagation = function() {
    this.cancelBubble = !0;
};
Array.forEach ||
    (Array.forEach = function(a, b, c) {
        for (var e = 0; e < a.length; e++) b.call(c, a[e], e, a);
    });
Function.prototype.forEach = function(a, b, c) {
    for (var e in a)
        "undefined" == typeof this.prototype[e] && b.call(c, a[e], e, a);
};
String.forEach = function(a, b, c) {
    Array.forEach(a.split(""), function(e, g) {
        b.call(c, e, g, a);
    });
};
var forEach = function(a, b, c) {
    if (a) {
        var e = Object;
        if (a instanceof Function) e = Function;
        else {
            if (a.forEach instanceof Function) {
                a.forEach(b, c);
                return;
            }
            "string" == typeof a
                ? (e = String)
                : "number" == typeof a.length && (e = Array);
        }
        e.forEach(a, b, c);
    }
};
