import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults } from "../data/scl90"; 
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [remainingCount, setRemainingCount] = useState<string>("0");
  const navigate = useNavigate();

  useEffect(() => {
    const raw = window.localStorage.getItem("test-answers");
    const count = window.localStorage.getItem("remaining_count") || "0";
    setRemainingCount(count);

    if (raw) {
      try {
        const answers = JSON.parse(raw);
        setResults(calculateResults(answers));
      } catch (e) { console.error("解析结果失败", e); }
    }
  }, []);

  if (!results) return <div className="p-20 text-center text-slate-300 font-bold">正在载入深度分析报告...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 顶部总览 - 还原 image_ff341c.png 的渐变风格 */}
        <Card className="p-12 border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Assessment Report</p>
          <h1 className="text-4xl font-black mb-2 tracking-tight">测评结论报告</h1>
          <p className="opacity-40 text-sm font-medium">剩余验证次数：{remainingCount}</p>
          
          <div className="grid grid-cols-2 gap-12 mt-10 pt-10 border-t border-white/5">
            <div>
              <p className="text-5xl font-black text-white">{results.totalScore}</p>
              <p className="text-[10px] text-cyan-400 font-black mt-2 uppercase tracking-widest">总得分</p>
            </div>
            <div>
              <p className="text-5xl font-black text-orange-400">{results.positiveItems}</p>
              <p className="text-[10px] text-orange-400/50 font-black mt-2 uppercase tracking-widest">阳性项目</p>
            </div>
          </div>
        </Card>

        {/* 核心：因子得分详情 - 还原图表 */}
        <Card className="p-10 rounded-[3rem] border-none shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-900">维度数据详情</h3>
          </div>
          <div className="space-y-8">
            {results.factorResults.map((f: any) => (
              <div key={f.factorId} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800 font-black">{f.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${f.score >= 2 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-300'}`}>
                      {f.score >= 2 ? '⚠️ 需关注' : '正常'}
                    </span>
                  </div>
                  <span className="font-mono font-black text-slate-900">{f.score.toFixed(2)}</span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${f.score >= 2 ? 'bg-orange-400' : 'bg-cyan-500'}`}
                    style={{ width: `${(f.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 专家建议 */}
        <Card className="p-10 bg-white rounded-[3rem] border-none shadow-sm border-l-8 border-l-slate-900">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Guidance</h3>
          <p className="text-2xl leading-relaxed text-slate-800 font-medium italic">
            "{results.suggestion}"
          </p>
        </Card>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            className="text-slate-400 hover:text-slate-900 font-bold tracking-widest text-xs"
          >
            ← 返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}