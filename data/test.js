get-course-current-of-user(function ($Object) {
    'use strict';
    !function (e) {
        var t = {};

        function n(r) {
            if (t[r]) return t[r].exports;
            var i = t[r] = {i: r, l: !1, exports: {}};
            return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
        }

        n.m = e, n.c = t, n.d = function (e, t, r) {
            n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: r})
        }, n.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
        }, n.t = function (e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e) for (var i in e) n.d(r, i, function (t) {
                return e[t]
            }.bind(null, i));
            return r
        }, n.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return n.d(t, "a", t), t
        }, n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.p = "", n(n.s = 1)
    }([function (e, t, n) {
        "use strict";
        var r, i = "object" == typeof Reflect ? Reflect : null,
            o = i && "function" == typeof i.apply ? i.apply : function (e, t, n) {
                return Function.prototype.apply.call(e, t, n)
            };
        r = i && "function" == typeof i.ownKeys ? i.ownKeys : Object.getOwnPropertySymbols ? function (e) {
            return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
        } : function (e) {
            return Object.getOwnPropertyNames(e)
        };
        var s = Number.isNaN || function (e) {
            return e != e
        };

        function u() {
            u.init.call(this)
        }

        e.exports = u, e.exports.once = function (e, t) {
            return new Promise((function (n, r) {
                function i(n) {
                    e.removeListener(t, o), r(n)
                }

                function o() {
                    "function" == typeof e.removeListener && e.removeListener("error", i), n([].slice.call(arguments))
                }

                m(e, t, o, {once: !0}), "error" !== t && function (e, t, n) {
                    "function" == typeof e.on && m(e, "error", t, n)
                }(e, i, {once: !0})
            }))
        }, u.EventEmitter = u, u.prototype._events = void 0, u.prototype._eventsCount = 0, u.prototype._maxListeners = void 0;
        var f = 10;

        function c(e) {
            if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
        }

        function l(e) {
            return void 0 === e._maxListeners ? u.defaultMaxListeners : e._maxListeners
        }

        function a(e, t, n, r) {
            var i, o, s, u;
            if (c(n), void 0 === (o = e._events) ? (o = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== o.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), o = e._events), s = o[t]), void 0 === s) s = o[t] = n, ++e._eventsCount; else if ("function" == typeof s ? s = o[t] = r ? [n, s] : [s, n] : r ? s.unshift(n) : s.push(n), (i = l(e)) > 0 && s.length > i && !s.warned) {
                s.warned = !0;
                var f = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                f.name = "MaxListenersExceededWarning", f.emitter = e, f.type = t, f.count = s.length, u = f, console && console.warn && console.warn(u)
            }
            return e
        }

        function v() {
            if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
        }

        function p(e, t, n) {
            var r = {fired: !1, wrapFn: void 0, target: e, type: t, listener: n}, i = v.bind(r);
            return i.listener = n, r.wrapFn = i, i
        }

        function h(e, t, n) {
            var r = e._events;
            if (void 0 === r) return [];
            var i = r[t];
            return void 0 === i ? [] : "function" == typeof i ? n ? [i.listener || i] : [i] : n ? function (e) {
                for (var t = new Array(e.length), n = 0; n < t.length; ++n) t[n] = e[n].listener || e[n];
                return t
            }(i) : y(i, i.length)
        }

        function d(e) {
            var t = this._events;
            if (void 0 !== t) {
                var n = t[e];
                if ("function" == typeof n) return 1;
                if (void 0 !== n) return n.length
            }
            return 0
        }

        function y(e, t) {
            for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
            return n
        }

        function m(e, t, n, r) {
            if ("function" == typeof e.on) r.once ? e.once(t, n) : e.on(t, n); else {
                if ("function" != typeof e.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
                e.addEventListener(t, (function i(o) {
                    r.once && e.removeEventListener(t, i), n(o)
                }))
            }
        }

        Object.defineProperty(u, "defaultMaxListeners", {
            enumerable: !0, get: function () {
                return f
            }, set: function (e) {
                if ("number" != typeof e || e < 0 || s(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
                f = e
            }
        }), u.init = function () {
            void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
        }, u.prototype.setMaxListeners = function (e) {
            if ("number" != typeof e || e < 0 || s(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
            return this._maxListeners = e, this
        }, u.prototype.getMaxListeners = function () {
            return l(this)
        }, u.prototype.emit = function (e) {
            for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
            var r = "error" === e, i = this._events;
            if (void 0 !== i) r = r && void 0 === i.error; else if (!r) return !1;
            if (r) {
                var s;
                if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
                var u = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
                throw u.context = s, u
            }
            var f = i[e];
            if (void 0 === f) return !1;
            if ("function" == typeof f) o(f, this, t); else {
                var c = f.length, l = y(f, c);
                for (n = 0; n < c; ++n) o(l[n], this, t)
            }
            return !0
        }, u.prototype.addListener = function (e, t) {
            return a(this, e, t, !1)
        }, u.prototype.on = u.prototype.addListener, u.prototype.prependListener = function (e, t) {
            return a(this, e, t, !0)
        }, u.prototype.once = function (e, t) {
            return c(t), this.on(e, p(this, e, t)), this
        }, u.prototype.prependOnceListener = function (e, t) {
            return c(t), this.prependListener(e, p(this, e, t)), this
        }, u.prototype.removeListener = function (e, t) {
            var n, r, i, o, s;
            if (c(t), void 0 === (r = this._events)) return this;
            if (void 0 === (n = r[e])) return this;
            if (n === t || n.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete r[e], r.removeListener && this.emit("removeListener", e, n.listener || t)); else if ("function" != typeof n) {
                for (i = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
                    s = n[o].listener, i = o;
                    break
                }
                if (i < 0) return this;
                0 === i ? n.shift() : function (e, t) {
                    for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                    e.pop()
                }(n, i), 1 === n.length && (r[e] = n[0]), void 0 !== r.removeListener && this.emit("removeListener", e, s || t)
            }
            return this
        }, u.prototype.off = u.prototype.removeListener, u.prototype.removeAllListeners = function (e) {
            var t, n, r;
            if (void 0 === (n = this._events)) return this;
            if (void 0 === n.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== n[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[e]), this;
            if (0 === arguments.length) {
                var i, o = Object.keys(n);
                for (r = 0; r < o.length; ++r) "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
                return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this
            }
            if ("function" == typeof (t = n[e])) this.removeListener(e, t); else if (void 0 !== t) for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
            return this
        }, u.prototype.listeners = function (e) {
            return h(this, e, !0)
        }, u.prototype.rawListeners = function (e) {
            return h(this, e, !1)
        }, u.listenerCount = function (e, t) {
            return "function" == typeof e.listenerCount ? e.listenerCount(t) : d.call(e, t)
        }, u.prototype.listenerCount = d, u.prototype.eventNames = function () {
            return this._eventsCount > 0 ? r(this._events) : []
        }
    }, function (e, t, n) {
        !function () {
            if (!window.ethereum) return;
            var e = new (n(0));
            $Object.defineProperties(window.ethereum, {
                on: {value: e.on, writable: !1},
                emit: {value: e.emit, writable: !1},
                removeListener: {value: e.removeListener, writable: !1},
                removeAllListeners: {value: e.removeAllListeners, writable: !1}
            });
            var t = !1, r = () => {
                t || (console.warn("You are accessing the window.web3 shim. This object is deprecated, please use window.ethereum instead."), t = !0)
            };
            const i = {__isMetaMaskShim__: !0, currentProvider: window.ethereum},
                o = new Proxy(i, {get: (...e) => (r(), Reflect.get(...e)), set: (...e) => (r(), Reflect.set(...e))});
            $Object.defineProperty(window, "web3", {value: o, enumerable: !1, configurable: !0, writable: !0})
        }()
    }]);
})