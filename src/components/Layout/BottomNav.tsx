import { NavLink } from 'react-router-dom';
import { Trophy, User, Gamepad2, Image, Users } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Trophy, label: '成就' },
    { to: '/profile', icon: User, label: '主页' },
    { to: '/games', icon: Gamepad2, label: '游戏' },
    { to: '/media', icon: Image, label: '截图' },
    { to: '/friends', icon: Users, label: '好友' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-lg border-t border-white/10 z-30">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-neon-cyan'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
