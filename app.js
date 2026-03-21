// Store the full text globally so we don't lose it if we truncate the UI
let currentFullText = "";

inputText.addEventListener('input', (e) => {
  // If the user types manually, keep our global variable synced
  currentFullText = e.target.value;
  
  const text = inputText.value.trim();
  const chars = text.length;
  const words = text === '' ? 0 : text.split(/\s+/).length;
  wordCount.innerText = `${chars} chars · ${words} words`;
});

// The upgraded file upload handler
fileUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
    alert("Please upload a valid .txt or .csv file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    currentFullText = e.target.result; // Store the REAL, massive text here

    // UI trick: Only render the first 2000 chars in the textarea so the browser doesn't freeze
    if (currentFullText.length > 2000) {
      inputText.value = currentFullText.substring(0, 2000) + "\n\n... [Display truncated for performance. Full document will be analyzed.]";
    } else {
      inputText.value = currentFullText;
    }
    
    inputText.dispatchEvent(new Event('input')); 
  };

  reader.readAsText(file);
  fileUpload.value = '';
});

// Update the Analyze button to send the FULL text, not the truncated text box value
analyzeBtn.addEventListener('click', () => {
  if (!currentFullText.trim()) return;

  analyzeBtn.innerHTML = '⏳ Analyzing Document...';
  analyzeBtn.disabled = true;

  // Send the massive text to the worker using our new command
  worker.postMessage({ type: 'PREDICT_DOCUMENT', payload: currentFullText });
});