"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function normalize(x) {
    return tf.tidy(function () { return tf.mul(tf.sub(x, tf.scalar(127.5)), tf.scalar(0.0078125)); });
}
exports.normalize = normalize;
//# sourceMappingURL=normalize.js.map