import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults } from "@/data/scl90";
import { Button } from "@/components/ui/button";
import { RotateCcw, LayoutDashboard, FileText } from "lucide-react";
import { supabase } from "../supabase";
import { cn } from "@/lib/utils";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  
  // ✅ 方案 A：使用 any[] 类型，彻底消除 factor 和 score 的红线报错
  const [results, setResults] = useState<any[] | null>(null);

  useEffect(() => {
    const handleUsageAndData = async () => {
      // 1. 获取本地存储的答案并计算结果
      const savedAnswers = localStorage.getItem("test-answers");
      if (savedAnswers) {
        try {
          const answers = JSON.parse(savedAnswers);
          const calculated = calculateResults(answers);
          // 确保计算出的结果是数组
          setResults(Array.isArray(calculated) ? calculated : null);
        } catch (e) {
          console.error("解析答案失败:", e);
        }
      }

      // 2. 扣费逻辑
      const currentCode = localStorage.getItem('access_code');
      if (!currentCode) return;

      const { data, error } = await supabase
        .from('access_codes')
        .select('used_count, max_uses')
        .eq('code', currentCode)
        .single();

      if (data && !error) {
        const newUsedCount = data.used_count + 1;
        
        // 更新数据库 (扣费)
        const { error: updateError } = await supabase
          .from('access_codes')
          .update({ used_count: newUsedCount })
          .eq('code', currentCode);

        if (!updateError) {
          // 只有数据库更新成功后，才在页面上显示剩余次数
          setRemainingUses(data.max_uses - newUsedCount);
        }
      }
    };
    
    handleUsageAndData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">测评结果报告</h1>
          <p className="text-slate-500">基于 SCL-90 症状自评量表的深度分析</p>
        </div>

        {/* 结果展示区 */}
        {results && results.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                {/* 使用 item.factor，any类型下这里不会报错 */}
                <span className="text-sm font-medium text-slate-500 mb-1">{item.factor || "未知维度"}</span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-cyan-600">
                    {/* 使用 item.score，并增加兜底值防止报错 */}
                    {(item.score || 0).toFixed(2)}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    (item.score || 0) >= 2 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                  )}>
                    {(item.score || 0) >= 2 ? "显著" : "正常"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <FileText className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-400">正在生成深度分析报告，请稍候...</p>
            </div>
          </div>
        )}

        {/* 剩余次数提示 */}
        {remainingUses !== null && (
          <div className="bg-cyan-600 p-6 rounded-2xl text-white shadow-lg shadow-cyan-200 text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-cyan-100 text-sm mb-1">当前验证码剩余可用次数</p>
              <div className="text-3xl font-black">{remainingUses} 次</div>
            </div>
            <LayoutDashboard className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <p className="text-xs text-slate-400 italic">* 为了您的隐私，建议立即截图保存此报告</p>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full max-w-xs h-12 rounded-xl gap-2 border-slate-200 hover:bg-slate-100 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> 返回首页重新测评
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
