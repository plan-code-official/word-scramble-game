import React from 'react';
import GameWelcomeScreen from './GameWelcomeScreen/GameWelcomeScreen';

import ErrorScreen from './ErrorScreen';
import bgImg from '../utils/BG.webp';
import badgeBG from '../assets/QuestionNumber.png';
import qCoin from '../assets/QuestionCoin.png';
import daddCoin from '../assets/daddcoin.webp';
import description from '../assets/description.png';
import startBtn from '../assets/start_transparent.png';
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
  const isReady = totalQuestions > 0;

  if (error) {
    return (
      <ErrorScreen
        onExit={onExit}
        description={
          error.toLowerCase().includes('lessonid')
            ? 'لا يمكننا العثور على الدرس المطلوب. يرجى التأكد من الرابط أو العودة للرئيسية.'
            : error
        }
      />
    );
  }

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
      descriptionImage={description}
      startButtonImage={startBtn}
      exitButtonImage={exitBtn}
      onStart={onStart}
      onExit={onExit}
      isLoading={isLoading}
      isReady={isReady}
    />
  );
};

export default WelcomeScreen;

