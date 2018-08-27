# Talking Detector

[![Slack](https://slack.bri.im/badge.svg)](https://slack.bri.im)

**JavaScript for Talking Detector in the browser implemented on top of the face-api.js API([justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)) and tensorflow.js  API ([tensorflow/tfjs](https://github.com/tensorflow/tfjs))**


* **[Build and Run](#running-the-examples)**
* **[About the Package](#about-the-package)**
  * **[Face Detection & 5 Point Face Landmarks - MTCNN](#about-face-detection-mtcnn)**
* **[Usage](#usage)**
  * **[Loading the Models](#usage-load-models)**
  * **[Face Detection & 5 Point Face Landmarks - MTCNN](#usage-face-detection-mtcnn)**
  

## Examples!

### Live Face Detection

**MTCNN**

![preview_video-facedetection](https://user-images.githubusercontent.com/31125521/41238649-bbf10046-6d96-11e8-9041-1de46c6adccd.jpg)



![mtcnn-preview](https://user-images.githubusercontent.com/31125521/42756818-0a41edaa-88fe-11e8-9033-8cd141b0fa09.gif)



<a name="running-the-examples"></a>

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

<a name="about-the-package"></a>

## About the Package

<a name="about-face-detection-mtcnn"></a>

### Face Detection & 5 Point Face Landmarks - MTCNN

MTCNN (Multi-task Cascaded Convolutional Neural Networks) represents an alternative to SSD Mobilenet v1, which offers much more room for configuration and is able to achieve much lower processing times. MTCNN is a 3 stage cascaded CNN, which simultanously returns 5 face landmark points along with the bounding boxes and scores for each face. By limiting the minimum size of faces expected in an image, MTCNN allows you to process frames from your webcam in realtime. Additionally with 2MB, the size of the weights file is only a third of the size of the quantized SSD Mobilenet v1 model (~6MB).

MTCNN has been presented in the paper [Joint Face Detection and Alignment using Multi-task Cascaded Convolutional Networks](https://kpzhang93.github.io/MTCNN_face_detection_alignment/paper/spl.pdf) by Zhang et al. and the model weights are provided in the official [repo](https://github.com/kpzhang93/MTCNN_face_detection_alignment) of the MTCNN implementation.


## Usage

Get the latest build from dist/face-api.js or dist/face-api.min.js and include the script:

``` html
<script src="face-api.js"></script>
```

Or install the package:

``` bash
npm i face-api.js
```

<a name="usage-load-models"></a>

### Loading the Models

To load a model, you have provide the corresponding manifest.json file as well as the model weight files (shards) as assets. Simply copy them to your public or assets folder. The manifest.json and shard files of a model have to be located in the same directory / accessible under the same route.

Assuming the models reside in **public/models**:

``` javascript
await faceapi.loadFaceDetectionModel('/models')
// accordingly for the other models:
// await faceapi.loadFaceLandmarkModel('/models')
// await faceapi.loadFaceRecognitionModel('/models')
// await faceapi.loadMtcnnModel('/models')
```

As an alternative, you can also create instance of the neural nets:

``` javascript
const net = new faceapi.FaceDetectionNet()
// accordingly for the other models:
// const net = new faceapi.FaceLandmarkNet()
// const net = new faceapi.FaceRecognitionNet()
// const net = new faceapi.Mtcnn()

await net.load('/models/face_detection_model-weights_manifest.json')
// await net.load('/models/face_landmark_68_model-weights_manifest.json')
// await net.load('/models/face_recognition_model-weights_manifest.json')
// await net.load('/models/mtcnn_model-weights_manifest.json')

// or simply load all models
await net.load('/models')
```

Using instances, you can also load the weights as a Float32Array (in case you want to use the uncompressed models):

``` javascript
// using fetch
const res = await fetch('/models/face_detection_model.weights')
const weights = new Float32Array(await res.arrayBuffer())
net.load(weights)

// using axios
const res = await axios.get('/models/face_detection_model.weights', { responseType: 'arraybuffer' })
const weights = new Float32Array(res.data)
net.load(weights)
```

<a name="usage-face-detection-ssd"></a>


### Face Detection & 5 Point Face Landmarks - MTCNN

Detect faces and get the bounding boxes and scores:

``` javascript
// defaults parameters shown:
const forwardParams = {
  // number of scaled versions of the input image passed through the CNN
  // of the first stage, lower numbers will result in lower inference time,
  // but will also be less accurate
  maxNumScales: 10,
  // scale factor used to calculate the scale steps of the image
  // pyramid used in stage 1
  scaleFactor: 0.709,
  // the score threshold values used to filter the bounding
  // boxes of stage 1, 2 and 3
  scoreThresholds: [0.6, 0.7, 0.7],
  // mininum face size to expect, the higher the faster processing will be,
  // but smaller faces won't be detected
  minFaceSize: 20
}

const results = await faceapi.mtcnn(document.getElementById('myImg'), forwardParams)
```

Alternatively you can also specify the scale steps manually:

``` javascript
const forwardParams = {
  scaleSteps: [0.4, 0.2, 0.1, 0.05]
}

const results = await faceapi.mtcnn(document.getElementById('myImg'), forwardParams)
```

Finally you can draw the returned bounding boxes and 5 Point Face Landmarks into a canvas:

``` javascript
const minConfidence = 0.9

if (results) {
  results.forEach(({ faceDetection, faceLandmarks }) => {

    // ignore results with low confidence score
    if (faceDetection.score < minConfidence) {
      return
    }

    faceapi.drawDetection('overlay', faceDetection)
    faceapi.drawLandmarks('overlay', faceLandmarks)
  })
}
```

<a name="usage-face-recognition"></a>


