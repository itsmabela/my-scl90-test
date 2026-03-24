import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; 
import { calculateResults, questions, scaleOptions } from "../data/scl90"; 
import { useToast } from "@/components/ui/use-toast";

const STORAGE_KEY = 'scl90_progress';

export default function AssessmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. 初始化：从本地恢复进度
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
      } catch (e) {
        console.error("恢复进度失败", e);
      }
    }
  }, []);

  // 2. 选择答案逻辑
  const handleSelect = (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    // 实时保存进度到本地，防止意外刷新
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: newAnswers }));
  };

  // 3. 提交逻辑
  const submitAssessment = async () => {
    const completedCount = Object.keys(answers).length;
    if (completedCount < 90) {
      toast({ 
        title: "未完成", 
        description: `请完成所有题目（当前: ${completedCount}/90），漏题会导致结果不准确。` 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 立即锁定答案到本地存储，供结果页读取
      window.localStorage.setItem("test-answers", JSON.stringify(answers));
      window.localStorage.removeItem(STORAGE_KEY); 

      // 后台执行异步任务（不等待，直接跳转）
      (async () => {
        try {
          const currentCode = window.localStorage.getItem('access_code');
          // 1. 更新验证码使用次数
          if (currentCode) {
            const { data: codeData } = await (supabase as any)
              .from('access_codes')
              .select('used_count')
              .eq('code', currentCode)
              .single();

            if (codeData) {
              await (supabase as any)
                .from('access_codes')
                .update({ used_count: (Number(codeData.used_count) || 0) + 1 })
                .eq('code', currentCode);
            }
          }

          // 2. 备份测试结果到数据库
          const finalResults = calculateResults(answers);
          await (supabase as any).from("test_results").insert({
            test_type: "scl90",
            answers: answers,
            result: finalResults,
            submitted_at: new Date().toISOString(),
          });
          console.log("后台数据备份完成");
        } catch (bgError) {
          console.error("后台同步非致命异常:", bgError);
        }
      })();

      toast({ title: "提交成功", description: "正在为您生成深度分析报告..." });
      
      // 略微延迟确保存储写入完成
      setTimeout(() => {
        navigate("/results");
      }, 300);

    } catch (error) {
      console.error("提交异常:", error);
      navigate("/results"); // 发生错误也尝试跳转
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        {/* 顶部固定进度栏 */}
        <div className="mb-8 sticky top-0 bg-white/95 backdrop-blur py-4 z-10 border-b">
          <h1 className="text-2xl font-bold text-slate-900">SCL-90 症状自评量表</h1>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-slate-500">请根据您最近一周的实际感受进行选择</span>
            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold">
              已完成: {Object.keys(answers).length} / 90
            </span>
          </div>
          {/* 进度条演示 */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300" 
              style={{ width: `${(Object.keys(answers).length / 90) * 100}%` }}
            />
          </div>
        </div>

        {/* 题目列表 */}
        <div className="space-y-10">
          {questions.map((q) => (
            <div key={q.id} className="group">
              <p className="text-lg font-medium text-slate-800 mb-5 group-hover:text-cyan-700 transition-colors">
                <span className="text-slate-300 mr-2 text-sm font-mono">{q.id}.</span>
                {q.text}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {scaleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(q.id, opt.value)}
                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      answers[q.id] === opt.value
                        ? "bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-100 ring-2 ring-cyan-100"
                        : "bg-white border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 底部提交按钮 */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <button 
            onClick={submitAssessment}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all ${
              isSubmitting 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-cyan-600 text-white hover:bg-cyan-700 shadow-xl shadow-cyan-200 active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "报告生成中..." : "提交测评查看结果"}
          </button>
          <p className="text-center text-slate-400 text-xs mt-6">
            本测评仅作为心理状态参考，不作为临床诊断依据
          </p>
        </div>
      </div>
    </div>
  );
}