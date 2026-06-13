import { useState, useMemo } from 'react';
import { Plus, Filter, Search, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useFilteredAchievements } from '@/hooks/useData';
import { getYearsRange } from '@/utils/dateUtils';
import { exportToImage } from '@/utils/exportUtils';
import type { Achievement, Platform, Rarity, Media } from '@/types';
import AchievementCard from '@/components/Achievement/AchievementCard';
import AchievementModal from '@/components/Achievement/AchievementModal';
import AchievementForm from '@/components/Achievement/AchievementForm';
import ExportCard, { ExportCardCustomizer } from '@/components/Export/ExportCard';

export default function AchievementWall() {
  const { achievements, addAchievement, updateAchievement } = useAppStore();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [showExportCustomizer, setShowExportCustomizer] = useState(false);
  const [exportSelectedAchievements, setExportSelectedAchievements] = useState<Achievement[]>([]);
  const [exportSelectedMedia, setExportSelectedMedia] = useState<Media[]>([]);

  const filteredAchievements = useFilteredAchievements(
    platformFilter,
    rarityFilter,
    yearFilter,
    searchQuery
  );

  const years = useMemo(() => {
    const allDates = achievements.map((a) => a.completedAt);
    return getYearsRange(allDates);
  }, [achievements]);

  const pinnedAchievements = filteredAchievements.filter((a) => a.isPinned);
  const normalAchievements = filteredAchievements.filter((a) => !a.isPinned);

  const handleExport = async () => {
    try {
      setShowExportPreview(true);
      setTimeout(async () => {
        await exportToImage('export-card', '个人成就卡片.png');
        setShowExportPreview(false);
      }, 100);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败');
      setShowExportPreview(false);
    }
  };

  const handleExportWithSelection = (selectedAchievements: Achievement[], selectedMedia: Media[]) => {
    setExportSelectedAchievements(selectedAchievements);
    setExportSelectedMedia(selectedMedia);
    setShowExportCustomizer(false);
    setShowExportPreview(true);
  };

  const handleSubmit = (achievement: Achievement) => {
    if (editingAchievement) {
      updateAchievement(achievement.id, achievement);
    } else {
      addAchievement(achievement);
    }
    setEditingAchievement(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">
              成就墙
            </h1>
            <p className="text-gray-400">
              共 {achievements.length} 个成就，{pinnedAchievements.length} 个置顶
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-cyber-outline flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">筛选</span>
            </button>
            {achievements.length > 0 && (
              <button
                onClick={() => setShowExportCustomizer(true)}
                className="btn-cyber-outline flex items-center gap-2 text-neon-purple border-neon-purple hover:bg-neon-purple hover:text-white"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">导出卡片</span>
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="btn-cyber flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>添加成就</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索成就或游戏..."
              className="input-cyber pl-10"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-3 animate-slide-up">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">平台</label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
                className="input-cyber text-sm py-2"
              >
                <option value="all">全部平台</option>
                <option value="ps">PlayStation</option>
                <option value="xbox">Xbox</option>
                <option value="switch">Switch</option>
                <option value="pc">PC</option>
                <option value="mobile">手游</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">稀有度</label>
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as Rarity | 'all')}
                className="input-cyber text-sm py-2"
              >
                <option value="all">全部稀有度</option>
                <option value="legendary">传说</option>
                <option value="epic">史诗</option>
                <option value="rare">稀有</option>
                <option value="common">普通</option>
              </select>
            </div>
          </div>
        )}

        {years.length > 0 && (
          <div className="mt-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-cyber">
              <button
                onClick={() => setYearFilter(null)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  yearFilter === null
                    ? 'bg-neon-cyan text-cyber-darker font-semibold'
                    : 'bg-cyber-card text-gray-300 hover:bg-white/10'
                }`}
              >
                全部年份
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setYearFilter(year)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    yearFilter === year
                      ? 'bg-neon-cyan text-cyber-darker font-semibold'
                      : 'bg-cyber-card text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {pinnedAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neon-gold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-neon-gold rounded-full" />
            置顶代表作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onClick={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>
        </div>
      )}

      {normalAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {normalAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AchievementCard
                achievement={achievement}
                onClick={() => setSelectedAchievement(achievement)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-white mb-2">还没有成就</h3>
          <p className="text-gray-400 mb-6">开始添加你的第一个游戏成就吧</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-cyber inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加成就
          </button>
        </div>
      )}

      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          onEdit={() => {
            setEditingAchievement(selectedAchievement);
            setSelectedAchievement(null);
            setShowForm(true);
          }}
          onExport={() => handleExport()}
        />
      )}

      {showForm && (
        <AchievementForm
          achievement={editingAchievement || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingAchievement(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {showExportCustomizer && (
        <div className="modal-overlay" onClick={() => setShowExportCustomizer(false)}>
          <div
            className="fixed inset-4 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-4xl lg:max-h-[90vh] overflow-y-auto bg-cyber-darker rounded-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-cyber-darker border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">自定义导出内容</h3>
              <button
                onClick={() => setShowExportCustomizer(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ExportCardCustomizer onExport={handleExportWithSelection} />
            </div>
          </div>
        </div>
      )}

      {showExportPreview && (
        <div className="modal-overlay" onClick={() => setShowExportPreview(false)}>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-3xl my-8 animate-scale-in">
              <div className="bg-cyber-darker rounded-2xl p-4 mb-4 flex items-center justify-between">
                <h3 className="text-white font-semibold">个人成就卡片预览</h3>
                <button
                  onClick={() => setShowExportPreview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto scrollbar-cyber">
                <ExportCard selectedAchievements={exportSelectedAchievements} selectedMedia={exportSelectedMedia} />
              </div>
              <div className="bg-cyber-darker rounded-2xl p-4 mt-4 flex justify-center gap-3">
                <button
                  onClick={handleExport}
                  className="btn-cyber flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载图片
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hidden">
        <ExportCard selectedAchievements={exportSelectedAchievements} selectedMedia={exportSelectedMedia} />
      </div>
    </div>
  );
}
