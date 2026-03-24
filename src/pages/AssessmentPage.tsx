import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 重点：请根据你项目的实际目录结构检查这些路径
import { supabase } from "../supabase"; 
import { calculateResults } from "../data/scl90"; 
import { useToast } from "@/components/ui/use-toast";

// 定义进度缓存的键名
const STORAGE_KEY = 'scl90_progress';

export default function AssessmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitAssessment = async () => {
    // 1. 基础校验
    if (isSubmitting || Object.keys(answers).length < 90) {
      toast({ title: "提示", description: "请完成所有题目后再提交" });
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. 🔥 核心：立即锁定本地存储，确保跳转后 ResultsPage 有数据
      // 这里的键名 "test-answers" 必须与结果页完全对齐
      window.localStorage.removeItem(STORAGE_KEY); 
      window.localStorage.setItem("test-answers", JSON.stringify(answers));
      console.log("✅ 数据已存入 LocalStorage: test-answers");

      // 3. 异步处理验证码扣费（使用 as any 绕过可能的类型报错）
      const currentCode = window.localStorage.getItem('access_code');
      if (currentCode) {
        const { data: codeData } = await (supabase as any)
          .from('access_codes')
          .select('used_count')
          .eq('code', currentCode)
          .single();

        if (codeData) {
          await (supabase as any)
            .from('access_codes')
            .update({ used_count: (codeData.used_count || 0) + 1 })
            .eq('code', currentCode);
        }
      }

      // 4. 异步备份到数据库
      const calculated = (calculateResults as any)(answers);
      await (supabase as any).from("test_results").insert({
        test_type: "scl90",
        answers: answers,
        result: calculated,
        submitted_at: new Date().toISOString(),
      });

      toast({ title: "提交成功", description: "报告生成中..." });
      
      // 5. 强制跳转
      setTimeout(() => {
        navigate("/results");
      }, 300);

    } catch (error) {
      console.error("提交过程出现非致命异常:", error);
      // 即使数据库失败，因为步骤2已经存了本地，依然跳转显示报告
      navigate("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... 其余渲染逻辑保持不变
}