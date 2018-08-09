import * as tf from '@tensorflow/tfjs';
import { BoundingBox } from './BoundingBox';
import { PNetParams } from './types';
export declare function stage1(imgTensor: tf.Tensor4D, scales: number[], scoreThreshold: number, params: PNetParams, stats: any): {
    boxes: BoundingBox[];
    scores: number[];
};
