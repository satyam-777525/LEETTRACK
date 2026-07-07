import React from 'react';
import { FaListUl, FaCheckCircle, FaHourglassHalf, FaChartLine } from 'react-icons/fa';

export default function Dashboard({ total, solved }) {
  const remaining = total - solved;
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  const cardData = [
    {
      title: 'Total Questions',
      value: total,
      icon: FaListUl,
      colorClass: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Solved Questions',
      value: solved,
      icon: FaCheckCircle,
      colorClass: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Remaining',
      value: remaining,
      icon: FaHourglassHalf,
      colorClass: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Completion Rate',
      value: `${percentage}%`,
      icon: FaChartLine,
      colorClass: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="card-glow relative overflow-hidden rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700/80 shadow-md backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-400">{card.title}</span>
                <div className={`p-2.5 rounded-xl ${card.bgColor} border`}>
                  <IconComponent className={`w-4 h-4 ${card.colorClass}`} />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tight text-white font-mono">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Container Card */}
      <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 backdrop-blur-md">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-200">Overall Progress</h3>
            <p className="text-xs text-zinc-400">Keep grinding. Consistency beats talent!</p>
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {percentage}%
          </span>
        </div>
        
        {/* Progress track */}
        <div className="relative w-full h-4 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden shadow-inner">
          <div
            style={{ width: `${percentage}%` }}
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
          {/* Pulsing light overlay for sleek animation */}
          {percentage > 0 && (
            <div
              style={{ width: `${percentage}%` }}
              className="absolute top-0 left-0 h-full rounded-full bg-white/20 animate-progress-pulse transition-all duration-500 ease-out pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
