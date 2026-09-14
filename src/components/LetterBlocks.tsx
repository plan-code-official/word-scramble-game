import React from 'react';
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

const LetterBlocks: React.FC<LetterBlocksProps> = ({
  tiles,
  slots,
  checkResult,
  phase,
  onTileClick,
  onSlotClick,
  onClear,
}) => {
  const slotsClass = [
    'slots-row',
    checkResult === 'correct' ? 'slots-correct' : '',
    checkResult === 'wrong' ? 'slots-wrong' : '',
  ].join(' ');

  return (
    <div className="letter-blocks-wrapper">

      {/* ── Answer slots ────────────────────────────────────────────────── */}
      <div className={slotsClass}>
        {slots.map((slot, i) => (
          <button
            key={i}
            className={`slot-cell ${slot.letter ? 'slot-filled' : 'slot-empty'}`}
            onClick={() => slot.letter && onSlotClick(i)}
            disabled={!slot.letter || phase !== 'playing'}
            aria-label={slot.letter ?? 'خانة فارغة'}
          >
            <span className="slot-letter">{slot.letter ?? ''}</span>
          </button>
        ))}
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

      {/* ── Clear button ─────────────────────────────────────────────────── */}
      {phase === 'playing' && slots.some(s => s.letter !== null) && (
        <button className="clear-btn" onClick={onClear} title="مسح الكل">
          🔄 مسح
        </button>
      )}

      {/* ── Result message Modal ────────────────────────────────────────── */}
      {checkResult && (
        <div className="result-modal-overlay">
          <div className={`result-modal-content ${checkResult === 'correct' ? 'correct-msg' : 'wrong-msg'}`}>
            {checkResult === 'correct' ? 'أحسنت!' : 'حاول مرة أخرى!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterBlocks;
