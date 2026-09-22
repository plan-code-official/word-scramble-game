import React from 'react';
import './WelcomeScreen.css';
import QuestionCoin from '../assets/QuestionCoin.png';
import QuestionNumber from '../assets/QuestionNumber.png';
import descriptionImg from '../assets/description.png';
import startButtonImg from '../assets/startButton.png';
import daddcoinImg from '../assets/daddcoin.webp';

interface WelcomeScreenProps {
  totalQuestions: number;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ totalQuestions, onStart }) => {
  // Daddcoin number same as question coin number
  const xpCount = totalQuestions;

  return (
    <div className="welcome-screen-new">
      <div className="welcome-header" style={{ backgroundImage: `url(${QuestionNumber})` }}>
        <img src={QuestionCoin} alt="Question" className="welcome-qcoin" />
        <span className="welcome-stat-text q-count">{totalQuestions}</span>
        <span className="welcome-stat-arrow">{'>'}</span>
        <span className="welcome-stat-text xp-count">{xpCount}</span>
        <img src={daddcoinImg} alt="DaddCoin" className="welcome-daddcoin" />
      </div>

      <div className="welcome-body">
        <img src={descriptionImg} alt="How to play" className="welcome-desc-img" />
      </div>

      <div className="welcome-footer">
        <button 
          className="welcome-start-btn" 
          onClick={onStart}
          style={{ backgroundImage: `url(${startButtonImg})` }}
        >
          ابدأ
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
