import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Calendar, Clock, User, Type, Feather, Key } from 'lucide-react';

interface InputFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserPreferences>({
    surname: '',
    gender: 'unisex',
    birthDate: '',
    birthTime: '',
    style: '传统国风',
    additionalNotes: '',
    cardKey: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const styles = [
    "传统国风",
    "现代简约",
    "五行平衡",
    "诗词歌赋",
    "高雅独特"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surname) return;
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-stone-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif-sc font-bold text-stone-800">新生儿取名</h2>
        <p className="text-stone-500 text-sm mt-2">基于国学底蕴与现代汉语言学解析</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {/* Surname */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">宝宝姓氏</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="请输入姓氏（如：陈）"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-300 outline-none transition-all"
              required
              autoComplete="off"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">性别</label>
          <div className="flex gap-3">
            {[
              { val: 'boy', label: '男宝', icon: '👦' },
              { val: 'girl', label: '女宝', icon: '👧' },
              { val: 'unisex', label: '未定/通用', icon: '👶' }
            ].map((option) => (
              <button
                key={option.val}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: option.val as any }))}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  formData.gender === option.val
                    ? 'bg-amber-50 border-amber-300 text-amber-800 ring-1 ring-amber-300'
                    : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                }`}
              >
                <span className="mr-1">{option.icon}</span> {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">出生日期</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full pl-10 pr-2 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">出生时间</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="time"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleChange}
                className="w-full pl-10 pr-2 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">风格偏好</label>
          <div className="relative">
            <Feather className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <select
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-200 outline-none appearance-none"
            >
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">补充要求 (选填)</label>
          <div className="relative">
            <Type className="absolute left-3 top-3 text-stone-400 w-4 h-4" />
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="例如：可输入辈分字、忌讳字等，需要写清楚如：辈分字：德..."
              rows={2}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-200 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Card Key */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">卡密验证 (必填)</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              name="cardKey"
              value={formData.cardKey || ''}
              onChange={handleChange}
              placeholder="请输入您的使用卡密"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-300 outline-none transition-all"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-stone-800 text-stone-50 font-medium text-lg hover:bg-stone-900 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
              大师推演中...
            </>
          ) : (
            '立即生成'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
