// DOM Elements
const inputText = document.getElementById('inputText');
const wordCount = document.getElementById('wordCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const statusBadge = document.getElementById('statusBadge');
const resultCard = document.getElementById('resultCard');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');

let historyArray = [];

// 1. Initialize the Web Worker
const worker = new Worker('model.js');

// 2. Listen for messages from the Worker
worker.onmessage = (event) => {
  const { type, message, score } = event.data;

  if (type === 'STATUS' && message === 'READY') {
    // Model loaded
    statusBadge.innerHTML = '✅ Ready';
    statusBadge.classList.add('ready');
    inputText.disabled = false;
    analyzeBtn.disabled = false;
  } 
  else if (type === 'RESULT') {
    // Prediction received
    displayResult(score, inputText.value.trim());
    analyzeBtn.innerHTML = '⚡ Analyze';
    analyzeBtn.disabled = false;
  }
};

// 3. UI Interactions
inputText.addEventListener('input', () => {
  const text = inputText.value.trim();
  const chars = text.length;
  const words = text === '' ? 0 : text.split(/\s+/).length;
  wordCount.innerText = `${chars} chars · ${words} words`;
});

analyzeBtn.addEventListener('click', () => {
  const text = inputText.value.trim();
  if (!text) return;

  // Set loading state
  analyzeBtn.innerHTML = '⏳ Analyzing...';
  analyzeBtn.disabled = true;

  // Send text to the Web Worker for processing
  worker.postMessage({ type: 'PREDICT', payload: text });
});

clearBtn.addEventListener('click', () => {
  inputText.value = '';
  wordCount.innerText = '0 chars · 0 words';
  resultCard.classList.add('hidden');
});

// 4. Render Result & Update History
function displayResult(score, text) {
  const isPositive = score > 0.5;
  const confidence = (isPositive ? score : (1 - score)) * 100;
  const confidenceStr = confidence.toFixed(1) + '%';
  const label = isPositive ? 'Positive' : 'Negative';

  // Update Result Card UI
  document.getElementById('resultEmoji').innerText = isPositive ? '😊' : '😠';
  document.getElementById('resultLabel').innerText = label;
  document.getElementById('resultScore').innerText = confidenceStr;
  document.getElementById('resultTextSnippet').innerText = `"${text}"`;
  
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = confidenceStr;

  // Swap CSS classes for colors
  const labelEl = document.getElementById('resultLabel');
  const scoreEl = document.getElementById('resultScore');
  
  labelEl.className = isPositive ? 'positive-text' : 'negative-text';
  scoreEl.className = isPositive ? 'score-text positive-text' : 'score-text negative-text';
  progressBar.className = isPositive ? 'progress-bar positive-bg' : 'progress-bar negative-bg';
  resultCard.className = isPositive ? 'card result-card border-positive' : 'card result-card border-negative';

  resultCard.classList.remove('hidden');

  // Add to History
  addToHistory({ text, label, confidenceStr, isPositive });
}

function addToHistory(item) {
  historyArray.unshift(item); // Add to beginning
  historyCount.innerText = `${historyArray.length} analyses`;

  if (historyArray.length === 1) {
    historyList.innerHTML = ''; // Clear empty state
  }

  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  historyItem.innerHTML = `
    <div class="emoji">${item.isPositive ? '😊' : '😠'}</div>
    <div style="min-width: 0; flex-grow: 1;">
      <div class="history-item-text">${item.text}</div>
      <div class="history-item-meta">
        <span class="${item.isPositive ? 'positive-text' : 'negative-text'}"><b>${item.label}</b></span>
        <span>·</span>
        <span>${item.confidenceStr}</span>
      </div>
    </div>
  `;
  
  historyList.prepend(historyItem);
}