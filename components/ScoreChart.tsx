import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { NameScore } from '../types';

interface ScoreChartProps {
  scores: NameScore;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ scores }) => {
  const data = [
    { subject: '音律', A: scores.sound, fullMark: 100 },
    { subject: '字形', A: scores.shape, fullMark: 100 },
    { subject: '寓意', A: scores.meaning, fullMark: 100 },
    { subject: '文化', A: scores.culture, fullMark: 100 },
    { subject: '平衡', A: scores.balance, fullMark: 100 },
  ];

  return (
    <div className="w-full h-48 sm:h-56 relative">
       {/* Background circle decoration */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
         <div className="w-32 h-32 rounded-full border border-stone-900"></div>
         <div className="absolute w-24 h-24 rounded-full border border-stone-900"></div>
       </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e7e5e4" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#78716c', fontSize: 12, fontFamily: 'serif' }} 
          />
          <Radar
            name="Score"
            dataKey="A"
            stroke="#d97706" // amber-600
            fill="#fcd34d"   // amber-300
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;