let encoder;
let classifier;

// 1. Basic Preprocessing
function preprocess(text) {
  // Lowercase and strip punctuation to normalize input
  return text.toLowerCase().replace(/[^\w\s\']/gi, '').trim();
}

// 2. Initialize Models
async function init() {
  try {
    // Load Universal Sentence Encoder
    encoder = await use.load();
    
    // For a real app, load your hosted model:
    // classifier = await tf.loadLayersModel('./models/model.json');
    
    // --- DEMO MOCK CLASSIFIER ---
    // Creating a quick, compiled mock model so this demo runs out of the box.
    classifier = tf.sequential();
    classifier.add(tf.layers.dense({units: 1, activation: 'sigmoid', inputShape: [512]}));
    classifier.compile({optimizer: 'adam', loss: 'binaryCrossentropy'});
    // ----------------------------

    document.getElementById('status').innerText = 'Model Ready (WebGL Edge Inference)';
    document.getElementById('status').className = 'ready';
    document.getElementById('inputText').disabled = false;
    document.getElementById('predictBtn').disabled = false;
  } catch (err) {
    document.getElementById('status').innerText = 'Error loading model.';
    console.error(err);
  }
}

// 3. Inference Logic
async function predictSentiment() {
  const rawText = document.getElementById('inputText').value;
  if (!rawText) return;

  const cleanText = preprocess(rawText);
  
  // Get embeddings from USE
  const embeddings = await encoder.embed([cleanText]);
  
  // Run classification
  const prediction = classifier.predict(embeddings);
  const score = prediction.dataSync()[0]; // Value between 0 and 1
  
  // Cleanup tensors to prevent memory leaks
  embeddings.dispose();
  prediction.dispose();

  // Update UI
  const isPositive = score > 0.5;
  const resultCard = document.getElementById('resultCard');
  resultCard.classList.remove('hidden');
  document.getElementById('sentimentLabel').innerText = isPositive ? '😊 Positive' : '😠 Negative';
  
  // Format confidence (if score is 0.2, it's 80% confident it's negative)
  const confidence = isPositive ? score : (1 - score);
  document.getElementById('confidenceScore').innerText = (confidence * 100).toFixed(1) + '%';
}

// Bind events
document.getElementById('predictBtn').addEventListener('click', predictSentiment);

// Start
init();