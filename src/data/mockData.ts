import type { Game, Achievement, FriendPost, Media } from '@/types';

export const mockGames: Game[] = [
  {
    id: 'game-1',
    name: '艾尔登法环',
    platform: 'ps',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=600&fit=crop',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'game-2',
    name: '塞尔达传说：王国之泪',
    platform: 'switch',
    coverImage: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400&h=600&fit=crop',
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'game-3',
    name: '赛博朋克2077',
    platform: 'pc',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    createdAt: '2024-03-10T10:00:00Z',
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    gameId: 'game-1',
    name: '艾尔登之王',
    description: '击败了艾尔登法环的最终Boss',
    completedAt: '2024-06-01T15:30:00Z',
    rarity: 'legendary',
    isPinned: true,
    isPublic: true,
    media: [],
    notes: '历时120小时，终于通关！这是一场硬仗，死了无数次终于过了。',
  },
  {
    id: 'ach-2',
    gameId: 'game-1',
    name: '满月女王',
    description: '击败了满月女王蕾娜菈',
    completedAt: '2024-05-15T20:00:00Z',
    rarity: 'epic',
    isPinned: false,
    isPublic: true,
    media: [],
    notes: '召唤泪滴后难度降低很多',
  },
  {
    id: 'ach-3',
    gameId: 'game-2',
    name: '大师之章',
    description: '完成所有神庙挑战',
    completedAt: '2024-04-10T18:00:00Z',
    rarity: 'epic',
    isPinned: true,
    isPublic: true,
    media: [],
    notes: '林克时间YYDS',
  },
  {
    id: 'ach-4',
    gameId: 'game-3',
    name: '街头小子',
    description: '完成所有街头任务',
    completedAt: '2024-03-25T12:00:00Z',
    rarity: 'rare',
    isPinned: false,
    isPublic: true,
    media: [],
  },
  {
    id: 'ach-5',
    gameId: 'game-1',
    name: '宁姆格福探索者',
    description: '探索了宁姆格福地区',
    completedAt: '2024-04-01T10:00:00Z',
    rarity: 'common',
    isPinned: false,
    isPublic: true,
    media: [],
  },
];

export const mockMedia: Media[] = [
  {
    id: 'media-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop',
    createdAt: '2024-06-01T16:00:00Z',
    relatedAchievementId: 'ach-1',
  },
  {
    id: 'media-2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
    createdAt: '2024-05-15T21:00:00Z',
    relatedAchievementId: 'ach-2',
  },
  {
    id: 'media-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
    createdAt: '2024-04-10T19:00:00Z',
    relatedAchievementId: 'ach-3',
  },
];

export const mockFriendPosts: FriendPost[] = [
  {
    id: 'post-1',
    friendId: 'friend-1',
    friendName: '魂系老玩家',
    friendAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    content: mockAchievements[0],
    contentType: 'achievement',
    likes: 42,
    isLiked: false,
    comments: [
      {
        id: 'comment-1',
        author: '游戏新手',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
        text: '太强了！',
        createdAt: '2024-06-01T18:00:00Z',
      },
    ],
    createdAt: '2024-06-01T17:00:00Z',
  },
  {
    id: 'post-2',
    friendId: 'friend-2',
    friendName: '任豚一枚',
    friendAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: mockAchievements[2],
    contentType: 'achievement',
    likes: 28,
    isLiked: true,
    comments: [],
    createdAt: '2024-04-10T20:00:00Z',
  },
  {
    id: 'post-3',
    friendId: 'friend-3',
    friendName: '赛博朋克爱好者',
    friendAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    content: mockMedia[2],
    contentType: 'media',
    likes: 15,
    isLiked: false,
    comments: [],
    createdAt: '2024-04-10T19:30:00Z',
  },
];

export const getPlatformName = (platform: string): string => {
  const names: Record<string, string> = {
    ps: 'PlayStation',
    xbox: 'Xbox',
    switch: 'Nintendo Switch',
    pc: 'PC',
    mobile: 'Mobile',
  };
  return names[platform] || platform;
};

export const getPlatformIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    ps: '🕹️',
    xbox: '🎮',
    switch: '🎯',
    pc: '💻',
    mobile: '📱',
  };
  return icons[platform] || '🎮';
};

export const getRarityName = (rarity: string): string => {
  const names: Record<string, string> = {
    legendary: '传说',
    epic: '史诗',
    rare: '稀有',
    common: '普通',
  };
  return names[rarity] || rarity;
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    legendary: 'from-amber-500 to-orange-600',
    epic: 'from-purple-600 to-violet-700',
    rare: 'from-cyan-400 to-blue-500',
    common: 'from-gray-500 to-gray-600',
  };
  return colors[rarity] || 'from-gray-500 to-gray-600';
};
