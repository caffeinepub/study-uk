import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAmbientSound } from '../../hooks/useAmbientSound';

export default function AmbientSoundPlayer() {
  const { sounds, selectedSound, isPlaying, volume, play, pause, togglePlay, setVolume } = useAmbientSound();

  return (
    <Card className="bg-transparent border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
          <Volume2 className="h-5 w-5" />
          Ambient Sounds
        </CardTitle>
        <CardDescription className="text-white/70 drop-shadow-lg">Focus with calming background sounds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {sounds.map((sound) => (
            <Button
              key={sound.id}
              variant={selectedSound === sound.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => play(sound.id)}
              className={
                selectedSound === sound.id
                  ? 'justify-start bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30'
                  : 'justify-start bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
              }
            >
              <span className="mr-2">{sound.icon}</span>
              {sound.name}
            </Button>
          ))}
        </div>

        {selectedSound && (
          <div className="space-y-3 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-3 flex-1 ml-4">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-white/70 drop-shadow-lg" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white/70 drop-shadow-lg" />
                )}
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-white/70 drop-shadow-lg w-8 text-right">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
