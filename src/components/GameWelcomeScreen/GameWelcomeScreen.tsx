import React from 'react';
import './GameWelcomeScreen.css';

export interface GameWelcomeScreenProps {
  backgroundImage?: string;
  statsBgImage: string;
  statLeftIcon: string;
  statLeftAlt?: string;
  statLeftValue: number;
  statRightValue: number;
  statRightIcon: string;
  statRightAlt?: string;
  heroImage: string;
  heroAlt?: string;
  startButtonImage: string;
  exitButtonImage: string;
  onStart: () => void;
  onExit?: () => void;
  isLoading?: boolean;
  isReady?: boolean;
  error?: string | null;
}

const GameWelcomeScreen: React.FC<GameWelcomeScreenProps> = ({
  backgroundImage,
  statsBgImage,
  statLeftIcon,
  statLeftAlt = 'الأسئلة',
  statLeftValue,
  statRightValue,
  statRightIcon,
  statRightAlt = 'النقاط',
  heroImage,
  heroAlt = 'كيفية اللعب',
  startButtonImage,
  exitButtonImage,
  onStart,
  onExit,
  isLoading = false,
  isReady = true,
  error = null,
}) => {
  const handleExit = () => {
    if (onExit) {
      onExit();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      className="gws-screen"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {/* ── HEADER: Stats Badge ───────────────────────────────────────────── */}
      <header className="gws-header">
        <div
          className="gws-stats-bg"
          style={{ backgroundImage: `url(${statsBgImage})` }}
        >
          <img src={statLeftIcon} alt={statLeftAlt} className="gws-stat-icon gws-stat-left-icon" />
          <span className="gws-stat-text gws-stat-left-val">{statLeftValue}</span>
          <span className="gws-stat-arrow">=</span>
          <span className="gws-stat-text gws-stat-right-val">{statRightValue}</span>
          <img src={statRightIcon} alt={statRightAlt} className="gws-stat-icon gws-stat-right-icon" />
        </div>
      </header>

      {/* ── BODY: Hero / Description Image ─────────────────────────────────── */}
      <main className="gws-body">
        <img
          src={heroImage}
          alt={heroAlt}
          className="gws-hero-img"
          loading="eager"
        />
      </main>

      {/* ── FOOTER: Action Buttons ────────────────────────────────────────── */}
      <footer className="gws-footer">
        {error ? (
          <div className="gws-status-msg gws-error-msg">عذراً، حدث خطأ أثناء التحميل</div>
        ) : (
          <div className="gws-footer-buttons" dir="rtl">
            {/* Exit Button */}
            <button
              className="gws-btn gws-exit-btn"
              onClick={handleExit}
              type="button"
              aria-label="خروج"
            >
              <img
                src={exitButtonImage}
                alt="خروج"
                className="gws-btn-bg"
                loading="eager"
              />
            </button>

            {/* Start Button - only rendered when ready and not loading */}
            {isLoading ? (
              <div className="gws-status-msg gws-loading-msg">تحميل...</div>
            ) : isReady ? (
              <button
                className="gws-btn gws-start-btn"
                onClick={onStart}
                type="button"
                aria-label="ابدأ اللعب"
              >
                <img
                  src={startButtonImage}
                  alt="ابدأ"
                  className="gws-btn-bg"
                  loading="eager"
                />
              </button>
            ) : null}
          </div>
        )}
      </footer>
    </div>
  );
};

export default GameWelcomeScreen;
