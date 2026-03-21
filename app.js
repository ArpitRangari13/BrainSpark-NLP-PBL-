const inputText = document.getElementById('inputText');
const wordCount = document.getElementById('wordCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const statusBadge = document.getElementById('statusBadge');
const resultCard = document.getElementById('resultCard');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const fileUpload = document.getElementById('fileUpload');
const uploadBtn = document.getElementById('uploadBtn');

let historyArray = [];
let currentFullText = ""; // Holds full text for massive documents

const worker = new Worker('model.js');

worker.onmessage = (event) => {
  const { type, message, score } = event.data;

  if (type === 'STATUS' && message === 'READY') {
    statusBadge.innerHTML = '✅ Ready';
    statusBadge.classList.add('ready');
    inputText.disabled = false;
    analyzeBtn.disabled = false;
  } 
  else if (type === 'RESULT') {
    displayResult(score, currentFullText || inputText.value.trim());
    analyzeBtn.innerHTML = '⚡ Analyze';
    analyzeBtn.disabled = false;
  }
};

inputText.addEventListener('input', (e) => {
  currentFullText = e.target.value;
  updateWordCount(currentFullText);
});

function updateWordCount(text) {
  const chars = text.length;
  const words = text === '' ? 0 : text.split(/\s+/).length;
  wordCount.innerText = `${chars} chars · ${words} words`;
}

uploadBtn.addEventListener('click', () => fileUpload.click());

fileUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    currentFullText = e.target.result;
    
    // UI protection: Only render first 2500 chars to prevent browser lag
    if (currentFullText.length > 2500) {
      inputText.value = currentFullText.substring(0, 2500) + "\n\n...[Display truncated for performance. Full document will be analyzed.]";
    } else {
      inputText.value = currentFullText;
    }
    updateWordCount(currentFullText);
  };
  reader.readAsText(file);
  fileUpload.value = '';
});

analyzeBtn.addEventListener('click', () => {
  if (!currentFullText.trim()) return;
  analyzeBtn.innerHTML = '⏳ Analyzing...';
  analyzeBtn.disabled = true;
  worker.postMessage({ type: 'PREDICT', payload: currentFullText });
});

clearBtn.addEventListener('click', () => {
  inputText.value = '';
  currentFullText = '';
  updateWordCount('');
  resultCard.classList.add('hidden');
});

function displayResult(score, text) {
  const isPositive = score > 0.5;
  const confidence = (isPositive ? score : (1 - score)) * 100;
  const confidenceStr = confidence.toFixed(1) + '%';
  const label = isPositive ? 'Positive' : 'Negative';

  document.getElementById('resultEmoji').innerText = isPositive ? '😊' : '😠';
  document.getElementById('resultLabel').innerText = label;
  document.getElementById('resultScore').innerText = confidenceStr;
  
  // Show a small snippet of the text in the result card
  const snippet = text.length > 150 ? text.substring(0, 150) + "..." : text;
  document.getElementById('resultTextSnippet').innerText = `"${snippet}"`;
  
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = confidenceStr;

  const labelEl = document.getElementById('resultLabel');
  const scoreEl = document.getElementById('resultScore');
  
  labelEl.className = isPositive ? 'positive-text' : 'negative-text';
  scoreEl.className = isPositive ? 'score-text positive-text' : 'score-text negative-text';
  progressBar.className = isPositive ? 'progress-bar positive-bg' : 'progress-bar negative-bg';
  resultCard.className = isPositive ? 'card result-card border-positive' : 'card result-card border-negative';

  resultCard.classList.remove('hidden');
  addToHistory({ text: snippet, label, confidenceStr, isPositive });
}

function addToHistory(item) {
  historyArray.unshift(item);
  historyCount.innerText = `${historyArray.length} analyses`;
  if (historyArray.length === 1) historyList.innerHTML = ''; 

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