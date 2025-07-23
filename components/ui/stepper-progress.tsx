import React from "react";

interface StepperProgressProps {
  step: number; // index step aktif (mulai dari 0)
  steps: string[];
  progress: number; // 0-100
}

export default function StepperProgress({ step, steps, progress }: StepperProgressProps) {
  return (
    <div className="w-full max-w-3xl mb-10 mx-auto">
      {/* Stepper label */}
      <div className="flex justify-between items-center mb-2 px-2">
        {steps.map((label, idx) => (
          <div
            key={label}
            className={`flex-1 text-center text-xs md:text-base font-semibold ${step === idx ? 'text-sky-700' : 'text-gray-400'}`}
          >
            {label}
          </div>
        ))}
      </div>
      {/* Progress percentage */}
      <div className="flex justify-between items-center mb-1 px-2">
        <span className="text-xs text-gray-400 font-semibold">{progress}%</span>
        <span className="text-xs text-gray-400 font-semibold">{progress === 100 ? 'Selesai' : ''}</span>
      </div>
      {/* Custom Progress Bar */}
      <div className="relative h-4 flex items-center">
        {/* Background bar */}
        <div className="absolute left-0 right-0 h-3 rounded-full bg-sky-100" />
        {/* Gradient progress */}
        <div
          className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%`, zIndex: 1 }}
        />
      </div>
    </div>
  );
} 