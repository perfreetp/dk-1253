import { Edit2, Trophy } from 'lucide-react';
import type { Game } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { getPlatformName, getPlatformIcon } from '@/data/mockData';

interface GameCardProps {
  game: Game;
  onEdit: () => void;
  onClick: () => void;
}

export default function GameCard({ game, onEdit, onClick }: GameCardProps) {
  const { achievements } = useAppStore();
  const gameAchievements = achievements.filter((a) => a.gameId === game.id);

  return (
    <div
      className="card-cyber cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative mb-4">
        {game.coverImage ? (
          <img
            src={game.coverImage}
            alt={game.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-lg flex items-center justify-center">
            <span className="text-5xl">{getPlatformIcon(game.platform)}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker via-transparent to-transparent rounded-lg" />
        
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPlatformIcon(game.platform)}</span>
            <span className="text-xs text-gray-300">{getPlatformName(game.platform)}</span>
          </div>
          <div className="flex items-center gap-2 bg-cyber-darker/80 backdrop-blur-sm rounded-full px-3 py-1">
            <Trophy className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-semibold text-white">{gameAchievements.length}</span>
          </div>
        </div>

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-8 h-8 bg-cyber-darker/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-neon-cyan/20 transition-colors"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-lg text-white mb-1 truncate">{game.name}</h3>
      <p className="text-sm text-gray-400">
        {gameAchievements.length > 0
          ? `已完成 ${gameAchievements.length} 个成就`
          : '暂无成就记录'}
      </p>

      <div className="mt-4 flex flex-wrap gap-1">
        {gameAchievements.slice(0, 3).map((achievement) => (
          <span
            key={achievement.id}
            className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${
              achievement.rarity === 'legendary'
                ? 'from-amber-500/20 to-orange-600/20 text-amber-300'
                : achievement.rarity === 'epic'
                ? 'from-purple-600/20 to-violet-700/20 text-purple-300'
                : achievement.rarity === 'rare'
                ? 'from-cyan-400/20 to-blue-500/20 text-cyan-300'
                : 'from-gray-500/20 to-gray-600/20 text-gray-300'
            }`}
          >
            {achievement.name}
          </span>
        ))}
        {gameAchievements.length > 3 && (
          <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-400">
            +{gameAchievements.length - 3} 更多
          </span>
        )}
      </div>
    </div>
  );
}
