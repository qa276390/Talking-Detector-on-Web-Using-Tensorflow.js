"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as tf from '@tensorflow/tfjs-core';
var tf = require("@tensorflow/tfjs");
function isTensor(tensor, dim) {
    return tensor instanceof tf.Tensor && tensor.shape.length === dim;
}
exports.isTensor = isTensor;
function isTensor1D(tensor) {
    return isTensor(tensor, 1);
}
exports.isTensor1D = isTensor1D;
function isTensor2D(tensor) {
    return isTensor(tensor, 2);
}
exports.isTensor2D = isTensor2D;
function isTensor3D(tensor) {
    return isTensor(tensor, 3);
}
exports.isTensor3D = isTensor3D;
function isTensor4D(tensor) {
    return isTensor(tensor, 4);
}
exports.isTensor4D = isTensor4D;
//# sourceMappingURL=isTensor.js.map