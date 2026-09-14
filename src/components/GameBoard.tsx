import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import TopBar from './TopBar';
import TargetWord from './TargetWord';
import LetterBlocks from './LetterBlocks';
import GameOver from './GameOver';
import './GameBoard.css';

const GameBoard: React.FC = () => {
  const {
    state,
    currentWord,
    totalWords,
    placeTile,
    returnTile,
    clearSlots,
    restart,
    loadDemoMode,
    retryInit,
  } = useGameLogic();

  if (state.isLoading) {
    return (
      <div className="gameboard">
        <Stars />
        <div className="status-card">
          <div className="spinner" />
          <p className="status-msg">جاري تحميل الأسئلة وبدء الجلسة...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="gameboard">
        <Stars />
        <div className="status-card error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">تعذر بدء اللعبة</h2>
          <p className="error-msg">{state.error}</p>
          <div className="error-actions">
            <button className="action-btn retry-btn" onClick={retryInit}>
              🔄 إعادة المحاولة
            </button>
            <button className="action-btn demo-btn" onClick={loadDemoMode}>
              🎮 تجربة اللعبة (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === 'game-over') {
    return (
      <div className="gameboard">
        <Stars />
        <GameOver
          score={state.score}
          totalWords={totalWords}
          correctCount={state.correctCount}
          completedData={state.completedData}
          onRestart={restart}
        />
      </div>
    );
  }

  return (
    <div className="gameboard">
      {/* Progress line at the very top of the background */}
      <div className="progress-line-container">
        <div 
          className="progress-line-fill" 
          style={{ width: `${((state.currentIndex + 1) / totalWords) * 100}%` }}
        />
      </div>
      <Stars />
      <div className="game-frame">
        <div className="game-content">
          {/* Submitting indicator */}
          {state.phase === 'submitting' && (
            <div className="submitting-overlay">
              <div className="spinner" />
              <p>جاري تسجيل النتائج...</p>
            </div>
          )}

          {/* Top bar */}
          <TopBar
            currentIndex={state.currentIndex}
            totalWords={totalWords}
            score={state.score}
            elapsedSeconds={state.elapsedSeconds}
          />

          {/* Target word card */}
          <div className="target-section">
            <TargetWord
              hint={currentWord.hint}
              questionText={currentWord.questionText}
              imageUrl={currentWord.imageUrl}
              audioUrl={currentWord.audioUrl}
              correctAnswer={currentWord.word}
            />
          </div>

          {/* Letter tiles + slots */}
          <LetterBlocks
            tiles={state.tiles}
            slots={state.slots}
            checkResult={state.checkResult}
            phase={state.phase}
            onTileClick={placeTile}
            onSlotClick={returnTile}
            onClear={clearSlots}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Decorative stars background ─────────────────────────────────────────── */
const Stars: React.FC = () => (
  <div className="stars-container" aria-hidden>
    {Array.from({ length: 60 }, (_, i) => (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 40}%`,
          width: `${1 + Math.random() * 2.5}px`,
          height: `${1 + Math.random() * 2.5}px`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ))}
  </div>
);

export default GameBoard;
