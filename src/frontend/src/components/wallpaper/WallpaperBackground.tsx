import { useWallpaper } from '../../hooks/useWallpaper';

export default function WallpaperBackground() {
  const { currentWallpaper } = useWallpaper();

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${currentWallpaper.url})`,
        }}
      />
    </div>
  );
}
