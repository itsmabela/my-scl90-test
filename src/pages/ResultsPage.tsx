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

const levelColors: Record<string, string> = {
  normal: "text-success",
  mild: "text-primary",
  moderate: "text-warning",
  severe: "text-destructive",
};

const levelLabels: Record<string, string> = {
  normal: "正常",
  mild: "轻度",
  moderate: "中度",
  severe: "重度",
};

const levelBadgeVariants: Record<string, string> = {
  normal: "bg-success/10 text-success border-success/20",
  mild: "bg-primary/10 text-primary border-primary/20",
  moderate: "bg-warning/10 text-warning border-warning/20",
  severe: "bg-destructive/10 text-destructive border-destructive/20",
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("scl90_answers");
    if (!stored) {
      navigate("/");
      return;
    }
    const answers = JSON.parse(stored);
    setResult(calculateResults(answers));
  }, [navigate]);

  if (!result) return null;

  const radarData = result.factorResults.map((f) => ({
    factor: f.name,
    score: f.score,
    fullMark: 5,
  }));

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            测评结果报告
          </h1>
          <Badge
            variant="outline"
            className="px-4 py-2 text-xs tracking-wide border-primary/30 text-muted-foreground"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-warning" />
            本量表为筛查评估工具，不能替代专业诊断
          </Badge>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 text-center space-y-1">
            <TrendingUp className="w-5 h-5 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">{result.totalScore}</div>
            <div className="text-xs text-muted-foreground">总分</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-center space-y-1">
            <BarChart3 className="w-5 h-5 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">{result.totalAverage}</div>
            <div className="text-xs text-muted-foreground">总均分</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-center space-y-1">
            <Activity className="w-5 h-5 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">{result.positiveItems}</div>
            <div className="text-xs text-muted-foreground">阳性项目数</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 text-center space-y-1">
            <BarChart3 className="w-5 h-5 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">{result.positiveAverage}</div>
            <div className="text-xs text-muted-foreground">阳性均分</div>
          </div>
        </div>

        {/* Overall level */}
        <div
          className={cn(
            "border rounded-xl p-6",
            levelBadgeVariants[result.overallLevel]
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                result.overallLevel === "normal"
                  ? "bg-success/20"
                  : result.overallLevel === "mild"
                  ? "bg-primary/20"
                  : result.overallLevel === "moderate"
                  ? "bg-warning/20"
                  : "bg-destructive/20"
              )}
            >
              <Activity
                className={cn("w-5 h-5", levelColors[result.overallLevel])}
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                综合评估：{levelLabels[result.overallLevel]}
              </h3>
              <p className="text-sm mt-1 text-foreground/80 leading-relaxed">
                {result.suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
            九因子雷达图
          </h2>
          <div className="w-full h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid
                  stroke="hsl(210 15% 88%)"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fontSize: 12, fill: "hsl(210 10% 55%)" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "hsl(210 10% 55%)" }}
                  tickCount={6}
                />
                <Radar
                  name="因子得分"
                  dataKey="score"
                  stroke="hsl(195 25% 38%)"
                  fill="hsl(195 25% 38%)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Factor details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            各因子详细解读
          </h2>
          {result.factorResults.map((f) => (
            <div
              key={f.factorId}
              className="bg-card border border-border rounded-xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{f.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {f.score}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", levelBadgeVariants[f.level])}
                  >
                    {levelLabels[f.level]}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{f.description}</p>
              <p className="text-sm text-foreground/80">{f.interpretation}</p>
            </div>
          ))}
        </div>

        {/* Retry button */}
        <div className="text-center pt-4 pb-8">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => {
              sessionStorage.removeItem("scl90_answers");
              localStorage.removeItem("scl90_progress");
              navigate("/");
            }}
          >
            <RotateCcw className="w-4 h-4" />
            重新测评
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
