import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 请确保路径与你项目实际结构一致
import { supabase } from "../supabase"; 
import { calculateResults } from "../data/scl90"; 
import { useToast } from "@/components/ui/use-toast";

const STORAGE_KEY = 'scl90_progress';

export default function AssessmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitAssessment = async () => {
    // 1. 基础校验：确保 90 题全部完成
    const completedCount = Object.keys(answers).length;
    if (isSubmitting || completedCount < 90) {
      toast({ 
        title: "提示", 
        description: `请完成所有题目后再提交（当前已完成: ${completedCount}/90）` 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. ⭐ 核心突破：立即锁定本地存储，不等待任何数据库操作
      const answersData = JSON.stringify(answers);
      window.localStorage.setItem("test-answers", answersData);
      window.localStorage.removeItem(STORAGE_KEY); 
      console.log("✅ 本地存储已锁定，准备跳转");

      // 3. 🚀 非阻塞操作：验证码扣费与数据库备份 (不使用 await)
      // 这样即便 Supabase 卡住或报错，也不会影响页面跳转
      (async () => {
        try {
          const currentCode = window.localStorage.getItem('access_code');
          
          // 执行验证码更新
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

          // 执行数据库结果备份
          const finalResults = (calculateResults as any)(answers);
          await (supabase as any).from("test_results").insert({
            test_type: "scl90",
            answers: answers,
            result: finalResults,
            submitted_at: new Date().toISOString(),
          });
          console.log("后台数据同步完成");
        } catch (bgError) {
          console.error("后台同步失败（非致命）:", bgError);
        }
      })();

      // 4. 立即反馈并跳转
      toast({ title: "提交成功", description: "正在为您展示测评报告..." });
      
      setTimeout(() => {
        navigate("/results");
      }, 200);

    } catch (error) {
      console.error("提交逻辑异常:", error);
      // 兜底：发生任何错误都强制跳转，因为 localStorage 可能已经存好了
      navigate("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">SCL-90 症状自评量表</h1>
          <p className="text-slate-500 mt-2">请根据您最近一周的实际感受进行选择</p>
          <div className="mt-4 inline-block px-4 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium">
            已完成: {Object.keys(answers).length} / 90
          </div>
        </div>

        {/* 这里需要确保你的题目列表组件正确调用了 setAnswers。
          例如：<QuestionList onAnswer={(id, val) => setAnswers(prev => ({...prev, [id]: val}))} />
        */}

        <div className="mt-10 pt-6 border-t border-slate-100">
          <button 
            onClick={submitAssessment}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isSubmitting 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-200"
            }`}
          >
            {isSubmitting ? "正在生成报告..." : "提交测评查看结果"}
          </button>
          <p className="text-center text-slate-400 text-xs mt-4">
            点击提交即表示您已阅读并同意个人隐私保护协议
          </p>
        </div>
      </div>
    </div>
  );
}