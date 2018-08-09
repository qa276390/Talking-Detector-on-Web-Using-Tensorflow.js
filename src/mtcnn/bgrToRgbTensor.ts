//import * as tf from '@tensorflow/tfjs-core';
import * as tf from '@tensorflow/tfjs';

export function bgrToRgbTensor(tensor: tf.Tensor4D): tf.Tensor4D {
  return tf.tidy(
    () => tf.stack(tf.unstack(tensor, 3).reverse(), 3)
  ) as tf.Tensor4D
}