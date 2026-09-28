import React, { useRef, useEffect } from 'react';
import { LetterTile, SlotCell } from '../types';
import './LetterBlocks.css';

interface LetterBlocksProps {
  tiles: LetterTile[];
  slots: SlotCell[];
  checkResult: 'correct' | 'wrong' | null;
  phase: string;
  onTileClick: (tileId: string) => void;
  onSlotClick: (index: number) => void;
  onClear: () => void;
}

const BackspaceIcon = () => (
  <svg
    className="backspace-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Pointing towards right (in RTL, towards the target letters) */}
    <path d="M3 5h13l6 7-6 7H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <line x1="8" y1="9" x2="14" y2="15" />
    <line x1="14" y1="9" x2="8" y2="15" />
  </svg>
);

const LetterBlocks: React.FC<LetterBlocksProps> = ({
  tiles,
  slots,
  checkResult,
  phase,
  onTileClick,
  onSlotClick,
  onClear,
}) => {
  // Find index of the last filled slot
  let lastFilledIndex = -1;
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i].letter !== null) {
      lastFilledIndex = i;
      break;
    }
  }

  const hasPlacedLetters = lastFilledIndex !== -1;
  const placedCount = slots.filter(s => s.letter !== null).length;

  const handleBackspace = () => {
    if (phase !== 'playing' || lastFilledIndex === -1) return;
    onSlotClick(lastFilledIndex);
  };

  // Keyboard Backspace support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'playing') return;
      if (e.key === 'Backspace' && hasPlacedLetters) {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, hasPlacedLetters, lastFilledIndex]);

  // Long-press handling for Clear All
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggeredRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (phase !== 'playing' || !hasPlacedLetters) return;
    isLongPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      onClear();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(50);
        } catch (_) {}
      }
    }, 550);
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    isLongPressTriggeredRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLongPressTriggeredRef.current) {
      isLongPressTriggeredRef.current = false;
      return;
    }
    if (hasPlacedLetters && phase === 'playing') {
      handleBackspace();
    }
  };

  const slotsClass = [
    'slots-row',
    checkResult === 'correct' ? 'slots-correct' : '',
    checkResult === 'wrong' ? 'slots-wrong' : '',
  ].join(' ');

  return (
    <div className="letter-blocks-wrapper">

      {/* ── Answer slots & Delete button row ─────────────────────────── */}
      <div className="answers-container">
        <div className="answers-row">
          {/* Answer slots */}
          <div className={slotsClass}>
            {slots.map((slot, i) => (
              <button
                key={i}
                className={`slot-cell ${slot.letter ? 'slot-filled' : 'slot-empty'}`}
                onClick={() => slot.letter && onSlotClick(i)}
                disabled={!slot.letter || phase !== 'playing'}
                aria-label={slot.letter ?? `خانة فارغة ${i + 1}`}
              >
                <span className="slot-letter">{slot.letter ?? ''}</span>
              </button>
            ))}
          </div>

          {/* Delete / Backspace Button */}
          <div className="delete-btn-wrapper">
            <button
              className={`delete-btn ${hasPlacedLetters ? 'can-delete' : 'is-empty'}`}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerLeave}
              onClick={handleClick}
              disabled={!hasPlacedLetters || phase !== 'playing'}
              aria-label="حذف الحرف الأخير (اضغط مطولاً لمسح الكل)"
              title={hasPlacedLetters ? "حذف الحرف الأخير (اضغط مطولاً لمسح الكل)" : "لا توجد حروف لحذفها"}
              type="button"
            >
              <BackspaceIcon />
            </button>

            {/* Quick Clear All Chip */}
            <button
              className={`clear-all-chip ${placedCount >= 2 && phase === 'playing' ? 'visible' : 'hidden'}`}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              type="button"
              title="مسح كل الحروف"
              aria-hidden={placedCount < 2}
            >
              مسح الكل
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrambled tiles ─────────────────────────────────────────────── */}
      <div className="tiles-row">
        {tiles.map(tile => (
          <button
            key={tile.id}
            className={`letter-tile ${tile.isPlaced ? 'tile-placed' : 'tile-available'}`}
            onClick={() => !tile.isPlaced && onTileClick(tile.id)}
            disabled={tile.isPlaced || phase !== 'playing'}
            aria-label={tile.letter}
          >
            {tile.isPlaced ? '' : tile.letter}
          </button>
        ))}
      </div>

      {/* ── Result message Modal ────────────────────────────────────────── */}
      {checkResult && (
        <div className="result-modal-overlay">
          <div className={`result-modal-content ${checkResult === 'correct' ? 'correct-msg' : 'wrong-msg'}`}>
            {checkResult === 'correct' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div>أحسنت!</div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div> خطأ </div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterBlocks;
