import { useMemo, useState } from 'react';
import { Trophy, Star, TrendingUp, Gamepad2, Award, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getRarityName, getRarityColor, getPlatformName, getPlatformIcon } from '@/data/mockData';
import { formatDate, getYearsRange } from '@/utils/dateUtils';
import RarityBadge from '@/components/Achievement/RarityBadge';

export default function ProfileOverview() {
  const { user, achievements, games } = useAppStore();
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const years = useMemo(() => {
    const allDates = achievements.map((a) => a.completedAt);
    return getYearsRange(allDates);
  }, [achievements]);

  const stats = useMemo(() => {
    const filteredAchievements = selectedYear === 'all' 
      ? achievements 
      : achievements.filter(a => new Date(a.completedAt).getFullYear() === selectedYear);

    const platformCount: Record<string, number> = {};
    filteredAchievements.forEach(a => {
      const game = games.find(g => g.id === a.gameId);
      if (game) {
        platformCount[game.platform] = (platformCount[game.platform] || 0) + 1;
      }
    });

    const rarityCount = {
      legendary: filteredAchievements.filter((a) => a.rarity === 'legendary').length,
      epic: filteredAchievements.filter((a) => a.rarity === 'epic').length,
      rare: filteredAchievements.filter((a) => a.rarity === 'rare').length,
      common: filteredAchievements.filter((a) => a.rarity === 'common').length,
    };

    const pinnedAchievements = filteredAchievements
      .filter((a) => a.isPinned)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    const recentAchievements = [...filteredAchievements]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5);

    const monthStats: Record<string, number> = {};
    filteredAchievements.forEach(a => {
      const month = new Date(a.completedAt).toLocaleDateString('zh-CN', { month: 'long' });
      monthStats[month] = (monthStats[month] || 0) + 1;
    });
    const topMonth = Object.entries(monthStats).sort((a, b) => b[1] - a[1])[0];

    return {
      total: filteredAchievements.length,
      platformCount,
      rarityCount,
      pinnedAchievements,
      recentAchievements,
      topMonth,
    };
  }, [achievements, games, selectedYear]);

  const getGameName = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    return game?.name || '未知游戏';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">
          个人主页
        </h1>
        <p className="text-gray-400">回顾你的游戏历程</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-cyber text-2xl font-bold text-white mb-1">{user.nickname}</h2>
            <p className="text-gray-400 text-sm">{user.bio}</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-cyber">
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedYear === 'all'
                ? 'bg-neon-cyan text-cyber-darker font-semibold'
                : 'bg-cyber-card text-gray-300 hover:bg-white/10'
            }`}
          >
            全部记录
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedYear === year
                  ? 'bg-neon-cyan text-cyber-darker font-semibold'
                  : 'bg-cyber-card text-gray-300 hover:bg-white/10'
              }`}
            >
              {year}年
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-neon-cyan" />
            <h3 className="font-semibold text-white">成就总数</h3>
          </div>
          <div className="text-4xl font-cyber font-bold text-white mb-2">
            {stats.total}
          </div>
          <p className="text-sm text-gray-400">
            {selectedYear === 'all' ? '累计' : selectedYear + '年'}
          </p>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-neon-gold" />
            <h3 className="font-semibold text-white">传说成就</h3>
          </div>
          <div className="text-4xl font-cyber font-bold text-neon-gold mb-2">
            {stats.rarityCount.legendary}
          </div>
          <p className="text-sm text-gray-400">
            占比 {stats.total > 0 ? Math.round((stats.rarityCount.legendary / stats.total) * 100) : 0}%
          </p>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-neon-purple" />
            <h3 className="font-semibold text-white">最高产月份</h3>
          </div>
          <div className="text-2xl font-cyber font-bold text-white mb-2">
            {stats.topMonth ? stats.topMonth[0] : '-'}
          </div>
          <p className="text-sm text-gray-400">
            {stats.topMonth ? `${stats.topMonth[1]}个成就` : '暂无数据'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-6 h-6 text-neon-cyan" />
            <h3 className="font-semibold text-white">平台分布</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.platformCount).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPlatformIcon(platform)}</span>
                  <span className="text-gray-300">{getPlatformName(platform)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-cyber-darker rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
            {Object.keys(stats.platformCount).length === 0 && (
              <p className="text-gray-400 text-center py-4">暂无平台数据</p>
            )}
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-neon-gold" />
            <h3 className="font-semibold text-white">稀有度分布</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats.rarityCount).map(([rarity, count]) => (
              <div
                key={rarity}
                className={`bg-gradient-to-br ${getRarityColor(rarity)} rounded-lg p-3 text-center`}
              >
                <div className="font-cyber text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-xs text-white/80">{getRarityName(rarity)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats.pinnedAchievements.length > 0 && (
        <div className="card-cyber mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-neon-gold" />
            <h3 className="font-semibold text-white">代表作成就</h3>
          </div>
          <div className="space-y-3">
            {stats.pinnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-cyber-darker rounded-lg p-4 border border-neon-gold/30 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏆</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{achievement.name}</h4>
                    <RarityBadge rarity={achievement.rarity} />
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

      <div className="card-cyber">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-neon-cyan" />
          <h3 className="font-semibold text-white">最近完成</h3>
        </div>
        <div className="space-y-3">
          {stats.recentAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-4 p-3 bg-cyber-darker rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎮</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white truncate">{achievement.name}</h4>
                  <RarityBadge rarity={achievement.rarity} />
                </div>
                <p className="text-sm text-gray-400">{getGameName(achievement.gameId)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-gray-300">{formatDate(achievement.completedAt)}</p>
              </div>
            </div>
          ))}
          {stats.recentAchievements.length === 0 && (
            <p className="text-gray-400 text-center py-8">暂无成就记录</p>
          )}
        </div>
      </div>
    </div>
  );
}
