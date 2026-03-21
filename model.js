importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder');

let encoder;
let classifier;

async function initModels() {
  try {
    await tf.ready();
    encoder = await use.load();
    
    classifier = tf.sequential();
    classifier.add(tf.layers.dense({units: 24, activation: 'relu', inputShape: [512]}));
    classifier.add(tf.layers.dropout({rate: 0.2}));
    classifier.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    classifier.compile({optimizer: tf.train.adam(0.01), loss: 'binaryCrossentropy'});

    // Expanded robust training dictionary for better out-of-the-box accuracy
    const positivePhrases = [
      "I love this", "happy", "great", "wonderful", "amazing", "beautiful", "good", 
      "excellent", "fantastic", "perfect", "highly recommend", "best experience",
      "works flawlessly", "very satisfied", "impressive", "brilliant"
    ];
    const negativePhrases = [
      "I hate this", "sad", "terrible", "awful", "worst", "ugly", "bad", 
      "horrible", "disgusting", "waste of money", "do not buy", "broken",
      "useless", "disappointed", "poor quality", "frustrating"
    ];
    
    const trainingTexts = [...positivePhrases, ...negativePhrases];
    const trainingLabels = tf.tensor2d([
      ...Array(positivePhrases.length).fill([1]), 
      ...Array(negativePhrases.length).fill([0])
    ]);
    
    const trainingEmbeddings = await encoder.embed(trainingTexts);
    await classifier.fit(trainingEmbeddings, trainingLabels, { epochs: 60, shuffle: true });
    
    trainingEmbeddings.dispose();
    trainingLabels.dispose();

    postMessage({ type: 'STATUS', message: 'READY' });
  } catch (error) {
    console.error("Worker error:", error);
  }
}

self.onmessage = async (event) => {
  if (event.data.type === 'PREDICT') {
    const fullText = event.data.payload;
    
    // MEMORY SAFE CHUNKING: Split large documents by punctuation/newlines
    const chunks = fullText.split(/(?<=[.!?\n])\s+/).filter(chunk => chunk.trim().length > 5);
    if (chunks.length === 0) chunks.push(fullText);

    let totalScore = 0;
    const batchSize = 10; // Process 10 sentences at a time to prevent RAM overload

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      
      const embeddings = await encoder.embed(batch);
      const predictions = classifier.predict(embeddings);
      const scores = predictions.dataSync(); 
      
      for (let s of scores) totalScore += s;
      
      // CRITICAL: Prevent memory leaks
      embeddings.dispose();
      predictions.dispose();
    }

    const finalAverageScore = totalScore / chunks.length;
    postMessage({ type: 'RESULT', score: finalAverageScore });
  }
};

initModels();