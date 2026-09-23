import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LetterTile, SlotCell, AnswerSubmission, WordItem } from '../types';
import { getGameWords, scramble } from '../data/words';
import { fetchQuestions, startSession, submitAnswers, completeSession } from '../services/api';
import { playClick, playPlaceBack, playCorrect, playWrong, playWin } from '../utils/sound';

const CORRECT_DISPLAY_MS = 900;
const WRONG_DISPLAY_MS = 900;

function buildTiles(letters: string[]): LetterTile[] {
  const scrambled = scramble(letters);
  return scrambled.map((letter, i) => ({
    id: `tile-${i}-${letter}-${Math.random()}`,
    letter,
    isPlaced: false,
  }));
}

function buildSlots(count: number): SlotCell[] {
  return Array.from({ length: count }, () => ({ letterId: null, letter: null }));
}

export function useGameLogic() {
  const [state, setState] = useState<GameState>({
    words: [],
    currentIndex: 0,
    score: 0,
    elapsedSeconds: 0,
    tiles: [],
    slots: [],
    checkResult: null,
    phase: 'playing',
    correctCount: 0,
    wrongCount: 0,
    isLoading: true,
    error: null,
    token: null,
    lessonId: null,
    sessionId: null,
    completedData: null,
    isDemo: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const answersRef = useRef<AnswerSubmission[]>([]);

  /* ── Extraction of URL parameters & Initial load ───────────────────────── */
  const initGame = useCallback(async (forcedDemo = false) => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const lessonId = searchParams.get('lessonId');

    answersRef.current = [];

    // If missing token or lessonId and not forcedDemo, show error screen with Demo option
    if ((!token || !lessonId) && !forcedDemo) {
      setState(p => ({
        ...p,
        isLoading: false,
        token: null,
        lessonId: null,
        error: 'لم يتم العثور على رمز التوثيق (token) أو معرف الدرس (lessonId) في رابط اللعبة.',
      }));
      return;
    }

    // Demo Mode
    if (forcedDemo || (!token && !lessonId)) {
      const demoWords = getGameWords(4);
      const first = demoWords[0];
      questionStartTimeRef.current = Date.now();
      setState({
        words: demoWords,
        currentIndex: 0,
        score: 0,
        elapsedSeconds: 0,
        tiles: buildTiles(first.letters),
        slots: buildSlots(first.letters.length),
        checkResult: null,
        phase: 'playing',
        correctCount: 0,
        wrongCount: 0,
        isLoading: false,
        error: null,
        token: null,
        lessonId: null,
        sessionId: null,
        completedData: null,
        isDemo: true,
      });
      return;
    }

    // API Mode
    setState(p => ({
      ...p,
      isLoading: true,
      error: null,
      token,
      lessonId,
      isDemo: false,
    }));

    try {
      const apiQuestions = await fetchQuestions(token!, lessonId!);
      if (!apiQuestions || apiQuestions.length === 0) {
        throw new Error('لم يتم العثور على أسئلة لهذا الدرس');
      }

      const sessionId = await startSession(token!, lessonId!);

      const words: WordItem[] = apiQuestions.map((q) => {
        const targetWord = (q.correctAnswer || (q.options && q.options[0]?.text) || q.question || '').trim();
        return {
          id: String(q.id),
          questionId: Number(q.id),
          word: targetWord,
          letters: [...targetWord],
          hint: q.hint || null,
          questionText: q.question ? q.question.trim() : null,
          imageUrl: q.imageUrl || null,
          audioUrl: q.audioUrl || null,
          points: q.points ?? 10,
          timeLimit: q.timeLimit ?? 60,
        };
      });

      const first = words[0];
      questionStartTimeRef.current = Date.now();

      setState({
        words,
        currentIndex: 0,
        score: 0,
        elapsedSeconds: 0,
        tiles: buildTiles(first.letters),
        slots: buildSlots(first.letters.length),
        checkResult: null,
        phase: 'playing',
        correctCount: 0,
        wrongCount: 0,
        isLoading: false,
        error: null,
        token,
        lessonId,
        sessionId,
        completedData: null,
        isDemo: false,
      });
    } catch (err: any) {
      console.error('Failed to initialize game:', err);
      setState(p => ({
        ...p,
        isLoading: false,
        error: err?.message || 'حدث خطأ غير متوقع عند الاتصال بالخادم',
      }));
    }
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  /* ── Timer ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (state.phase !== 'playing' || state.isLoading || state.error) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setState(p => ({ ...p, elapsedSeconds: p.elapsedSeconds + 1 }));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.phase, state.currentIndex, state.isLoading, state.error]);

  /* ── Finish game & submit session ────────────────────────────────────── */
  const finishGameSession = useCallback(async (token: string | null, sessionId: string | null) => {
    playWin();
    if (!token || !sessionId) {
      // Demo Mode or Missing session: transition directly to game-over
      setState(p => ({ ...p, phase: 'game-over' }));
      return;
    }

    setState(p => ({ ...p, phase: 'submitting' }));
    try {
      // Submit accumulated answers
      await submitAnswers(token, sessionId, answersRef.current);

      // Complete session
      const completedData = await completeSession(token, sessionId);
      setState(p => ({
        ...p,
        phase: 'game-over',
        completedData,
      }));
    } catch (err: any) {
      console.error('Failed to complete game session:', err);
      // Even if completion API fails, show game over screen gracefully
      setState(p => ({
        ...p,
        phase: 'game-over',
      }));
    }
  }, []);

  /* ── Advance to next word ────────────────────────────────────────────── */
  const advanceToNext = useCallback(() => {
    const currentState = stateRef.current;
    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const currentWord = currentState.words[currentState.currentIndex];
    
    if (currentWord) {
      answersRef.current.push({
        questionId: Number(currentWord.questionId) || (currentState.currentIndex + 1),
        selectedAnswer: String(currentWord.word),
        timeTaken,
      });
    }

    const nextIndex = currentState.currentIndex + 1;
    if (nextIndex >= currentState.words.length) {
      finishGameSession(currentState.token, currentState.sessionId);
      return;
    }

    const nextWord = currentState.words[nextIndex];
    questionStartTimeRef.current = Date.now();

    setState(p => ({
      ...p,
      currentIndex: nextIndex,
      tiles: buildTiles(nextWord.letters),
      slots: buildSlots(nextWord.letters.length),
      checkResult: null,
      phase: 'playing',
      elapsedSeconds: 0,
    }));
  }, [finishGameSession]);

  /* ── Player clicks a scrambled tile → moves to next empty slot ───────── */
  const placeTile = useCallback((tileId: string) => {
    const currentState = stateRef.current;
    if (currentState.phase !== 'playing') return;
    const tile = currentState.tiles.find(t => t.id === tileId);
    if (!tile || tile.isPlaced) return;

    const slotIndex = currentState.slots.findIndex(s => s.letterId === null);
    if (slotIndex === -1) return;

    playClick();

    const newTiles = currentState.tiles.map(t =>
      t.id === tileId ? { ...t, isPlaced: true } : t
    );
    const newSlots = currentState.slots.map((s, i) =>
      i === slotIndex ? { letterId: tileId, letter: tile.letter } : s
    );

    // Check after placing
    const allFilled = newSlots.every(s => s.letter !== null);
    if (allFilled) {
      const formed = newSlots.map(s => s.letter).join('');
      const word = currentState.words[currentState.currentIndex]?.word;
      if (formed === word) {
        playCorrect();
        const currentPoints = 1; // Override API points (which is often 10) to increment by 1
        setTimeout(() => advanceToNext(), CORRECT_DISPLAY_MS);
        setState(p => ({
          ...p,
          tiles: newTiles,
          slots: newSlots,
          phase: 'correct',
          checkResult: 'correct',
          score: p.score + currentPoints,
          correctCount: p.correctCount + 1,
        }));
      } else {
        playWrong();
        setTimeout(() => {
          setState(s => (s.phase === 'wrong' ? { ...s, phase: 'playing', checkResult: null } : s));
        }, WRONG_DISPLAY_MS);
        setState(p => ({
          ...p,
          tiles: newTiles,
          slots: newSlots,
          phase: 'wrong',
          checkResult: 'wrong',
          wrongCount: (p.wrongCount || 0) + 1,
        }));
      }
    } else {
      setState(p => ({ ...p, tiles: newTiles, slots: newSlots }));
    }
  }, [advanceToNext]);

  /* ── Player clicks a placed slot → returns letter to tiles ──────────── */
  const returnTile = useCallback((slotIndex: number) => {
    const currentState = stateRef.current;
    if (currentState.phase !== 'playing') return;
    const slot = currentState.slots[slotIndex];
    if (!slot.letterId) return;

    playPlaceBack();

    const newTiles = currentState.tiles.map(t =>
      t.id === slot.letterId ? { ...t, isPlaced: false } : t
    );
    const newSlots = currentState.slots.map((s, i) =>
      i === slotIndex ? { letterId: null, letter: null } : s
    );
    setState(p => ({ ...p, tiles: newTiles, slots: newSlots }));
  }, []);

  /* ── Clear all slots ─────────────────────────────────────────────────── */
  const clearSlots = useCallback(() => {
    const currentState = stateRef.current;
    if (currentState.phase !== 'playing') return;
    const newTiles = currentState.tiles.map(t => ({ ...t, isPlaced: false }));
    const newSlots = currentState.slots.map(() => ({ letterId: null, letter: null }));
    setState(p => ({ ...p, tiles: newTiles, slots: newSlots }));
  }, []);

  /* ── Restart ─────────────────────────────────────────────────────────── */
  const restart = useCallback(() => {
    initGame(stateRef.current.isDemo);
  }, [initGame]);

  const loadDemoMode = useCallback(() => {
    initGame(true);
  }, [initGame]);

  const currentWord = state.words[state.currentIndex] || { word: '', hint: '', letters: [] };
  const totalWords = state.words.length || 1;

  return {
    state,
    currentWord,
    totalWords,
    placeTile,
    returnTile,
    clearSlots,
    restart,
    loadDemoMode,
    retryInit: () => initGame(false),
  };
}
