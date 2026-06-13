import type { Rarity } from '@/types';
import { getRarityName, getRarityColor } from '@/data/mockData';

interface RarityBadgeProps {
  rarity: Rarity;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
  const colorClass = getRarityColor(rarity);

  return (
    <span
      className={`badge-rarity bg-gradient-to-r ${colorClass} ${
        rarity === 'legendary' ? 'animate-pulse-glow' : ''
      }`}
    >
      {getRarityName(rarity)}
    </span>
  );
}
