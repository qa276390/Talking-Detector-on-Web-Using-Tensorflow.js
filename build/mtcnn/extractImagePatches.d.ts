import * as tf from '@tensorflow/tfjs';
import { Dimensions } from '../types';
import { BoundingBox } from './BoundingBox';
export declare function extractImagePatches(img: HTMLCanvasElement, boxes: BoundingBox[], {width, height}: Dimensions): Promise<tf.Tensor4D[]>;
