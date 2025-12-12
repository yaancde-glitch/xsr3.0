export interface NameScore {
  total: number;
  sound: number;
  shape: number;
  meaning: number;
  culture: number;
  balance: number;
}

export interface MBTIInfo {
  type: string;
  desc: string;
}

export interface NameAnalysis {
  sound_analysis: string;
  shape_analysis: string;
  meaning_analysis: string;
  culture_analysis: string;
  balance_analysis: string;
}

export interface SubNameInfo {
  name: string;
  meaning: string;
}

export interface BaziInfo {
  zodiac: string;
  zodiac_desc: string;
  constellation: string;
  constellation_desc: string;
  wuxing: string;
  wuxing_desc: string;
}

export interface NameRecommendation {
  chinese_name: string;
  pinyin: string;
  scores: NameScore;
  mbti: MBTIInfo;
  analysis: NameAnalysis;
  nickname: SubNameInfo;
  english_name: SubNameInfo;
  bazi: BaziInfo;
  summary: string;
  tags: string[];
}

export interface NameResponse {
  names: NameRecommendation[];
}

export interface UserPreferences {
  surname: string;
  gender: 'boy' | 'girl' | 'unisex';
  birthDate: string;
  birthTime: string;
  style: string;
  additionalNotes?: string;
  cardKey?: string;
}

// DeepSeek / OpenAI API Response Types
export interface DeepSeekChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: DeepSeekChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}