//import * as tf from '@tensorflow/tfjs-core';
import * as tf from '@tensorflow/tfjs';

import { FaceDetection } from './FaceDetection';
import { Rect } from './Rect';
import { toNetInput } from './toNetInput';
import { TNetInput } from './types';

/**
 * Extracts the tensors of the image regions containing the detected faces.
 * Useful if you want to compute the face descriptors for the face images.
 * Using this method is faster then extracting a canvas for each face and
 * converting them to tensors individually.
 *
 * @param input The image that face detection has been performed on.
 * @param detections The face detection results or face bounding boxes for that image.
 * @returns Tensors of the corresponding image region for each detected face.
 */
export async function extractFaceTensors(
  input: TNetInput,
  detections: Array<FaceDetection | Rect>
): Promise<tf.Tensor4D[]> {

  const netInput = await toNetInput(input, true)

  if (netInput.batchSize > 1) {
    if (netInput.isManaged) {
      netInput.dispose()
    }
    throw new Error('extractFaceTensors - batchSize > 1 not supported')
  }

  return tf.tidy(() => {
    const imgTensor = netInput.inputs[0].expandDims().toFloat() as tf.Tensor4D

    const [imgHeight, imgWidth, numChannels] = imgTensor.shape.slice(1)

    const boxes = detections.map(
      det => det instanceof FaceDetection
        ? det.forSize(imgWidth, imgHeight).getBox().floor()
        : det
    )
    //console.log('imgTensor')
    //console.log(imgTensor)
    //console.log('boxes')
    //console.log(boxes)
    let newimgTensor = imgTensor
    let dx = 0, dy = 0, tmpx = 0, tmpy = 0
    if(boxes.length > 0){
      for(var i = 0; i< boxes.length;i++)
      {
        tmpx = ((boxes[i].x + boxes[i].width)-imgWidth > 0) ? ((boxes[i].x + boxes[i].width)-imgWidth) : 0
        tmpy = ((boxes[i].y + boxes[i].height)-imgHeight > 0) ? ((boxes[i].y + boxes[i].height)-imgHeight) : 0
        if(tmpx>dx)
          dx = tmpx
        if(tmpy>dy)
          dy = tmpy
      }
      if(dx > 0 || dy > 0){
        newimgTensor = newimgTensor.pad([[0,0],[dy,dy],[dx,dx],[0,0]])
        //console.log('Box to big!')
      }
    }
    //console.log('paded newimgTensor')
    //console.log(newimgTensor)
      const faceTensors = boxes.map(({ x, y, width, height }) =>
      tf.slice(newimgTensor, [0, y, x, 0], [1, height, width, numChannels])
    )
    //console.log('faceTensors')
    //console.log(faceTensors)
    
    if (netInput.isManaged) {
      netInput.dispose()
    }
    return faceTensors
  })
}
