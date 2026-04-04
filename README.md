# 🧠 BrainSpark: Privacy-First Sentiment Analysis
BrainSpark is an automated, highly efficient system designed to analyze public comments received through E-Consultation modules. By leveraging Edge-based Artificial Intelligence and Deep Learning, BrainSpark classifies citizen feedback directly within the user's browser — ensuring absolute data privacy as no information ever leaves the local device.
🌐 Live Demo – Try BrainSpark in action!

## 🚀 Key Features
- 🔒 Absolute Privacy: 100% of citizen feedback is processed locally; no data is transmitted to backend servers.
- 🎯 Contextual Accuracy: Powered by Google’s Universal Sentence Encoder (USE) to capture semantic meaning, sarcasm, and complex grammar.
- ⚡ Edge AI Performance: Runs deep learning models directly in the browser using TensorFlow.js with zero server-side compute costs.
- 📊 Scalable Data Processing: Memory-safe document chunking and mini-batching handle thousands of comments without crashing.
- 🖥️ Non-Blocking UI: Asynchronous Web Worker architecture ensures smooth 60fps interface while ML computations run in the background.
- 📈 Interactive Dashboards: Real-time visualization of sentiment distribution (Positive/Negative) using Chart.js.

## 🛠️ Technical Stack
- Frontend: HTML5, CSS3, JavaScript
- Machine Learning: TensorFlow.js
- Embeddings: Google Universal Sentence Encoder (USE)
- Visualization: Chart.js
- API: HTML5 FileReader API for local data ingestion

## 📂 Project Structure
├── index.html          # Main User Interface and Dashboard
├── styles.css          # Modern, responsive styling
├── app.js              # UI logic and Web Worker communication
├── model.js            # Background Web Worker for ML & TensorFlow.js logic
└── assets/             # Project static resources and icons

## 📖 How It Works
- Data Ingestion: Users upload .csv or .txt comment logs via the HTML5 FileReader API.
- Memory Management: Text chunking splits documents into batches for sequential processing.
- Feature Extraction: Sentences are mapped into 512-dimensional dense vector embeddings using USE.
- Classification: A custom Sequential Neural Network predicts sentiment (Positive/Negative).
- Visualization: Results are displayed via progress bars, historical logs, and aggregate charts in real time.

## 🎯 Objectives
- Process massive datasets of citizen comments without backend servers.
- Bypass manual stop-word removal or stemming using state-of-the-art embeddings.
- Reduce human bias and inconsistency in interpreting public opinion.
- Assist policymakers in making rapid, data-driven decisions through summarized insights.

## 🚀 Getting Started
Prerequisites
- Modern browser (Chrome, Edge, Firefox) with JavaScript enabled.
- Internet connection (only required to load USE model from TensorFlow.js CDN).
Installation
Clone the repository:
git clone [https://github.com/ArpitRangari13/brainspark.git](https://github.com/ArpitRangari13/BrainSpark-NLP-PBL-)
cd brainspark


Open index.html in your browser to launch BrainSpark.

## 📊 Demo Workflow
- Upload a .csv or .txt file containing citizen comments.
- Watch BrainSpark process data locally in your browser.
- Explore interactive dashboards showing sentiment distribution.

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a pull request.
For major changes, open an issue first to discuss what you’d like to improve.

