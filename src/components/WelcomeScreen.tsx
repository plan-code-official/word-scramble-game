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
  isLoading?: boolean;
  error?: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  totalQuestions, 
  onStart,
  isLoading = false,
  error = null
}) => {
  return (
    <div className="welcome-screen-new">
      <div 
        className="welcome-stats-bg" 
        style={{ backgroundImage: `url(${QuestionNumber})` }}
      >
        <img src={QuestionCoin} alt="Questions" className="welcome-qcoin" />
        <span className="welcome-stat-text q-count">{totalQuestions}</span>
        <span className="welcome-stat-arrow">{'>'}</span>
        <span className="welcome-stat-text xp-count">{totalQuestions}</span>
        <img src={daddcoinImg} alt="Dadd Points" className="welcome-daddcoin" />
      </div>

      <div className="welcome-body">
        <img src={descriptionImg} alt="How to play" className="welcome-desc-img" />
      </div>

      <div className="welcome-footer">
        {isLoading ? (
          <div className="welcome-status-msg">جاري تحميل الأسئلة...</div>
        ) : error ? (
          <div className="welcome-status-msg error-msg">{error}</div>
        ) : (
          <button 
            className="welcome-start-btn" 
            onClick={onStart}
            style={{ backgroundImage: `url(${startButtonImg})` }}
          >
            ابدأ!
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
