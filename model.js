// 1. Import TF.js and USE directly from CDN
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');

let encoder;
let classifier;

async function initModels() {
  try {
    await tf.ready();
    
    // Load Universal Sentence Encoder
    encoder = await use.load();
    
    // Create the classifier
    classifier = tf.sequential();
    classifier.add(tf.layers.dense({units: 16, activation: 'relu', inputShape: [512]}));
    classifier.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    classifier.compile({optimizer: 'adam', loss: 'binaryCrossentropy'});

    // ==========================================
    // NEW: MINI IN-BROWSER TRAINING LOOP!
    // Let's quickly teach the random model what words mean.
    // ==========================================
    const trainingTexts = [
      "I love this", "happy", "great", "wonderful", "amazing", "beautiful", "good",  // Positives (1)
      "I hate this", "sad", "terrible", "awful", "worst", "ugly", "bad"              // Negatives (0)
    ];
    // 1s for positive, 0s for negative
    const trainingLabels = tf.tensor2d([[1], [1], [1], [1], [1], [1], [1], [0], [0], [0], [0], [0], [0], [0]]);
    
    // Convert our training text into USE embeddings
    const trainingEmbeddings = await encoder.embed(trainingTexts);
    
    // Train the model for 50 rounds (takes ~1 second on the edge)
    await classifier.fit(trainingEmbeddings, trainingLabels, { epochs: 50 });
    
    // Clean up training memory
    trainingEmbeddings.dispose();
    trainingLabels.dispose();
    // ==========================================

    // Notify app.js that models are trained and ready!
    postMessage({ type: 'STATUS', message: 'READY' });
  } catch (error) {
    console.error("Worker error:", error);
  }
}

// 2. Listen for text from app.js
self.onmessage = async (event) => {
  if (event.data.type === 'PREDICT') {
    const text = event.data.payload;
    
    const embeddings = await encoder.embed([text]);
    const prediction = classifier.predict(embeddings);
    const score = prediction.dataSync()[0]; 
    
    embeddings.dispose();
    prediction.dispose();

    postMessage({ type: 'RESULT', score: score });
  }
};

initModels();