import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, SkipBack, LogOut } from 'lucide-react';
import { useSpotify } from '../../hooks/useSpotify';

export default function SpotifyPlayer() {
  const { 
    isConnected, 
    currentTrack, 
    isPlaying, 
    login, 
    logout, 
    play,
    pause,
    next, 
    previous 
  } = useSpotify();

  const handleTogglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Music className="h-5 w-5" />
            Spotify Player
          </h3>
          <p className="text-sm text-white/70">
            Connect your Spotify account
          </p>
        </div>
        <div className="text-center space-y-4">
          <Music className="h-12 w-12 mx-auto text-white/70" />
          <div>
            <p className="text-sm text-white/70 mb-4">
              Listen to your favorite music while studying
            </p>
            <Button 
              onClick={login}
              className="text-white hover:text-white/80"
            >
              Connect Spotify
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Music className="h-5 w-5" />
            Spotify Player
          </h3>
          <p className="text-sm text-white/70">
            Now playing
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-white hover:text-white/80"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {currentTrack ? (
          <>
            <div className="flex items-center gap-4">
              {currentTrack.album?.images?.[0]?.url && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-16 h-16 rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-white">{currentTrack.name}</p>
                <p className="text-sm text-white/70 truncate">{currentTrack.artists?.[0]?.name}</p>
                <p className="text-xs text-white/50 truncate">{currentTrack.album?.name}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={previous}
                className="text-white hover:text-white/80"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handleTogglePlayback}
                className="text-white hover:text-white/80"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="text-white hover:text-white/80"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-white/70">No track playing</p>
        )}
      </div>
    </div>
  );
}
