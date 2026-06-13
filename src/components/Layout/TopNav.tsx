import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

const pageTitles: Record<string, string> = {
  '/': '成就墙',
  '/games': '游戏库',
  '/media': '截图详情',
  '/friends': '好友浏览',
  '/settings': '设置',
};

export default function TopNav() {
  const location = useLocation();
  const { user } = useAppStore();
  const title = pageTitles[location.pathname] || '成就墙';

  return (
    <header className="sticky top-0 z-20 bg-cyber-darker/80 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="font-cyber text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">欢迎回来，{user.nickname}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
            <span>{user.joinedDate ? new Date(user.joinedDate).getFullYear() : ''}年加入</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white font-semibold">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
