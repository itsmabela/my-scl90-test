import { useEffect, useState } from "react";
// 路径必须与 AssessmentPage 保持对齐
import { calculateResults } from "../data/scl90"; 

export default function ResultsPage() {
  // 使用 <any> 允许状态接收计算出的结果对象
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const loadStoredResults = () => {
      // 1. 获取本地存储
      const rawData = window.localStorage.getItem("test-answers");
      
      if (!rawData) {
        console.error("⚠️ [未发现数据] LocalStorage 中没有 test-answers");
        return;
      }

      try {
        // 2. 解析并计算
        const parsedAnswers = JSON.parse(rawData);
        const computedData = (calculateResults as any)(parsedAnswers);
        
        if (computedData) {
          setResults(computedData);
          console.log("✅ [结果生成成功]");
        }
      } catch (err) {
        console.error("❌ [解析失败] 答案格式不正确:", err);
      }
    };

    loadStoredResults();
  }, []);

  // ... 你的报告渲染逻辑
  if (!results) return <div>正在生成报告，请稍候...</div>;

  return (
    <div>
      {/* 这里渲染你的图表和结果 */}
      <h1>测评结果报告</h1>
    </div>
  );
}