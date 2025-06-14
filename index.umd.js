// TypeIt by Alex MacArthur - https://typeitjs.com
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).TypeIt = t()
}(this, (function() {
    "use strict";
    const e = e => Array.isArray(e)
      , t = t => e(t) ? t : [t];
    const n = e => Array.from(e)
      , r = e => document.createTextNode(e);
    let i = e => ([...e.childNodes].forEach((e => {
        if (e.nodeValue)
            return [...e.nodeValue].forEach((t => {
                e.parentNode.insertBefore(r(t), e)
            }
            )),
            void e.remove();
        i(e)
    }
    )),
    e);
    const a = e => {
        let t = document.implementation.createHTMLDocument();
        return t.body.innerHTML = e,
        i(t.body)
    }
      , o = "ti-cursor"
      , s = {
        started: !1,
        completed: !1,
        frozen: !1,
        destroyed: !1
    }
      , l = {
        breakLines: !0,
        cursor: {
            autoPause: !0,
            autoPauseDelay: 500,
            animation: {
                frames: [0, 0, 1].map((e => ({
                    opacity: e
                }))),
                options: {
                    iterations: 1 / 0,
                    easing: "steps(2, start)",
                    fill: "forwards"
                }
            }
        },
        cursorChar: "|",
        cursorSpeed: 1e3,
        deleteSpeed: null,
        html: !0,
        lifeLike: !0,
        loop: !1,
        loopDelay: 750,
        nextStringDelay: 750,
        speed: 100,
        startDelay: 250,
        startDelete: !1,
        strings: [],
        waitUntilVisible: !1,
        beforeString: () => {}
        ,
        afterString: () => {}
        ,
        beforeStep: () => {}
        ,
        afterStep: () => {}
        ,
        afterComplete: () => {}
    };
    function u(e, t=!1, n=!1) {
        let r, i = e.querySelector(".ti-cursor"), a = document.createTreeWalker(e, NodeFilter.SHOW_ALL, {
            acceptNode: e => {
                if (i && n) {
                    if (e.classList?.contains(o))
                        return NodeFilter.FILTER_ACCEPT;
                    if (i.contains(e))
                        return NodeFilter.FILTER_REJECT
                }
                return e.classList?.contains(o) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
            }
        }), s = [];
        for (; r = a.nextNode(); )
            r.originalParent || (r.originalParent = r.parentNode),
            s.push(r);
        return t ? s.reverse() : s
    }
    function c(e, t=!0) {
        return t ? u(a(e)) : n(e).map(r)
    }
    const d = e => document.createElement(e)
      , f = (e, t="") => {
        let n = d("style");
        n.id = t,
        n.appendChild(r(e)),
        document.head.appendChild(n)
    }
      , h = t => (e(t) || (t = [t / 2, t / 2]),
    t)
      , y = (e, t) => Math.abs(Math.random() * (e + t - (e - t)) + (e - t));
    let p = e => e / 2;
    const m = e => "value"in e;
    let g = e => "function" == typeof e ? e() : e;
    const b = e => Number.isInteger(e);
    let w = (e, t=document, n=!1) => t["querySelector" + (n ? "All" : "")](e);
    const T = (e, t) => Object.assign({}, e, t);
    let v = {
        "font-family": "",
        "font-weight": "",
        "font-size": "",
        "font-style": "",
        "line-height": "",
        color: "",
        transform: "translateX(-.125em)"
    };
    const E = (e, t) => new Array(t).fill(e)
      , P = ({queueItems: e, selector: t, cursorPosition: n, to: r}) => {
        if (b(t))
            return -1 * t;
        let i = new RegExp("END","i").test(r)
          , a = t ? [...e].reverse().findIndex(( ({char: e}) => {
            let n = e.parentElement
              , r = n.matches(t);
            return !(!i || !r) || r && n.firstChild.isSameNode(e)
        }
        )) : -1;
        return a < 0 && (a = i ? 0 : e.length - 1),
        a - n + (i ? 0 : 1)
    }
    ;
    let S = e => new Promise((t => {
        requestAnimationFrame((async () => {
            t(await e())
        }
        ))
    }
    ))
      , N = e => e?.getAnimations().find((t => t.id === e.dataset.tiAnimationId))
      , L = ({cursor: e, frames: t, options: n}) => {
        let r = e.animate(t, n);
        return r.pause(),
        r.id = e.dataset.tiAnimationId,
        S(( () => {
            S(( () => {
                r.play()
            }
            ))
        }
        )),
        r
    }
      , C = e => e.func?.call(null)
      , D = async ({index: e, queueItems: t, wait: n, cursor: r, cursorOptions: i}) => {
        let a = t[e][1]
          , o = []
          , s = e
          , l = a
          , u = () => l && !l.delay
          , c = a.shouldPauseCursor() && i.autoPause;
        for (; u(); )
            o.push(l),
            u() && s++,
            l = t[s] ? t[s][1] : null;
        if (o.length)
            return await S((async () => {
                for (let e of o)
                    await C(e)
            }
            )),
            s - 1;
        let d, f = N(r);
        return f && (d = {
            ...f.effect.getComputedTiming(),
            delay: c ? i.autoPauseDelay : 0
        }),
        await n((async () => {
            f && c && f.cancel(),
            await S(( () => {
                C(a)
            }
            ))
        }
        ), a.delay),
        await ( ({cursor: e, options: t, cursorOptions: n}) => {
            if (!e || !n)
                return;
            let r, i = N(e);
            i && (t.delay = i.effect.getComputedTiming().delay,
            r = i.currentTime,
            i.cancel());
            let a = L({
                cursor: e,
                frames: n.animation.frames,
                options: t
            });
            return r && (a.currentTime = r),
            a
        }
        )({
            cursor: r,
            options: d,
            cursorOptions: i
        }),
        e
    }
    ;
    return function(e, r={}) {
        let S = async (e, t, n=!1) => {
            X.frozen && await new Promise((e => {
                this.unfreeze = () => {
                    X.frozen = !1,
                    e()
                }
            }
            )),
            n || await G.beforeStep(this),
            await ( (e, t, n) => new Promise((r => {
                n.push(setTimeout((async () => {
                    await e(),
                    r()
                }
                ), t || 0))
            }
            )))(e, t, J),
            n || await G.afterStep(this)
        }
          , N = (e, t) => D({
            index: e,
            queueItems: t,
            wait: S,
            cursor: ee,
            cursorOptions: G.cursor
        })
          , C = e => ( (e, t) => {
            if (!e)
                return;
            let n = e.parentNode;
            (n.childNodes.length > 1 || n.isSameNode(t) ? e : n).remove()
        }
        )(e, V)
          , I = () => m(V)
          , M = (e=0) => function(e) {
            let {speed: t, deleteSpeed: n, lifeLike: r} = e;
            return n = null !== n ? n : t / 3,
            r ? [y(t, p(t)), y(n, p(n))] : [t, n]
        }(G)[e]
          , x = () => (e => m(e) ? n(e.value) : u(e, !0).filter((e => !(e.childNodes.length > 0))))(V)
          , A = (e, t) => (Y.add(e),
        ( (e={}) => {
            let t = e.delay;
            t && Y.add({
                delay: t
            })
        }
        )(t),
        this)
          , H = () => W ?? U
          , O = (e={}) => [{
            func: () => B(e)
        }, {
            func: () => B(G)
        }]
          , F = e => {
            let t = G.nextStringDelay;
            Y.add([{
                delay: t[0]
            }, ...e, {
                delay: t[1]
            }])
        }
          , k = async () => {
            if (!I() && ee && V.appendChild(ee),
            Z) {
                ( (e, t) => {
                    let n = `[data-typeit-id='${e}'] .ti-cursor`
                      , r = getComputedStyle(t)
                      , i = Object.entries(v).reduce(( (e, [t,n]) => `${e} ${t}: var(--ti-cursor-${t}, ${n || r[t]});`), "");
                    f(`${n} { display: inline-block; width: 0; ${i} }`, e)
                }
                )(K, V),
                ee.dataset.tiAnimationId = K;
                let {animation: e} = G.cursor
                  , {frames: t, options: n} = e;
                L({
                    frames: t,
                    cursor: ee,
                    options: {
                        duration: G.cursorSpeed,
                        ...n
                    }
                })
            }
        }
          , R = () => {
            let e = G.strings.filter((e => !!e));
            e.forEach(( (t, n) => {
                if (this.type(t),
                n + 1 === e.length)
                    return;
                let r = G.breakLines ? [{
                    func: () => z(d("BR")),
                    typeable: !0
                }] : E({
                    func: j,
                    delay: M(1)
                }, Y.getTypeable().length);
                F(r)
            }
            ))
        }
          , $ = async (e=!0) => {
            X.started = !0;
            let t = t => {
                Y.done(t, !e)
            }
            ;
            try {
                let n = [...Y.getQueue()];
                for (let e = 0; e < n.length; e++) {
                    let[r,i] = n[e];
                    if (!i.done) {
                        if (!i.deletable || i.deletable && x().length) {
                            let r = await N(e, n);
                            Array(r - e).fill(e + 1).map(( (e, t) => e + t)).forEach((e => {
                                let[r] = n[e];
                                t(r)
                            }
                            )),
                            e = r
                        }
                        t(r)
                    }
                }
                if (!e)
                    return this;
                if (X.completed = !0,
                await G.afterComplete(this),
                !G.loop)
                    throw "";
                let r = G.loopDelay;
                S((async () => {
                    await (async e => {
                        let t = H();
                        t && await q({
                            value: t
                        });
                        let n = x().map((e => [Symbol(), {
                            func: j,
                            delay: M(1),
                            deletable: !0,
                            shouldPauseCursor: () => !0
                        }]));
                        for (let r = 0; r < n.length; r++)
                            await N(r, n);
                        Y.reset(),
                        Y.set(0, {
                            delay: e
                        })
                    }
                    )(r[0]),
                    $()
                }
                ), r[1])
            } catch (n) {}
            return this
        }
          , q = async e => {
            var t, n, r;
            t = e,
            n = U,
            r = x(),
            U = Math.min(Math.max(n + t, 0), r.length),
            ( (e, t, n) => {
                let r = t[n - 1]
                  , i = w(".ti-cursor", e);
                (e = r?.parentNode || e).insertBefore(i, r || null)
            }
            )(V, x(), U)
        }
          , z = e => ( (e, t) => {
            if (m(e))
                return void (e.value = `${e.value}${t.textContent}`);
            t.innerHTML = "";
            let n = (r = t.originalParent,
            /body/i.test(r?.tagName) ? e : t.originalParent || e);
            var r;
            n.insertBefore(t, w(".ti-cursor", n) || null)
        }
        )(V, e)
          , B = async e => G = T(G, e)
          , _ = async () => {
            I() ? V.value = "" : x().forEach(C)
        }
          , j = () => {
            let e = x();
            e.length && (I() ? V.value = V.value.slice(0, -1) : C(e[U]))
        }
        ;
        this.break = function(e) {
            return A({
                func: () => z(d("BR")),
                typeable: !0
            }, e)
        }
        ,
        this.delete = function(e=null, t={}) {
            e = g(e);
            let n = O(t)
              , r = e
              , {instant: i, to: a} = t
              , o = Y.getTypeable()
              , s = null === r ? o.length : b(r) ? r : P({
                queueItems: o,
                selector: r,
                cursorPosition: H(),
                to: a
            });
            return A([n[0], ...E({
                func: j,
                delay: i ? 0 : M(1),
                deletable: !0
            }, s), n[1]], t)
        }
        ,
        this.empty = function(e={}) {
            return A({
                func: _
            }, e)
        }
        ,
        this.exec = function(e, t={}) {
            let n = O(t);
            return A([n[0], {
                func: () => e(this)
            }, n[1]], t)
        }
        ,
        this.move = function(e, t={}) {
            e = g(e);
            let n = O(t)
              , {instant: r, to: i} = t
              , a = P({
                queueItems: Y.getTypeable(),
                selector: null === e ? "" : e,
                to: i,
                cursorPosition: H()
            })
              , o = a < 0 ? -1 : 1;
            return W = H() + a,
            A([n[0], ...E({
                func: () => q(o),
                delay: r ? 0 : M(),
                cursorable: !0
            }, Math.abs(a)), n[1]], t)
        }
        ,
        this.options = function(e, t={}) {
            return e = g(e),
            B(e),
            A({}, t)
        }
        ,
        this.pause = function(e, t={}) {
            return A({
                delay: g(e)
            }, t)
        }
        ,
        this.type = function(e, t={}) {
            e = g(e);
            let {instant: n} = t
              , r = O(t)
              , i = c(e, G.html).map((e => {
                return {
                    func: () => z(e),
                    char: e,
                    delay: n || (t = e,
                    /<(.+)>(.*?)<\/(.+)>/.test(t.outerHTML)) ? 0 : M(),
                    typeable: e.nodeType === Node.TEXT_NODE
                };
                var t
            }
            ))
              , a = [r[0], {
                func: async () => await G.beforeString(e, this)
            }, ...i, {
                func: async () => await G.afterString(e, this)
            }, r[1]];
            return A(a, t)
        }
        ,
        this.is = function(e) {
            return X[e]
        }
        ,
        this.destroy = function(e=!0) {
            J.forEach(clearTimeout),
            J = [],
            g(e) && ee && C(ee),
            X.destroyed = !0
        }
        ,
        this.freeze = function() {
            X.frozen = !0
        }
        ,
        this.unfreeze = () => {}
        ,
        this.reset = function(e) {
            !this.is("destroyed") && this.destroy(),
            e ? (Y.wipe(),
            e(this)) : Y.reset(),
            U = 0;
            for (let t in X)
                X[t] = !1;
            return V[I() ? "value" : "innerHTML"] = "",
            this
        }
        ,
        this.go = function() {
            return X.started ? this : (k(),
            G.waitUntilVisible ? (( (e, t) => {
                new IntersectionObserver(( (n, r) => {
                    n.forEach((n => {
                        n.isIntersecting && (t(),
                        r.unobserve(e))
                    }
                    ))
                }
                ),{
                    threshold: 1
                }).observe(e)
            }
            )(V, $.bind(this)),
            this) : ($(),
            this))
        }
        ,
        this.flush = function(e=( () => {}
        )) {
            return k(),
            $(!1).then(e),
            this
        }
        ,
        this.getQueue = () => Y,
        this.getOptions = () => G,
        this.updateOptions = e => B(e),
        this.getElement = () => V;
        let V = "string" == typeof (Q = e) ? w(Q) : Q;
        var Q;
        let J = []
          , U = 0
          , W = null
          , X = T({}, s);
        r.cursor = (e => {
            if ("object" == typeof e) {
                let t = {}
                  , {frames: n, options: r} = l.cursor.animation;
                return t.animation = e.animation || {},
                t.animation.frames = e.animation?.frames || n,
                t.animation.options = T(r, e.animation?.options || {}),
                t.autoPause = e.autoPause ?? l.cursor.autoPause,
                t.autoPauseDelay = e.autoPauseDelay || l.cursor.autoPauseDelay,
                t
            }
            return !0 === e ? l.cursor : e
        }
        )(r.cursor ?? l.cursor);
        let G = T(l, r);
        G = T(G, {
            html: !I() && G.html,
            nextStringDelay: h(G.nextStringDelay),
            loopDelay: h(G.loopDelay)
        });
        let K = Math.random().toString().substring(2, 9)
          , Y = function(e) {
            let n = function(e) {
                return t(e).forEach((e => a.set(Symbol(e.char?.innerText), r({
                    ...e
                })))),
                this
            }
              , r = e => (e.shouldPauseCursor = function() {
                return Boolean(this.typeable || this.cursorable || this.deletable)
            }
            ,
            e)
              , i = () => Array.from(a.values())
              , a = new Map;
            return n(e),
            {
                add: n,
                set: function(e, t) {
                    let n = [...a.keys()];
                    a.set(n[e], r(t))
                },
                wipe: function() {
                    a = new Map,
                    n(e)
                },
                reset: function() {
                    a.forEach((e => delete e.done))
                },
                destroy: e => a.delete(e),
                done: (e, t=!1) => t ? a.delete(e) : a.get(e).done = !0,
                getItems: (e=!1) => e ? i() : i().filter((e => !e.done)),
                getQueue: () => a,
                getTypeable: () => i().filter((e => e.typeable))
            }
        }([{
            delay: G.startDelay
        }]);
        V.dataset.typeitId = K,
        f("[data-typeit-id]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}");
        let Z = !!G.cursor && !I()
          , ee = ( () => {
            if (I())
                return;
            let e = d("span");
            return e.className = o,
            Z ? (e.innerHTML = a(G.cursorChar).innerHTML,
            e) : (e.style.visibility = "hidden",
            e)
        }
        )();
        G.strings = (e => {
            let t = V.innerHTML;
            return t ? (V.innerHTML = "",
            G.startDelete ? (V.innerHTML = t,
            i(V),
            F(E({
                func: j,
                delay: M(1),
                deletable: !0
            }, x().length)),
            e) : t.replace(/<!--(.+?)-->/g, "").trim().split(/<br(?:\s*?)(?:\/)?>/).concat(e)) : e
        }
        )(t(G.strings)),
        G.strings.length && R()
    }
}
));
