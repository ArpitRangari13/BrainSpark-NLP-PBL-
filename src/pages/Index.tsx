import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Zap,
  Clock,
  Brain,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useWorker, type SentimentResult } from "@/hooks/useWorker";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const { modelStatus, isAnalyzing, currentResult, history, predict, clearResult } = useWorker();

  const handleAnalyze = () => {
    if (inputText.trim() && modelStatus === "ready" && !isAnalyzing) {
      predict(inputText.trim());
    }
  };

  const handleClear = () => {
    setInputText("");
    clearResult();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAnalyze();
    }
  };

  const charCount = inputText.length;
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-primary -top-40 -left-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent top-1/3 -right-32 fixed" />
      <div className="orb w-[300px] h-[300px] bg-success bottom-0 left-1/3 fixed" />

      {/* Dot grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 0.5px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl gradient-border bg-primary/5">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                Edge Sentiment AI
              </h1>
              <p className="text-[11px] text-muted-foreground tracking-wide uppercase">On-device NLP</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:flex">
              <Shield className="h-3 w-3" />
              <span>Private & Secure</span>
            </div>
            <StatusBadge status={modelStatus} />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-6 py-10">
        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { icon: Zap, label: "Real-time analysis" },
            { icon: Shield, label: "100% private" },
            { icon: Activity, label: "On-device ML" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <Icon className="h-3 w-3 text-primary/70" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
            Understand the emotion<br />
            <span className="gradient-text">behind every word.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Paste any text and get instant sentiment analysis — powered entirely by your browser.
            Zero servers, zero latency, zero compromises on privacy.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card-elevated rounded-2xl overflow-hidden"
            >
              {/* Gradient top accent */}
              <div className="h-[2px] w-full" style={{
                background: "linear-gradient(90deg, hsl(243 75% 59%), hsl(280 73% 57%), hsl(330 80% 60%))"
              }} />

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-muted-foreground/60" />
                  <span className="text-sm font-medium text-foreground">Input Text</span>
                </div>

                <Textarea
                  placeholder="Type or paste any text to analyze its sentiment..."
                  className="min-h-[180px] resize-none border-0 bg-secondary/30 rounded-xl p-4 text-[15px] leading-relaxed shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:bg-secondary/50 transition-colors"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {charCount > 0 ? (
                      <>
                        <span className="mono text-[11px] text-muted-foreground/70 tabular-nums">
                          {charCount} chars
                        </span>
                        <span className="h-3 w-px bg-border" />
                        <span className="mono text-[11px] text-muted-foreground/70 tabular-nums">
                          {wordCount} words
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/50">
                        Waiting for input…
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg"
                      disabled={!inputText && !currentResult}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={modelStatus !== "ready" || !inputText.trim() || isAnalyzing}
                      size="sm"
                      className="h-9 gap-2 rounded-xl px-5 text-xs font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:shadow-none"
                      style={{
                        background: modelStatus === "ready" && inputText.trim() && !isAnalyzing
                          ? "linear-gradient(135deg, hsl(243 75% 59%), hsl(280 73% 57%))"
                          : undefined,
                      }}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          Analyze
                          <kbd className="ml-0.5 hidden rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-1.5 py-0.5 font-mono text-[10px] leading-none sm:inline">
                            ⌘↵
                          </kbd>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Result Card */}
            <AnimatePresence mode="wait">
              {currentResult && (
                <ResultCard result={currentResult} />
              )}
            </AnimatePresence>
          </div>

          {/* Right column — History */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-0"
          >
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
                    <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">History</h3>
                </div>
                {history.length > 0 && (
                  <span className="mono rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                    {history.length}
                  </span>
                )}
              </div>

              <div className="p-3 max-h-[480px] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {history.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center px-6 py-16 text-center"
                    >
                      <div className="relative">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80">
                          <Sparkles className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary/40" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm font-medium text-muted-foreground/70">No analyses yet</p>
                      <p className="mt-1 text-xs text-muted-foreground/40 max-w-[200px]">
                        Run your first analysis and results will appear here
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-1.5">
                      {history.map((item, i) => (
                        <HistoryItem key={`${item.text.slice(0, 20)}-${i}`} item={item} index={i} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

function ResultCard({ result }: { result: SentimentResult }) {
  const confidence = Math.max(result.score, 1 - result.score) * 100;
  const isPositive = result.label === "Positive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card-elevated rounded-2xl overflow-hidden"
    >
      {/* Gradient bar */}
      <div
        className="h-[3px] w-full"
        style={{
          background: isPositive
            ? "linear-gradient(90deg, hsl(160 84% 39%), hsl(166 72% 40%), hsl(180 70% 42%))"
            : "linear-gradient(90deg, hsl(4 90% 58%), hsl(20 90% 55%), hsl(36 90% 52%))",
        }}
      />

      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Emoji container */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.1 }}
            className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${
              isPositive ? "bg-success/8" : "bg-destructive/8"
            }`}
          >
            <span className="text-4xl" style={{ animation: "float 3s ease-in-out infinite" }}>
              {isPositive ? "😊" : "😠"}
            </span>
            {/* Subtle ring */}
            <div className={`absolute inset-0 rounded-2xl border-2 ${
              isPositive ? "border-success/15" : "border-destructive/15"
            }`} />
          </motion.div>

          <div className="flex-1 space-y-4 min-w-0">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isPositive ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10">
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  </div>
                )}
                <span className={`text-xl font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
                  {result.label}
                </span>
              </div>
              <div className={`mono rounded-xl px-3 py-1.5 text-sm font-semibold ${
                isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}>
                {confidence.toFixed(1)}%
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium">Confidence Score</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    background: isPositive
                      ? "linear-gradient(90deg, hsl(160 84% 39%), hsl(166 72% 40%))"
                      : "linear-gradient(90deg, hsl(4 90% 58%), hsl(20 90% 55%))",
                  }}
                />
              </div>
            </div>

            {/* Analyzed text */}
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                "{result.text}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HistoryItem({ item, index }: { item: SentimentResult; index: number }) {
  const confidence = Math.max(item.score, 1 - item.score) * 100;
  const isPositive = item.label === "Positive";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group relative flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-secondary/60 cursor-default"
    >
      {/* Sentiment indicator */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
        isPositive ? "bg-success/10" : "bg-destructive/10"
      }`}>
        {isPositive ? "😊" : "😠"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-foreground leading-snug">
          {item.text.length > 45 ? item.text.slice(0, 45) + "…" : item.text}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className={`text-[11px] font-semibold ${isPositive ? "text-success" : "text-destructive"}`}>
            {item.label}
          </span>
          <span className="mono text-[11px] text-muted-foreground/50">{confidence.toFixed(0)}%</span>
        </div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 transition-all group-hover:text-muted-foreground/50 group-hover:translate-x-0.5" />
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-warning/20 bg-warning/5 px-3 py-1.5">
        <div className="relative">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-warning" />
        </div>
        <span className="text-[11px] font-semibold text-warning">Loading model…</span>
      </div>
    );
  }
  if (status === "ready") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5"
      >
        <div className="relative flex h-3.5 w-3.5 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-success/20" />
          <CheckCircle2 className="relative h-3.5 w-3.5 text-success" />
        </div>
        <span className="text-[11px] font-semibold text-success">Model ready</span>
      </motion.div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1.5">
      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
      <span className="text-[11px] font-semibold text-destructive">Error</span>
    </div>
  );
}

export default Index;
