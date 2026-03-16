import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, ClipboardList, ArrowRight } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 overflow-hidden"
      style={{
        backgroundColor: "#FDFCF9",
        backgroundImage: `
          radial-gradient(900px 700px at 15% 20%, rgba(250, 243, 224, 0.85) 0%, rgba(250, 243, 224, 0) 60%),
          radial-gradient(900px 700px at 85% 25%, rgba(240, 244, 237, 0.9) 0%, rgba(240, 244, 237, 0) 62%),
          radial-gradient(900px 700px at 55% 95%, rgba(250, 243, 224, 0.65) 0%, rgba(250, 243, 224, 0) 58%),
          radial-gradient(1000px 800px at 50% 45%, rgba(253, 252, 249, 0.9) 0%, rgba(253, 252, 249, 0) 60%)
        `,
      }}
    >
      <div className="relative z-10 max-w-xl w-full space-y-12 text-center">
        {/* Disclaimer badge */}
        <Badge variant="outline" className="px-4 py-2 text-xs tracking-wide border-primary/30 text-muted-foreground">
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-warning" />
          本量表为筛查评估工具，不能替代专业诊断
        </Badge>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            SCL-90
            <br />
            <span className="text-primary font-medium text-2xl md:text-3xl tracking-[0.18em]">
              症状自评量表
            </span>
          </h1>
          <div className="text-xs md:text-sm text-foreground/55">
            每一个情绪，都值得被看见。
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            SCL-90（Symptom Checklist-90）是国际通用的心理健康评估工具，
            通过90个项目评估您近期的身心状况，帮助您更好地了解自己。
          </p>
        </div>

        {/* Info cards */}
        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>约 5-10 分钟</span>
          </div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <span>共 90 题</span>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="border rounded-[24px] px-8 py-8 md:px-10 md:py-9 text-center space-y-5"
          style={{
            borderColor: "rgba(15, 23, 42, 0.08)",
            backgroundColor: "rgba(255, 255, 255, 0.62)",
            boxShadow:
              "0 30px 80px rgba(17, 24, 39, 0.10), 0 10px 28px rgba(17, 24, 39, 0.06)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="space-y-3">
            <div className="text-base md:text-lg font-semibold text-foreground tracking-wide text-center">
              这是一次关于自我的深度对话
            </div>
            <div className="text-sm md:text-[15px] text-muted-foreground leading-7 md:leading-8 space-y-2 text-center">
              <p>本表将陪伴你从 9 种心理维度了解近期的状态。</p>
              <p>你的所有数据都已被安全加密，请放心倾诉。</p>
              <p>别担心，这只是一个参考，它不代表你的全部。</p>
              <p className="text-foreground/80">准备好了吗？让我们开启这段探索之旅。</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="h-14 px-10 text-base font-medium rounded-xl shadow-lg transition-all duration-300 bg-[#8BA888] hover:bg-[#7A9A79] text-white hover:shadow-2xl hover:scale-[1.03] active:scale-[0.99]"
          onClick={() => navigate("/assessment")}
        >
          开始测评
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
