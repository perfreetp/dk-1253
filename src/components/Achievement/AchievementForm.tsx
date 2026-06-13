import { useState, useMemo } from 'react';
import { X, Upload } from 'lucide-react';
import type { Achievement, Rarity } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { generateId } from '@/utils/dateUtils';

interface AchievementFormProps {
  achievement?: Achievement;
  onClose: () => void;
  onSubmit: (achievement: Achievement) => void;
}

const rarityOptions: Rarity[] = ['legendary', 'epic', 'rare', 'common'];
const rarityLabels: Record<Rarity, string> = {
  legendary: '传说',
  epic: '史诗',
  rare: '稀有',
  common: '普通',
};

export default function AchievementForm({
  achievement,
  onClose,
  onSubmit,
}: AchievementFormProps) {
  const { games, addMedia, settings, media } = useAppStore();
  const [formData, setFormData] = useState({
    gameId: achievement?.gameId || '',
    name: achievement?.name || '',
    description: achievement?.description || '',
    completedAt: achievement?.completedAt
      ? new Date(achievement.completedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    rarity: achievement?.rarity || ('common' as Rarity),
    notes: achievement?.notes || '',
    isPinned: achievement?.isPinned || false,
    isPublic: achievement?.isPublic ?? settings.defaultPublic,
    newMedia: [] as Array<{ id: string; type: 'image' | 'video'; url: string; createdAt: string }>,
  });
  
  const existingMedia = useMemo(() => {
    if (!achievement) return [];
    return media.filter(m => m.relatedAchievementId === achievement.id);
  }, [achievement, media]);
  
  const allMedia = useMemo(() => {
    return [...existingMedia, ...formData.newMedia];
  }, [existingMedia, formData.newMedia]);

  const [showGameSelect, setShowGameSelect] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newMediaItem = {
          id: generateId(),
          type: 'image' as const,
          url,
          createdAt: new Date().toISOString(),
        };
        setFormData((prev) => ({
          ...prev,
          newMedia: [...prev.newMedia, newMediaItem],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (mediaId: string) => {
    setFormData((prev) => ({
      ...prev,
      newMedia: prev.newMedia.filter((m) => m.id !== mediaId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gameId || !formData.name) {
      alert('请填写游戏和成就名称');
      return;
    }

    const achievementId = achievement?.id || generateId();
    
    formData.newMedia.forEach((media) => {
      const mediaId = media.id || generateId();
      addMedia({
        id: mediaId,
        type: media.type,
        url: media.url,
        createdAt: media.createdAt,
        relatedAchievementId: achievementId,
      });
    });

    const newAchievement: Achievement = {
      id: achievementId,
      gameId: formData.gameId,
      name: formData.name,
      description: formData.description || undefined,
      completedAt: new Date(formData.completedAt).toISOString(),
      rarity: formData.rarity,
      isPinned: formData.isPinned,
      isPublic: formData.isPublic,
      media: allMedia,
      notes: formData.notes || undefined,
    };

    onSubmit(newAchievement);
    onClose();
  };

  const selectedGame = games.find((g) => g.id === formData.gameId);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cyber text-2xl font-bold text-white">
            {achievement ? '编辑成就' : '添加成就'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              选择游戏 *
            </label>
            <button
              type="button"
              onClick={() => setShowGameSelect(true)}
              className="w-full input-cyber text-left flex items-center justify-between"
            >
              {selectedGame ? (
                <span>{selectedGame.name}</span>
              ) : (
                <span className="text-gray-400">选择一个游戏</span>
              )}
            </button>

            {showGameSelect && (
              <div className="mt-2 bg-cyber-darker rounded-lg border border-white/10 max-h-48 overflow-y-auto">
                {games.length === 0 ? (
                  <p className="p-4 text-gray-400 text-sm">
                    还没有游戏，请先在游戏库中添加游戏
                  </p>
                ) : (
                  games.map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, gameId: game.id }));
                        setShowGameSelect(false);
                      }}
                      className={`w-full text-left p-3 hover:bg-white/5 transition-colors ${
                        formData.gameId === game.id ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-white'
                      }`}
                    >
                      {game.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              成就名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input-cyber"
              placeholder="输入成就名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="input-cyber resize-none"
              rows={2}
              placeholder="成就描述（可选）"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                完成日期 *
              </label>
              <input
                type="date"
                value={formData.completedAt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, completedAt: e.target.value }))
                }
                className="input-cyber"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                稀有度 *
              </label>
              <select
                value={formData.rarity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rarity: e.target.value as Rarity,
                  }))
                }
                className="input-cyber"
                required
              >
                {rarityOptions.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarityLabels[rarity]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              心得笔记
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="input-cyber resize-none"
              rows={3}
              placeholder="分享你的游戏心得或攻略（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              截图上传
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-neon-cyan transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  点击上传截图或拖拽到此处
                </span>
              </label>
            </div>

            {allMedia.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {allMedia.map((media) => (
                  <div key={media.id} className="relative group">
                    <img
                      src={media.url}
                      alt=""
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    {existingMedia.some(m => m.id === media.id) && (
                      <div className="absolute top-1 left-1 bg-neon-cyan text-cyber-darker text-xs px-1 rounded">
                        已保存
                      </div>
                    )}
                    {!existingMedia.some(m => m.id === media.id) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(media.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isPinned: e.target.checked }))
                }
                className="w-4 h-4 rounded border-white/20 bg-cyber-darker text-neon-cyan focus:ring-neon-cyan"
              />
              <span className="text-gray-300">置顶代表作</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
                }
                className="w-4 h-4 rounded border-white/20 bg-cyber-darker text-neon-cyan focus:ring-neon-cyan"
              />
              <span className="text-gray-300">公开显示</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-cyber flex-1">
              {achievement ? '保存修改' : '添加成就'}
            </button>
            <button type="button" onClick={onClose} className="btn-cyber-outline flex-1">
              取消
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
