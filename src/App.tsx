import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import HomePage from "./pages/HomePage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. 验证码校验逻辑
  const verifyCode = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', code.trim())
        .single();

      if (error || !data) {
        alert("验证码无效，请重新输入");
      } else if (data.used_count >= data.max_uses) {
        alert("该验证码的 6 次测试机会已用完");
      } else {
        setIsAuthenticated(true);
        localStorage.setItem('access_code', code.trim());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. 如果未验证，显示漂亮的“验证墙”
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">身份验证</h2>
            <p className="text-slate-400 mt-2">请输入您的兑换码以开始测评</p>
          </div>
          
          <div className="space-y-6">
            <input 
              type="text" 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cyan-400 outline-none transition-all text-center text-lg tracking-widest"
              placeholder="请输入验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            
            <button 
              onClick={verifyCode}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-cyan-200 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "验证中..." : "进入系统"}
            </button>
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-400">
            验证通过后可进行 <span className="text-cyan-600 font-bold">6</span> 次完整测试
          </div>
        </div>
      </div>
    );
  }

  // 3. 验证通过，正常显示路由
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;