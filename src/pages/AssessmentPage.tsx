import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { questions, scaleOptions, calculateResults } from "@/data/scl90";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabase";
import { toast } from "@/components/ui/use-toast";

const STORAGE_KEY = "scl90_progress";

const optionColors = [
  "border-option-1/40 hover:border-option-1 hover:bg-option-1/5",
  "border-option-2/40 hover:border-option-2 hover:bg-option-2/5",
  "border-option-3/40 hover:border-option-3 hover:bg-option-3/5",
  "border-option-4/40 hover:border-option-4 hover:bg-option-4/5",
  "border-option-5/40 hover:border-option-5 hover:bg-option-5/5",
];

const optionSelectedColors = [
  "border-option-1 bg-option-1/10 ring-1 ring-option-1/30",
  "border-option-2 bg-option-2/10 ring-1 ring-option-2/30",
  "border-option-3 bg-option-3/10 ring-1 ring-option-3/30",
  "border-option-4 bg-option-4/10 ring-1 ring-option-4/30",
  "border-option-5 bg-option-5/10 ring-1 ring-option-5/30",
];

function loadProgress(): { index: number; answers: Record<number, number> } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.index === "number" && parsed.answers) {
        return { index: parsed.index, answers: parsed.answers };
      }
    }
  } catch {}
  return { index: 0, answers: {} };
}

function saveProgress(index: number, answers: Record<number, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, answers }));
}

const AssessmentPage = () => {
  const navigate = useNavigate();
  const initial = useRef(loadProgress());
  const [currentIndex, setCurrentIndex] = useState(initial.current.index);
  const [answers, setAnswers] = useState<Record<number, number>>(initial.current.answers);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist progress on every change
  useEffect(() => {
    saveProgress(currentIndex, answers);
  }, [currentIndex, answers]);

  // Derived state — all from currentIndex
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const selectedValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  const submitAssessment = async (answersToSubmit: Record<number, number>) => {
    if (isSubmitting) return;
    if (Object.keys(answersToSubmit).length < 90) return;

    setIsSubmitting(true);
    try {
      const result = calculateResults(answersToSubmit);

      const { error } = await supabase.from("test_results").insert({
        test_type: "scl90",
        answers: answersToSubmit,
        result,
        submitted_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      sessionStorage.setItem("scl90_answers", JSON.stringify(answersToSubmit));
      localStorage.removeItem(STORAGE_KEY);
      navigate("/results");
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "提交失败，请稍后再试";

      toast({
        title: "提交失败",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = (value: number) => {
    if (isTransitioning || isSubmitting || !currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Check if this was the last question and all 90 are answered
    const newAnsweredCount = Object.keys(newAnswers).length;
    if (isLastQuestion && newAnsweredCount >= 90) {
      // Auto-submit after delay
      setIsTransitioning(true);
      setTimeout(() => {
        void submitAssessment(newAnswers);
      }, 400);
      return;
    }

    // Auto-advance to next question
    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isTransitioning && !isSubmitting) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    await submitAssessment(answers);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">
              第 {currentIndex + 1} 题 / 共 {questions.length} 题
            </span>
            <span>已答 {answeredCount} 题 · {Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div
          className={cn(
            "max-w-lg w-full space-y-10 transition-opacity duration-200",
            isTransitioning ? "opacity-40" : "opacity-100"
          )}
        >
          {/* Question text */}
          <div className="space-y-3 text-center">
            <span className="text-xs text-muted-foreground tracking-widest">
              第 {currentQuestion.id} 题
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
              {currentQuestion.text}
            </h2>
            <p className="text-sm text-muted-foreground">
              在最近一周内，该症状困扰您的程度
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {scaleOptions.map((option, idx) => {
              const isSelected = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={isTransitioning}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left",
                    isSelected ? optionSelectedColors[idx] : optionColors[idx],
                    !isSelected && "bg-card",
                    isTransitioning && "pointer-events-none"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {option.value}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">
                      {option.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isTransitioning || isSubmitting}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            上一题
          </Button>

          {isLastQuestion && answeredCount >= 90 ? (
            <Button onClick={handleSubmit} className="px-8" disabled={isSubmitting}>
              {isSubmitting ? "提交中..." : "提交测评"}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              已答 {answeredCount} / 90 题
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
