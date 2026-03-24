const ResultsPage = () => {
  const navigate = useNavigate();
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  // 第 4 行 👈 修改这里

// 定义计算结果的结构接口
interface SCL90ResultFactor {
  factor: string; // 因子名称，如“躯体化”
  score: number;  // 因子分数，如 1.55
}

// 将 setResults 的类型明确为该接口的数组
const [results, setResults] = useState<SCL90ResultFactor[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processResults = async () => {
      setLoading(true);
      console.log("🔍 [诊断] 开始处理结果页逻辑...");

      // 1. 读取本地存储的答案并计算
      const savedAnswers = localStorage.getItem("test-answers");
      console.log("🔍 [诊断] LocalStorage 中的 'test-answers':", savedAnswers);

      if (savedAnswers) {
        try {
          const answers = JSON.parse(savedAnswers);
          console.log("🔍 [诊断] 解析后的答案对象:", answers);

          const calculated = calculateResults(answers);
          console.log("🔍 [诊断] 计算出的维度分数:", calculated);

          if (Array.isArray(calculated) && calculated.length > 0) {
            setResults(calculated);
            console.log("✅ [诊断] 结果已成功存入 State");
          } else {
            console.error("❌ [诊断] calculateResults 返回了空数组或无效数据");
          }
        } catch (e) {
          console.error("❌ [诊断] JSON 解析或计算过程崩溃:", e);
        }
      } else {
        console.warn("⚠️ [诊断] 没找到 'test-answers'，请检查 AssessmentPage 是否存对了名字");
      }

      // 2. 检查数据库连接 (从 Supabase 读取次数)
      const currentCode = localStorage.getItem('access_code');
      if (currentCode) {
        try {
          const { data, error } = await supabase
            .from('access_codes')
            .select('used_count, max_uses')
            .eq('code', currentCode)
            .single();

          if (error) throw error;
          if (data) {
            console.log("✅ [诊断] 成功从 Supabase 读取次数:", data);
            setRemainingUses(data.max_uses - data.used_count);
          }
        } catch (err) {
          console.error("❌ [诊断] Supabase 读取失败，请检查 RLS 策略:", err);
        }
      }

      setLoading(false);
    };
    
    processResults();
  }, []); // 👈 确保这里只有一个 useEffect，且末尾是空的依赖数组

  // 下面接你的 return (...) 代码