import React from 'react';
import './TopBar.css';

import daddcoin from '../assets/daddcoin.webp';

interface TopBarProps {
  currentIndex: number;
  totalWords: number;
  score: number;
  elapsedSeconds: number;
}

const TopBar: React.FC<TopBarProps> = ({ currentIndex, totalWords, score }) => {
  return (
    <div className="top-bar">
      <div className="counter-pill">
        <span className="counter-text">{currentIndex + 1} / {totalWords}</span>
      </div>

      <div className="score-pill">
        <img src={daddcoin} alt="Coin" className="score-icon-img" />
        <span className="score-val">{score}</span>
      </div>
    </div>
  );
};

export default TopBar;
