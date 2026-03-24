import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults } from "../data/scl90"; 
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// 引入你之前使用的图表库
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [remainingCount, setRemainingCount] = useState<string>("0");
  const navigate = useNavigate();

  useEffect(() => {
    const raw = window.localStorage.getItem("test-answers");
    const count = window.localStorage.getItem('remaining_count') || "0";
    setRemainingCount(count);

    if (raw) {
      try {
        const answers = JSON.parse(raw);
        const calc = calculateResults(answers);
        setResults(calc);
        console.log("[结果生成成功]");
      } catch (e) {
        console.error("解析数据失败", e);
      }
    }
  }, []);

  if (!results) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">正在深度解析心理健康画像...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 头部：高级深色渐变卡片 */}
        <Card className="relative overflow-hidden p-10 border-none shadow-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">SCL-90 症状自评报告</h1>
              <p className="text-slate-400 font-medium italic">Symptom Checklist 90 - Professional Analysis</p>
              <div className="mt-6 inline-flex items-center px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                <span className="text-xs font-bold text-cyan-400 mr-2">剩余验证次数:</span>
                <span className="text-xs font-mono font-bold text-white">{remainingCount}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <p className="text-4xl font-black text-white">{results.totalScore}</p>
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mt-2">总得分</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-orange-400">{results.positiveItems}</p>
                <p className="text-[10px] font-black text-orange-400/50 uppercase tracking-[0.2em] mt-2">阳性数</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：因子数据可视化图表 */}
          <Card className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-800">各维度因子画像</h3>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-right">均分参考线: 2.0</span>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.factorResults} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 5]} hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                    {results.factorResults.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 2 ? '#f97316' : '#10768e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 右侧：因子列表详情 */}
          <Card className="p-8 rounded-[2.5rem] bg-white border-none shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-50 pb-4">明细数据</h3>
            <div className="space-y-5 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {results.factorResults.map((f: any) => (
                <div key={f.factorId} className="flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-[#10768e] transition-colors">{f.name}</p>
                    <p className={`text-[10px] font-bold ${f.score >= 2 ? 'text-orange-500' : 'text-slate-300'}`}>
                      {f.score >= 2 ? '⚠️ 需关注' : '正常'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-black text-slate-900">{f.score.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 底部：专家解读建议 */}
        <Card className="p-10 bg-[#10768e] rounded-[2.5rem] text-white shadow-xl shadow-cyan-900/10">
          <div className="flex items-start gap-6">
            <div className="bg-white/10 p-4 rounded-2xl">
              <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-black text-cyan-300 uppercase tracking-[0.2em] mb-3">Professional Suggestion</h3>
              <p className="text-xl leading-relaxed font-medium italic opacity-90">
                "{results.suggestion}"
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-8 pb-12">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            className="text-slate-400 hover:text-[#10768e] font-bold tracking-widest text-xs transition-all hover:bg-transparent"
          >
            ← 返回首页重新测评
          </Button>
        </div>
      </div>
    </div>
  );
}