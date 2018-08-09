import * as tf from '@tensorflow/tfjs';
import { PointwiseConvParams } from './types';
export declare function pointwiseConvLayer(x: tf.Tensor4D, params: PointwiseConvParams, strides: [number, number]): tf.Tensor<tf.Rank.R4>;
