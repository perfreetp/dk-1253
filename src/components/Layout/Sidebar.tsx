import { NavLink } from 'react-router-dom';
import { Trophy, Gamepad2, Image, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: Trophy, label: '成就墙' },
    { to: '/games', icon: Gamepad2, label: '游戏库' },
    { to: '/media', icon: Image, label: '截图详情' },
    { to: '/friends', icon: Users, label: '好友浏览' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-cyber-darker/50 backdrop-blur-lg border-r border-white/10 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="font-cyber text-2xl font-bold text-gradient">成就墙</h1>
        <p className="text-sm text-gray-400 mt-2">记录你的游戏高光时刻</p>
      </div>

      <nav className="flex-1 px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link mb-2 ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="text-xs text-gray-500">
          <p>游戏成就展示小程序</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
