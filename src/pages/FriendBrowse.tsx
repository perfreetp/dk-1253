import { useState, useMemo, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Send, Search, Filter, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatTimeAgo, generateId } from '@/utils/dateUtils';
import { mockFriendPosts } from '@/data/mockData';
import type { Comment, Achievement, Media, FriendPost } from '@/types';

export default function FriendBrowse() {
  const {
    friendPosts,
    likeFriendPost,
    addComment,
    addFriendPost,
    bookmarkedFriends,
    toggleBookmarkFriend,
    user,
    games,
  } = useAppStore();

  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showComment, setShowComment] = useState<string | null>(null);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'mostLiked' | 'mostCommented'>('latest');

  useEffect(() => {
    const savedFilters = localStorage.getItem('friendBrowseFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setShowBookmarkedOnly(filters.showBookmarkedOnly || false);
        setSearchQuery(filters.searchQuery || '');
        setPlatformFilter(filters.platformFilter || 'all');
        setSortBy(filters.sortBy || 'latest');
      } catch (e) {
        console.error('Failed to load filters:', e);
      }
    }
  }, []);

  useEffect(() => {
    const filters = {
      showBookmarkedOnly,
      searchQuery,
      platformFilter,
      sortBy,
    };
    localStorage.setItem('friendBrowseFilters', JSON.stringify(filters));
  }, [showBookmarkedOnly, searchQuery, platformFilter, sortBy]);

  const allPosts = useMemo(() => {
    const combined: FriendPost[] = [];
    const seenIds = new Set<string>();
    
    friendPosts.forEach(post => {
      if (!seenIds.has(post.id)) {
        seenIds.add(post.id);
        combined.push(post);
      }
    });
    
    mockFriendPosts.forEach(mockPost => {
      if (!seenIds.has(mockPost.id)) {
        seenIds.add(mockPost.id);
        combined.push(mockPost);
      }
    });
    
    return combined;
  }, [friendPosts]);

  const displayPosts = useMemo(() => {
    let posts = [...allPosts];
    
    if (showBookmarkedOnly) {
      posts = posts.filter(post => bookmarkedFriends.includes(post.friendId));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post => {
        const matchName = post.friendName.toLowerCase().includes(query);
        if (post.contentType === 'achievement') {
          const achievement = post.content as Achievement;
          const matchContent = achievement.name.toLowerCase().includes(query) ||
                             achievement.description?.toLowerCase().includes(query);
          const game = games.find(g => g.id === achievement.gameId);
          const matchGame = game?.name.toLowerCase().includes(query);
          return matchName || matchContent || matchGame;
        }
        return matchName;
      });
    }

    if (platformFilter !== 'all') {
      posts = posts.filter(post => {
        if (post.contentType === 'achievement') {
          const achievement = post.content as Achievement;
          const game = games.find(g => g.id === achievement.gameId);
          return game?.platform === platformFilter;
        }
        return false;
      });
    }

    posts.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'mostLiked') {
        return getPostLikes(b) - getPostLikes(a);
      } else {
        return getPostComments(b).length - getPostComments(a).length;
      }
    });
    
    return posts;
  }, [allPosts, showBookmarkedOnly, searchQuery, platformFilter, sortBy, bookmarkedFriends, games]);

  const handleLike = (post: FriendPost) => {
    const storePost = friendPosts.find(p => p.id === post.id);
    
    if (storePost) {
      likeFriendPost(post.id);
    } else {
      const existingInAll = allPosts.find(p => p.id === post.id);
      if (existingInAll) {
        const updatedPost: FriendPost = {
          ...existingInAll,
          isLiked: !existingInAll.isLiked,
          likes: existingInAll.isLiked ? existingInAll.likes - 1 : existingInAll.likes + 1,
        };
        addFriendPost(updatedPost);
      }
    }
  };

  const handleComment = (post: FriendPost) => {
    const commentText = newComment[post.id]?.trim();
    if (!commentText) return;

    const newCommentObj: Comment = {
      id: generateId(),
      author: user.nickname,
      avatar: user.avatar,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const storePost = friendPosts.find(p => p.id === post.id);
    
    if (storePost) {
      addComment(post.id, newCommentObj);
    } else {
      const existingInAll = allPosts.find(p => p.id === post.id);
      if (existingInAll) {
        const updatedPost: FriendPost = {
          ...existingInAll,
          comments: [...existingInAll.comments, newCommentObj],
        };
        addFriendPost(updatedPost);
      }
    }

    setNewComment(prev => ({ ...prev, [post.id]: '' }));
    setShowComment(null);
  };

  const handleBookmark = (friendId: string) => {
    toggleBookmarkFriend(friendId);
  };

  const isBookmarked = (friendId: string) => bookmarkedFriends.includes(friendId);

  const getPostLikes = (post: FriendPost) => {
    const storePost = friendPosts.find(p => p.id === post.id);
    return storePost ? storePost.likes : post.likes;
  };

  const getPostComments = (post: FriendPost) => {
    const storePost = friendPosts.find(p => p.id === post.id);
    return storePost ? storePost.comments : post.comments;
  };

  const getPostIsLiked = (post: FriendPost) => {
    const storePost = friendPosts.find(p => p.id === post.id);
    return storePost ? storePost.isLiked : post.isLiked;
  };

  const uniquePlatforms = useMemo(() => {
    const platforms = new Set<string>();
    allPosts.forEach(post => {
      if (post.contentType === 'achievement') {
        const achievement = post.content as Achievement;
        const game = games.find(g => g.id === achievement.gameId);
        if (game) platforms.add(game.platform);
      }
    });
    return Array.from(platforms);
  }, [allPosts, games]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">好友浏览</h1>
            <p className="text-gray-400">发现好友的精彩成就和分享</p>
          </div>

          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`btn-cyber-outline flex items-center gap-2 ${
              showBookmarkedOnly ? 'border-neon-gold text-neon-gold bg-neon-gold/10' : ''
            }`}
          >
            <Bookmark className={`w-4 h-4 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
            <span>{showBookmarkedOnly ? '只看收藏' : '全部动态'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索好友或内容..."
              className="input-cyber pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="input-cyber text-sm min-w-[140px]"
            >
              <option value="all">全部平台</option>
              {uniquePlatforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'ps' ? 'PlayStation' : 
                   platform === 'xbox' ? 'Xbox' :
                   platform === 'switch' ? 'Switch' :
                   platform === 'pc' ? 'PC' : 'Mobile'}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-cyber text-sm min-w-[140px]"
            >
              <option value="latest">最新动态</option>
              <option value="mostLiked">最多点赞</option>
              <option value="mostCommented">最多评论</option>
            </select>
          </div>
        </div>

        {(searchQuery || platformFilter !== 'all' || showBookmarkedOnly) && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <span>筛选结果：{displayPosts.length} 条动态</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('all');
                setShowBookmarkedOnly(false);
              }}
              className="text-neon-cyan hover:underline ml-2"
            >
              清除筛选
            </button>
          </div>
        )}

        {bookmarkedFriends.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-neon-gold mt-2">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>已收藏 {bookmarkedFriends.length} 位好友</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {displayPosts.map((post, index) => {
          const isLiked = getPostIsLiked(post);
          const likes = getPostLikes(post);
          const comments = getPostComments(post);

          return (
            <div
              key={post.id}
              className="card-cyber animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <img src={post.friendAvatar} alt={post.friendName} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{post.friendName}</h3>
                    <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    分享了 {post.contentType === 'achievement' ? '成就' : '截图'}
                  </p>
                </div>
                <button
                  onClick={() => handleBookmark(post.friendId)}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked(post.friendId) ? 'text-neon-gold bg-neon-gold/10' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked(post.friendId) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {post.contentType === 'achievement' ? (
                <AchievementContent achievement={post.content as Achievement} games={games} />
              ) : (
                <MediaContent media={post.content as Media} />
              )}

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likes}</span>
                </button>

                <button
                  onClick={() => setShowComment(showComment === post.id ? null : post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    showComment === post.id ? 'text-neon-cyan' : 'text-gray-400 hover:text-neon-cyan'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{comments.length}</span>
                </button>
              </div>

              {showComment === post.id && (
                <div className="mt-4 space-y-3 animate-slide-up">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.avatar || 'https://via.placeholder.com/32'}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 bg-cyber-darker rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">{comment.author}</span>
                          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {user.nickname.charAt(0)}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post); }}
                        placeholder="写下你的评论..."
                        className="input-cyber flex-1 text-sm py-2"
                      />
                      <button onClick={() => handleComment(post)} className="btn-cyber px-4">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {displayPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{showBookmarkedOnly ? '🔖' : searchQuery ? '🔍' : '👥'}</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {showBookmarkedOnly ? '暂无收藏好友动态' : searchQuery ? '未找到匹配的动态' : '暂无好友动态'}
          </h3>
          <p className="text-gray-400">
            {showBookmarkedOnly ? '去关注更多玩家吧' : searchQuery ? '尝试其他关键词或筛选条件' : '关注更多玩家，发现精彩内容'}
          </p>
          {(showBookmarkedOnly || searchQuery) && (
            <button
              onClick={() => {
                setShowBookmarkedOnly(false);
                setSearchQuery('');
                setPlatformFilter('all');
              }}
              className="btn-cyber mt-4"
            >
              清除筛选
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AchievementContent({ achievement, games }: { achievement: Achievement; games: any[] }) {
  const game = games.find(g => g.id === achievement.gameId);

  return (
    <div className="bg-cyber-darker rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🏆</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white">{achievement.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${
              achievement.rarity === 'legendary' ? 'from-amber-500 to-orange-600' :
              achievement.rarity === 'epic' ? 'from-purple-600 to-violet-700' :
              achievement.rarity === 'rare' ? 'from-cyan-400 to-blue-500' :
              'from-gray-500 to-gray-600'
            } text-white`}>
              {achievement.rarity}
            </span>
          </div>
          {game && <p className="text-sm text-gray-400 mb-2">{game.name}</p>}
          {achievement.description && <p className="text-sm text-gray-300">{achievement.description}</p>}
          {achievement.notes && <p className="text-sm text-neon-purple mt-2 italic">"{achievement.notes}"</p>}
        </div>
      </div>
    </div>
  );
}

function MediaContent({ media }: { media: Media }) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {media.type === 'image' ? (
        <img src={media.url} alt="" className="w-full max-h-96 object-cover" />
      ) : (
        <div className="w-full aspect-video bg-cyber-darker flex items-center justify-center">
          <span className="text-4xl">🎬</span>
        </div>
      )}
    </div>
  );
}
