# Talking Detector

[![Slack](https://slack.bri.im/badge.svg)](https://slack.bri.im)

**JavaScript for Talking Detector in the browser implemented on top of the face-api.js API([justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)) and tensorflow.js  API ([tensorflow/tfjs](https://github.com/tensorflow/tfjs))**


* **[What's inside](#inside)**
* **[Build and Run](#build-and-run)**
* **[Structure](#structure)**
* **[About the Package](#about-the-package)**
  * **[Face Detection & 5 Point Face Landmarks - MTCNN](#about-face-detection-mtcnn)**
  * **[Using Pretrained MobileNet to extract features](#about-mobliebet)**
  * **[Using Tensorflow.js to train a local model](#about-tfjs-local)**

  
<a name="inside"></a>
## What's inside?

### Live Face Detection

**MTCNN**

![preview_video-facedetection](https://user-images.githubusercontent.com/31125521/41238649-bbf10046-6d96-11e8-9041-1de46c6adccd.jpg)

<a name="build-and-run"></a>

## Build and Run

### Build 

``` bash
npm run-script build
```

### Run

``` bash
cd examples
npm i
npm start
```

Browse to http://localhost:3000/.

<a name="structure"></a>

## Structure

We use MTCNN to extract faces and than put them into a pretrained moblieNet with a local training model behind to train and predict. 

<img src="https://github.com/qa276390/face-demo/blob/master/examples/public/images/structure.png" width="450" height="600" />

<a name="about-the-package"></a>

## About the Package

<a name="about-face-detection-mtcnn"></a>

### Face Detection & 5 Point Face Landmarks - MTCNN

MTCNN (Multi-task Cascaded Convolutional Neural Networks) represents an alternative to SSD Mobilenet v1, which offers much more room for configuration and is able to achieve much lower processing times. MTCNN is a 3 stage cascaded CNN, which simultanously returns 5 face landmark points along with the bounding boxes and scores for each face. By limiting the minimum size of faces expected in an image, MTCNN allows you to process frames from your webcam in realtime. Additionally with 2MB, the size of the weights file is only a third of the size of the quantized SSD Mobilenet v1 model (~6MB).

MTCNN has been presented in the paper [Joint Face Detection and Alignment using Multi-task Cascaded Convolutional Networks](https://kpzhang93.github.io/MTCNN_face_detection_alignment/paper/spl.pdf) by Zhang et al. and the model weights are provided in the official [repo](https://github.com/kpzhang93/MTCNN_face_detection_alignment) of the MTCNN implementation.

<a name="about-moblienet"></a>

### Using Pretrained MobileNet to extract features 

<a name="about-tfjs-local"></a>

### Using Tensorflow.js to train a local model  


