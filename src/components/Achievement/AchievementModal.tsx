import { X, Pin, PinOff, Eye, EyeOff, Edit2, Trash2, Download } from 'lucide-react';
import type { Achievement } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/utils/dateUtils';
import RarityBadge from './RarityBadge';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
  onEdit: () => void;
  onExport: () => void;
}

export default function AchievementModal({
  achievement,
  onClose,
  onEdit,
  onExport,
}: AchievementModalProps) {
  const { getGameById, togglePinAchievement, togglePublicAchievement, deleteAchievement } =
    useAppStore();
  const game = getGameById(achievement.gameId);

  const handleDelete = () => {
    if (confirm('确定要删除这个成就吗？')) {
      deleteAchievement(achievement.id);
      onClose();
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                achievement.isPinned
                  ? 'from-amber-500 to-orange-600'
                  : 'from-neon-cyan to-neon-purple'
              } flex items-center justify-center shadow-lg ${
                achievement.isPinned ? 'shadow-neon-gold' : 'shadow-neon'
              }`}
            >
              <span className="text-3xl">🏆</span>
            </div>
            <div>
              <h2 className="font-cyber text-2xl font-bold text-white mb-2">
                {achievement.name}
              </h2>
              <div className="flex items-center gap-2">
                <RarityBadge rarity={achievement.rarity} />
                {game && (
                  <span className="text-sm text-gray-400">{game.name}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {achievement.description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">描述</h3>
            <p className="text-gray-300">{achievement.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-cyber-darker rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-1">完成时间</h3>
            <p className="text-white">{formatDate(achievement.completedAt)}</p>
          </div>
          <div className="bg-cyber-darker rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-1">稀有度</h3>
            <p className="text-white capitalize">{achievement.rarity}</p>
          </div>
        </div>

        {achievement.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">心得笔记</h3>
            <div className="bg-cyber-darker rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-wrap">{achievement.notes}</p>
            </div>
          </div>
        )}

        {achievement.media.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">相关截图</h3>
            <div className="grid grid-cols-3 gap-2">
              {achievement.media.map((media) => (
                <img
                  key={media.id}
                  src={media.url}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => togglePinAchievement(achievement.id)}
            className={`btn-cyber-outline flex items-center gap-2 text-sm ${
              achievement.isPinned ? 'border-neon-gold text-neon-gold' : ''
            }`}
          >
            {achievement.isPinned ? (
              <>
                <PinOff className="w-4 h-4" />
                取消置顶
              </>
            ) : (
              <>
                <Pin className="w-4 h-4" />
                置顶
              </>
            )}
          </button>

          <button
            onClick={() => togglePublicAchievement(achievement.id)}
            className={`btn-cyber-outline flex items-center gap-2 text-sm ${
              !achievement.isPublic ? 'border-neon-gold text-neon-gold' : ''
            }`}
          >
            {achievement.isPublic ? (
              <>
                <EyeOff className="w-4 h-4" />
                隐藏
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                公开
              </>
            )}
          </button>

          <button
            onClick={onExport}
            className="btn-cyber-outline flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            导出
          </button>

          <button
            onClick={onEdit}
            className="btn-cyber-outline flex items-center gap-2 text-sm"
          >
            <Edit2 className="w-4 h-4" />
            编辑
          </button>

          <button
            onClick={handleDelete}
            className="btn-cyber-outline flex items-center gap-2 text-sm border-red-500 text-red-500 hover:bg-red-500"
          >
            <Trash2 className="w-4 h-4" />
            删除
          </button>
        </div>
      </div>
    </>
  );
}
