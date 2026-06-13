import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Game, Achievement, Media, AppSettings, UserProfile, Comment, FriendPost } from '@/types';

interface AppStore extends AppState {
  setUser: (user: UserProfile) => void;
  addGame: (game: Game) => void;
  updateGame: (id: string, game: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;
  togglePinAchievement: (id: string) => void;
  togglePublicAchievement: (id: string) => void;
  addMedia: (media: Media) => void;
  deleteMedia: (id: string) => void;
  likeFriendPost: (id: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  addFriendPost: (post: FriendPost) => void;
  toggleBookmarkFriend: (friendId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  getGameById: (id: string) => Game | undefined;
  getAchievementsByGame: (gameId: string) => Achievement[];
  getMediaByAchievement: (achievementId: string) => Media[];
}

const defaultUser: UserProfile = {
  id: 'user-1',
  nickname: '游戏玩家',
  avatar: '',
  bio: '热爱游戏的玩家',
  joinedDate: new Date().toISOString(),
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  defaultPlatform: 'all',
  defaultRarity: 'all',
  defaultPublic: true,
  exportIncludeStats: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      games: [],
      achievements: [],
      media: [],
      friendPosts: [],
      settings: defaultSettings,
      bookmarkedFriends: [],

      setUser: (user) => set({ user }),

      addGame: (game) => set((state) => ({ games: [...state.games, game] })),

      updateGame: (id, gameUpdate) =>
        set((state) => ({
          games: state.games.map((g) => (g.id === id ? { ...g, ...gameUpdate } : g)),
        })),

      deleteGame: (id) =>
        set((state) => {
          const gameAchievements = state.achievements.filter((a) => a.gameId === id);
          const achievementIds = gameAchievements.map((a) => a.id);
          return {
            games: state.games.filter((g) => g.id !== id),
            achievements: state.achievements.filter((a) => a.gameId !== id),
            media: state.media.filter((m) => 
              !achievementIds.includes(m.relatedAchievementId || '')
            ),
          };
        }),

      addAchievement: (achievement) =>
        set((state) => ({ achievements: [...state.achievements, achievement] })),

      updateAchievement: (id, achievementUpdate) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, ...achievementUpdate } : a
          ),
        })),

      deleteAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.filter((a) => a.id !== id),
          media: state.media.filter((m) => m.relatedAchievementId !== id),
        })),

      togglePinAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, isPinned: !a.isPinned } : a
          ),
        })),

      togglePublicAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, isPublic: !a.isPublic } : a
          ),
        })),

      addMedia: (media) => set((state) => ({ media: [...state.media, media] })),

      deleteMedia: (id) => set((state) => ({ media: state.media.filter((m) => m.id !== id) })),

      likeFriendPost: (id) =>
        set((state) => ({
          friendPosts: state.friendPosts.map((p) =>
            p.id === id
              ? {
                  ...p,
                  isLiked: !p.isLiked,
                  likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                }
              : p
          ),
        })),

      addComment: (postId, comment) =>
        set((state) => ({
          friendPosts: state.friendPosts.map((p) =>
            p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
          ),
        })),

      addFriendPost: (post) =>
        set((state) => {
          const existingIndex = state.friendPosts.findIndex((p) => p.id === post.id);
          if (existingIndex >= 0) {
            const updated = [...state.friendPosts];
            updated[existingIndex] = post;
            return { friendPosts: updated };
          }
          return { friendPosts: [...state.friendPosts, post] };
        }),

      toggleBookmarkFriend: (friendId) =>
        set((state) => ({
          bookmarkedFriends: state.bookmarkedFriends.includes(friendId)
            ? state.bookmarkedFriends.filter((id) => id !== friendId)
            : [...state.bookmarkedFriends, friendId],
        })),

      updateSettings: (settingsUpdate) =>
        set((state) => ({
          settings: { ...state.settings, ...settingsUpdate },
        })),

      getGameById: (id) => get().games.find((g) => g.id === id),

      getAchievementsByGame: (gameId) =>
        get().achievements.filter((a) => a.gameId === gameId),

      getMediaByAchievement: (achievementId) =>
        get().media.filter((m) => m.relatedAchievementId === achievementId),
    }),
    {
      name: 'game-achievement-storage',
    }
  )
);
