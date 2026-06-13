import { useState, useMemo } from 'react';
import { Check, X, GripVertical, Image as ImageIcon, Trophy, Layout, Grid, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getRarityName, getRarityColor } from '@/data/mockData';
import { formatDate } from '@/utils/dateUtils';
import type { Achievement, Media } from '@/types';

interface Section {
  id: string;
  type: 'achievements' | 'media' | 'stats';
  items: (Achievement | Media)[];
  title: string;
}

export function ExportCardCustomizer({
  onExport,
}: {
  onExport: (selectedAchievements: Achievement[], selectedMedia: Media[]) => void;
}) {
  const { achievements, media } = useAppStore();
  const [selectedAchievements, setSelectedAchievements] = useState<Achievement[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'compact'>('modern');

  const pinnedAchievements = achievements.filter(a => a.isPinned);
  const unpinnedAchievements = achievements.filter(a => !a.isPinned);
  const relatedMedia = media.filter(m => 
    selectedAchievements.some(a => a.id === m.relatedAchievementId)
  );

  const toggleAchievement = (achievement: Achievement) => {
    setSelectedAchievements(prev =>
      prev.some(a => a.id === achievement.id)
        ? prev.filter(a => a.id !== achievement.id)
        : [...prev, achievement]
    );
  };

  const toggleMedia = (mediaItem: Media) => {
    setSelectedMedia(prev =>
      prev.some(m => m.id === mediaItem.id)
        ? prev.filter(m => m.id !== mediaItem.id)
        : [...prev, mediaItem]
    );
  };

  const selectAllPinned = () => {
    const allSelected = new Set(selectedAchievements.map(a => a.id));
    pinnedAchievements.forEach(a => allSelected.add(a.id));
    setSelectedAchievements(achievements.filter(a => allSelected.has(a.id)));
  };

  const selectRelatedMedia = () => {
    setSelectedMedia(relatedMedia);
  };

  const moveAchievement = (from: number, to: number) => {
    const newList = [...selectedAchievements];
    const [removed] = newList.splice(from, 1);
    newList.splice(to, 0, removed);
    setSelectedAchievements(newList);
  };

  const moveMedia = (from: number, to: number) => {
    const newList = [...selectedMedia];
    const [removed] = newList.splice(from, 1);
    newList.splice(to, 0, removed);
    setSelectedMedia(newList);
  };

  const moveAchievementUp = (index: number) => {
    if (index > 0) {
      moveAchievement(index, index - 1);
    }
  };

  const moveAchievementDown = (index: number) => {
    if (index < selectedAchievements.length - 1) {
      moveAchievement(index, index + 1);
    }
  };

  const moveMediaUp = (index: number) => {
    if (index > 0) {
      moveMedia(index, index - 1);
    }
  };

  const moveMediaDown = (index: number) => {
    if (index < selectedMedia.length - 1) {
      moveMedia(index, index + 1);
    }
  };

  const reorderAchievements = (from: number, to: number) => {
    const newList = [...selectedAchievements];
    const [removed] = newList.splice(from, 1);
    newList.splice(to, 0, removed);
    setSelectedAchievements(newList);
  };

  const reorderMedia = (from: number, to: number) => {
    const newList = [...selectedMedia];
    const [removed] = newList.splice(from, 1);
    newList.splice(to, 0, removed);
    setSelectedMedia(newList);
  };

  return (
    <div className="space-y-6">
      <div className="card-cyber">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-neon-cyan" />
            选择模板
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTemplate('modern')}
            className={`p-4 rounded-lg border-2 transition-all ${
              template === 'modern'
                ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                : 'border-white/10 text-gray-300 hover:border-white/30'
            }`}
          >
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm font-medium">现代风格</div>
          </button>
          <button
            onClick={() => setTemplate('classic')}
            className={`p-4 rounded-lg border-2 transition-all ${
              template === 'classic'
                ? 'border-neon-purple bg-neon-purple/10 text-neon-purple'
                : 'border-white/10 text-gray-300 hover:border-white/30'
            }`}
          >
            <div className="text-2xl mb-2">📜</div>
            <div className="text-sm font-medium">经典风格</div>
          </button>
          <button
            onClick={() => setTemplate('compact')}
            className={`p-4 rounded-lg border-2 transition-all ${
              template === 'compact'
                ? 'border-neon-gold bg-neon-gold/10 text-neon-gold'
                : 'border-white/10 text-gray-300 hover:border-white/30'
            }`}
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium">紧凑风格</div>
          </button>
        </div>
      </div>

      <div className="card-cyber">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-neon-gold" />
            选择成就（可拖动排序）
          </h3>
          <button onClick={selectAllPinned} className="text-sm text-neon-cyan hover:underline">
            全选置顶成就
          </button>
        </div>

        {selectedAchievements.length > 0 && (
          <div className="mb-4 p-3 bg-cyber-darker rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <Move className="w-4 h-4" />
              已选择成就（使用按钮调整顺序）
            </p>
            <div className="space-y-2">
              {selectedAchievements.map((achievement, idx) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-2 bg-cyber-dark px-3 py-2 rounded-lg border border-neon-cyan/30"
                >
                  <span className="text-xs text-gray-500 w-6 text-center">{idx + 1}</span>
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="flex-1 text-sm text-white truncate max-w-[120px]">{achievement.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveAchievementUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="上移"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveAchievementDown(idx)}
                      disabled={idx === selectedAchievements.length - 1}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="下移"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleAchievement(achievement)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-cyber">
          {pinnedAchievements.length > 0 && (
            <>
              <p className="text-xs text-neon-gold font-semibold">置顶成就</p>
              {pinnedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  onClick={() => toggleAchievement(achievement)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                    selectedAchievements.some(a => a.id === achievement.id)
                      ? 'bg-neon-cyan/10 border-2 border-neon-cyan'
                      : 'bg-cyber-darker border-2 border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="w-6 h-6 rounded border-2 border-current flex items-center justify-center">
                    {selectedAchievements.some(a => a.id === achievement.id) && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{achievement.name}</p>
                    <p className="text-xs text-gray-400">{getRarityName(achievement.rarity)}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {unpinnedAchievements.length > 0 && (
            <>
              <p className="text-xs text-gray-400 font-semibold mt-4">其他成就</p>
              {unpinnedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  onClick={() => toggleAchievement(achievement)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                    selectedAchievements.some(a => a.id === achievement.id)
                      ? 'bg-neon-cyan/10 border-2 border-neon-cyan'
                      : 'bg-cyber-darker border-2 border-transparent hover:border-white/20'
                  }`}
                >
                  <div className="w-6 h-6 rounded border-2 border-current flex items-center justify-center">
                    {selectedAchievements.some(a => a.id === achievement.id) && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{achievement.name}</p>
                    <p className="text-xs text-gray-400">{getRarityName(achievement.rarity)}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {achievements.length === 0 && (
            <p className="text-gray-400 text-center py-8">暂无成就可选择</p>
          )}
        </div>
      </div>

      <div className="card-cyber">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-neon-purple" />
            选择截图（可拖动排序）
          </h3>
          <button onClick={selectRelatedMedia} className="text-sm text-neon-cyan hover:underline">
            选择关联截图
          </button>
        </div>

        {selectedMedia.length > 0 && (
          <div className="mb-4 p-3 bg-cyber-darker rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <Move className="w-4 h-4" />
              已选择截图（使用按钮调整顺序）
            </p>
            <div className="space-y-2">
              {selectedMedia.map((mediaItem, idx) => (
                <div
                  key={mediaItem.id}
                  className="flex items-center gap-3 bg-cyber-dark px-3 py-2 rounded-lg border border-neon-purple/30"
                >
                  <span className="text-xs text-gray-500 w-6 text-center">{idx + 1}</span>
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img src={mediaItem.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">截图 {idx + 1}</p>
                    <p className="text-xs text-gray-500">{formatDate(mediaItem.createdAt)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveMediaUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="上移"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveMediaDown(idx)}
                      disabled={idx === selectedMedia.length - 1}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="下移"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleMedia(mediaItem)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto scrollbar-cyber">
          {media.map(mediaItem => (
            <div
              key={mediaItem.id}
              onClick={() => toggleMedia(mediaItem)}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedMedia.some(m => m.id === mediaItem.id)
                  ? 'ring-2 ring-neon-cyan'
                  : 'hover:opacity-80'
              }`}
            >
              <img src={mediaItem.url} alt="" className="w-full h-full object-cover" />
              {selectedMedia.some(m => m.id === mediaItem.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-neon-cyan rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-cyber-darker" />
                </div>
              )}
            </div>
          ))}

          {media.length === 0 && (
            <p className="text-gray-400 text-center py-8 col-span-4">暂无截图可选择</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onExport(selectedAchievements, selectedMedia)}
          disabled={selectedAchievements.length === 0 && selectedMedia.length === 0}
          className="btn-cyber flex-1 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          生成导出卡片
        </button>
      </div>

      <div className="text-center text-sm text-gray-400">
        已选择 {selectedAchievements.length} 个成就，{selectedMedia.length} 张截图 | 模板：{template === 'modern' ? '现代风格' : template === 'classic' ? '经典风格' : '紧凑风格'}
      </div>
    </div>
  );
}
