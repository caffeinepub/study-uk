import { useWallpaper } from '../../hooks/useWallpaper';
import { ScrollArea } from '@/components/ui/scroll-area';
import WallpaperUploader from './WallpaperUploader';

export default function WallpaperSelector() {
  const { wallpapers, selectedWallpaper, setSelectedWallpaper } = useWallpaper();

  const categories = [
    { name: 'Anime Study', wallpapers: wallpapers.filter((w) => w.category === 'anime') },
    { name: 'Cozy Spaces', wallpapers: wallpapers.filter((w) => w.category === 'cozy') },
    { name: 'Nature', wallpapers: wallpapers.filter((w) => w.category === 'nature') },
    { name: 'Abstract', wallpapers: wallpapers.filter((w) => w.category === 'abstract') },
    { name: 'Custom', wallpapers: wallpapers.filter((w) => w.category === 'custom') },
  ];

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-6">
        {categories.map((category) => {
          if (category.wallpapers.length === 0) return null;

          return (
            <div key={category.name}>
              <h3 className="text-sm font-medium mb-3 text-white drop-shadow-lg">{category.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {category.wallpapers.map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => setSelectedWallpaper(wallpaper.id)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      selectedWallpaper === wallpaper.id
                        ? 'ring-2 ring-white shadow-lg'
                        : 'ring-1 ring-white/20'
                    }`}
                  >
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedWallpaper === wallpaper.id && (
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-white font-medium drop-shadow-lg">✓ Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="pt-6 border-t border-white/20">
          <h3 className="text-sm font-medium mb-3 text-white drop-shadow-lg">Upload Custom Wallpaper</h3>
          <WallpaperUploader />
        </div>
      </div>
    </ScrollArea>
  );
}
