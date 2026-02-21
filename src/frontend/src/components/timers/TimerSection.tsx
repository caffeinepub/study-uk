import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Focus, Plus } from 'lucide-react';
import StopwatchTimer from './StopwatchTimer';
import PomodoroTimer from './PomodoroTimer';
import AnimedoroTimer from './AnimedoroTimer';
import CustomPresetTimer from './CustomPresetTimer';
import PresetManager from '../presets/PresetManager';
import { useFocusMode } from '../../hooks/useFocusMode';
import { useGetAllPresets } from '../../hooks/useQueries';
import { useState } from 'react';

export default function TimerSection() {
  const { toggleFocusMode } = useFocusMode();
  const { data: presets = [] } = useGetAllPresets();
  const [showPresetManager, setShowPresetManager] = useState(false);

  return (
    <div className="bg-transparent border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white drop-shadow-lg">Study Timers</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPresetManager(true)}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Custom Timer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFocusMode}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <Focus className="mr-2 h-4 w-4" />
            Focus Mode
          </Button>
        </div>
      </div>

      <Tabs defaultValue="stopwatch" className="w-full">
        <TabsList className={`grid w-full mb-8 bg-white/10 backdrop-blur-sm border border-white/20 ${presets.length > 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="stopwatch" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Stopwatch</TabsTrigger>
          <TabsTrigger value="pomodoro" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Pomodoro</TabsTrigger>
          <TabsTrigger value="animedoro" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Animedoro</TabsTrigger>
          {presets.length > 0 && (
            <TabsTrigger value="custom" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70">Custom</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="stopwatch">
          <StopwatchTimer />
        </TabsContent>
        
        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>
        
        <TabsContent value="animedoro">
          <AnimedoroTimer />
        </TabsContent>

        {presets.length > 0 && (
          <TabsContent value="custom">
            <CustomPresetTimer />
          </TabsContent>
        )}
      </Tabs>

      {showPresetManager && (
        <PresetManager onClose={() => setShowPresetManager(false)} />
      )}
    </div>
  );
}
