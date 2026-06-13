import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getRarityName, getRarityColor } from '@/data/mockData';
import { formatDate } from '@/utils/dateUtils';
import { Trophy, Calendar, Star } from 'lucide-react';

export default function ExportCard() {
  const { user, achievements, games } = useAppStore();

  const stats = useMemo(() => {
    const thisYear = new Date().getFullYear();
    const thisYearAchievements = achievements.filter(
      (a) => new Date(a.completedAt).getFullYear() === thisYear
    );
    
    const rarityCount = {
      legendary: achievements.filter((a) => a.rarity === 'legendary').length,
      epic: achievements.filter((a) => a.rarity === 'epic').length,
      rare: achievements.filter((a) => a.rarity === 'rare').length,
      common: achievements.filter((a) => a.rarity === 'common').length,
    };

    const pinnedAchievements = achievements.filter((a) => a.isPinned).slice(0, 3);
    
    const achievementMedia = achievements.flatMap((a) => a.media);
    const featuredMedia = achievementMedia.slice(0, 6);

    return {
      total: achievements.length,
      thisYear: thisYearAchievements.length,
      rarityCount,
      pinnedAchievements,
      featuredMedia,
    };
  }, [achievements]);

  const getGameName = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    return game?.name || '未知游戏';
  };

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
              <h1 className="font-cyber text-2xl font-bold text-white mb-1">
                {user.nickname}
              </h1>
              <p className="text-gray-400 text-sm">游戏成就档案</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-neon-cyan" />
                <span className="font-cyber text-2xl font-bold text-white">
                  {stats.total}
                </span>
              </div>
              <p className="text-xs text-gray-400">总成就数</p>
            </div>
            <div className="bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-neon-purple" />
                <span className="font-cyber text-2xl font-bold text-white">
                  {stats.thisYear}
                </span>
              </div>
              <p className="text-xs text-gray-400">{new Date().getFullYear()}年完成</p>
            </div>
            <div className="bg-cyber-dark/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-neon-gold" />
                <span className="font-cyber text-2xl font-bold text-white">
                  {stats.rarityCount.legendary}
                </span>
              </div>
              <p className="text-xs text-gray-400">传说成就</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h2 className="font-cyber text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-neon-gold rounded-full" />
              代表作成就
            </h2>
            <div className="space-y-3">
              {stats.pinnedAchievements.length > 0 ? (
                stats.pinnedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-cyber-dark rounded-lg p-4 border border-neon-gold/30 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🏆</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {achievement.name}
                        </h3>
                        <span className={`badge-rarity bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                          {getRarityName(achievement.rarity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{getGameName(achievement.gameId)}</p>
                      {achievement.notes && (
                        <p className="text-sm text-neon-purple mt-2 italic">
                          "{achievement.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">暂无置顶成就</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-cyber text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-neon-cyan rounded-full" />
              稀有度分布
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(stats.rarityCount).map(([rarity, count]) => (
                <div
                  key={rarity}
                  className={`bg-gradient-to-br ${getRarityColor(rarity)} rounded-lg p-3 text-center`}
                >
                  <div className="font-cyber text-xl font-bold text-white mb-1">
                    {count}
                  </div>
                  <div className="text-xs text-white/80">
                    {getRarityName(rarity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {stats.featuredMedia.length > 0 && (
            <div>
              <h2 className="font-cyber text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-purple rounded-full" />
                精选截图
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {stats.featuredMedia.map((mediaItem) => (
                  <div
                    key={mediaItem.id}
                    className="aspect-square rounded-lg overflow-hidden border border-white/10"
                  >
                    <img
                      src={mediaItem.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
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
