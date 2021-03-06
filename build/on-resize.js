"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeEventListener = exports.addEventListener = exports.off = exports.on = undefined;

var _platform = require("./platform");

var _utils = require("./utils");

/* eslint no-param-reassign: 0 */

var requestAnimationFrame = (0, _platform.isServer)() ? _utils.noop : (0, _platform.getWindow)().requestAnimationFrame || (0, _platform.getWindow)().mozRequestAnimationFrame || (0, _platform.getWindow)().webkitRequestAnimationFrame || function (fn) {
  (0, _platform.getWindow)().setTimeout(fn, 20);
};

var cancelAnimationFrame = (0, _platform.isServer)() ? _utils.noop : (0, _platform.getWindow)().cancelAnimationFrame || (0, _platform.getWindow)().mozCancelAnimationFrame || (0, _platform.getWindow)().webkitCancelAnimationFrame || (0, _platform.getWindow)().clearTimeout;

var isIE = (0, _platform.isServer)() ? false : navigator.userAgent.match(/Trident/);

var namespace = "__resizeDetector__";

var uninitialize = function uninitialize(el) {
  el[namespace].destroy();
  el[namespace] = undefined;
};

var createElementHack = function createElementHack() {
  var el = document.createElement("object");
  el.className = "resize-sensor";
  el.setAttribute("style", "display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;");
  el.setAttribute("class", "resize-sensor");
  el.type = "text/html";
  el.data = "about:blank";
  return el;
};

var initialize = function initialize(el) {

  var detector = el[namespace] = {};
  detector.listeners = [];

  var onResize = function onResize(e) {
    /* Keep in mind e.target could be el OR objEl. In this current implementation we don't seem to need to know this but its important
    to not forget e.g. in some future refactoring scenario. */
    if (detector.resizeRAF) cancelAnimationFrame(detector.resizeRAF);
    detector.resizeRAF = requestAnimationFrame(function () {
      detector.listeners.forEach(function (fn) {
        fn(e);
      });
    });
  };

  if (isIE) {
    /* We do not support ie8 and below (or ie9 in compat mode).
    Therefore there is no presence of `attachEvent` here. */
    el.addEventListener("onresize", onResize);
    detector.destroy = function () {
      el.removeEventListener("onresize", onResize);
    };
  } else {
    if (getComputedStyle(el).position === "static") {
      detector.elWasStaticPosition = true;
      el.style.position = "relative";
    }
    var objEl = createElementHack();
    objEl.onload = function () /* event */{
      this.contentDocument.defaultView.addEventListener("resize", onResize);
    };
    detector.destroy = function () {
      if (detector.elWasStaticPosition) el.style.position = "";
      // Event handlers will be automatically removed.
      // http://stackoverflow.com/questions/12528049/if-a-dom-element-is-removed-are-its-listeners-also-removed-from-memory
      if (el.contains(objEl)) el.removeChild(objEl);
    };

    el.appendChild(objEl);
  }
};

var on = function on(el, fn) {

  /* Window object natively publishes resize events. We handle it as a
  special case here so that users do not have to think about two APIs. */

  if (el === (0, _platform.getWindow)()) {
    (0, _platform.getWindow)().addEventListener("resize", fn);
    return;
  }

  /* Not caching namespace read here beacuse not guaranteed that its available. */

  if (!el[namespace]) initialize(el);
  el[namespace].listeners.push(fn);
};

var off = function off(el, fn) {
  if (el === (0, _platform.getWindow)()) {
    (0, _platform.getWindow)().removeEventListener("resize", fn);
    return;
  }
  var detector = el[namespace];
  if (!detector) return;
  var i = detector.listeners.indexOf(fn);
  if (i !== -1) detector.listeners.splice(i, 1);
  if (!detector.listeners.length) uninitialize(el);
};

exports.default = {
  on: on,
  off: off,
  addEventListener: on,
  removeEventListener: off
};
exports.on = on;
exports.off = off;
exports.addEventListener = on;
exports.removeEventListener = off;