import React, { useState, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import TopBar from './TopBar';
import TargetWord from './TargetWord';
import LetterBlocks from './LetterBlocks';
import WelcomeScreen from './WelcomeScreen';
import Celebration from '../Celebration/CelebrationWrapper';
import ResultsPanel from '../ResultsPanel/ResultsPanelWrapper';
import './GameBoard.css';

const GameBoard: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  useEffect(() => {
    if (state.isLoading) {
      setHasStarted(false);
      setShowCelebration(false);
      setShowResults(false);
    }
  }, [state.isLoading]);

  // Trigger celebration on win
  useEffect(() => {
    if (state.phase === 'game-over' && !showResults) {
      setShowCelebration(true);
    }
  }, [state.phase, showResults]);

  // Handle transition from Celebration to Results
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowResults(true);
  };

  const handleRetry = () => {
    setShowResults(false);
    setShowCelebration(false);
    restart();
  };

  const handleBack = () => {
    console.log('Go to menu');
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  if (!hasStarted || state.isLoading || state.error) {
    return (
      <WelcomeScreen
        totalQuestions={totalWords}
        onStart={() => setHasStarted(true)}
        isLoading={state.isLoading}
        error={state.error}
      />
    );
  }

  const finalScore = state.completedData ? state.completedData.score : state.score;
  const coinsEarned = state.completedData ? state.completedData.coins : (state.score * 2);

  return (
    <div className="gameboard">
      {/* Progress line at the very top of the background */}
      <div className="progress-line-container">
        <div 
          className="progress-line-fill" 
          style={{ width: `${((Math.min(state.currentIndex, totalWords - 1) + 1) / totalWords) * 100}%` }}
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

      {/* End Game Overlays */}
      <Celebration 
        isVisible={showCelebration} 
        onComplete={handleCelebrationComplete} 
      />

      {showResults && (
        <ResultsPanel
          score={finalScore}
          totalScore={100}
          correctAnswers={state.correctCount}
          wrongAnswers={state.wrongCount || 0}
          coins={coinsEarned}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
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
