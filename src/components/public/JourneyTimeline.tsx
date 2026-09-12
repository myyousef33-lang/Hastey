import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import {
  Lightbulb,
  Palette,
  Code2,
  Cpu,
  ShieldCheck,
  Rocket,
  Sparkles,
  Milestone,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

interface TimelineStage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  isSpecial?: boolean;
}

const STAGES: TimelineStage[] = [
  {
    step: '01',
    title: 'الفكرة',
    tagline: 'كل مشروع كبير يبدأ بفكرة.',
    description:
      'بدأت حِصّتي بفكرة تهدف إلى تقديم تجربة تعليمية رقمية أكثر تنظيمًا وسهولة للطلاب والمدرسين.',
    icon: Lightbulb
  },
  {
    step: '02',
    title: 'التصميم',
    tagline: 'تحويل الفكرة إلى تجربة.',
    description:
      'تم بناء الهوية البصرية وتصميم الواجهات مع التركيز على البساطة وسهولة الاستخدام وتجربة المستخدم.',
    icon: Palette
  },
  {
    step: '03',
    title: 'البرمجة',
    tagline: 'هنا بدأت الفكرة تتحول إلى واقع.',
    description:
      'تم تطوير الأنظمة والواجهات والوظائف الأساسية وتحويل التصميم إلى منصة تعمل بشكل فعلي.',
    icon: Code2
  },
  {
    step: '04',
    title: 'التطوير',
    tagline: 'التفاصيل الصغيرة تصنع الفرق.',
    description:
      'استمر العمل على تحسين المنصة وإضافة الوظائف وتطوير الأداء وتجربة المستخدم.',
    icon: Cpu
  },
  {
    step: '05',
    title: 'الاختبار',
    tagline: 'قبل أن تصل التجربة إليك، تم اختبارها.',
    description:
      'مراجعة الوظائف والواجهات والتأكد من استقرار المنصة وتجربة الاستخدام على مختلف الأجهزة.',
    icon: ShieldCheck
  },
  {
    step: '06',
    title: 'الإطلاق',
    tagline: 'من الفكرة إلى منصة حقيقية.',
    description:
      'أصبحت حِصّتي جاهزة لتقديم تجربة تعليمية رقمية متكاملة.',
    icon: Rocket,
    isSpecial: true
  }
];

export const JourneyTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 85%']
  });

  // Smooth spring for the filling line
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  const smoothEasing = [0.22, 1, 0.36, 1];

  return (
    <section
      ref={containerRef}
      aria-labelledby="journey-heading"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Subtle ambient background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 -right-32 w-80 h-80 rounded-full bg-blue-100/30 blur-3xl animate-ambient-float" />
        <div className="absolute top-2/3 -left-32 w-96 h-96 rounded-full bg-sky-50/40 blur-3xl animate-ambient-float-alt" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: smoothEasing }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs mb-4"
          >
            <Milestone className="w-3.5 h-3.5 text-blue-600" />
            <span>محطات التطوير والإنجاز</span>
          </motion.div>

          <motion.h2
            id="journey-heading"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: smoothEasing }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
          >
            رحلة بناء حِصّتي
          </motion.h2>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, delay: 0.2, ease: smoothEasing }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            من فكرة بسيطة إلى منصة تعليمية متكاملة، مرت حِصّتي برحلة من التصميم والتطوير والاختبار حتى وصلت إلى صورتها الحالية.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Track Line on Desktop (Centered at 50%) */}
          <div
            className="hidden md:block absolute top-6 bottom-6 right-1/2 translate-x-1/2 w-1 bg-slate-200/80 rounded-full"
            aria-hidden="true"
          >
            {/* Animated Scroll Progress Line */}
            <motion.div
              style={{ scaleY: shouldReduceMotion ? 1 : scaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-full shadow-xs"
            />
          </div>

          {/* Side Track Line on Mobile (Right aligned for RTL) */}
          <div
            className="md:hidden absolute top-4 bottom-4 right-6 sm:right-7 w-1 bg-slate-200/80 rounded-full"
            aria-hidden="true"
          >
            <motion.div
              style={{ scaleY: shouldReduceMotion ? 1 : scaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 rounded-full shadow-xs"
            />
          </div>

          {/* Stages List */}
          <div className="space-y-12 sm:space-y-16 md:space-y-20 relative z-10">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              // Even stages (0, 2, 4) on Right side (desktop RTL start)
              // Odd stages (1, 3, 5) on Left side (desktop RTL other side)
              const isEven = index % 2 === 0;

              return (
                <div
                  key={stage.step}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Milestone Node on Desktop (Centered) */}
                  <div
                    className="hidden md:flex absolute right-1/2 translate-x-1/2 items-center justify-center z-20"
                    aria-hidden="true"
                  >
                    <motion.div
                      initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.45, delay: 0.15, ease: smoothEasing }}
                      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 ${
                        stage.isSpecial
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-blue-500/20'
                          : 'bg-white text-blue-600 ring-4 ring-blue-50 border border-blue-200'
                      }`}
                    >
                      {stage.isSpecial && (
                        <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-md animate-pulse -z-10" />
                      )}
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Milestone Node on Mobile (Right Side on RTL) */}
                  <div
                    className="md:hidden absolute right-3.5 sm:right-4.5 top-5 z-20"
                    aria-hidden="true"
                  >
                    <motion.div
                      initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.4, ease: smoothEasing }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                        stage.isSpecial
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 border-2 border-blue-500'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                    </motion.div>
                  </div>

                  {/* Card Container */}
                  <div
                    className={`w-full md:w-[calc(50%-2.5rem)] pr-12 sm:pr-14 md:pr-0 ${
                      isEven ? 'md:pl-0 md:pr-0' : 'md:pr-0 md:pl-0'
                    }`}
                  >
                    <motion.div
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              x: typeof window !== 'undefined' && window.innerWidth >= 768 ? (isEven ? 24 : -24) : 0,
                              y: typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 0
                            }
                      }
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.55, ease: smoothEasing }}
                      className={`group relative rounded-3xl p-6 sm:p-7 transition-all duration-300 border ${
                        stage.isSpecial
                          ? 'bg-gradient-to-br from-white via-blue-50/40 to-blue-50/70 border-blue-300 shadow-md shadow-blue-500/5 hover:border-blue-400 hover:shadow-xl'
                          : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-200'
                      }`}
                    >
                      {/* Top highlight bar on hover */}
                      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/40 transition-all duration-500 rounded-full" />

                      {/* Header Row: Step number + Tagline + Icon on Mobile */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`font-mono text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg ${
                              stage.isSpecial
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}
                          >
                            {stage.step}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                            {stage.title}
                          </h3>
                        </div>

                        {/* Icon on card */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            stage.isSpecial
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs sm:text-sm font-bold text-blue-600 mb-2">
                        {stage.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Special launch highlight badge */}
                      {stage.isSpecial && (
                        <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>المنصة تعمل الآن بكامل كفاءتها وجاهزيتها</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 11. Concluding Card */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: smoothEasing }}
          className="mt-16 sm:mt-24 relative rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-br from-white via-blue-50/50 to-blue-100/40 border border-blue-200/80 shadow-md overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow inside Concluding Card */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white ring-1 ring-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <HeartHandshake className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              وراء كل تجربة تعليمية ناجحة... فريق يعمل بشغف.
            </h3>

            <p className="text-sm sm:text-base font-medium text-blue-700 leading-relaxed">
              حِصّتي — نطوّر اليوم تجربة تعليمية أفضل للغد.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
