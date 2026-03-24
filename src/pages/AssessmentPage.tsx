import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { questions, scaleOptions, calculateResults } from "@/data/scl90";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
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
  const [isFinished, setIsFinished] = useState(Object.keys(initial.current.answers).length >= 90);

  useEffect(() => {
    if (!isFinished) {
      saveProgress(currentIndex, answers);
    }
  }, [currentIndex, answers, isFinished]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const selectedValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  const submitAssessment = async () => {
    if (isSubmitting || Object.keys(answers).length < 90) return;

    setIsSubmitting(true);
    try {
      // 1. 验证码扣费逻辑
      const currentCode = localStorage.getItem('access_code');
      if (currentCode) {
        const { data: codeData } = await supabase
          .from('access_codes')
          .select('used_count')
          .eq('code', currentCode)
          .single();

        if (codeData) {
          await supabase
            .from('access_codes')
            .update({ used_count: (codeData.used_count || 0) + 1 })
            .eq('code', currentCode);
        }
      }

      // 2. 计算并备份结果
      const finalResult = (calculateResults as any)(answers);
      await supabase.from("test_results").insert({
        test_type: "scl90",
        answers: answers,
        result: finalResult,
        submitted_at: new Date().toISOString(),
      });

      // 3. 关键：存入结果页需要的 'test-answers' 键名
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("test-answers", JSON.stringify(answers));
      
      toast({ title: "提交成功", description: "正在生成您的专业报告..." });

      // 4. 延迟跳转确保 IO 完成
      setTimeout(() => {
        navigate("/results");
      }, 300);

    } catch (e: any) {
      console.error("提交失败:", e);
      toast({ title: "保存失败", description: "网络错误，请稍后重试", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = (value: number) => {
    if (isTransitioning || isSubmitting || !currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isSubmitting) {
      setIsFinished(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium text-cyan-700">第 {currentIndex + 1} 题 / 共 {questions.length} 题</span>
            <span>已答 {answeredCount} 题 · {Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {!isFinished ? (
          <div className={cn("max-w-lg w-full space-y-10 transition-opacity duration-200", isTransitioning ? "opacity-40" : "opacity-100")}>
            <div className="space-y-3 text-center">
              <span className="text-xs text-muted-foreground tracking-widest uppercase font-bold">Question {currentQuestion.id}</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-relaxed">{currentQuestion.text}</h2>
            </div>

            <div className="space-y-3">
              {scaleOptions.map((option, idx) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  disabled={isTransitioning}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left shadow-sm",
                    selectedValue === option.value ? optionSelectedColors[idx] : optionColors[idx] + " bg-white"
                  )}
                >
                  <span className={cn("flex items-center justify-center w-10 h-10 rounded-full text-base font-bold shrink-0", selectedValue === option.value ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-500")}>
                    {option.value}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800">{option.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">测评已完成</h2>
              <p className="text-slate-500">点击下方按钮生成您的深度专业分析报告。</p>
            </div>
            <Button onClick={submitAssessment} className="w-full h-14 bg-cyan-600 hover:bg-cyan-700 text-lg rounded-2xl" disabled={isSubmitting}>
              {isSubmitting ? "正在计算结果..." : "立即提交并查看结果"}
            </Button>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0 || isSubmitting} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> 上一题
          </Button>
          <span className="text-xs font-medium text-slate-400">进度: {answeredCount} / 90</span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;