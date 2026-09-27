import React from 'react';
import './TopBar.css';
import daddcoin from '../assets/daddcoin.webp';
import ExitButtonIcon from '../assets/ExitButton.svg';

interface TopBarProps {
  currentIndex: number;
  totalWords: number;
  score: number;
  elapsedSeconds: number;
  onExit: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ currentIndex, totalWords, score, onExit }) => {
  const displayIndex = Math.min(currentIndex + 1, totalWords);
  const progress = (displayIndex / totalWords) * 100;

  return (
    <div className="top-bar">
      <div className="top-bar-row">
        {/* Right physically (first in RTL): exit button */}
        <button className="tb-exit-btn" onClick={onExit} aria-label="Exit Game">
          <img src={ExitButtonIcon} alt="Exit" />
        </button>

        {/* Center: question label + counter */}
        <div className="tb-center">
          <span className="tb-label">السؤال</span>
          <span className="tb-counter">{displayIndex}/{totalWords}</span>
        </div>

        {/* Left physically (last in RTL): coins earned */}
        <div className="tb-coins">
          <img src={daddcoin} alt="Coins" className="tb-coin-img" />
          <span className="tb-coin-val">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="tb-progress-track">
        <div
          className="tb-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default TopBar;
