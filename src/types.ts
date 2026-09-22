export interface WordItem {
  id: string;
  questionId?: number;
  word: string;                 // الكلمة الكاملة المراد إيجادها (correctAnswer)
  letters: string[];            // الحروف المفردة
  hint?: string | null;         // التلميح
  questionText?: string | null; // نص السؤال (Prompt)
  imageUrl?: string | null;     // رابط صورة السؤال
  audioUrl?: string | null;     // رابط صوت السؤال
  points?: number;
  timeLimit?: number;
}

export interface LetterTile {
  id: string;           // id فريد لكل حرف
  letter: string;
  isPlaced: boolean;    // هل وُضع في خانة؟
}

export interface SlotCell {
  letterId: string | null;  // id الحرف الموضوع، أو null إذا فارغ
  letter: string | null;
}

export type CheckResult = 'correct' | 'wrong' | null;

export interface QuestionOption {
  text: string;
  imageUrl?: string | null;
}

export interface ApiQuestion {
  id: number;
  question: string;
  options?: QuestionOption[];
  correctAnswer: string;
  points?: number;
  timeLimit?: number;
  order?: number;
  hint?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
}

export interface QuestionsApiResponse {
  success: boolean;
  data: {
    lessonId: number;
    lessonName: string;
    questions: ApiQuestion[];
  };
}

export interface StartSessionApiResponse {
  success: boolean;
  data: {
    id: string;
  };
}

export interface AnswerSubmission {
  questionId: number;
  selectedAnswer: string;
  timeTaken: number;
}

export interface CompleteSessionData {
  score: number;
  percentage: number;
  stars: number;
  coins: number;
  experience: number;
  session: {
    id: string;
    status: string;
  };
  reward?: any;
  isNewReward?: boolean;
}

export interface CompleteSessionApiResponse {
  success: boolean;
  data: CompleteSessionData;
}

export interface GameState {
  words: WordItem[];
  currentIndex: number;
  score: number;
  elapsedSeconds: number;
  tiles: LetterTile[];
  slots: SlotCell[];
  checkResult: CheckResult;
  phase: 'playing' | 'correct' | 'wrong' | 'submitting' | 'game-over';
  correctCount: number;
  wrongCount?: number;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  lessonId: string | null;
  sessionId: string | null;
  completedData: CompleteSessionData | null;
  isDemo: boolean;
}
