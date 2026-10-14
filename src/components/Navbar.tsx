import React from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/mooreMachine';

export type NavSection = 'dashboard' | 'configuration' | 'simulator' | 'results' | 'trace' | 'testcases' | 'about';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onQuickSimulate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onQuickSimulate,
}) => {
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sound.enabled = next;
    if (next) sound.playTone(520, 0.08);
  };

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'dashboard', label: 'Home' },
    { id: 'configuration', label: 'Machine Spec' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'results', label: 'Results' },
    { id: 'trace', label: 'Trace Table' },
    { id: 'testcases', label: 'Test Cases' },
    { id: 'about', label: 'Theory & Viva' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="cursor-pointer flex items-center gap-2 group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-mono font-bold text-white text-base shadow-lg shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
            M
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            Moore Machine Simulator
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute Audio Tones' : 'Enable Audio Tones'}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Audio"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onQuickSimulate}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate 10110</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Strip */}
      <div className="lg:hidden border-t border-slate-800/70 overflow-x-auto py-1 px-3 flex items-center gap-1 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeSection === item.id
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
