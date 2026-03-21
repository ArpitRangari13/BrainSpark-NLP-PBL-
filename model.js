self.onmessage = async (event) => {
  if (event.data.type === 'PREDICT') {
    // Handling a normal, short sentence
    const text = event.data.payload;
    const embeddings = await encoder.embed([text]);
    const prediction = classifier.predict(embeddings);
    const score = prediction.dataSync()[0]; 
    embeddings.dispose();
    prediction.dispose();
    postMessage({ type: 'RESULT', score: score });
  } 
  else if (event.data.type === 'PREDICT_DOCUMENT') {
    // Handling a massive file upload
    const fullText = event.data.payload;
    
    // 1. Chunking: Split by newlines (paragraphs/CSV rows) and remove empty lines
    const chunks = fullText.split(/\n+/).filter(chunk => chunk.trim().length > 10);
    
    // If it's surprisingly short, just treat it normally
    if (chunks.length === 0) {
       chunks.push(fullText);
    }

    let totalScore = 0;
    const batchSize = 10; // Process 10 chunks at a time to save RAM

    // 2. Mini-Batching Loop
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      
      // Embed 10 chunks at once (highly efficient)
      const embeddings = await encoder.embed(batch);
      
      // Predict 10 chunks at once
      const predictions = classifier.predict(embeddings);
      
      // Extract the scores array
      const scores = predictions.dataSync(); 
      
      // Add them to our running total
      for (let s of scores) {
        totalScore += s;
      }
      
      // CRITICAL: Manually trigger garbage collection for these tensors
      // If you forget this, your browser will crash on page 2.
      embeddings.dispose();
      predictions.dispose();
    }

    // 3. Calculate Final Average
    const finalAverageScore = totalScore / chunks.length;
    
    postMessage({ type: 'RESULT', score: finalAverageScore });
  }
};