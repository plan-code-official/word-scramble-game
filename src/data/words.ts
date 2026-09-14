import { WordItem } from '../types';

const RAW_WORDS: Omit<WordItem, 'letters'>[] = [
  { id: 'w1',  word: 'كلب',     hint: 'Dog' },
  { id: 'w2',  word: 'قطة',     hint: 'Cat' },
  { id: 'w3',  word: 'بيت',     hint: 'House' },
  { id: 'w4',  word: 'شمس',     hint: 'Sun' },
  { id: 'w5',  word: 'قمر',     hint: 'Moon' },
  { id: 'w6',  word: 'نجم',     hint: 'Star' },
  { id: 'w7',  word: 'بحر',     hint: 'Sea' },
  { id: 'w8',  word: 'كتاب',    hint: 'Book' },
  { id: 'w9',  word: 'سمكة',    hint: 'Fish' },
  { id: 'w10', word: 'زهرة',    hint: 'Flower' },
  { id: 'w11', word: 'شجرة',    hint: 'Tree' },
  { id: 'w12', word: 'طائر',    hint: 'Bird' },
  { id: 'w13', word: 'حصان',    hint: 'Horse' },
  { id: 'w14', word: 'فراشة',   hint: 'Butterfly' },
  { id: 'w15', word: 'مدرسة',   hint: 'School' },
  { id: 'w16', word: 'سماء',    hint: 'Sky' },
  { id: 'w17', word: 'ماء',     hint: 'Water' },
  { id: 'w18', word: 'أسد',     hint: 'Lion' },
  { id: 'w19', word: 'فيل',     hint: 'Elephant' },
  { id: 'w20', word: 'نملة',    hint: 'Ant' },
];

function splitToLetters(word: string): string[] {
  return [...word];
}

function scramble(letters: string[]): string[] {
  const arr = [...letters];
  // Keep shuffling until different from original
  for (let attempt = 0; attempt < 20; attempt++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.some((l, i) => l !== letters[i])) break;
  }
  return arr;
}

export const WORDS: WordItem[] = RAW_WORDS.map((w, idx) => ({
  ...w,
  questionId: idx + 1,
  letters: splitToLetters(w.word),
}));

export function getGameWords(count = 10): WordItem[] {
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export { scramble };
