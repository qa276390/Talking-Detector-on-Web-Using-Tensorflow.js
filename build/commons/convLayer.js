"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function convLayer(x, params, padding, withRelu) {
    if (padding === void 0) { padding = 'same'; }
    if (withRelu === void 0) { withRelu = false; }
    return tf.tidy(function () {
        var out = tf.add(tf.conv2d(x, params.filters, [1, 1], padding), params.bias);
        return withRelu ? tf.relu(out) : out;
    });
}
exports.convLayer = convLayer;
//# sourceMappingURL=convLayer.js.map