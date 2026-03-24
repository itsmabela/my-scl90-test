import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults } from "../data/scl90"; // 请核对路径
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 从 localStorage 获取答案
    const raw = window.localStorage.getItem("test-answers");
    console.log("读取到的原始数据:", raw);

    if (raw) {
      try {
        const answers = JSON.parse(raw);
        // 2. 调用计算逻辑
        const calculated = calculateResults(answers);
        console.log("计算后的结果:", calculated);
        setResults(calculated);
        console.log("[结果生成成功]"); // 对应你截图中的日志
      } catch (e) {
        console.error("解析或计算失败:", e);
      }
    }
  }, []);

  // 3. 渲染界面
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-center mb-8">测评结果报告</h1>

        {!results ? (
          <div className="text-center py-20">
            <p className="text-slate-500">正在生成深度分析报告，请稍候...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* 这里展示你的结果数据 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">总分</p>
                <p className="text-3xl font-bold text-cyan-600">{results.totalScore}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">阳性项目数</p>
                <p className="text-3xl font-bold text-cyan-600">{results.positiveCount}</p>
              </div>
            </div>

            {/* 如果你有图表组件，放在这里 */}
            <div className="mt-8 p-6 border rounded-xl">
              <h3 className="font-bold mb-4">各因子得分详情</h3>
              <pre className="text-xs bg-slate-50 p-4 rounded overflow-auto">
                {JSON.stringify(results.factors, null, 2)}
              </pre>
            </div>

            <div className="pt-8 flex justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                返回首页重新测评
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}