import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Game, Platform } from '@/types';
import PlatformFilter from '@/components/Game/PlatformFilter';
import GameCard from '@/components/Game/GameCard';
import GameForm from '@/components/Game/GameForm';

export default function GameLibrary() {
  const { games, addGame, updateGame } = useAppStore();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game) => {
    if (selectedPlatform !== 'all' && game.platform !== selectedPlatform) {
      return false;
    }
    if (searchQuery) {
      return game.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSubmit = (game: Game) => {
    if (editingGame) {
      updateGame(game.id, game);
    } else {
      addGame(game);
    }
    setEditingGame(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">
              游戏库
            </h1>
            <p className="text-gray-400">
              共 {games.length} 款游戏
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="btn-cyber flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>添加游戏</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索游戏..."
              className="input-cyber pl-10"
            />
          </div>
        </div>

        <PlatformFilter selected={selectedPlatform} onChange={setSelectedPlatform} />
      </div>

      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GameCard
                game={game}
                onEdit={() => {
                  setEditingGame(game);
                  setShowForm(true);
                }}
                onClick={() => {
                  console.log('View game details:', game);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-white mb-2">还没有游戏</h3>
          <p className="text-gray-400 mb-6">开始添加你的游戏收藏吧</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-cyber inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加游戏
          </button>
        </div>
      )}

      {showForm && (
        <GameForm
          game={editingGame || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingGame(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
