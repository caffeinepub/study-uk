import TimerSection from '../components/timers/TimerSection';
import AmbientSoundPlayer from '../components/sound/AmbientSoundPlayer';
import SpotifyPlayer from '../components/spotify/SpotifyPlayer';
import MotivationalQuote from '../components/quotes/MotivationalQuote';

export default function TimerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <MotivationalQuote />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TimerSection />
          </div>
          <div className="space-y-6">
            <AmbientSoundPlayer />
            <SpotifyPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}
