"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function pointwiseConvLayer(x, params, strides) {
    return tf.tidy(function () {
        var out = tf.conv2d(x, params.filters, strides, 'same');
        out = tf.add(out, params.batch_norm_offset);
        return tf.clipByValue(out, 0, 6);
    });
}
exports.pointwiseConvLayer = pointwiseConvLayer;
//# sourceMappingURL=pointwiseConvLayer.js.map