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
import { supabase } from "../supabase"; // 1. 导入数据库配置

const ResultsPage = () => {
  const navigate = useNavigate();
  const [remainingUses, setRemainingUses] = useState<number | null>(null);

  // 2. 获取剩余次数的逻辑
  // 修改后的逻辑：先获取次数、再扣除次数、最后更新页面显示
  useEffect(() => {
    const handleUsage = async () => {
      const currentCode = localStorage.getItem('access_code');
      if (!currentCode) return;

      // 1. 先从数据库查询当前的使用情况
      const { data } = await supabase
        .from('access_codes')
        .select('used_count, max_uses')
        .eq('code', currentCode)
        .single();

      if (data) {
        // 2. 关键：把数据库里的使用次数 + 1
        const newUsedCount = data.used_count + 1;
        
        await supabase
          .from('access_codes')
          .update({ used_count: newUsedCount })
          .eq('code', currentCode);

        // 3. 更新页面上显示的剩余次数（即：最大次数 - 新的使用次数）
        setRemainingUses(data.max_uses - newUsedCount);
      }
    };
    
    handleUsage();
  }, []); // 这里的空数组确保只有在第一次进入结果页时才执行一次扣费

  // 这里假设你原本有获取测试结果的逻辑...
  // const answers = JSON.parse(localStorage.getItem("test-answers") || "{}");
  // const results = calculateResults(answers);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 这里是你原本的结果显示内容... */}
        <h1 className="text-2xl font-bold text-center">测评结果报告</h1>

        {/* 3. 展示剩余次数的代码块 */}
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