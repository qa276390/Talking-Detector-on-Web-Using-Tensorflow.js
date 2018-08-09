"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function scale(x, params) {
    return tf.add(tf.mul(x, params.weights), params.biases);
}
exports.scale = scale;
//# sourceMappingURL=scaleLayer.js.map