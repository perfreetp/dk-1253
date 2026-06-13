import { useState } from 'react';
import {
  Sun,
  Moon,
  Download,
  Trash2,
  User,
  Shield,
  Palette,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Settings() {
  const { user, settings, updateSettings, achievements, games } = useAppStore();
  const [showExportPreview, setShowExportPreview] = useState(false);

  const handleThemeToggle = () => {
    updateSettings({
      theme: settings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const handleExportAll = () => {
    setShowExportPreview(true);
    setTimeout(() => {
      const data = {
        user,
        games,
        achievements,
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'game-achievements-backup.json';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportPreview(false);
    }, 100);
  };

  const handleClearData = () => {
    if (
      confirm(
        '确定要清除所有数据吗？这将删除所有游戏、成就和截图。此操作不可撤销。'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const hiddenAchievements = achievements.filter((a) => !a.isPublic).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">
          设置
        </h1>
        <p className="text-gray-400">个性化你的成就墙体验</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-semibold text-white">个人信息</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">昵称</label>
              <input
                type="text"
                value={user.nickname}
                onChange={(e) =>
                  useAppStore.getState().setUser({
                    ...user,
                    nickname: e.target.value,
                  })
                }
                className="input-cyber"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">个人简介</label>
              <textarea
                value={user.bio}
                onChange={(e) =>
                  useAppStore.getState().setUser({
                    ...user,
                    bio: e.target.value,
                  })
                }
                className="input-cyber resize-none"
                rows={3}
                placeholder="介绍一下自己..."
              />
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-semibold text-white">外观</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">主题模式</p>
              <p className="text-sm text-gray-400">
                {settings.theme === 'dark' ? '深色模式' : '浅色模式'}
              </p>
            </div>
            <button
              onClick={handleThemeToggle}
              className="relative w-16 h-8 rounded-full bg-cyber-darker border border-white/20 transition-colors hover:border-neon-cyan"
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-transform flex items-center justify-center ${
                  settings.theme === 'dark' ? 'left-1' : 'left-9'
                }`}
              >
                {settings.theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-cyber-darker" />
                ) : (
                  <Sun className="w-3 h-3 text-cyber-darker" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-semibold text-white">隐私设置</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">默认公开新成就</p>
                <p className="text-sm text-gray-400">新建成就时的默认可见性</p>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    defaultPlatform: settings.defaultPlatform === 'all' ? 'pc' : 'all',
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                  settings.defaultPlatform === 'all'
                    ? 'bg-neon-cyan justify-end'
                    : 'bg-gray-600 justify-start'
                }`}
              >
                <div className="w-5 h-5 bg-white rounded-full mx-0.5" />
              </button>
            </div>

            <div className="bg-cyber-darker rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-medium">隐藏的成就</p>
                <span className="text-2xl font-bold text-neon-purple">
                  {hiddenAchievements}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                共有 {achievements.length} 个成就，其中 {hiddenAchievements} 个对他人隐藏
              </p>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-semibold text-white">数据管理</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-1">导出统计数据</p>
              <p className="text-sm text-gray-400 mb-3">
                在分享卡片中包含你的成就统计
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.exportIncludeStats}
                  onChange={(e) =>
                    updateSettings({ exportIncludeStats: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-cyber-darker text-neon-cyan focus:ring-neon-cyan"
                />
                <span className="text-gray-300">显示成就总数和稀有度分布</span>
              </label>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleExportAll}
                className="btn-cyber w-full mb-3"
              >
                <Download className="w-4 h-4 inline mr-2" />
                导出所有数据
              </button>
              <p className="text-xs text-gray-500 text-center">
                导出为 JSON 格式，包含所有游戏、成就和截图信息
              </p>
            </div>
          </div>
        </div>

        <div className="card-cyber border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-white">危险区域</h2>
          </div>

          <div>
            <p className="text-white font-medium mb-1">清除所有数据</p>
            <p className="text-sm text-gray-400 mb-3">
              删除所有游戏、成就、截图和设置。此操作不可撤销。
            </p>
            <button
              onClick={handleClearData}
              className="px-6 py-3 rounded-lg font-semibold transition-all bg-red-500 text-white hover:bg-red-600"
            >
              清除所有数据
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 py-8">
          <p className="mb-2">游戏成就展示小程序</p>
          <p>版本 1.0.0</p>
          <p className="mt-4">
            共记录 {games.length} 款游戏，{achievements.length} 个成就
          </p>
        </div>
      </div>

      {showExportPreview && (
        <div className="modal-overlay">
          <div className="modal-content p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white">正在导出数据...</p>
          </div>
        </div>
      )}
    </div>
  );
}
