import React, { useState, useRef } from 'react';
import InputForm from './components/InputForm';
import NameCard from './components/NameCard';
import { UserPreferences, NameResponse } from './types';
import { generateNames } from './services/deepSeekService'; 
import { Crown, Sparkles, AlertCircle, Loader2, Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [results, setResults] = useState<NameResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    // Client-side check: Card Key is required
    if (!prefs.cardKey) {
       setError("请输入卡密以继续");
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }

    setStep('loading');
    setError(null);

    try {
      const data = await generateNames(prefs);
      setResults(data);
      setStep('results');
    } catch (err: any) {
      console.error(err);
      // Display friendly error message
      setError(err.message || "AI 推演过程中遇到了阻碍，请稍后再试。");
      setStep('form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const reset = () => {
    setResults(null);
    setStep('form');
    setError(null);
  };

  const handleSaveImage = async () => {
    if (!resultsRef.current || isSaving) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(resultsRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `灵韵起名-${results?.names[0].chinese_name || '方案'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to save image", err);
      setError("图片保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-stone-800 font-sans selection:bg-amber-100">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={step === 'results' ? reset : undefined}>
            <div className="bg-stone-800 text-white p-1.5 rounded-lg">
              <Crown size={18} />
            </div>
            <span className="font-serif-sc font-bold text-lg tracking-wide">灵韵起名</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
             <p className="text-sm">{error}</p>
          </div>
        )}

        {step === 'form' && (
          <div className="animate-fade-in-up">
            <InputForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
             </div>
             <h3 className="text-xl font-serif-sc font-bold text-stone-700 mb-2">大师正在推演中...</h3>
             <p className="text-stone-400 text-sm">排盘分析 · 测算五行 · 斟酌音律</p>
          </div>
        )}

        {step === 'results' && results && (
          <div className="animate-fade-in-up">
             <div ref={resultsRef} data-screenshot-target>
                {results.names.length > 0 && (
                    <NameCard data={results.names[0]} />
                )}
             </div>

             <div className="mt-8 pb-10">
                <p className="text-stone-400 text-xs mb-6 text-center">生成内容仅供参考，请结合家庭实际情况决定</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={reset}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-stone-200 text-stone-600 rounded-full font-medium shadow-sm hover:shadow-md hover:bg-stone-50 transition-all duration-300"
                  >
                    <RefreshCw size={18} />
                    <span>重新生成</span>
                  </button>
                  <button 
                    onClick={handleSaveImage}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-stone-800 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    <span>{isSaving ? '保存中...' : '保存图片'}</span>
                  </button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;