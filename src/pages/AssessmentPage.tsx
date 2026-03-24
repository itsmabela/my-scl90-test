import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    if (isSubmitting || Object.keys(answers).length < 90) {
      toast({ title: "提示", description: "请完成所有题目后再提交" });
      return;
    }
    setIsSubmitting(true);
    try {
      window.localStorage.removeItem(STORAGE_KEY); 
      window.localStorage.setItem("test-answers", JSON.stringify(answers));
      
      const currentCode = window.localStorage.getItem('access_code');
      if (currentCode) {
        const { data: codeData } = await (supabase as any).from('access_codes').select('used_count').eq('code', currentCode).single();
        if (codeData) {
          await (supabase as any).from('access_codes').update({ used_count: (codeData.used_count || 0) + 1 }).eq('code', currentCode);
        }
      }

      const calculated = (calculateResults as any)(answers);
      await (supabase as any).from("test_results").insert({
        test_type: "scl90", answers, result: calculated, submitted_at: new Date().toISOString(),
      });

      toast({ title: "提交成功", description: "报告生成中..." });
      setTimeout(() => { navigate("/results"); }, 300);
    } catch (error) {
      console.error(error);
      navigate("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 核心修正：必须添加 return 语句，返回具体的界面 HTML
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">SCL-90 症状自评自测</h1>
        
        {/* 这里是你原来的题目列表渲染逻辑 */}
        <p className="text-slate-500 mb-8">请根据最近一周的实际情况回答所有题目。</p>

        <button 
          onClick={submitAssessment}
          disabled={isSubmitting}
          className="w-full bg-cyan-600 text-white py-3 rounded-lg font-bold disabled:bg-slate-300"
        >
          {isSubmitting ? "提交中..." : "提交测评查看报告"}
        </button>
      </div>
    </div>
  );
}