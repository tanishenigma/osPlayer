
import { useState, useEffect } from 'react';
import { TrackProcess } from '../types';
import { Play, Pause, Loader, CircleDot, Music, StopCircle, Plus } from 'lucide-react';

interface ProcessStateVisualizerProps {
  tracks: TrackProcess[];
  onTrackSelect: (trackId: string) => void;
  currentTrackId: string | null;
}

const ProcessStateVisualizer = ({ 
  tracks, 
  onTrackSelect,
  currentTrackId
}: ProcessStateVisualizerProps) => {
  
  // Group tracks by process state
  const tracksByState = {
    new: tracks.filter(track => track.state === 'new'),
    ready: tracks.filter(track => track.state === 'ready'),
    running: tracks.filter(track => track.state === 'running'),
    waiting: tracks.filter(track => track.state === 'waiting'),
    end: tracks.filter(track => track.state === 'end')
  };
  
  // Animation when a track changes state
  const [animatedTrackId, setAnimatedTrackId] = useState<string | null>(null);
  
  useEffect(() => {
    // When track state changes, trigger animation
    if (currentTrackId) {
      setAnimatedTrackId(currentTrackId);
      
      // Remove animation class after animation completes
      const timeout = setTimeout(() => {
        setAnimatedTrackId(null);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [currentTrackId, tracks]);

  // Get icon for process state
  const getStateIcon = (state: string) => {
    switch (state) {
      case 'new':
        return <Plus size={16} className="text-blue-400" />;
      case 'ready':
        return <Loader size={16} className="text-amber-400 animate-spin" />;
      case 'running':
        return <Play size={16} className="text-green-500" />;
      case 'waiting':
        return <Pause size={16} className="text-orange-400" />;
      case 'end':
        return <StopCircle size={16} className="text-red-500" />;
      default:
        return <CircleDot size={16} className="text-muted-foreground" />;
    }
  };

  // Render tracks grouped by process state
  const renderTracksByState = (state: 'new' | 'ready' | 'running' | 'waiting' | 'end') => {
    return tracksByState[state].map(track => (
      <div 
        key={track.id}
        onClick={() => onTrackSelect(track.id)}
        className={`
          process-item state-${state} 
          ${track.id === currentTrackId ? 'ring-1 ring-primary' : ''}
          ${track.id === animatedTrackId ? 'animate-slide-up' : ''}
          cursor-pointer hover:bg-card/60 transition-all
        `}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded bg-muted mr-3 overflow-hidden">
            {track.coverUrl ? (
              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <Music size={16} />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">{track.title}</p>
              {getStateIcon(track.state)}
            </div>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            
            <div className="track-progress mt-2">
              <div 
                className="track-progress-inner" 
                style={{ width: `${track.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* New processes */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <Plus size={14} className="mr-1 text-blue-400" /> 
          NEW
        </h3>
        <div className="space-y-2">
          {tracksByState.new.length > 0 ? (
            renderTracksByState('new')
          ) : (
            <p className="text-xs text-muted-foreground p-2">No new processes</p>
          )}
        </div>
      </div>
      
      {/* Ready processes */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <Loader size={14} className="mr-1 text-amber-400" /> 
          READY
        </h3>
        <div className="space-y-2">
          {tracksByState.ready.length > 0 ? (
            renderTracksByState('ready')
          ) : (
            <p className="text-xs text-muted-foreground p-2">No ready processes</p>
          )}
        </div>
      </div>
      
      {/* Running processes */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <Play size={14} className="mr-1 text-green-500" /> 
          RUNNING
        </h3>
        <div className="space-y-2">
          {tracksByState.running.length > 0 ? (
            renderTracksByState('running')
          ) : (
            <p className="text-xs text-muted-foreground p-2">No running processes</p>
          )}
        </div>
      </div>
      
      {/* Waiting processes */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <Pause size={14} className="mr-1 text-orange-400" /> 
          WAITING
        </h3>
        <div className="space-y-2">
          {tracksByState.waiting.length > 0 ? (
            renderTracksByState('waiting')
          ) : (
            <p className="text-xs text-muted-foreground p-2">No waiting processes</p>
          )}
        </div>
      </div>
      
      {/* End processes */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <StopCircle size={14} className="mr-1 text-red-500" /> 
          END
        </h3>
        <div className="space-y-2">
          {tracksByState.end.length > 0 ? (
            renderTracksByState('end')
          ) : (
            <p className="text-xs text-muted-foreground p-2">No ended processes</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessStateVisualizer;
