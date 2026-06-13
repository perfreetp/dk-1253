import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, Calendar } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { generateId, formatDate } from '@/utils/dateUtils';
import type { Media } from '@/types';

export default function MediaGallery() {
  const { media, addMedia, deleteMedia, achievements } = useAppStore();
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    relatedAchievementId: '',
    type: 'image' as 'image' | 'video',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newMedia: Media = {
          id: generateId(),
          type: uploadForm.type,
          url,
          createdAt: new Date().toISOString(),
          relatedAchievementId: uploadForm.relatedAchievementId || undefined,
        };
        addMedia(newMedia);
      };
      reader.readAsDataURL(file);
    });

    setShowUpload(false);
    setUploadForm({ relatedAchievementId: '', type: 'image' });
  };

  const getMediaWithAchievement = (mediaItem: Media) => {
    if (!mediaItem.relatedAchievementId) return null;
    return achievements.find((a) => a.id === mediaItem.relatedAchievementId);
  };

  const groupedMedia = media.reduce((acc, item) => {
    const date = new Date(item.createdAt).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, Media[]>);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="font-cyber text-3xl font-bold text-gradient mb-2">
              截图详情
            </h1>
            <p className="text-gray-400">
              共 {media.length} 个媒体文件
            </p>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="btn-cyber flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>上传媒体</span>
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="mb-6 card-cyber animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">上传媒体</h3>
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">媒体类型</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUploadForm((prev) => ({ ...prev, type: 'image' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    uploadForm.type === 'image'
                      ? 'bg-neon-cyan text-cyber-darker'
                      : 'bg-cyber-darker text-gray-300'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  图片
                </button>
                <button
                  onClick={() => setUploadForm((prev) => ({ ...prev, type: 'video' }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    uploadForm.type === 'video'
                      ? 'bg-neon-cyan text-cyber-darker'
                      : 'bg-cyber-darker text-gray-300'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  视频
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">关联成就（可选）</label>
              <select
                value={uploadForm.relatedAchievementId}
                onChange={(e) =>
                  setUploadForm((prev) => ({ ...prev, relatedAchievementId: e.target.value }))
                }
                className="input-cyber"
              >
                <option value="">不关联</option>
                {achievements.map((achievement) => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={uploadForm.type === 'image' ? 'image/*' : 'video/*'}
                multiple={uploadForm.type === 'image'}
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="block w-full border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-neon-cyan transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">
                  点击或拖拽上传{uploadForm.type === 'image' ? '图片' : '视频'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadForm.type === 'image'
                    ? '支持 JPG、PNG、GIF 格式'
                    : '支持 MP4、WebM 格式'}
                </p>
              </label>
            </div>
          </div>
        </div>
      )}

      {media.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedMedia).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(date)}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item, index) => {
                  const achievement = getMediaWithAchievement(item);
                  return (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => setSelectedMedia(item)}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt=""
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-cyber-darker rounded-lg flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      {achievement && (
                        <div className="absolute bottom-2 left-2 right-2 bg-cyber-darker/90 backdrop-blur-sm rounded px-2 py-1">
                          <p className="text-xs text-neon-cyan truncate">
                            {achievement.name}
                          </p>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('确定要删除这个媒体吗？')) {
                              deleteMedia(item.id);
                            }
                          }}
                          className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-white mb-2">还没有截图</h3>
          <p className="text-gray-400 mb-6">上传你的游戏截图和精彩瞬间</p>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-cyber inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            上传截图
          </button>
        </div>
      )}

      {selectedMedia && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setSelectedMedia(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {selectedMedia.type === 'image' ? (
              <img
                src={selectedMedia.url}
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-lg animate-scale-in"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                className="max-w-full max-h-[90vh] rounded-lg animate-scale-in"
              />
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-cyber-darker/90 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm text-gray-300">
                上传于 {formatDate(selectedMedia.createdAt)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
