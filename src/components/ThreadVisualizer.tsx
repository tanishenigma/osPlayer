
import { useEffect, useState } from 'react';
import { TrackProcess, Thread } from '../types';
import { Music } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ThreadVisualizerProps {
  track: TrackProcess;
  isPlaying: boolean;
}

const ThreadVisualizer = ({ track, isPlaying }: ThreadVisualizerProps) => {
  // Local state for animated thread progress
  const [threadStates, setThreadStates] = useState<Thread[]>(track.threads);
  
  // Update thread progress when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setThreadStates(prevThreads => 
        prevThreads.map(thread => {
          if (!thread.active) return thread;
          
          // Update progress based on thread type
          let progressIncrement = 0;
          
          switch (thread.type) {
            case 'decode':
              progressIncrement = 2; // Faster progress
              break;
            case 'buffer':
              progressIncrement = 1; // Medium progress
              break;
            case 'play':
              progressIncrement = 0.5; // Slower progress
              break;
          }
          
          const newProgress = thread.progress + progressIncrement;
          
          // Loop back to beginning when complete
          return {
            ...thread,
            progress: newProgress > 100 ? 0 : newProgress
          };
        })
      );
    }, 200);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  // Update local thread states when track changes
  useEffect(() => {
    setThreadStates(track.threads);
  }, [track]);

  return (
    <div className="neumorphic p-4">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
          {track.coverUrl ? (
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Music size={24} />
            </div>
          )}
        </div>
        
        <div className="ml-3">
          <h3 className="font-bold">{track.title}</h3>
          <p className="text-sm text-muted-foreground">{track.artist}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`
              inline-block w-2 h-2 rounded-full 
              ${isPlaying ? 'bg-os-state-running animate-pulse-glow' : 'bg-os-state-idle'}
            `}></span>
            <span className="text-xs">
              {track.state.toUpperCase()} | PID: {track.id.slice(0, 4)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        <h3 className="text-sm font-semibold">Active Threads</h3>
        
        {/* Simplified Thread visualization */}
        <div className="space-y-3">
          {threadStates.map(thread => (
            <div key={thread.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">
                  {thread.type.charAt(0).toUpperCase() + thread.type.slice(1)} Thread
                </span>
                <span 
                  className={`text-xs ${thread.active ? 'text-green-400' : 'text-muted-foreground'}`}
                >
                  {thread.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              
              <Progress 
                value={thread.progress} 
                className={`h-2 ${thread.type === 'decode' ? 'bg-os-blue/30' : thread.type === 'buffer' ? 'bg-os-purple/30' : 'bg-green-400/30'}`}
              />
            </div>
          ))}
        </div>
        
        {/* Active thread count */}
        <div className="glass p-3 rounded-lg text-center">
          <div className="text-xs">
            {threadStates.filter(t => t.active).length} Active Threads
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadVisualizer;
