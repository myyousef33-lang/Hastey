import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import type { SiteSettings } from '../../../types';
import { STORY_STAGES } from './types';
import { StoryNavigator } from './StoryNavigator';
import { IdeaStage } from './IdeaStage';
import { DesignStage } from './DesignStage';
import { CodeStage } from './CodeStage';
import { PlatformStage } from './PlatformStage';
import { RevealStage } from './RevealStage';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface HasstyMotionStoryProps {
  settings?: SiteSettings;
}

export const HasstyMotionStory: React.FC<HasstyMotionStoryProps> = ({ settings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, STORY_STAGES.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentStage = STORY_STAGES[currentIndex];

  return (
    <section
      aria-label="قصة بناء المنصة: من الفكرة إلى حِصّتي"
      className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-white via-blue-50/25 to-white border-y border-blue-50 overflow-hidden"
    >
      {/* Background radial ambient light */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-blue-100/35 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 mb-2.5">
            قصة التحول الرقمي
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            من الفكرة إلى حِصّتي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            اضغط على الأرقام (1 - 2 - 3 - 4 - 5) لتصفح مراحل ولادة المنصة فوراً
          </p>
        </div>

        {/* Instant Stage Navigator (1 - 2 - 3 - 4 - 5) */}
        <StoryNavigator
          currentIndex={currentIndex}
          onSelectIndex={setCurrentIndex}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Interactive Dynamic Stage Canvas */}
        <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center mt-6">
          <AnimatePresence mode="wait">
            {currentStage.id === 'idea' && (
              <IdeaStage key="stage-idea" isActive={true} />
            )}

            {currentStage.id === 'design' && (
              <DesignStage key="stage-design" isActive={true} />
            )}

            {currentStage.id === 'code' && (
              <CodeStage key="stage-code" isActive={true} />
            )}

            {currentStage.id === 'platform' && (
              <PlatformStage key="stage-platform" isActive={true} />
            )}

            {currentStage.id === 'reveal' && (
              <RevealStage
                key="stage-reveal"
                isActive={true}
                settings={settings}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Quick Stepper Action Footer */}
        <div className="flex items-center justify-between max-w-lg mx-auto pt-6 border-t border-slate-100 px-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="text-slate-400 font-mono text-xs">
            المرحلة {currentStage.stepNumber} من 05
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex === STORY_STAGES.length - 1}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-30 disabled:pointer-events-none transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50 font-bold"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
