/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

//import * as tf from '@tensorflow/tfjs';

const CONTROLS = ['up', 'down', 'left', 'right'];
const CONTROL_CODES = [38, 40, 37, 39];

function init() {
  //document.getElementById('controller').style.display = '';
  //statusElement.style.display = 'none';
  
  trainStatusElement = document.getElementById('train-status');
  // Set hyper params from UI values.
  
  learningRateElement = document.getElementById('learningRate')
  
  batchSizeFractionElement = document.getElementById('batchSizeFraction');
  epochsElement = document.getElementById('epochs');
  denseUnitsElement = document.getElementById('dense-units');
  statusElement = document.getElementById('status');
  
  console.log(trainStatusElement)
}

let trainStatusElement = document.getElementById('train-status');

// Set hyper params from UI values.
let learningRateElement = document.getElementById('learningRate');
const getLearningRate = () => +learningRateElement.value;

let batchSizeFractionElement = document.getElementById('batchSizeFraction');
const getBatchSizeFraction = () => +batchSizeFractionElement.value;

let epochsElement = document.getElementById('epochs');
const getEpochs = () => +epochsElement.value;

let denseUnitsElement = document.getElementById('dense-units');
const getDenseUnits = () => +denseUnitsElement.value;
let statusElement = document.getElementById('status');

function startPacman() {
  google.pacman.startGameplay();
}

function predictClass(classId) {
  google.pacman.keyPressed(CONTROL_CODES[classId]);
  document.body.setAttribute('data-active', CONTROLS[classId]);
}

function isPredicting() {
  statusElement.style.visibility = 'visible';
}
function donePredicting() {
  statusElement.style.visibility = 'hidden';
}
function trainStatus(status) {
  trainStatusElement.innerText = status;
}

let addExampleHandler;
function setExampleHandler(handler) {
  addExampleHandler = handler;
}
let mouseDown = false;
const totals = [0, 0, 0, 0];

const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
/*
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
*/
const thumbDisplayed = {};

async function handler(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(className + '-total');
  while (mouseDown) {
    addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = totals[label]++;
    await faceapi.tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}

/*
upButton.addEventListener('mousedown', () => handler(0));
upButton.addEventListener('mouseup', () => mouseDown = false);

downButton.addEventListener('mousedown', () => handler(1));
downButton.addEventListener('mouseup', () => mouseDown = false);

leftButton.addEventListener('mousedown', () => handler(2));
leftButton.addEventListener('mouseup', () => mouseDown = false);

rightButton.addEventListener('mousedown', () => handler(3));
rightButton.addEventListener('mouseup', () => mouseDown = false);
*/
function drawThumb(img, label) {
  if (thumbDisplayed[label] == null) {
    const thumbCanvas = document.getElementById(CONTROLS[label] + '-thumb');
    //const thumbCanvas = document.getElementById('up-thumb');
    const className = CONTROLS[label];
    const total = document.getElementById(className + '-total');
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = totals[label]++;
    //$(className + '-total').val(totals[label]++)
    console.log(totals)
    document.body.removeAttribute('data-active');

    //
    draw(img, thumbCanvas);
  }
}

function draw(image, canvas) {
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}
