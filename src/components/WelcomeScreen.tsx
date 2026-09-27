import React from 'react';
import './WelcomeScreen.css';
import QuestionCoin from '../assets/QuestionCoin.png';
import QuestionNumber from '../assets/QuestionNumber.png';
import descriptionImg from '../assets/description.png';
import startButtonImg from '../assets/startButton.png';
import daddcoinImg from '../assets/daddcoin.webp';
import ExitButtonIcon from '../assets/ExitButton.svg';

interface WelcomeScreenProps {
  totalQuestions: number;
  onStart: () => void;
  isLoading?: boolean;
  error?: string | null;
  onExit: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  totalQuestions,
  onStart,
  isLoading = false,
  error = null,
  onExit
}) => {
  return (
    <div className="welcome-screen-new">
      <button className="welcome-exit-btn" onClick={onExit} aria-label="Exit Game">
        <img src={ExitButtonIcon} alt="Exit" />
      </button>

      <div
        className="welcome-stats-bg"
        style={{ backgroundImage: `url(${QuestionNumber})`, padding: '0 20px' }}
      >
        <img src={QuestionCoin} alt="Questions" className="welcome-qcoin" />
        <span className="welcome-stat-text q-count">{totalQuestions}</span>
        <span className="welcome-stat-arrow">{'='}</span>
        <span className="welcome-stat-text xp-count">{totalQuestions}</span>
        <img src={daddcoinImg} alt="Dadd Points" className="welcome-daddcoin" />
      </div>

      <div className="welcome-body">
        <img src={descriptionImg} alt="How to play" className="welcome-desc-img" />
      </div>

      <div className="welcome-footer">
        {error ? (
          <div className="welcome-status-msg error-msg">عذرا حدث خطأ</div>
        ) : (
          <button
            className="welcome-start-btn"
            onClick={isLoading ? undefined : onStart}
            style={{
              backgroundImage: `url(${startButtonImg})`,
              cursor: isLoading ? 'default' : 'pointer',
              opacity: isLoading ? 0.8 : 1
            }}
            disabled={isLoading}
          >
            {isLoading ? 'تحميل ...' : 'ابدأ!'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
