import { Trophy, Pin, Calendar } from 'lucide-react';
import type { Achievement } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/utils/dateUtils';
import RarityBadge from './RarityBadge';

interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

export default function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  const { getGameById, media } = useAppStore();
  const game = getGameById(achievement.gameId);
  const achievementMedia = media.filter((m) => m.relatedAchievementId === achievement.id);

  return (
    <div
      className={`card-cyber cursor-pointer relative group ${
        achievement.isPinned ? 'border-neon-gold shadow-neon-gold' : ''
      }`}
      onClick={onClick}
    >
      {achievement.isPinned && (
        <div className="absolute -top-2 -right-2 bg-neon-gold text-cyber-darker px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-neon-gold">
          <Pin className="w-3 h-3" />
          置顶
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
              achievement.isPinned
                ? 'from-amber-500 to-orange-600'
                : 'from-neon-cyan to-neon-purple'
            } flex items-center justify-center shadow-lg ${
              achievement.isPinned ? 'shadow-neon-gold' : 'shadow-neon'
            }`}
          >
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white truncate flex-1">
              {achievement.name}
            </h3>
            <RarityBadge rarity={achievement.rarity} />
          </div>

          {game && (
            <p className="text-sm text-gray-400 mb-2">{game.name}</p>
          )}

          {achievement.description && (
            <p className="text-sm text-gray-300 mb-3 line-clamp-2">
              {achievement.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(achievement.completedAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              {achievementMedia.length > 0 && (
                <span className="text-neon-cyan">
                  {achievementMedia.length} 个附件
                </span>
              )}
              {achievement.notes && (
                <span className="text-neon-purple">有心得</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
