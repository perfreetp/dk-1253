import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { Game, Platform } from '@/types';
import { generateId } from '@/utils/dateUtils';

interface GameFormProps {
  game?: Game;
  onClose: () => void;
  onSubmit: (game: Game) => void;
}

const platformOptions: { value: Platform; label: string; icon: string }[] = [
  { value: 'ps', label: 'PlayStation', icon: '🎯' },
  { value: 'xbox', label: 'Xbox', icon: '🎮' },
  { value: 'switch', label: 'Nintendo Switch', icon: '🕹️' },
  { value: 'pc', label: 'PC', icon: '💻' },
  { value: 'mobile', label: 'Mobile', icon: '📱' },
];

export default function GameForm({ game, onClose, onSubmit }: GameFormProps) {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    platform: game?.platform || ('pc' as Platform),
    coverImage: game?.coverImage || '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        coverImage: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('请输入游戏名称');
      return;
    }

    const newGame: Game = {
      id: game?.id || generateId(),
      name: formData.name,
      platform: formData.platform,
      coverImage: formData.coverImage,
      createdAt: game?.createdAt || new Date().toISOString(),
    };

    onSubmit(newGame);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cyber text-2xl font-bold text-white">
            {game ? '编辑游戏' : '添加游戏'}
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
              游戏名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="input-cyber"
              placeholder="输入游戏名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              游戏平台 *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platformOptions.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, platform: platform.value }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.platform === platform.value
                      ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                      : 'border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              游戏封面
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-neon-cyan transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="game-cover-upload"
              />
              {formData.coverImage ? (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <label
                    htmlFor="game-cover-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="text-white">点击更换图片</span>
                  </label>
                </div>
              ) : (
                <label
                  htmlFor="game-cover-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    点击上传游戏封面
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-cyber flex-1">
              {game ? '保存修改' : '添加游戏'}
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
