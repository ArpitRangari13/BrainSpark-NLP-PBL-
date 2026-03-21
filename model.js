// 1. Import TF.js and USE directly from CDN
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');

let encoder;
let classifier;

async function initModels() {
  try {
    // Force WebGL backend if available, otherwise CPU
    await tf.ready();
    
    // Load Universal Sentence Encoder
    encoder = await use.load();
    
    // Create a mock compiled classifier for the demo
    // (In production, replace this with: classifier = await tf.loadLayersModel('./models/model.json');)
    classifier = tf.sequential();
    classifier.add(tf.layers.dense({units: 16, activation: 'relu', inputShape: [512]}));
    classifier.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    classifier.compile({optimizer: 'adam', loss: 'binaryCrossentropy'});

    // Notify app.js that models are ready
    postMessage({ type: 'STATUS', message: 'READY' });
  } catch (error) {
    console.error("Worker error:", error);
  }
}

// 2. Listen for text from app.js
self.onmessage = async (event) => {
  if (event.data.type === 'PREDICT') {
    const text = event.data.payload;
    
    // Run text through USE
    const embeddings = await encoder.embed([text]);
    
    // Run embeddings through the classifier
    const prediction = classifier.predict(embeddings);
    const score = prediction.dataSync()[0]; 
    
    // Cleanup memory to prevent leaks
    embeddings.dispose();
    prediction.dispose();

    // Send score back to app.js
    postMessage({ type: 'RESULT', score: score });
  }
};

// Start loading as soon as the worker file is fetched
initModels();