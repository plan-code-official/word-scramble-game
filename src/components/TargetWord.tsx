import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './TargetWord.css';

interface TargetWordProps {
  hint?: string | null;
  questionText?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  correctAnswer?: string;
}

const isGenericTitle = (text?: string | null): boolean => {
  if (!text) return true;
  const cleaned = text.trim().toLowerCase();
  return cleaned === 'scramble level' || cleaned === 'scramblelevel' || cleaned === 'level' || cleaned === 'scramble';
};

export const shouldDisplayPrompt = (
  text?: string | null
): boolean => {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (isGenericTitle(trimmed)) return false;
  return true;
};

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

const TargetWord: React.FC<TargetWordProps> = ({
  hint,
  questionText,
  imageUrl,
  audioUrl,
  correctAnswer,
}) => {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!audioUrl) return;
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  // Auto-play audio when audioUrl changes / question mounts
  useEffect(() => {
    if (audioUrl) {
      playAudio();
    }
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, [audioUrl]);

  // Close portal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPortalOpen(false);
      }
    };
    if (isPortalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPortalOpen]);

  const handleOpenPortal = () => {
    if (imageUrl) {
      setIsPortalOpen(true);
    }
  };

  const handleClosePortal = () => {
    setIsPortalOpen(false);
  };

  // Determine if text should be displayed
  const displayQuestion = shouldDisplayPrompt(questionText) ? questionText : null;
  const displayHint = shouldDisplayPrompt(hint) ? hint : null;
  const promptToRender = displayQuestion || displayHint;

  const renderContent = () => {
    if (imageUrl) {
      return (
        <>
          <div className="target-image-wrapper" onClick={handleOpenPortal} title="انقر لتكبير الصورة">
            <img src={imageUrl} alt="Question" className="target-image clickable-image" />
            {promptToRender && (
              <div className="image-caption-overlay">
                {promptToRender}
              </div>
            )}
            <div className="zoom-badge">
              <ExpandIcon />
            </div>
          </div>
          {audioUrl && (
            <button className="audio-play-btn" onClick={playAudio} type="button">
              <span className="audio-wave-icon" aria-hidden="true">🔊</span>
              <span>استمع للصوت</span>
            </button>
          )}
        </>
      );
    }

    if (audioUrl) {
      return (
        <button 
          className="audio-play-btn" 
          onClick={playAudio} 
          type="button" 
          style={{ flexDirection: 'column', padding: '12px 24px', gap: '4px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="audio-wave-icon" aria-hidden="true">🔊</span>
            <span>استمع للصوت</span>
          </div>
          {promptToRender && (
             <span style={{ fontSize: '1.2rem', marginTop: '4px' }}>{promptToRender}</span>
          )}
        </button>
      );
    }

    if (promptToRender) {
      return (
        <div className="target-prompt">
          {promptToRender}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="target-card">
      {renderContent()}

      {/* Fullscreen Image Portal */}
      {isPortalOpen && imageUrl && ReactDOM.createPortal(
        <div className="image-portal-overlay" onClick={handleClosePortal}>
          <div className="image-portal-content" onClick={(e) => e.stopPropagation()}>
            <button className="portal-close-btn" onClick={handleClosePortal} title="إغلاق">
              ✕
            </button>
            <img src={imageUrl} alt="Enlarged Question" className="portal-image" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TargetWord;
