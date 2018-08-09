"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function bgrToRgbTensor(tensor) {
    return tf.tidy(function () { return tf.stack(tf.unstack(tensor, 3).reverse(), 3); });
}
exports.bgrToRgbTensor = bgrToRgbTensor;
//# sourceMappingURL=bgrToRgbTensor.js.map