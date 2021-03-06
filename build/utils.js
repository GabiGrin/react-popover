"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientOnly = exports.noop = exports.equalRecords = exports.find = exports.arrayify = undefined;

var _platform = require("./platform");

var arrayify = function arrayify(x) {
  return Array.isArray(x) ? x : [x];
};

var find = function find(f, xs) {
  return xs.reduce(function (b, x) {
    return b ? b : f(x) ? x : null;
  }, null);
};

var equalRecords = function equalRecords(o1, o2) {
  for (var key in o1) {
    if (o1[key] !== o2[key]) return false;
  }return true;
};

var noop = function noop() {
  return undefined;
};

var clientOnly = function clientOnly(f) {
  return (0, _platform.isClient)() ? f : noop;
};

exports.default = {
  arrayify: arrayify,
  find: find,
  equalRecords: equalRecords,
  noop: noop,
  clientOnly: clientOnly
};
exports.arrayify = arrayify;
exports.find = find;
exports.equalRecords = equalRecords;
exports.noop = noop;
exports.clientOnly = clientOnly;