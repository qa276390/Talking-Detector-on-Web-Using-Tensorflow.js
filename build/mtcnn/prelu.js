"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function prelu(x, alpha) {
    return tf.tidy(function () {
        return tf.add(tf.relu(x), tf.mul(alpha, tf.neg(tf.relu(tf.neg(x)))));
    });
}
exports.prelu = prelu;
//# sourceMappingURL=prelu.js.map