import { useWallpaper } from '../../hooks/useWallpaper';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play } from 'lucide-react';
import WallpaperUploader from './WallpaperUploader';

export default function WallpaperSelector() {
  const { wallpapers, selectedWallpaper, setSelectedWallpaper } = useWallpaper();

  const categories = [
    { name: 'Study Spaces', wallpapers: wallpapers.filter((w) => w.category === 'study') },
    { name: 'Anime', wallpapers: wallpapers.filter((w) => w.category === 'anime') },
    { name: 'Studio Ghibli', wallpapers: wallpapers.filter((w) => w.category === 'ghibli') },
    { name: 'Nature', wallpapers: wallpapers.filter((w) => w.category === 'nature') },
    { name: 'Custom', wallpapers: wallpapers.filter((w) => w.category === 'custom') },
  ];

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {categories.map((category) => {
          if (category.wallpapers.length === 0) return null;

          return (
            <div key={category.name}>
              <h3 className="text-sm font-medium mb-3 text-white">{category.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {category.wallpapers.map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => setSelectedWallpaper(wallpaper.id)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      selectedWallpaper === wallpaper.id
                        ? 'ring-2 ring-white'
                        : 'ring-1 ring-white/20'
                    }`}
                  >
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover"
                    />
                    {wallpaper.type === 'video' && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {selectedWallpaper === wallpaper.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="text-white font-medium">✓ Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-6">
          <h3 className="text-sm font-medium mb-3 text-white">Upload Custom Wallpaper</h3>
          <WallpaperUploader />
        </div>
      </div>
    </ScrollArea>
  );
}
