import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAmbientSound } from '../../hooks/useAmbientSound';

export default function AmbientSoundPlayer() {
  const { sounds, selectedSound, isPlaying, volume, play, pause, togglePlay, setVolume } = useAmbientSound();

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
            >
              {sound.icon} {sound.name}
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
              >
                {isPlaying ? (
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
          </div>
        )}
      </div>
    </div>
  );
}
