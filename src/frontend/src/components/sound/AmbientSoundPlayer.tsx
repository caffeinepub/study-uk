import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import { useAmbientSound } from '../../hooks/useAmbientSound';

export default function AmbientSoundPlayer() {
  const { 
    sounds, 
    selectedSound, 
    isPlaying, 
    volume, 
    isLoading, 
    error, 
    needsInteraction,
    play, 
    pause, 
    togglePlay, 
    setVolume 
  } = useAmbientSound();

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white drop-shadow-md">
          <Volume2 className="h-5 w-5" />
          Ambient Sounds
        </h3>
        <p className="text-sm text-white/80 drop-shadow-sm">
          Create your perfect study atmosphere
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {sounds.map((sound) => (
            <Button
              key={sound.id}
              variant={selectedSound === sound.id ? 'default' : 'outline'}
              onClick={() => play(sound.id)}
              className="text-white hover:text-white/80"
              disabled={isLoading && selectedSound === sound.id}
            >
              {isLoading && selectedSound === sound.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {sound.icon} {sound.name}
                </>
              ) : (
                <>
                  {sound.icon} {sound.name}
                </>
              )}
            </Button>
          ))}
        </div>

        {selectedSound && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:text-white/80"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-white" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="w-32"
                />
                <Volume2 className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Status messages */}
            {needsInteraction && (
              <div className="flex items-start gap-2 rounded-md bg-white/10 p-3 text-sm text-white drop-shadow-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Click play to start audio (browser requires user interaction)</p>
              </div>
            )}

            {error && !needsInteraction && (
              <div className="flex items-start gap-2 rounded-md bg-white/10 p-3 text-sm text-white drop-shadow-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {isPlaying && !isLoading && !error && (
              <div className="flex items-center gap-2 text-sm text-white drop-shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <p>Now playing</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
