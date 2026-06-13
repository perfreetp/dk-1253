import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useThemeStore } from '@/store/useThemeStore';
import Sidebar from '@/components/Layout/Sidebar';
import BottomNav from '@/components/Layout/BottomNav';
import TopNav from '@/components/Layout/TopNav';
import AchievementWall from '@/pages/AchievementWall';
import GameLibrary from '@/pages/GameLibrary';
import MediaGallery from '@/pages/MediaGallery';
import FriendBrowse from '@/pages/FriendBrowse';
import Settings from '@/pages/Settings';

export default function App() {
  const { user, games, achievements } = useAppStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    console.log('App loaded with:', {
      user: user.nickname,
      games: games.length,
      achievements: achievements.length,
    });
  }, [user, games, achievements]);

  return (
    <Router>
      <div className="flex min-h-screen bg-cyber-darker">
        <Sidebar />
        
        <div className="flex-1 flex flex-col lg:ml-0">
          <TopNav />
          
          <main className="flex-1 overflow-y-auto scrollbar-cyber pb-20 lg:pb-0">
            <Routes>
              <Route path="/" element={<AchievementWall />} />
              <Route path="/games" element={<GameLibrary />} />
              <Route path="/media" element={<MediaGallery />} />
              <Route path="/friends" element={<FriendBrowse />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        
        <BottomNav />
      </div>
    </Router>
  );
}
