import { useState, useMemo } from 'react';
import { Heart, MessageCircle, Bookmark, Send, Filter } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatTimeAgo, generateId } from '@/utils/dateUtils';
import { mockFriendPosts } from '@/data/mockData';
import type { Comment, Achievement, Media } from '@/types';

export default function FriendBrowse() {
  const {
    friendPosts,
    likeFriendPost,
    addComment,
    bookmarkedFriends,
    toggleBookmarkFriend,
    user,
  } = useAppStore();

  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showComment, setShowComment] = useState<string | null>(null);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const displayPosts = useMemo(() => {
    let posts = friendPosts.length > 0 ? friendPosts : mockFriendPosts;
    
    if (showBookmarkedOnly) {
      posts = posts.filter((post) => bookmarkedFriends.includes(post.friendId));
    }
    
    return posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [friendPosts, showBookmarkedOnly, bookmarkedFriends]);

  const handleLike = (postId: string) => {
    if (friendPosts.some((p) => p.id === postId)) {
      likeFriendPost(postId);
    } else {
      console.log('Liked (mock):', postId);
    }
  };

  const handleComment = (postId: string) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    const newCommentObj: Comment = {
      id: generateId(),
      author: user.nickname,
      avatar: user.avatar,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    if (friendPosts.some((p) => p.id === postId)) {
      addComment(postId, newCommentObj);
    } else {
      console.log('Comment (mock):', postId, commentText);
    }

    setNewComment((prev) => ({ ...prev, [postId]: '' }));
    setShowComment(null);
  };

  const handleBookmark = (friendId: string) => {
    toggleBookmarkFriend(friendId);
  };

  const isBookmarked = (friendId: string) => bookmarkedFriends.includes(friendId);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">
              好友浏览
            </h1>
            <p className="text-gray-400">
              发现好友的精彩成就和分享
            </p>
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

        {bookmarkedFriends.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            <span>已收藏 {bookmarkedFriends.length} 位好友</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {displayPosts.map((post, index) => {
          const isLiked = friendPosts.find((p) => p.id === post.id)?.isLiked ?? post.isLiked;
          const likes = friendPosts.find((p) => p.id === post.id)?.likes ?? post.likes;
          const comments = friendPosts.find((p) => p.id === post.id)?.comments ?? post.comments;

          return (
            <div
              key={post.id}
              className="card-cyber animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={post.friendAvatar}
                  alt={post.friendName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white">{post.friendName}</h3>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    分享了 {post.contentType === 'achievement' ? '成就' : '截图'}
                  </p>
                </div>
                <button
                  onClick={() => handleBookmark(post.friendId)}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked(post.friendId)
                      ? 'text-neon-gold bg-neon-gold/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked(post.friendId) ? 'fill-current' : ''}`}
                  />
                </button>
              </div>

              {post.contentType === 'achievement' ? (
                <AchievementContent achievement={post.content as Achievement} />
              ) : (
                <MediaContent media={post.content as Media} />
              )}

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                  />
                  <span className="text-sm">{likes}</span>
                </button>

                <button
                  onClick={() => setShowComment(showComment === post.id ? null : post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    showComment === post.id
                      ? 'text-neon-cyan'
                      : 'text-gray-400 hover:text-neon-cyan'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{comments.length}</span>
                </button>
              </div>

              {showComment === post.id && (
                <div className="mt-4 space-y-3 animate-slide-up">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 bg-cyber-darker rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-white">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
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
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id);
                          }
                        }}
                        placeholder="写下你的评论..."
                        className="input-cyber flex-1 text-sm py-2"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="btn-cyber px-4"
                      >
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
          <div className="text-6xl mb-4">
            {showBookmarkedOnly ? '�' : '�👥'}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {showBookmarkedOnly ? '暂无收藏好友动态' : '暂无好友动态'}
          </h3>
          <p className="text-gray-400">
            {showBookmarkedOnly ? '去关注更多玩家吧' : '关注更多玩家，发现精彩内容'}
          </p>
          {showBookmarkedOnly && (
            <button
              onClick={() => setShowBookmarkedOnly(false)}
              className="btn-cyber mt-4"
            >
              查看全部动态
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AchievementContent({ achievement }: { achievement: Achievement }) {
  const { getGameById } = useAppStore();
  const game = getGameById(achievement.gameId);

  return (
    <div className="bg-cyber-darker rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🏆</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white">{achievement.name}</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${
                achievement.rarity === 'legendary'
                  ? 'from-amber-500 to-orange-600'
                  : achievement.rarity === 'epic'
                  ? 'from-purple-600 to-violet-700'
                  : achievement.rarity === 'rare'
                  ? 'from-cyan-400 to-blue-500'
                  : 'from-gray-500 to-gray-600'
              } text-white`}
            >
              {achievement.rarity}
            </span>
          </div>
          {game && <p className="text-sm text-gray-400 mb-2">{game.name}</p>}
          {achievement.description && (
            <p className="text-sm text-gray-300">{achievement.description}</p>
          )}
          {achievement.notes && (
            <p className="text-sm text-neon-purple mt-2 italic">
              "{achievement.notes}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaContent({ media }: { media: Media }) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt=""
          className="w-full max-h-96 object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-cyber-darker flex items-center justify-center">
          <span className="text-4xl">🎬</span>
        </div>
      )}
    </div>
  );
}
