//import * as tf from '@tensorflow/tfjs-core';
import * as tf from '@tensorflow/tfjs';

export function prelu<T extends tf.Tensor>(x: T, alpha: tf.Tensor1D): T {
  return tf.tidy(() =>
    tf.add(
      tf.relu(x),
      tf.mul(alpha, tf.neg(tf.relu(tf.neg(x))))
    )
  )
}
