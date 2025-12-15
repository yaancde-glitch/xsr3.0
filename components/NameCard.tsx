import React from 'react';
import { NameRecommendation } from '../types';
import ScoreChart from './ScoreChart';
import { Star, Flame, Moon, Quote, Sparkles } from 'lucide-react';

interface NameCardProps {
  data: NameRecommendation;
  rank?: number; // Kept for compatibility but not strictly used in single view
}

const NameCard: React.FC<NameCardProps> = ({ data }) => {
  const surname = data.chinese_name.charAt(0);
  const name = data.chinese_name.slice(1);
  const pinyinParts = data.pinyin.split(' ');
  const surnamePinyin = pinyinParts[0];
  const namePinyin = pinyinParts.slice(1);

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden mb-6 font-sans">
      
      {/* 1. Header Section: Big Name & Total Score */}
      <div className="pt-10 pb-8 px-6 relative text-center bg-gradient-to-b from-stone-50 to-white">
        <div className="absolute top-0 right-0 p-4">
           <div className="text-right">
             <div className="text-xs text-stone-400 font-medium mb-1">综合评分</div>
             <div className="text-5xl font-serif-sc font-bold text-amber-800 leading-none">{data.scores.total}</div>
           </div>
        </div>

        <div className="flex justify-center items-end gap-3 mb-2">
            <div className="flex flex-col items-center">
              <span className="text-sm text-stone-400 font-mono mb-2">{surnamePinyin}</span>
              <span className="text-6xl font-serif-sc font-bold text-stone-800">
                {surname}
              </span>
            </div>
            {name.split('').map((char, idx) => (
              <div key={idx} className="flex flex-col items-center">
                 <span className="text-sm text-stone-400 font-mono mb-2">{namePinyin[idx] || ''}</span>
                 <span className="text-6xl font-serif-sc font-bold text-stone-800">
                  {char}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="px-6 pb-10 space-y-8">
        
        {/* 2. Five Dimensions Radar */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
           <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif-sc font-bold text-lg text-stone-800">五维评分</h3>
           </div>
           <ScoreChart scores={data.scores} />
        </div>

        {/* 3. Detailed Score Analysis (Vertical List) */}
        <div className="space-y-4">
            <ScoreItem 
               label="音律" score={data.scores.sound} 
               desc={data.analysis.sound_analysis} 
            />
            <ScoreItem 
               label="字形" score={data.scores.shape} 
               desc={data.analysis.shape_analysis} 
            />
            <ScoreItem 
               label="寓意" score={data.scores.meaning} 
               desc={data.analysis.meaning_analysis} 
            />
             <ScoreItem 
               label="文化" score={data.scores.culture} 
               desc={data.analysis.culture_analysis} 
            />
            <ScoreItem 
               label="平衡" score={data.scores.balance} 
               desc={data.analysis.balance_analysis} 
            />
        </div>

        {/* 4. MBTI Card (Dark Theme) */}
        <div className="bg-[#3e3a36] rounded-2xl p-6 text-white relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                 <div className="text-xs text-white/60 mb-1">MBTI 倾向参考</div>
                 <div className="text-3xl font-bold tracking-wide">{data.mbti.type}</div>
              </div>
              <div className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">根据名字气质推测</div>
           </div>
           <p className="text-sm text-white/80 leading-relaxed relative z-10">
              {data.mbti.desc}
           </p>
        </div>

        {/* 5. Nickname & English Name (Styled like MBTI) */}
        <div className="grid grid-cols-2 gap-4">
           {/* Nickname */}
           <div className="bg-[#3e3a36] rounded-2xl p-5 text-white relative overflow-hidden flex flex-col">
              {/* Decorative blob */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 mb-auto">
                 <div className="text-xs text-white/60 mb-1">乳名建议</div>
                 <div className="text-2xl font-bold tracking-wide mb-3 font-serif-sc">{data.nickname.name}</div>
              </div>
              <div className="relative z-10 border-t border-white/10 pt-3 mt-2">
                <p className="text-xs text-white/80 leading-relaxed text-justify">
                  {data.nickname.meaning}
                </p>
              </div>
           </div>

           {/* English Name */}
           <div className="bg-[#3e3a36] rounded-2xl p-5 text-white relative overflow-hidden flex flex-col">
              {/* Decorative blob */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 mb-auto">
                 <div className="text-xs text-white/60 mb-1">英文名</div>
                 <div className="text-2xl font-bold tracking-wide mb-3">{data.english_name.name}</div>
              </div>
              <div className="relative z-10 border-t border-white/10 pt-3 mt-2">
                <p className="text-xs text-white/80 leading-relaxed text-justify">
                  {data.english_name.meaning}
                </p>
              </div>
           </div>
        </div>

        {/* 6. Fortune Encyclopedia (Bazi) */}
        <div>
           <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif-sc font-bold text-lg text-stone-800">命理百科</h3>
           </div>
           <div className="grid grid-cols-1 gap-3">
              <FortuneCard 
                icon="🐰" 
                title="生肖" 
                subtitle={data.bazi.zodiac}
                desc={data.bazi.zodiac_desc}
              />
              <FortuneCard 
                icon="⭐" 
                title="星座" 
                subtitle={data.bazi.constellation}
                desc={data.bazi.constellation_desc}
              />
               <FortuneCard 
                icon="🔥" 
                title="五行" 
                subtitle={data.bazi.wuxing}
                desc={data.bazi.wuxing_desc}
              />
           </div>
        </div>

        {/* 7. Summary & Tags */}
        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
           <div className="flex items-center gap-2 mb-4 border-l-4 border-amber-500 pl-3">
              <h3 className="font-serif-sc font-bold text-lg text-stone-800">综合介绍</h3>
           </div>
           
           <div className="relative mb-6">
              <Quote className="w-8 h-8 text-amber-200 absolute -top-2 -left-2 transform -scale-x-100 opacity-50" />
              <p className="text-stone-600 leading-7 text-justify pt-4 px-2 font-serif-sc">
                {data.summary}
              </p>
           </div>

           <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, idx) => (
                <span key={idx} className="bg-white text-amber-800 text-xs px-3 py-1.5 rounded-full border border-amber-100 shadow-sm font-medium">
                  #{tag}
                </span>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Score Bar Item
const ScoreItem = ({ label, score, desc }: { label: string, score: number, desc: string }) => (
  <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
    <div className="flex justify-between items-end mb-2">
       <span className="text-sm font-bold text-stone-700">{label}</span>
       <span className="text-lg font-serif-sc font-bold text-amber-600">{score}</span>
    </div>
    <div className="w-full bg-stone-100 h-1.5 rounded-full mb-3 overflow-hidden">
       <div className="bg-amber-400 h-full rounded-full" style={{ width: `${score}%` }}></div>
    </div>
    <p className="text-xs text-stone-500 leading-relaxed text-justify">
      {desc}
    </p>
  </div>
);

// Sub-component for Fortune Card
const FortuneCard = ({ icon, title, subtitle, desc }: { icon: string, title: string, subtitle: string, desc: string }) => (
  <div className="bg-white p-4 rounded-xl border border-stone-100 flex gap-4 shadow-sm">
     <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-xl shrink-0">
        {icon}
     </div>
     <div>
        <div className="flex items-baseline gap-2 mb-1">
           <span className="text-xs text-stone-400">{title}</span>
           <span className="text-base font-bold text-stone-800">{subtitle}</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed ">
           {desc}
        </p>
     </div>
  </div>
);

export default NameCard;
