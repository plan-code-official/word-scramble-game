import React from 'react';
import './GameOver.css';
import daddcoin from '../assets/daddcoin.webp';
import { CompleteSessionData } from '../types';

interface GameOverProps {
  score: number;
  totalWords: number;
  correctCount: number;
  completedData?: CompleteSessionData | null;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  totalWords,
  correctCount,
  completedData,
  onRestart,
}) => {
  const percentage = completedData
    ? Math.round(completedData.percentage)
    : Math.round((correctCount / Math.max(1, totalWords)) * 100);

  const finalScore = completedData ? completedData.score : score;
  const coins = completedData ? completedData.coins : score;
  const starsCount = completedData ? completedData.stars : (percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1);
  const experience = completedData ? completedData.experience : 0;

  let medal = '🥉';
  let msg = 'حاول مرة أخرى!';
  if (percentage >= 90) { medal = '🏆'; msg = 'ممتاز! أنت بطل!'; }
  else if (percentage >= 70) { medal = '🥇'; msg = 'رائع جداً!'; }
  else if (percentage >= 50) { medal = '🥈'; msg = 'جيد! واصل التحسن!'; }

  const starIcons = Array.from({ length: 3 }, (_, i) => (
    <span key={i} className={`star-icon ${i < starsCount ? 'star-gold' : 'star-dimmed'}`}>
      ★
    </span>
  ));

  return (
    <div className="gameover-overlay">
      <div className="gameover-card">
        <div className="stars-row-display">{starIcons}</div>
        <div className="medal">{medal}</div>
        <h2 className="gameover-title">{msg}</h2>

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-icon">📊</span>
            <span className="stat-num">{percentage}%</span>
            <span className="stat-label">النسبة</span>
          </div>

          <div className="stat-box">
            <img src={daddcoin} alt="Coins" className="stat-icon-img" />
            <span className="stat-num">{coins}</span>
            <span className="stat-label">Coins</span>
          </div>

          {experience > 0 && (
            <div className="stat-box">
              <span className="stat-icon">⚡</span>
              <span className="stat-num">{experience}</span>
              <span className="stat-label">XP</span>
            </div>
          )}

          <div className="stat-box">
            <span className="stat-icon">🎯</span>
            <span className="stat-num">{finalScore}</span>
            <span className="stat-label">النقاط</span>
          </div>
        </div>

        <button className="restart-btn" onClick={onRestart}>
          🔄 العب مرة أخرى
        </button>
      </div>
    </div>
  );
};

export default GameOver;
