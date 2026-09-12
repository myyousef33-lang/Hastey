import React from 'react';
import { motion } from 'motion/react';
import { STORY_STAGES, type StageInfo } from './types';
import { Compass, ChevronRight, ChevronLeft } from 'lucide-react';

interface StoryNavigatorProps {
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StoryNavigator: React.FC<StoryNavigatorProps> = ({
  currentIndex,
  onSelectIndex,
  onNext,
  onPrev
}) => {
  const currentStage = STORY_STAGES[currentIndex];
  const progressPercent = ((currentIndex + 1) / STORY_STAGES.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative z-20">
      {/* Navigator Card */}
      <div className="flex items-center justify-between gap-2 bg-white/95 rounded-2xl p-2 sm:p-2.5 border border-blue-100 shadow-sm backdrop-blur-xs">
        {/* Next / Prev Quick Arrows (RTL aware) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            title="المرحلة السابقة"
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === STORY_STAGES.length - 1}
            title="المرحلة التالية"
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 1 - 2 - 3 - 4 - 5 Stage Buttons (Instant Switching) */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {STORY_STAGES.map((stage, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={stage.id}
                onClick={() => onSelectIndex(idx)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-100'
                }`}
              >
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-blue-700 text-white' : 'text-slate-400'
                  }`}
                >
                  {stage.stepNumber}
                </span>
                <span className="text-[11px] sm:text-xs">{stage.name}</span>
              </button>
            );
          })}
        </div>

        {/* Title Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold shrink-0">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>من الفكرة إلى حِصّتي</span>
        </div>
      </div>

      {/* Instant Dynamic Progress Bar */}
      <div className="w-full bg-slate-200/70 h-1.5 rounded-full mt-2.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
