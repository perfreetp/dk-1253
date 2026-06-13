import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getRarityName, getRarityColor } from '@/data/mockData';
import { formatDate } from '@/utils/dateUtils';
import { Trophy, Calendar, Star } from 'lucide-react';
import type { Achievement, Media } from '@/types';

export { ExportCardCustomizer } from './ExportCardCustomizer';

interface ExportCardProps {
  selectedAchievements: Achievement[];
  selectedMedia: Media[];
  template?: 'modern' | 'classic' | 'compact';
}

export default function ExportCard({ selectedAchievements, selectedMedia, template = 'modern' }: ExportCardProps) {
  const { user, games } = useAppStore();

  const stats = useMemo(() => {
    const rarityCount = {
      legendary: selectedAchievements.filter(a => a.rarity === 'legendary').length,
      epic: selectedAchievements.filter(a => a.rarity === 'epic').length,
      rare: selectedAchievements.filter(a => a.rarity === 'rare').length,
      common: selectedAchievements.filter(a => a.rarity === 'common').length,
    };

    const thisYear = new Date().getFullYear();
    const thisYearCount = selectedAchievements.filter(
      a => new Date(a.completedAt).getFullYear() === thisYear
    ).length;

    return { total: selectedAchievements.length, thisYear: thisYearCount, rarityCount };
  }, [selectedAchievements]);

  const getGameName = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game?.name || '未知游戏';
  };

  if (template === 'classic') {
    return (
      <div className="bg-white p-8 text-gray-900" id="export-card">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{user.nickname}</h1>
            <p className="text-gray-600">游戏成就档案</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-100 rounded">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">成就总数</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded">
              <div className="text-3xl font-bold">{stats.thisYear}</div>
              <div className="text-sm text-gray-600">{new Date().getFullYear()}年完成</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded">
              <div className="text-3xl font-bold">{stats.rarityCount.legendary}</div>
              <div className="text-sm text-gray-600">传说成就</div>
            </div>
          </div>

          {selectedAchievements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">代表作成就</h2>
              {selectedAchievements.map(achievement => (
                <div key={achievement.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🏆</div>
                    <div className="flex-1">
                      <h3 className="font-bold">{achievement.name}</h3>
                      <p className="text-sm text-gray-600">{getGameName(achievement.gameId)}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                        {getRarityName(achievement.rarity)}
                      </span>
                      {achievement.notes && (
                        <p className="text-sm text-gray-500 mt-2 italic">"{achievement.notes}"</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedMedia.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2">精选截图</h2>
              <div className="grid grid-cols-3 gap-3">
                {selectedMedia.map(mediaItem => (
                  <img key={mediaItem.id} src={mediaItem.url} alt="" className="w-full aspect-square object-cover rounded" />
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>游戏成就展示小程序</p>
            <p>生成时间：{formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'compact') {
    return (
      <div className="bg-cyber-dark p-6" id="export-card">
        <div className="bg-cyber-darker rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white font-bold">
                {user.nickname.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-bold text-white">{user.nickname}</h1>
                <p className="text-xs text-gray-400">成就档案</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-gray-400">成就</p>
            </div>
          </div>

          {selectedAchievements.length > 0 && (
            <div className="space-y-2 mb-4">
              {selectedAchievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="flex items-center gap-2 p-2 bg-cyber-dark rounded">
                  <span className="text-lg">🏆</span>
                  <span className="flex-1 text-sm text-white truncate">{achievement.name}</span>
                </div>
              ))}
            </div>
          )}

          {selectedMedia.length > 0 && (
            <div className="flex gap-2 mb-4">
              {selectedMedia.slice(0, 4).map(mediaItem => (
                <img key={mediaItem.id} src={mediaItem.url} alt="" className="w-12 h-12 rounded object-cover" />
              ))}
            </div>
          )}

          <div className="text-center text-xs text-gray-500">
            成就墙小程序
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-dark p-8" id="export-card">
      <div className="bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="relative p-8 bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-cyan/10 border-b border-white/10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5" />
          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.nickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-cyber text-2xl font-bold text-white mb-1">{user.nickname}</h1>
              <p className="text-gray-400 text-sm">游戏成就档案</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-neon-cyan" />
                <span className="font-cyber text-2xl font-bold text-white">{stats.total}</span>
              </div>
              <p className="text-xs text-gray-400">成就总数</p>
            </div>
            <div className="bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-neon-purple" />
                <span className="font-cyber text-2xl font-bold text-white">{stats.thisYear}</span>
              </div>
              <p className="text-xs text-gray-400">{new Date().getFullYear()}年完成</p>
            </div>
            <div className="bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-neon-gold" />
                <span className="font-cyber text-2xl font-bold text-white">{stats.rarityCount.legendary}</span>
              </div>
              <p className="text-xs text-gray-400">传说成就</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {selectedAchievements.length > 0 && (
            <div>
              <h2 className="font-cyber text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-gold rounded-full" />
                代表作成就
              </h2>
              <div className="space-y-3">
                {selectedAchievements.map(achievement => (
                  <div key={achievement.id} className="bg-cyber-dark rounded-lg p-4 border border-neon-gold/30 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🏆</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{achievement.name}</h3>
                        <span className={`badge-rarity bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                          {getRarityName(achievement.rarity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{getGameName(achievement.gameId)}</p>
                      {achievement.notes && (
                        <p className="text-sm text-neon-purple mt-2 italic">"{achievement.notes}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedAchievements.length > 0 && (
            <div>
              <h2 className="font-cyber text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-cyan rounded-full" />
                稀有度分布
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(stats.rarityCount).map(([rarity, count]) => (
                  <div key={rarity} className={`bg-gradient-to-br ${getRarityColor(rarity)} rounded-lg p-3 text-center`}>
                    <div className="font-cyber text-xl font-bold text-white mb-1">{count}</div>
                    <div className="text-xs text-white/80">{getRarityName(rarity)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMedia.length > 0 && (
            <div>
              <h2 className="font-cyber text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-purple rounded-full" />
                精选截图
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {selectedMedia.map(mediaItem => (
                  <div key={mediaItem.id} className="aspect-square rounded-lg overflow-hidden border border-white/10">
                    <img src={mediaItem.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/10">
            <p className="mb-1">游戏成就展示小程序</p>
            <p>生成时间：{formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
