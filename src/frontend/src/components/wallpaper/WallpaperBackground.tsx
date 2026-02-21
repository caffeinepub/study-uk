import { useWallpaper } from '../../hooks/useWallpaper';

export default function WallpaperBackground() {
  const { currentWallpaper } = useWallpaper();

  return (
    <div className="fixed inset-0 z-0">
      {currentWallpaper.type === 'video' ? (
        <video
          key={currentWallpaper.url}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        >
          <source src={currentWallpaper.url} type="video/mp4" />
          <source src={currentWallpaper.url} type="video/webm" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${currentWallpaper.url})`,
          }}
        />
      )}
    </div>
  );
}
