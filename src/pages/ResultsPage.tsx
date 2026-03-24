import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults } from "../data/scl90"; 
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = window.localStorage.getItem("test-answers");
    if (raw) {
      try {
        const answers = JSON.parse(raw);
        setResults(calculateResults(answers));
        console.log("[结果生成成功]");
      } catch (e) { console.error("解析数据失败", e); }
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-500 mb-4 animate-pulse">正在努力为您计算分析结果...</p>
        <Button onClick={() => navigate("/")}>返回首页</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-cyan-600 to-indigo-700 text-white text-center rounded-[2rem]">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">SCL-90 症状自评量表结果报告</h1>
          <p className="opacity-80 font-medium">完成时间：{new Date().toLocaleString()}</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center rounded-2xl border-none shadow-sm bg-white">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">总分</p>
            <p className="text-4xl font-black text-cyan-600">{results.totalScore}</p>
          </Card>
          <Card className="p-6 text-center rounded-2xl border-none shadow-sm bg-white border-t-4 border-orange-400">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">阳性项目数</p>
            <p className="text-4xl font-black text-orange-500">{results.positiveItems}</p>
          </Card>
          <Card className="p-6 text-center rounded-2xl border-none shadow-sm bg-white">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">状态评估</p>
            <p className={`text-xl font-bold mt-2 ${results.overallLevel === 'normal' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {results.overallLevel === 'normal' ? '✨ 状态良好' : '📢 建议关注'}
            </p>
          </Card>
        </div>

        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-cyan-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800">各维度详细得分 (均分)</h3>
          </div>
          <div className="space-y-6">
            {results.factorResults.map((f: any) => (
              <div key={f.factorId} className="group">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600 group-hover:text-cyan-600 transition-colors">{f.name}</span>
                  <span className={f.score >= 2 ? 'text-orange-500' : 'text-slate-300'}>{f.score.toFixed(2)}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${f.score >= 2 ? 'bg-orange-400' : 'bg-cyan-500'}`}
                    style={{ width: `${(f.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-cyan-50/50 rounded-[2rem] border border-cyan-100/50 shadow-inner">
          <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">💡 专家深度解析建议</h3>
          <div className="bg-white p-6 rounded-2xl border border-cyan-100 text-slate-600 leading-relaxed text-lg shadow-sm">
            {results.suggestion}
          </div>
        </Card>

        <div className="flex justify-center pb-12">
          <Button onClick={() => navigate("/")} variant="outline" className="px-14 py-8 rounded-2xl border-2 font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95">
            返回重新测评
          </Button>
        </div>
      </div>
    </div>
  );
}