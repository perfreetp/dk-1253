import { useMemo, useState } from 'react';
import { Trophy, Calendar, Star, TrendingUp, Gamepad2, Award, Clock, ChevronDown, ChevronRight, Download, Check, X, Image as ImageIcon, Shuffle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getRarityName, getRarityColor, getPlatformName, getPlatformIcon } from '@/data/mockData';
import { formatDate } from '@/utils/dateUtils';
import RarityBadge from '@/components/Achievement/RarityBadge';
import { exportToImage } from '@/utils/exportUtils';
import type { Achievement, Media } from '@/types';

export default function ProfileOverview() {
  const { user, achievements, games, media } = useAppStore();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [showYearPreview, setShowYearPreview] = useState(false);
  const [selectedHighlights, setSelectedHighlights] = useState<{
    achievements: Achievement[];
    media: Media[];
    topGames: string[];
  }>({
    achievements: [],
    media: [],
    topGames: [],
  });
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizerTab, setCustomizerTab] = useState<'achievements' | 'media'>('achievements');

  const years = useMemo(() => {
    const allDates = achievements.map((a) => a.completedAt);
    const allYears = allDates.map(d => new Date(d).getFullYear());
    const uniqueYears = [...new Set(allYears)];
    return uniqueYears.sort((a, b) => b - a);
  }, [achievements]);

  const yearStats = useMemo(() => {
    const yearAchievements = achievements.filter(a => new Date(a.completedAt).getFullYear() === selectedYear);
    
    const monthData: Record<string, typeof yearAchievements> = {};
    yearAchievements.forEach(a => {
      const month = new Date(a.completedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
      if (!monthData[month]) monthData[month] = [];
      monthData[month].push(a);
    });

    const platformCount: Record<string, number> = {};
    yearAchievements.forEach(a => {
      const game = games.find(g => g.id === a.gameId);
      if (game) {
        platformCount[game.platform] = (platformCount[game.platform] || 0) + 1;
      }
    });

    const rarityCount = {
      legendary: yearAchievements.filter(a => a.rarity === 'legendary').length,
      epic: yearAchievements.filter(a => a.rarity === 'epic').length,
      rare: yearAchievements.filter(a => a.rarity === 'rare').length,
      common: yearAchievements.filter(a => a.rarity === 'common').length,
    };

    const pinnedAchievements = yearAchievements.filter(a => a.isPinned);
    const topRarityAchievements = [...yearAchievements].sort((a, b) => {
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }).slice(0, 5);

    const yearMedia = media.filter(m => {
      const mediaDate = new Date(m.createdAt).getFullYear();
      return mediaDate === selectedYear;
    });

    const topGames = Object.entries(platformCount)
      .map(([platform, count]) => ({
        platform,
        count,
        game: games.find(g => g.platform === platform)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      total: yearAchievements.length,
      platformCount,
      rarityCount,
      pinnedAchievements,
      topRarityAchievements,
      yearMedia,
      topGames,
      monthData,
    };
  }, [achievements, games, media, selectedYear]);

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(month)) {
        next.delete(month);
      } else {
        next.add(month);
      }
      return next;
    });
  };

  const getGameName = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game?.name || '未知游戏';
  };

  const handleExportYearReview = async () => {
    setShowYearPreview(true);
    setTimeout(async () => {
      try {
        await exportToImage('year-review-card', `${selectedYear}年度回顾.png`);
      } catch (error) {
        console.error('Export failed:', error);
        alert('导出失败');
      }
      setShowYearPreview(false);
    }, 100);
  };

  const toggleHighlightAchievement = (achievement: Achievement) => {
    setSelectedHighlights(prev => ({
      ...prev,
      achievements: prev.achievements.some(a => a.id === achievement.id)
        ? prev.achievements.filter(a => a.id !== achievement.id)
        : [...prev.achievements, achievement]
    }));
  };

  const toggleHighlightMedia = (mediaItem: Media) => {
    setSelectedHighlights(prev => ({
      ...prev,
      media: prev.media.some(m => m.id === mediaItem.id)
        ? prev.media.filter(m => m.id !== mediaItem.id)
        : [...prev.media, mediaItem]
    }));
  };

  const autoSelectHighlights = () => {
    const topAchievements = yearStats.topRarityAchievements.slice(0, 5);
    const topMedia = yearStats.yearMedia.slice(0, 8);
    const topGameIds = yearStats.topGames.map(g => g.game?.id).filter(Boolean) as string[];
    
    setSelectedHighlights({
      achievements: topAchievements,
      media: topMedia,
      topGames: topGameIds,
    });
  };

  const getGamePlatform = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game?.platform || 'pc';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">个人主页</h1>
            <p className="text-gray-400">回顾你的游戏历程</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCustomizer(true)} className="btn-cyber-outline flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              自定义回顾
            </button>
            <button onClick={handleExportYearReview} className="btn-cyber flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出年度回顾
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-cyber">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all font-cyber font-bold ${
                selectedYear === year
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-lg'
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
          <div className="text-5xl font-cyber font-bold text-white mb-2">{yearStats.total}</div>
          <p className="text-sm text-gray-400">{selectedYear}年</p>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-neon-gold" />
            <h3 className="font-semibold text-white">传说成就</h3>
          </div>
          <div className="text-5xl font-cyber font-bold text-neon-gold mb-2">
            {yearStats.rarityCount.legendary}
          </div>
          <p className="text-sm text-gray-400">
            占比 {yearStats.total > 0 ? Math.round((yearStats.rarityCount.legendary / yearStats.total) * 100) : 0}%
          </p>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-6 h-6 text-neon-purple" />
            <h3 className="font-semibold text-white">游玩游戏</h3>
          </div>
          <div className="text-5xl font-cyber font-bold text-white mb-2">
            {Object.keys(yearStats.platformCount).length}
          </div>
          <p className="text-sm text-gray-400">个平台</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-neon-gold" />
            <h3 className="font-semibold text-white">年度亮点成就</h3>
          </div>
          <div className="space-y-3">
            {yearStats.topRarityAchievements.map((achievement, idx) => (
              <div key={achievement.id} className="flex items-start gap-3 p-3 bg-cyber-darker rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white truncate">{achievement.name}</h4>
                    <RarityBadge rarity={achievement.rarity} />
                  </div>
                  <p className="text-sm text-gray-400">{getGameName(achievement.gameId)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-neon-cyan" />
            <h3 className="font-semibold text-white">平台分布</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(yearStats.platformCount).map(([platform, count]) => (
              <div key={platform} className="flex items-center gap-4">
                <span className="text-3xl">{getPlatformIcon(platform)}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">{getPlatformName(platform)}</span>
                    <span className="text-white font-semibold">{count}个</span>
                  </div>
                  <div className="w-full h-2 bg-cyber-darker rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all"
                      style={{ width: `${(count / yearStats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-cyber mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-neon-cyan" />
          <h3 className="font-semibold text-white">{selectedYear}年月份时间轴</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(yearStats.monthData)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([month, monthAchievements]) => {
              const isExpanded = expandedMonths.has(month);
              return (
                <div key={month} className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleMonth(month)}
                    className="w-full flex items-center justify-between p-4 bg-cyber-darker hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-neon-cyan" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-white font-semibold">{month}</span>
                      <span className="text-sm text-gray-400">({monthAchievements.length}个成就)</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="p-4 space-y-3 bg-cyber-dark/50">
                      {monthAchievements.map(achievement => (
                        <div key={achievement.id} className="flex items-start gap-3 p-3 bg-cyber-darker rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-white truncate">{achievement.name}</h4>
                              <RarityBadge rarity={achievement.rarity} />
                            </div>
                            <p className="text-sm text-gray-400">{getGameName(achievement.gameId)}</p>
                            {achievement.notes && (
                              <p className="text-sm text-neon-purple mt-2 italic">"{achievement.notes}"</p>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex-shrink-0">
                            {formatDate(achievement.completedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {yearStats.yearMedia.length > 0 && (
        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-neon-purple" />
            <h3 className="font-semibold text-white">年度截图集</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {yearStats.yearMedia.map(mediaItem => (
              <div key={mediaItem.id} className="aspect-square rounded-lg overflow-hidden">
                <img src={mediaItem.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {showYearPreview && (
        <div className="modal-overlay" onClick={() => setShowYearPreview(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-4xl my-8 animate-scale-in">
              <div className="bg-cyber-darker rounded-2xl p-4 mb-4 flex items-center justify-between">
                <h3 className="text-white font-semibold">{selectedYear}年年度回顾预览</h3>
                <button onClick={() => setShowYearPreview(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto scrollbar-cyber rounded-xl overflow-hidden" id="year-review-card">
                <YearReviewCard 
                  year={selectedYear} 
                  stats={yearStats} 
                  user={user}
                  getGameName={getGameName}
                  getGamePlatform={getGamePlatform}
                  selectedHighlights={selectedHighlights}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustomizer && (
        <div className="modal-overlay" onClick={() => setShowCustomizer(false)}>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-4xl my-8 animate-scale-in">
              <div className="bg-cyber-darker rounded-2xl overflow-hidden">
                <div className="sticky top-0 bg-cyber-darker border-b border-white/10 p-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold">自定义{selectedYear}年年度回顾</h3>
                  <button onClick={() => setShowCustomizer(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCustomizerTab('achievements')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          customizerTab === 'achievements'
                            ? 'bg-neon-cyan text-cyber-darker font-semibold'
                            : 'bg-cyber-card text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <Trophy className="w-4 h-4 inline mr-2" />
                        选择成就
                      </button>
                      <button
                        onClick={() => setCustomizerTab('media')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          customizerTab === 'media'
                            ? 'bg-neon-purple text-white font-semibold'
                            : 'bg-cyber-card text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 inline mr-2" />
                        选择截图
                      </button>
                    </div>
                    <button onClick={autoSelectHighlights} className="btn-cyber-outline text-sm">
                      <Shuffle className="w-4 h-4 inline mr-2" />
                      智能推荐
                    </button>
                  </div>

                  <div className="mb-4 p-3 bg-cyber-darker rounded-lg border border-white/10">
                    <p className="text-sm text-gray-400 mb-2">已选择亮点</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-neon-gold/20 text-neon-gold rounded-full text-sm">
                        {selectedHighlights.achievements.length}个成就
                      </span>
                      <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm">
                        {selectedHighlights.media.length}张截图
                      </span>
                    </div>
                  </div>

                  {customizerTab === 'achievements' ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-cyber">
                      {yearStats.topRarityAchievements.map(achievement => (
                        <div
                          key={achievement.id}
                          onClick={() => toggleHighlightAchievement(achievement)}
                          className={`p-4 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                            selectedHighlights.achievements.some(a => a.id === achievement.id)
                              ? 'bg-neon-cyan/10 border-2 border-neon-cyan'
                              : 'bg-cyber-darker border-2 border-transparent hover:border-white/20'
                          }`}
                        >
                          <div className="w-6 h-6 rounded border-2 border-current flex items-center justify-center">
                            {selectedHighlights.achievements.some(a => a.id === achievement.id) && (
                              <Check className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{achievement.name}</p>
                            <p className="text-xs text-gray-400">{getGameName(achievement.gameId)}</p>
                          </div>
                          <RarityBadge rarity={achievement.rarity} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto scrollbar-cyber">
                      {yearStats.yearMedia.map(mediaItem => (
                        <div
                          key={mediaItem.id}
                          onClick={() => toggleHighlightMedia(mediaItem)}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedHighlights.media.some(m => m.id === mediaItem.id)
                              ? 'ring-2 ring-neon-purple'
                              : 'hover:opacity-80'
                          }`}
                        >
                          <img src={mediaItem.url} alt="" className="w-full h-full object-cover" />
                          {selectedHighlights.media.some(m => m.id === mediaItem.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-neon-purple rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setShowCustomizer(false)} className="btn-cyber-outline">
                      取消
                    </button>
                    <button onClick={() => {
                      setShowCustomizer(false);
                      handleExportYearReview();
                    }} className="btn-cyber flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      生成年度回顾
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function YearReviewCard({ year, stats, user, getGameName, getGamePlatform, selectedHighlights }: any) {
  const displayAchievements = selectedHighlights.achievements.length > 0 
    ? selectedHighlights.achievements 
    : stats.topRarityAchievements;
  const displayMedia = selectedHighlights.media.length > 0 
    ? selectedHighlights.media 
    : stats.yearMedia;

  return (
    <div className="bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker p-12">
      <div className="text-center mb-8">
        <h1 className="font-cyber text-5xl font-bold text-gradient mb-4">{year}年度回顾</h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white text-3xl font-bold">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <h2 className="font-cyber text-2xl font-bold text-white">{user.nickname}</h2>
            <p className="text-gray-400">游戏成就档案</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-cyber-dark rounded-xl p-6 text-center border border-white/10">
          <div className="text-5xl font-cyber font-bold text-white mb-2">{stats.total}</div>
          <p className="text-gray-400">成就总数</p>
        </div>
        <div className="bg-cyber-dark rounded-xl p-6 text-center border border-neon-gold/30">
          <div className="text-5xl font-cyber font-bold text-neon-gold mb-2">{stats.rarityCount.legendary}</div>
          <p className="text-gray-400">传说成就</p>
        </div>
        <div className="bg-cyber-dark rounded-xl p-6 text-center border border-white/10">
          <div className="text-5xl font-cyber font-bold text-white mb-2">{Object.keys(stats.platformCount).length}</div>
          <p className="text-gray-400">游玩平台</p>
        </div>
      </div>

      {displayAchievements.length > 0 && (
        <div className="bg-cyber-dark rounded-xl p-6 mb-6 border border-white/10">
          <h3 className="font-cyber text-xl font-bold text-white mb-4">年度亮点成就</h3>
          <div className="space-y-3">
            {displayAchievements.map((achievement: any, idx: number) => (
              <div key={achievement.id} className="flex items-start gap-4 p-4 bg-cyber-darker rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-white font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                      {getRarityName(achievement.rarity)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{getGameName(achievement.gameId)}</p>
                  {achievement.notes && (
                    <p className="text-sm text-neon-purple italic">"{achievement.notes}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {displayMedia.length > 0 && (
        <div className="bg-cyber-dark rounded-xl p-6 mb-6 border border-white/10">
          <h3 className="font-cyber text-xl font-bold text-white mb-4">精彩瞬间</h3>
          <div className="grid grid-cols-4 gap-3">
            {displayMedia.slice(0, 8).map((mediaItem: any) => (
              <div key={mediaItem.id} className="aspect-square rounded-lg overflow-hidden">
                <img src={mediaItem.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 pt-6 border-t border-white/10">
        <p>游戏成就展示小程序</p>
        <p>生成时间：{new Date().toLocaleDateString('zh-CN')}</p>
      </div>
    </div>
  );
}
