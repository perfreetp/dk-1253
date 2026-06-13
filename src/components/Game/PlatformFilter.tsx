import type { Platform } from '@/types';
import { getPlatformName } from '@/data/mockData';

interface PlatformFilterProps {
  selected: Platform | 'all';
  onChange: (platform: Platform | 'all') => void;
}

export default function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  const platforms: (Platform | 'all')[] = ['all', 'ps', 'xbox', 'switch', 'pc', 'mobile'];
  
  const platformIcons: Record<string, string> = {
    all: '🎮',
    ps: '🎯',
    xbox: '🎮',
    switch: '🕹️',
    pc: '💻',
    mobile: '📱',
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-cyber">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onChange(platform)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            selected === platform
              ? 'bg-neon-cyan text-cyber-darker font-semibold'
              : 'bg-cyber-card text-gray-300 hover:bg-white/10'
          }`}
        >
          <span className="mr-2">{platformIcons[platform]}</span>
          {platform === 'all' ? '全部平台' : getPlatformName(platform)}
        </button>
      ))}
    </div>
  );
}
