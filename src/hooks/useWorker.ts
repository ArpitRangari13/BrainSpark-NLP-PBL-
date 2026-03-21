import { useEffect, useRef, useState, useCallback } from 'react';

export type ModelStatus = 'loading' | 'ready' | 'error';

export interface SentimentResult {
  text: string;
  label: 'Positive' | 'Negative';
  score: number;
}

export function useWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<SentimentResult | null>(null);
  const [history, setHistory] = useState<SentimentResult[]>([]);

  useEffect(() => {
    const worker = new Worker('/worker.js');
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'STATUS') {
        setModelStatus(payload === 'ready' ? 'ready' : 'error');
      } else if (type === 'RESULT') {
        const result: SentimentResult = payload;
        setCurrentResult(result);
        setHistory((prev) => [result, ...prev]);
        setIsAnalyzing(false);
      }
    };

    worker.onerror = () => {
      setModelStatus('error');
      setIsAnalyzing(false);
    };

    return () => worker.terminate();
  }, []);

  const predict = useCallback((text: string) => {
    if (workerRef.current && modelStatus === 'ready') {
      setIsAnalyzing(true);
      workerRef.current.postMessage({ type: 'PREDICT', payload: text });
    }
  }, [modelStatus]);

  const clearResult = useCallback(() => {
    setCurrentResult(null);
  }, []);

  return { modelStatus, isAnalyzing, currentResult, history, predict, clearResult };
}
