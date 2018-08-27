let modelLoaded = false
let minFaceSize = 50
let minConfidence = 0.85
let forwardTimes = []
let stop = false

let bgColor = '#ffffff'
let drawLines = false

let pointQ = new Queue();
let OFF = false
let end_time = 0
let TRAIN = true
let mobilenet
let model
let label_time
let NUM_CLASSES = 2
let videoEl
let LOADED = false
var Domain = 'http://127.0.0.1:3000'

const controllerDataset = new ControllerDataset(2)

navigator.getUserMedia = ( navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia ||
                   navigator.msGetUserMedia);

async function onPlay() {
  if(videoEl.paused || videoEl.ended || !modelLoaded)
  { 
    console.log('return false') 
    //return false
  }
  let start_time = new Date().getTime()
  console.log('###############In################')
  
  const { width, height } = faceapi.getMediaDimensions(videoEl)
  const canvas = $('#overlay').get(0)
  canvas.width = width
  canvas.height = height
      
  const mtcnnParams = {
    minFaceSize
  }
  //const { results, stats } = await faceapi.nets.mtcnn.forwardWithStats(videoEl, mtcnnParams)
  let img = faceapi.createCanvasFromMedia(videoEl)
  const results = await faceapi.mtcnn(img, mtcnnParams)
  console.log(results)
  
  let mtcnn_time = new Date().getTime()
  let lmk68_time = 0
  //updateTimeStats(stats.total)
  if(results.length!=0){
    locations = []
    flen = results.length
    for (i = 0; i<flen; i++)
    {
      results[i].faceDetection.box.height = results[i].faceDetection.box.height/2
      results[i].faceDetection.box.y = results[i].faceDetection.box.y + results[i].faceDetection.box.height
      locations.push(results[i].faceDetection)
    }
    //const faceTensors = (await faceapi.extractFaceTensors(videoEl, locations))
    const faceImgs = (await faceapi.extractFaces(img, locations))
  
    let label = 1
    ilen = faceImgs.length
    for(i=0;i<ilen;i++)
    {
      webcam = new Webcam(faceImgs[i]) 
      IMG = webcam.capture()
      img_resize = faceapi.tf.image.resizeBilinear(IMG, [224, 224])
      const activation = mobilenet.predict(img_resize);
      const predictions = model.predict(activation);
      const predictedClass = predictions.as1D().argMax();
      label = (await predictedClass.data())[0];
      predictedClass.dispose();
    }
    lmk68_time = new Date().getTime()
    checktime = new Date().getTime()
    if(checktime-end_time>1000){
      while(!pointQ.isEmpty())
      {pointQ.dequeue()}
    }
    pointQ.enqueue(label)
    
    if(pointQ.getLength()>3){
      pointQ.dequeue()
    }

    if(pointQ.getLength()!=1 && LabelSilent(pointQ))
    {
      console.log('E*************Off**************E')
      off()
    }
    else
    {
      console.log('E*************On**************E')
      on()
    }
    
    if (results) {

       for (i = 0; i<flen; i++)
      {
        results[i].faceDetection.box.y = results[i].faceDetection.box.y - results[i].faceDetection.box.height
        results[i].faceDetection.box.height = results[i].faceDetection.box.height*2     
      }

      results.forEach(({ faceDetection, faceLandmarks }) => {
        if (faceDetection.score < minConfidence) {
          return
        }
        faceapi.drawDetection('overlay', faceDetection.forSize(width, height))
        //faceapi.drawLandmarks('overlay', faceLandmarks.forSize(width, height), { lineWidth: 4, color: 'red' })
      })
    }
    end_time = new Date().getTime();
  }else if(!TRAIN){
    console.log('No Detect')
    off()
  }
  console.log((mtcnn_time - start_time) / 1000 + "sec");
  console.log((lmk68_time - mtcnn_time) / 1000 + "sec");
  console.log((end_time - start_time) / 1000 + "sec");
  console.log('################Out###############')
  if(stop)
    return false
  setTimeout(() => onPlay(videoEl))
}

function off(){
    if($('#recButton').hasClass('Rec')){
      $('#recButton').removeClass("Rec");
      $('#recButton').addClass("notRec");
    }
    OFF = true
}
function on(){
    if($('#recButton').hasClass('notRec')){
      $('#recButton').removeClass("notRec");
      $('#recButton').addClass("Rec");
    }
    OFF = false
}

function LabelSilent(Q, threshold){
  let i, j, t, tf, EN = 0
  let Qlen = Q.getLength()

  for(j = 0; j<Qlen;j++)
  {
    tf = Q.getitem(j)
    if(tf==1){
      return false
    }
  }
  return true
}
async function run() {
  await faceapi.loadMtcnnModel('/')
  await faceapi.loadFaceLandmarkModel('/')
  mobilenet = await loadMobilenet();

  modelLoaded = true

  //const videoEl = $('#inputVideo').get(0)
  videoEl = $('#inputVideo').get(0)

  navigator.getUserMedia(
    { video: {} },
    stream => videoEl.srcObject = stream,
    err => console.error(err)
  )
  
  init()

  $('#loader').hide()
  
  $('#recButton').addClass("Rec");

  $('#recButton').click(function(){
    if($('#recButton').hasClass('notRec')){
      $('#recButton').removeClass("notRec");
      $('#recButton').addClass("Rec");
    }
    else{
      $('#recButton').removeClass("Rec");
      $('#recButton').addClass("notRec");
    }
  });
  label_time = new Date().getTime()
  on()	
  //createSelect()
  getList()
  console.log('model loaded.')
}

function preLoad(videoEl){
  let cv = faceapi.createCanvasFromMedia(videoEl)
  wcam = new Webcam(cv)
  img = wcam.capture()
  img_re= faceapi.tf.image.resizeBilinear(img, [224, 224])
  faceapi.tf.tidy(() => mobilenet.predict(img_re));
}

$(document).ready(function() {
  //renderNavBar('#navbar', 'mtcnn_face_detection_webcam')
  run()
})

function Queue(){
  var a=[],b=0;
  this.getLength=function(){return a.length-b};
  this.isEmpty=function(){return 0==a.length};
  this.enqueue=function(b){a.push(b)};
  this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};
  this.peek=function(){return 0<a.length?a[b]:void 0};
  this.getitem=function(i){if(i<a.length){return a[i]}};
}

async function loadMobilenet() {
  const mobilenet = await faceapi.tf.loadModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

  // Return a model that outputs an internal activation.
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  //console.log(tf.shape(layer));
  return faceapi.tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}
/**
* Sets up and trains the classifier.
*/
async function train() {
  if (controllerDataset.xs == null) {
    throw new Error('Add some examples before training!');
  }

  // Creates a 2-layer fully connected model. By creating a separate model,
  // rather than adding layers to the mobilenet model, we "freeze" the weights
  // of the mobilenet model, and only train weights from the new model.
  model = faceapi.tf.sequential({
    layers: [
      // Flattens the input to a vector so we can use it in a dense layer. While
      // technically a layer, this only performs a reshape (and has no training
      // parameters).
      faceapi.tf.layers.flatten({inputShape: [7, 7, 256]}),
      // Layer 1
      faceapi.tf.layers.dense({
        units: getDenseUnits(),
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
      }),
      // Layer 2. The number of units of the last layer should correspond
      // to the number of classes we want to predict.
      faceapi.tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ]
  });

  // Creates the optimizers which drives training of the model.
  const optimizer = faceapi.tf.train.adam(getLearningRate());
  // We use categoricalCrossentropy which is the loss function we use for
  // categorical classification which measures the error between our predicted
  // probability distribution over classes (probability that an input is of each
  // class), versus the label (100% probability in the true class)>
  model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

  // We parameterize batch size as a fraction of the entire dataset because the
  // number of examples that are collected depends on how many examples the user
  // collects. This allows us to have a flexible batch size.
  const batchSize =
      Math.floor(controllerDataset.xs.shape[0] * getBatchSizeFraction());
  if (!(batchSize > 0)) {
    throw new Error(
        `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
  }

  // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
  model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: getEpochs(),
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainStatus('Loss: ' + logs.loss.toFixed(5));
        await faceapi.tf.nextFrame();
      }
    }
  });
}
document.getElementById('train').addEventListener('click', async () => {
trainStatus('Training...');
await faceapi.tf.nextFrame();
await faceapi.tf.nextFrame();
isPredicting = false;
train();
});

document.getElementById('predict').addEventListener('click', async () => {
console.log('predict!')
if(!LOADED){
  const saveResult = await model.save(Domain + '/file_upload');
  console.log('model saved.')
  console.log(saveResult)
  console.log(saveResult.responses[0])
  if(saveResult.responses[0].status==200)
  { getList()}
}
  TRAIN = false
onPlay()
});

    
let count = 0
function getList(){
    const Http = new XMLHttpRequest();
    const url = Domain + '/list_user';
    Http.open("GET", url);
    Http.send();
    let res
    Http.onreadystatechange=(e)=>{

        console.log(count)
        count = count + 1
        if (Http.readyState==4 && Http.status==200){
          console.log(Http.responseText)

          var obj = document.getElementById("model_id_select");
          obj.options.length=0; //remove all options
          
          res = Http.response;
          console.log(res);
          if(res.length!=0){
            resobj = JSON.parse(res)
            console.log(resobj);
            len = resobj.length
            console.log(len);

            for(i=0;i<len;i++){
                obj.add(new Option(resobj[i],resobj[i]))
            }
          }
        }
    }
    
    return res
}
// ////////////////////////////////////////
setExampleHandler(label => {
faceapi.tf.tidy(() => {
    addNetExample(label)
});
});

async function addNetExample(label)
{
const { width, height } = faceapi.getMediaDimensions(videoEl)
const canvas = $('#overlay').get(0)
canvas.width = width
canvas.height = height
    
const mtcnnParams = {
  minFaceSize
}

let img = faceapi.createCanvasFromMedia(videoEl)
const results = await faceapi.mtcnn(img, mtcnnParams)
console.log(results)

if(results.length!=0){
  locations = []
  flen = results.length
  for (i = 0; i<flen; i++)
  {
    results[i].faceDetection.box.height = results[i].faceDetection.box.height/2
    results[i].faceDetection.box.y = results[i].faceDetection.box.y + results[i].faceDetection.box.height
    locations.push(results[i].faceDetection)
  }
  
  const faceImgs = (await faceapi.extractFaces(img, locations))

  ilen = faceImgs.length
  for(i=0;i<ilen;i++)
  {
    webcam = new Webcam(faceImgs[i]) 
    IMG = webcam.capture()
    img_resize = faceapi.tf.image.resizeBilinear(IMG, [224, 224])
    controllerDataset.addExample(mobilenet.predict(img_resize), label)

    drawThumb(img_resize, label);
  }

  for (i = 0; i<flen; i++)
  {
    results[i].faceDetection.box.y = results[i].faceDetection.box.y - results[i].faceDetection.box.height
    results[i].faceDetection.box.height = results[i].faceDetection.box.height*2
  }

  results.forEach(({ faceDetection, faceLandmarks }) => {
  if (faceDetection.score < minConfidence) {
    return
  }
  faceapi.drawDetection('overlay', faceDetection.forSize(width, height))
  })

}else{
  setTimeout(() => addNetExample(label))
}
}

//button

async function LoadModelButton(){
LOADED = true
var obj=document.getElementById('model_id_select');
var index=obj.selectedIndex; 
var ModelID = obj.options[index].text;
//ModelID = document.getElementById('model_id').value

model = await faceapi.tf.loadModel(Domain+'/models/'+ModelID+'/model.json',Domain+'/models/'+ModelID+'/model.weights.bin');
console.log(model.summary())
}
function onIncreaseMinFaceSize() {
  minFaceSize = Math.min(faceapi.round(minFaceSize + 50), 300)
  $('#minFaceSize').val(minFaceSize)
}

function onDecreaseMinFaceSize() {
minFaceSize = Math.max(faceapi.round(minFaceSize - 50), 50)
$('#minFaceSize').val(minFaceSize)
}

function onIncreaseThreshold() {
Enthr= Math.min((Enthr + 0.1), 5)
//let textT = Math.round(Enthr*100) + '%'
let textT = Math.round(Enthr*100)/100
$('#Threshold').val(textT)
}

function onDecreaseThreshold() {
Enthr= Math.max((Enthr - 0.1), 0.0)
//let textT = Math.round(Enthr*100) + '%'
let textT = Math.round(Enthr*100)/100
$('#Threshold').val(textT)
}
function onIncreaseuthr() {
uthr= Math.min((uthr + 0.001), 3)
//let textT = Math.round(Enthr*100) + '%'
let textT = Math.round(uthr*1000)/1000
$('#uthr').val(textT)
}

function onDecreaseuthr() {
uthr= Math.max((uthr - 0.001), 0.0)
//let textT = Math.round(Enthr*100) + '%'
let textT = Math.round(uthr*1000)/1000
$('#uthr').val(textT)
}
function updateTimeStats(timeInMs) {
forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
$('#time').val(`${Math.round(avgTimeInMs)} ms`)
$('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
}