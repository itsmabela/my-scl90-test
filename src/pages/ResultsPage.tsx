import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults, type TestResult } from "@/data/scl90";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, TrendingUp, Activity, BarChart3 } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { supabase } from "../supabase";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [results, setResults] = useState<TestResult[] | null>(null); // 存储测评结果

  useEffect(() => {
    const handleUsageAndData = async () => {
      // 1. 获取本地存储的答案并计算结果
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
        
        // 执行数据库更新
        await supabase
          .from('access_codes')
          .update({ used_count: newUsedCount })
          .eq('code', currentCode);

        // 计算并设置剩余次数
        const left = data.max_uses - newUsedCount;
        setRemainingUses(left < 0 ? 0 : left);
      }
    };
    
    handleUsageAndData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">测评结果报告</h1>

        {/* 这里原本应该有你的图表展示代码，如果被删了，请记得补回 */}
        {results && (
          <div className="p-4 bg-white shadow rounded-xl text-center">
            <p className="text-slate-600">测试已完成，结果已生成</p>
          </div>
        )}

        {/* 剩余次数展示 */}
        {remainingUses !== null && (
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center mx-4">
            <p className="text-sm text-slate-500">
              当前验证码剩余可用次数：
              <span className={`font-bold ml-1 ${remainingUses <= 1 ? 'text-red-500' : 'text-cyan-600'}`}>
                {remainingUses}
              </span> 次
            </p>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              * 次数用完后将无法再次查看结果，请及时截图保存当前页面
            </p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> 返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;