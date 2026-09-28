import React from 'react';
import GameWelcomeScreen from './GameWelcomeScreen/GameWelcomeScreen';

import bgImg from '../utils/BG.webp';
import badgeBG from '../assets/QuestionNumber.png';
import qCoin from '../assets/QuestionCoin.png';
import daddCoin from '../assets/daddcoin.webp';
import description from '../assets/description.png';
import startBtn from '../assets/Start.png';
import exitBtn from '../assets/Exit1.png';

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
  onExit,
}) => {
  return (
    <GameWelcomeScreen
      backgroundImage={bgImg}
      statsBgImage={badgeBG}
      statLeftIcon={qCoin}
      statLeftAlt="Questions"
      statLeftValue={totalQuestions}
      statRightValue={totalQuestions}
      statRightIcon={daddCoin}
      statRightAlt="Dadd Points"
      heroImage={description}
      heroAlt="كيف ألعب"
      startButtonImage={startBtn}
      exitButtonImage={exitBtn}
      onStart={onStart}
      onExit={onExit}
      isLoading={isLoading}
      isReady={totalQuestions > 0 && !error}
      error={error}
    />
  );
};

export default WelcomeScreen;

