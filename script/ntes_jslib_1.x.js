﻿/*
 * NetEase Javascript Library v1.2.5
 *
 * Modified from
 *		jRaiser Javascript Library
 *		http://code.google.com/p/jraiser/
 *		Copyright 2008-2010 Heero.Luo (http://heeroluo.net/)
 *
 * licensed under MIT license
 *
 * Creation date: 2008/2/6
 * Modified date: 2010/8/4
 */
 (function(R, f) {
    var b = "1.2.5 Build 201008041550",
    _ = "NTES";
    if (R[_] && R[_].version >= b) return;
    var A = R.$,
    c = R.document,
    T = R[_] = R.$ = function($, _) {
        if (!$) return $;
        "string" === typeof $ && ($ = L($, _));
        return M($)
    };
    T.one = function($, _) {
        return M(L($, _, 1))
    };
    T.all = function($, _) {
        return M(L($, _, 0))
    };
    function L(_, B, $) {
        var A = s.exec(_, B || c);
        if ($ !== f) if (A) {
            var C = T.util.isArray(A);
            if (1 === $ && C) return A[0];
            else if (0 === $ && !C) return [A]
        } else if (0 === $) return [];
        return A
    }
    function M(A) {
        if (A && !A[_]) if (A.nodeType) {
            if ("unknown" !== typeof A.getAttribute) for (var $ in T.element) f === A[$] && (A[$] = T.element[$])
        } else A = T.util.extend(T.util.toArray(A), T.element);
        return A
    }
    T.version = b;
    T.resume = function() {
        A = R.$;
        R.$ = R[_] = T;
        return T
    };
    T.retire = function() {
        R.$ = A;
        return A
    };
    var O = c.createElement("div");
    O.innerHTML = "<p class='TEST'></p>";
    var s = {
        SPACE: /\s*([\s>~+,])\s*/g,
        ISSIMPLE: /^#?[\w\u00c0-\uFFFF_-]+$/,
        IMPLIEDALL: /([>\s~\+,]|^)([#\.\[:])/g,
        ATTRVALUES: /=(["'])([^'"]*)\1]/g,
        ATTR: /\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/g,
        PSEUDOSEQ: /\(([^\(\)]*)\)$/g,
        BEGINIDAPART: /^(?:\*#([\w\u00c0-\uFFFF_-]+))/,
        STANDARD: /^[>\s~\+:]/,
        STREAM: /[#\.>\s\[\]:~\+]+|[^#\.>\s\[\]:~\+]+/g,
        ISINT: /^\d+$/,
        enableQuerySelector: O.querySelectorAll && O.querySelectorAll(".TEST").length > 0,
        tempAttrValues: [],
        tempAttrs: [],
        idName: _ + "UniqueId",
        id: 0,
        exec: function($, I) {
            var _,
            G,
            E,
            C,
            B,
            J,
            K,
            F,
            H,
            L,
            D = this;
            $ = $.trim();
            if ("" === $) return;
            if (D.ISSIMPLE.test($)) if (0 === $.indexOf("#") && typeof I.getElementById !== "undefined") return D.getElemById(I, $.substr(1));
            else if (typeof I.getElementsByTagName !== "undefined") return T.util.toArray(I.getElementsByTagName($));
            if (D.enableQuerySelector && I.nodeType) {
                try {
                    return T.util.toArray(I.querySelectorAll($))
                } catch(A) {}
            }
            I = I.nodeType ? [I] : T.util.toArray(I);
            G = $.replace(D.SPACE, "$1").replace(D.ATTRVALUES, D.analyzeAttrValues).replace(D.ATTR, D.analyzeAttrs).replace(D.IMPLIEDALL, "$1*$2").split(",");
            E = G.length;
            C = -1;
            _ = [];
            while (++C < E) {
                J = I;
                $ = G[C];
                if (D.BEGINIDAPART.test($)) if (typeof I[0].getElementById !== "undefined") {
                    J = [D.getElemById(I[0], RegExp.$1)];
                    if (!J[0]) continue;
                    $ = RegExp.rightContext
                } else $ = G[C];
                if ($ !== "") {
                    if (!D.STANDARD.test($)) $ = " " + $;
                    K = $.match(D.STREAM) || [];
                    F = K.length;
                    B = 0;
                    while (B < F) {
                        H = K[B++];
                        L = K[B++];
                        J = D.operators[H] ? D.operators[H](J, L) : [];
                        if (0 === J.length) break
                    }
                }

                T.util.merge(_, J)
            }
            D.tempAttrValues.length = D.tempAttrs.length = 0;
            return _.length > 1 ? D.unique(_) : _
        },
        analyzeAttrs: function(_, B, A, $) {
            return "[]" + (s.tempAttrs.push([B, A, $]) - 1)
        },
        analyzeAttrValues: function($, A, _) {
            return "=" + (s.tempAttrValues.push(_) - 1) + "]"
        },
        generateId: function(_) {
            var B = this.idName,
            $;
            try {
                $ = _[B] = _[B] || new Number(++this.id)
            } catch(A) {
                $ = _.getAttribute(B);
                if (!$) {
                    $ = new Number(++this.id);
                    _.setAttribute(B, $)
                }
            }
            return $.valueOf()
        },
        unique: function(C) {
            var A = [],
            D = 0,
            B = {},
            _,
            $;
            while (_ = C[D++]) if (1 === _.nodeType) {
                $ = this.generateId(_);
                if (!B[$]) {
                    B[$] = true;
                    A.push(_)
                }
            }
            return A
        },
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        getAttribute: function($, A) {
            var _ = this.attrMap[A] || A,
            B = $[_];
            if ("string" !== typeof B) if ("undefined" !== typeof $.getAttributeNode) {
                B = $.getAttributeNode(A);
                B = f == B ? B: B.value
            } else if ($.attributes) B = String($.attributes[A]);
            return null == B ? "": B
        },
        getElemById: function(A, $) {
            var _ = A.getElementById($);
            if (_ && _.id !== $ && A.all) {
                _ = A.all[$];
                if (_) {
                    _.nodeType && (_ = [_]);
                    for (var B = 0; B < _.length; B++) if (this.getAttribute(_[B], "id") === $) return _[B]
                }
            } else return _
        },
        getElemsByTagName: function(F, H, E, D, _) {
            var A = [],
            I = -1,
            G = F.length,
            $,
            C,
            B;
            D !== "*" && (B = D.toUpperCase());
            while (++I < G) {
                $ = F[I][H];
                C = 0;
                while ($ && (!_ || C < _)) {
                    if (1 === $.nodeType) { ($.nodeName.toUpperCase() === B || !B) && A.push($);
                        C++
                    }
                    $ = $[E]
                }
            }
            return A
        },
        checkElemPosition: function(G, H, J, A) {
            var $ = [];
            if (!isNaN(H)) {
                var C = G.length,
                D = -1,
                _ = {},
                B,
                E,
                I,
                F;
                while (++D < C) {
                    B = G[D].parentNode;
                    E = this.generateId(B);
                    if (f === _[E]) {
                        I = 0;
                        F = B[J];
                        while (F) {
                            1 === F.nodeType && I++;
                            if (I < H) F = F[A];
                            else break
                        }
                        _[E] = F || 0
                    } else F = _[E];
                    G[D] === F && $.push(G[D])
                }
            }
            return $
        },
        getElemsByPosition: function(A, C, _) {
            var D = C,
            B = A.length,
            $ = [];
            while (D >= 0 && D < B) {
                $.push(A[D]);
                D += _
            }
            return $
        },
        getElemsByAttribute: function(B, D) {
            var _ = [],
            $,
            E = 0,
            A = this.attrOperators[D[1] || ""],
            C = "~=" === D[1] ? " " + D[2] + " ": D[2];
            if (A) while ($ = B[E++]) A(this.getAttribute($, D[0]), C) && _.push($);
            return _
        },
        operators: {
            "#": function(_, $) {
                return s.getElemsByAttribute(_, ["id", "=", $])
            },
            " ": function(A, _) {
                var B = A.length;
                if (1 === B) return A[0].getElementsByTagName(_);
                else {
                    var $ = [],
                    C = -1;
                    while (++C < B) T.util.merge($, A[C].getElementsByTagName(_));
                    return $
                }
            },
            ".": function($, _) {
                return s.getElemsByAttribute($, ["class", "~=", _])
            },
            ">": function(_, $) {
                return s.getElemsByTagName(_, "firstChild", "nextSibling", $)
            },
            "+": function(_, $) {
                return s.getElemsByTagName(_, "nextSibling", "nextSibling", $, 1)
            },
            "~": function(_, $) {
                return s.getElemsByTagName(_, "nextSibling", "nextSibling", $)
            },
            "[]": function($, _) {
                _ = s.tempAttrs[_];
                if (_) {
                    if (s.ISINT.test(_[2])) _[2] = s.tempAttrValues[_[2]];
                    return s.getElemsByAttribute($, _)
                } else return $
            },
            ":": function(_, A) {
                var $;
                if (s.PSEUDOSEQ.test(A)) {
                    $ = parseInt(RegExp.$1);
                    A = RegExp.leftContext
                }
                return s.pseOperators[A] ? s.pseOperators[A](_, $) : []
            }
        },
        attrOperators: {
            "": function($) {
                return $ !== ""
            },
            "=": function(_, $) {
                return $ === _
            },
            "~=": function(_, $) {
                return (" " + _ + " ").indexOf($) >= 0
            },
            "!=": function(_, $) {
                return $ !== _
            },
            "^=": function(_, $) {
                return _.indexOf($) === 0
            },
            "$=": function(_, $) {
                return _.substr(_.length - $.length) === $
            },
            "*=": function(_, $) {
                return _.indexOf($) >= 0
            }
        },
        pseOperators: {
            "first-child": function($) {
                return s.checkElemPosition($, 1, "firstChild", "nextSibling")
            },
            "nth-child": function(_, $) {
                return s.checkElemPosition(_, $, "firstChild", "nextSibling")
            },
            "last-child": function($) {
                return s.checkElemPosition($, 1, "lastChild", "previousSibling")
            },
            "nth-last-child": function(_, $) {
                return s.checkElemPosition(_, $, "lastChild", "previousSibling")
            },
            "odd": function($) {
                return s.getElemsByPosition($, 0, 2)
            },
            "even": function($) {
                return s.getElemsByPosition($, 1, 2)
            },
            "lt": function(_, $) {
                return s.getElemsByPosition(_, $ - 1, -1)
            },
            "gt": function(_, $) {
                return s.getElemsByPosition(_, $ + 1, 1)
            }
        }
    };
    T.element = {
        get: function($) {
            return this.nodeType === f ? this[$] : (0 == $ ? this: f)
        },
        $: function($) {
            return T("number" === typeof $ ? this.get($) : $, this)
        },
        hasClass: function($) {
            return T.style.hasClass(this, $)
        },
        addCss: function($) {
            return T.style.addCss(this, $)
        },
        removeCss: function($) {
            return T.style.removeCss(this, $)
        },
        addEvent: function(_, A, $) {
            return T.event.addEvent(this, _, A, $)
        },
        removeEvent: function($, _) {
            return T.event.removeEvent(this, $, _)
        },
        attr: function(A, B) {
            var _ = this;
            A = s.attrMap[A] || A;
            if (B !== f) return T.dom.eachNode(_, 
            function($, _) {
                this[$] = T.util.isFunction(_) ? _.call(this) : _
            },
            arguments);
            else {
                var $ = this.get(0);
                return $ ? $[A] : f
            }
        },
        each: function($) {
            return T.dom.eachNode(this, $)
        }
    };
    T.element[_] = T.element.$;
    R.addEvent = c.addEvent = T.element.addEvent;
    R.removeEvent = c.removeEvent = T.element.removeEvent;
    var W = {},
    r = Array.prototype.slice,
    S = Object.prototype.toString;
    T.util = {
        isArray: function($) {
            return S.call($) === "[object Array]"
        },
        isFunction: function($) {
            return S.call($) === "[object Function]"
        },
        toArray: function($) {
            if (T.util.isArray($)) return $;
            var A;
            try {
                A = r.call($)
            } catch(_) {
                A = [];
                var B = $.length;
                while (B) A[--B] = $[B]
            }
            return A
        },
        merge: function(_, $) {
            var B = $.length,
            A = _.length;
            while (--B >= 0) _[A + B] = $[B];
            return _
        },
        parseTpl: function(A, $, _) {
            if (null == A) return;
            if (null == $) return A;
            var B = W[A];
            if (!B) {
                B = new Function("obj", "var _=[];with(obj){_.push('" + A.replace(/[\r\t\n]/g, " ").replace(/'(?=[^#]*#>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<#=(.+?)#>/g, "',$1,'").split("<#").join("');").split("#>").join("_.push('") + "');}return _.join('');");
                _ !== false && (W[A] = B)
            }
            return B($)
        },
        extend: function($, A) {
            for (var _ in A) $[_] = A[_];
            return $
        },
        each: function(A, _, $) {
            var D = -1,
            B = A.length,
            C = B === f || T.util.isFunction(A);
            if ($) {
                if (C) {
                    for (D in A) if (false === _.apply(A[D], $)) break
                } else while (++D < B) if (false === _.apply(A[D], $)) break
            } else if (C) {
                for (D in A) if (false === _.call(A[D], D, A[D])) break
            } else while (++D < B) if (false === _.call(A[D], D, A[D])) break;
            return A
        }
    };
    T.parseTpl = T.util.parseTpl;
    T.each = T.util.each;
    var V = [],
    C,
    $;
    if (c.addEventListener) $ = function() {
        c.removeEventListener("DOMContentLoaded", $, false);
        j()
    };
    else if (c.attachEvent) $ = function() {
        if ("complete" === c.readyState) {
            c.detachEvent("onreadystatechange", $);
            j()
        }
    };
    function X() {
        if (T.dom.isReady) return;
        try {
            c.documentElement.doScroll("left")
        } catch($) {
            setTimeout(X, 1);
            return
        }
        j()
    }
    function j() {
        if (!T.dom.isReady) {
            if (!c.body) return setTimeout(j, 13);
            T.dom.isReady = true;
            if (V) {
                var _ = -1,
                $ = V.length;
                while (++_ < $) V[_].call(c, T);
                V = null
            }
        }
    }
    function Q() {
        if (C) return;
        if ("complete" === c.readyState) return j();
        if (c.addEventListener) {
            c.addEventListener("DOMContentLoaded", j, false);
            R.addEventListener("load", j, false)
        } else if (c.attachEvent) {
            c.attachEvent("onreadystatechange", j);
            R.attachEvent("onload", j);
            var _;

            try {
                _ = R.frameElement == null
            } catch($) {}
            c.documentElement.doScroll && _ && X()
        }
        C = true
    }
    T.dom = {
        wrapByArray: function($) {
            if ($) if ($.nodeType !== f || $.setInterval) return [$];
            else if ($.length) return T.util.toArray($);
            return []
        },
        eachNode: function(_, A, $) {
            T.each(T.dom.wrapByArray(_), A, $);
            return _
        },
        ready: function($) {
            Q();
            if (T.dom.isReady) $.call(c, T);
            else V.push($);
            return this
        }
    };
    T.ready = T.dom.ready;
    var k = /\s*([:;])\s*/g,
    a = /[^:;]+?(?=:)/g,
    J = /[^:;]+/g,
    d = /[^\s]+/g,
    E = /-([a-z])/gi,
    Z = O.style.styleFloat !== f ? "styleFloat": "cssFloat",
    o = /^float$/i;
    function u($, B, _) {
        if (this.className) {
            var A = " " + this.className + " ",
            C = -1;
            while (++C < B) - 1 === A.indexOf(" " + $[C] + " ") && (A += ($[C] + " "));
            this.className = A.trim()
        } else this.className = _
    }
    function h($, B, _) {
        switch (this.className) {
        case _:
            this.className = "";
            break;
        case "":
            return;
            break;
        default:
            var A = " " + this.className + " ",
            C = -1;
            while (++C < B) A = A.replace(" " + $[C] + " ", " ");
            this.className = A.trim();
            break
        }
    }
    function t(A, _) {
        if ("" === this.style.cssText && "string" === typeof _) this.style.cssText = _;
        else for (var $ in A) this.style[$] !== f && (this.style[$] = A[$])
    }
    function m(_) {
        for (var $ in _) this.style[$] !== f && (this.style[$] = "")
    }
    T.style = {
        fixStyleName: function($) {
            return o.test($) ? Z: $.replace(E, 
            function(_, $) {
                return $.toUpperCase()
            })
        },
        hasClass: function(_, $) {
            _ = T.dom.wrapByArray(_);
            var A = _.length;
            if (A > 0) {
                $ = " " + $ + " ";
                while (--A >= 0) if ((" " + _[A].className + " ").indexOf($) >= 0) return true
            }
            return false
        },
        parse: function(C) {
            if ("string" === typeof C) {
                var B = C.indexOf(";") >= 0,
                _ = C.indexOf(":") >= 0,
                $;
                if (B || _) {
                    $ = {};
                    C = C.trim().replace(k, "$1").replace(_ ? a: J, T.style.fixStyleName).match(J);
                    var A = C.length,
                    D = 0;
                    if (_) {
                        if (A % 2 !== 0) throw "invalid inline style";
                        while (D < A) $[C[D++]] = C[D++]
                    } else while (D < A) $[C[D++]] = ""
                } else $ = C.match(d) || [];
                return $
            }
            return C
        },
        addCss: function(_, A) {
            var $ = T.style.parse(A);
            if (T.util.isArray($)) T.dom.eachNode(_, u, [$, $.length, A]);
            else T.dom.eachNode(_, t, [$, A]);
            return _
        },
        removeCss: function(_, A) {
            var $ = T.style.parse(A);
            if (T.util.isArray($)) T.dom.eachNode(_, h, [$, $.length, A]);
            else T.dom.eachNode(_, m, [$]);
            return _
        },
        getCurrentStyle: function(A, _, $) {
            if (!A) return f; ! A.nodeType && (A = A[0]);
            _ = T.style.fixStyleName(_);
            return A.style[_] || ((A.currentStyle || ($ || R).getComputedStyle(A, null))[_])
        }
    };
    function n(A, B, _) {
        var $ = this;
        B = T.event.delegate($, A, B, _);
        if ($.attachEvent) $.attachEvent("on" + A, B);
        else if ($.addEventListener) $.addEventListener(A, B, false)
    }
    function g(_, A) {
        var $ = this;
        A = T.event.getDelegate($, _, A);
        if ($.detachEvent) $.detachEvent("on" + _, A);
        else if ($.removeEventListener) $.removeEventListener(_, A, false)
    }
    var H = /\s*,\s*/,
    D = 0;
    T.event = {
        idName: _ + "EventId",
        eventSpace: _ + "Events",
        addEvent: function(_, A, C, $) {
            A = A.split(H);
            var B = A.length;
            while (--B >= 0) T.dom.eachNode(_, n, [A[B], C, $]);
            return _
        },
        removeEvent: function($, _, B) {
            _ = _.split(H);
            var A = _.length;
            while (--A >= 0) T.dom.eachNode($, g, [_[A], B]);
            return $
        },
        delegate: function(_, E, G, C) {
            var A = T.event,
            B = _[A.eventSpace] = _[A.eventSpace] || {},
            $ = G[A.idName] = G[A.idName] || ++D;
            B[E] = B[E] || {};
            var F = B[E][$];
            if (!F) {
                F = function($) {
                    $ = A.fix($);
                    var B = G.call(_, $, C);
                    false === B && $.preventDefault();
                    return B
                };
                B[E][$] = F
            }
            return F
        },
        getDelegate: function($, B, C) {
            var A = T.event;
            try {
                return $[A.eventSpace][B][C[A.idName]]
            } catch(_) {}
            return C
        },
        fix: function(_) { ! _.target && (_.target = _.srcElement || c);
            3 == _.target.nodeType && (_.target = _.target.parentNode);
            null == _.timeStamp && (_.timeStamp = Date.now());
            _.preventDefault = _.preventDefault || 
            function() {
                this.returnValue = false
            };
            _.stopPropagation = _.stopPropagation || 
            function() {
                this.cancelBubble = true
            };
            if (f === _.pageX && f !== _.clientX) {
                var A = c.documentElement,
                $ = c.body;
                _.pageX = _.clientX + (A.scrollLeft || $.scrollLeft || 0) - (A.clientLeft || 0);
                _.pageY = _.clientY + (A.scrollTop || $.scrollTop || 0) - (A.clientTop || 0)
            }
            if (!_.which && ((_.charCode || _.charCode === 0) ? _.charCode: _.keyCode)) _.which = _.charCode || _.keyCode;
            if (!_.which && _.button !== f) _.which = (_.button & 1 ? 1: (_.button & 2 ? 3: (_.button & 4 ? 2: 0)));
            return _
        }
    };
    var q = R.navigator.userAgent.toLowerCase(),
    i = /(webkit)[ \/]([\w.]+)/.exec(q) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(q) || /(msie) ([\w.]+)/.exec(q) || !/compatible/.test(q) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(R.navigator.userAgent.toLowerCase());
    T.browser = {};
    if (i) {
        T.browser[i[1] || ""] = true;
        T.browser.version = i[2] || "0"
    }
    T.ajax = {
        createXhr: function() {
            var _;
            try {
                _ = R.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest()
            } catch($) {}
            if (!_) throw "failed to create XMLHttpRequest object";
            return _
        },
        send: function(G, C, B, H, A) {
            A = A || T.ajax.createXhr();
            var E;
            "string" === typeof C && (C = C.toUpperCase());
            C = C !== "GET" && C !== "POST" ? "GET": C;
            H = H || {};
            H.async = "boolean" === typeof H.async ? H.async: true;
            var _;
            if (B) {
                _ = [];
                for (var $ in B) B[$] != null && _.push($ + "=" + encodeURIComponent(B[$]));
                _ = _.join("&").replace(/%20/g, "+");
                if ("GET" === C) {
                    G += ("?" + _);
                    _ = f
                }
            }
            H.async && !isNaN(H.timeout) && H.timeout > 0 && setTimeout(function() {
                if (!E) {
                    A.abort();
                    H.onTimeout && H.onTimeout(A)
                }
            },
            H.timeout);
            A.onreadystatechange = function() {
                if (4 == A.readyState) {
                    E = true;
                    var $ = 200 == A.status ? "onSuccess": "onError";
                    H[$] && H[$](A)
                }
            };
            A.open(C, G, H.async, H.username, H.password);
            var D = [];
            "POST" === C && D.push("application/x-www-form-urlencoded");
            A.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            if (H.headers) for (var F in H.headers) if ("content-type" === F.toLowerCase()) D.push(H.headers[F]);
            else A.setRequestHeader(F, H.headers[F]);
            D.length && A.setRequestHeader("Content-Type", D.join(";").replace(/;+/g, ";").replace(/;$/, ""));
            A.send(_);
            return A
        },
        importJs: function(C, $, A, _) {
            _ = _ || c;
            var B = _.createElement("script");
            B.language = "javascript";
            B.type = "text/javascript";
            A && (B.charset = A);
            B.onload = B.onreadystatechange = function() {
                if (!B.readyState || "loaded" == B.readyState || "complete" == B.readyState) {
                    $ && $();
                    B.onload = B.onreadystatechange = null;
                    B.parentNode.removeChild(B)
                }
            };
            B.src = C;
            T.one("head", _).appendChild(B)
        }
    };
    var v = /[smhdMy]$/,
    K = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 24 * 60 * 60,
        M: 30 * 24 * 60 * 60,
        y: 365 * 24 * 60 * 60
    };
    T.cookie = {
        encoder: R.encodeURIComponent,
        decoder: R.decodeURIComponent,
        get: function(B, D) {
            var _ = T.cookie;
            B = _.encoder(B) + "=";
            var $ = c.cookie,
            A = $.indexOf(B),
            C;
            if ( - 1 === A) return D ? f: "";
            A += B.length;
            C = $.indexOf(";", A);
            if (C === -1) C = $.length;
            return _.decoder($.substring(A, C))
        },
        set: function(C, G, A, F, E, D) {
            var _ = T.cookie,
            B = [_.encoder(C) + "=" + _.encoder(G)];
            if (A) {
                var H,
                $;
                if ("[object Date]" === S.call(A)) H = A;
                else {
                    if ("string" === typeof A && v.test(A)) {
                        A = A.substring(0, A.length - 1);
                        $ = RegExp.lastMatch
                    }
                    if (!isNaN(A)) {
                        H = new Date();
                        H.setTime(H.getTime() + A * K[$ || "m"] * 1000)
                    }
                }
                H && B.push("expires=" + H.toUTCString())
            }
            E && B.push("path=" + E);
            F && B.push("domain=" + F);
            D && B.push("secure");
            c.cookie = B.join(";")
        },
        del: function($, A, _) {
            c.cookie = T.cookie.encoder($) + "=" + (_ ? ";path=" + _: "") + (A ? ";domain=" + A: "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT"
        }
    };
    var N = /^\s+|\s+$/g; ! String.prototype.trim && (String.prototype.trim = function() {
        return this.replace(N, "")
    });
    String.prototype.left = function($) {
        return this.substr(0, $)
    };
    String.prototype.right = function($) {
        return this.slice( - $)
    };
    String.format = function($) {
        var _ = arguments,
        A = new RegExp("%([1-" + _.length + "])", "g");
        return String($).replace(A, 
        function(A, $) {
            return _[$]
        })
    };
    Function.prototype.bind = function() {
        if (!arguments.length) return this;
        var _ = this,
        $ = r.call(arguments),
        A = $.shift();
        return function() {
            return _.apply(A, $.concat(r.call(arguments)))
        }
    }; ! Array.prototype.indexOf && (Array.prototype.indexOf = function(A, _) {
        var $ = this.length,
        _ = Number(_) || 0;
        _ = _ < 0 ? Math.ceil(_) : Math.floor(_);
        _ < 0 && (_ += $);
        for (; _ < $; _++) if (this[_] === A) return _;
        return - 1
    });
    Array.prototype.remove = function($) {
        $ >= 0 && this.splice($, 1);
        return this
    };
    function B($) {
        return $ < 10 ? "0" + $: $
    }
    var U,
    F,
    p,
    P,
    Y,
    G;
    function l($) {
        switch ($) {
        case "yyyy":
            return U;
        case "yy":
            return U.toString().slice( - 2);
        case "MM":
            return B(F);
        case "M":
            return F;
        case "dd":
            return B(p);
        case "d":
            return p;
        case "HH":
            return B(P);
        case "H":
            return P;
        case "hh":
            return B(P > 12 ? P - 12: P);
        case "h":
            return P > 12 ? P - 12: P;
        case "mm":
            return B(Y);
        case "m":
            return Y;
        case "ss":
            return B(G);
        case "s":
            return G;
        default:
            return $
        }
    }
    Date.now = Date.now || 
    function() {
        return + new Date
    };
    Date.prototype.format = function($) {
        U = this.getFullYear();
        F = this.getMonth() + 1;
        p = this.getDate();
        P = this.getHours();
        Y = this.getMinutes();
        G = this.getSeconds();
        return $.replace(/y+|m+|d+|h+|s+|H+|M+/g, l)
    };
    O = null;
    T.ui = {};
    function e(_, $) {
        return (_ + 1) % $
    }
    function I(_, $) {
        return _ <= 0 ? $ - 1: (_ - 1) % $
    }
    T.ui.Slide = function(_, B, G, E, A, F) {
        if (!arguments.length) return;
        var $ = this;
        $.total = B.length;
        if (_ && $.total !== _.length) throw "can not match ctrls(" + _.length + ") and contents(" + $.total + ")";
        $.constructor = arguments.callee;
        $._curIndex = -1;
        $._ctrls = _;
        $._contents = B;
        $._css = G;
        $._eventName = E;
        $.interval = A;
        $.playMode = e;
        $.rollbackMode = I;
        $.delay = F;
        if ($._ctrls && $._ctrls.length && $._eventName) {
            var D,
            C;
            if (F) {
                D = function(_, $) { ! this._delayTimer && (this._delayTimer = setTimeout(this.show.bind(this, $), this.delay));
                    _.preventDefault()
                }.bind($);
                C = function() {
                    if (this._delayTimer) {
                        clearTimeout(this._delayTimer);
                        delete this._delayTimer
                    }
                }.bind($)
            } else D = function(_, $) {
                this.show($);
                _.preventDefault()
            }.bind($);
            for (var H = $.total - 1; H >= 0; H--) {
                T.event.addEvent($._ctrls[H], E, D, new Number(H));
                C && T.event.addEvent($._ctrls[H], "mouseout", C)
            }
        }
        $.interval && $.play()
    };
    T.ui.Slide.prototype = {
        show: function(_) {
            var A = this;
            _ = _ < 0 ? 0: _ >= A.total ? A.total - 1: _;
            var B = A._ctrls ? A._ctrls[_] : null,
            $ = A._contents[_];
            if ( - 1 === A._curIndex) A._curIndex = 0;
            T.style.removeCss(A._ctrls, A._css);
            T.style.removeCss(A._contents, A._css);
            T.style.addCss(B, A._css);
            T.style.addCss($, A._css);
            A.onShow && A.onShow(_, B, $);
            A._curIndex = _
        },
        showNext: function() {
            this.show(this.playMode(this._curIndex, this.total))
        },
        showPrevious: function() {
            this.show(this.rollbackMode(this._curIndex, this.total))
        },
        play: function(A) {
            var _ = this;
            if (!isNaN(A)) _.interval = parseInt(A);
            if (!_._playTimer) {
                if (!_._hasEvent) {
                    var $ = _.pause.bind(_),
                    B = _.play.bind(_);
                    T.event.addEvent(_._ctrls, "mouseover", $);
                    T.event.addEvent(_._ctrls, "mouseout", B);
                    T.event.addEvent(_._contents, "mouseover", $);
                    T.event.addEvent(_._contents, "mouseout", B);
                    _._hasEvent = 1
                }
                _._playTimer = setInterval(_.showNext.bind(_), _.interval)
            }
        },
        pause: function() {
            var _ = this;
            if (_._playTimer) {
                clearInterval(_._playTimer);
                delete _._playTimer;
                if (_.onStop) {
                    var $ = _._curIndex;
                    _.onStop($, _._ctrls[$], _._contents[$])
                }
            }
        }
    }
})(window)