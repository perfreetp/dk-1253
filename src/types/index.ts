export interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  joinedDate: string;
}

export type Platform = 'ps' | 'xbox' | 'switch' | 'pc' | 'mobile';
export type Rarity = 'legendary' | 'epic' | 'rare' | 'common';

export interface Media {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  createdAt: string;
  relatedAchievementId?: string;
}

export interface Achievement {
  id: string;
  gameId: string;
  name: string;
  description?: string;
  completedAt: string;
  rarity: Rarity;
  isPinned: boolean;
  isPublic: boolean;
  media: Media[];
  notes?: string;
}

export interface Game {
  id: string;
  name: string;
  platform: Platform;
  coverImage: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface FriendPost {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  content: Achievement | Media;
  contentType: 'achievement' | 'media';
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  defaultPlatform: Platform | 'all';
  defaultRarity: Rarity | 'all';
  defaultPublic: boolean;
  exportIncludeStats: boolean;
}

export interface AppState {
  user: UserProfile;
  games: Game[];
  achievements: Achievement[];
  media: Media[];
  friendPosts: FriendPost[];
  settings: AppSettings;
  bookmarkedFriends: string[];
}
