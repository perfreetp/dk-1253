import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { mockGames, mockAchievements, mockMedia } from '@/data/mockData';

export const useInitializeData = () => {
  const { games, achievements, media, addGame, addAchievement, addMedia } = useAppStore();

  useEffect(() => {
    if (games.length === 0) {
      mockGames.forEach((game) => addGame(game));
    }
    if (achievements.length === 0) {
      mockAchievements.forEach((achievement) => addAchievement(achievement));
    }
    if (media.length === 0) {
      mockMedia.forEach((m) => addMedia(m));
    }
  }, [games.length, achievements.length, media.length, addGame, addAchievement, addMedia]);
};

export const useFilteredAchievements = (
  platformFilter: string,
  rarityFilter: string,
  yearFilter: number | null,
  searchQuery: string
) => {
  const { achievements, games } = useAppStore();

  return achievements.filter((achievement) => {
    const game = games.find((g) => g.id === achievement.gameId);

    if (platformFilter !== 'all' && game?.platform !== platformFilter) {
      return false;
    }

    if (rarityFilter !== 'all' && achievement.rarity !== rarityFilter) {
      return false;
    }

    if (yearFilter !== null) {
      const achievementYear = new Date(achievement.completedAt).getFullYear();
      if (achievementYear !== yearFilter) {
        return false;
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = achievement.name.toLowerCase().includes(query);
      const matchGame = game?.name.toLowerCase().includes(query);
      return matchName || matchGame;
    }

    return true;
  });
};
