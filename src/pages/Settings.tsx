import { useState } from 'react';
import {
  Sun,
  Moon,
  Download,
  Trash2,
  User,
  Shield,
  Palette,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function Settings() {
  const { user, settings, updateSettings, achievements, games } = useAppStore();
  const { theme, setTheme } = useThemeStore();
  const [showExportPreview, setShowExportPreview] = useState(false);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
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

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-3 block">主题模式</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === 'dark'
                      ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                      : 'border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm font-medium">深色模式</span>
                  {theme === 'dark' && <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === 'light'
                      ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                      : 'border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm font-medium">浅色模式</span>
                  {theme === 'light' && <Check className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                当前：{theme === 'dark' ? '深色模式' : '浅色模式'}
              </p>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-semibold text-white">隐私设置</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cyber-darker rounded-lg">
              <div>
                <p className="text-white font-medium mb-1">默认公开新成就</p>
                <p className="text-sm text-gray-400">
                  新建成就时自动设为公开显示
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    defaultPublic: !settings.defaultPublic,
                  })
                }
                className={`relative w-14 h-7 rounded-full transition-colors flex items-center ${
                  settings.defaultPublic
                    ? 'bg-neon-cyan justify-end'
                    : 'bg-gray-600 justify-start'
                }`}
              >
                <div className="w-6 h-6 bg-white rounded-full mx-0.5 transition-transform flex items-center justify-center">
                  {settings.defaultPublic ? (
                    <Check className="w-3 h-3 text-cyber-darker" />
                  ) : null}
                </div>
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

            <div className="bg-cyber-darker rounded-lg p-4">
              <p className="text-white font-medium mb-2">隐私说明</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 公开的成就会被其他玩家看到</li>
                <li>• 隐藏的成就仅自己可见</li>
                <li>• 可以在成就详情中随时切换可见性</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-cyber">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-semibold text-white">数据管理</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cyber-darker rounded-lg">
              <div>
                <p className="text-white font-medium mb-1">导出统计数据</p>
                <p className="text-sm text-gray-400">
                  在分享卡片中包含成就统计
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({ exportIncludeStats: !settings.exportIncludeStats })
                }
                className={`relative w-14 h-7 rounded-full transition-colors flex items-center ${
                  settings.exportIncludeStats
                    ? 'bg-neon-cyan justify-end'
                    : 'bg-gray-600 justify-start'
                }`}
              >
                <div className="w-6 h-6 bg-white rounded-full mx-0.5 transition-transform flex items-center justify-center">
                  {settings.exportIncludeStats ? (
                    <Check className="w-3 h-3 text-cyber-darker" />
                  ) : null}
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button onClick={handleExportAll} className="btn-cyber w-full mb-3">
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
            <button onClick={handleClearData} className="px-6 py-3 rounded-lg font-semibold transition-all bg-red-500 text-white hover:bg-red-600">
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
