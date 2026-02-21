import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    previous,
  } = useSpotify();

  if (!isConnected) {
    return (
      <Card className="bg-transparent border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Music className="h-5 w-5" />
            Spotify
          </CardTitle>
          <CardDescription className="text-white/70 drop-shadow-lg">Connect your Spotify account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={login} 
            className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            Connect Spotify
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-white/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
            <Music className="h-5 w-5" />
            Spotify
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTrack ? (
          <>
            <div className="flex gap-3">
              {currentTrack.album.images[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-16 h-16 rounded-lg shadow-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-white drop-shadow-lg">{currentTrack.name}</p>
                <p className="text-sm text-white/70 truncate drop-shadow-lg">
                  {currentTrack.artists.map((a) => a.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={previous}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={isPlaying ? pause : play}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={next}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/70 text-center drop-shadow-lg">No track playing</p>
        )}
      </CardContent>
    </Card>
  );
}
