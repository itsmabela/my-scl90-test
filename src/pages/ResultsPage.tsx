import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults, type TestResult } from "@/data/scl90";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { supabase } from "../supabase";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [results, setResults] = useState<TestResult[] | null>(null);

  useEffect(() => {
    const processResultsAndUsage = async () => {
      // 1. 获取并计算测试结果 (确保图表有数据)
      const savedAnswers = localStorage.getItem("test-answers");
      if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        const calculated = calculateResults(answers);
        setResults(calculated);
      }

      // 2. 处理扣费逻辑
      const currentCode = localStorage.getItem('access_code');
      if (!currentCode) return;

      const { data, error } = await supabase
        .from('access_codes')
        .select('used_count, max_uses')
        .eq('code', currentCode)
        .single();

      if (data && !error) {
        const newUsedCount = data.used_count + 1;
        
        // 这一步是写入数据库
        const { error: updateError } = await supabase
          .from('access_codes')
          .update({ used_count: newUsedCount })
          .eq('code', currentCode);

        if (!updateError) {
          setRemainingUses(data.max_uses - newUsedCount);
        } else {
          console.error("更新失败:", updateError);
        }
      }
    };
    
    processResultsAndUsage();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">测评结果报告</h1>

        {/* --- 这里是你的结果展示区 (补回图表逻辑) --- */}
        {results ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {results.map((item) => (
              <div key={item.factor} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500">{item.factor}</p>
                <p className="text-lg font-bold text-cyan-600">{item.score.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">正在生成深度分析报告...</div>
        )}

        {/* --- 剩余次数展示 --- */}
        {remainingUses !== null && (
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              当前验证码剩余可用次数：
              <span className="font-bold ml-1 text-cyan-600">{remainingUses}</span> 次
            </p>
            <p className="text-[10px] text-slate-400 mt-1 italic">* 请及时截图保存</p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> 返回首页重新测评
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;