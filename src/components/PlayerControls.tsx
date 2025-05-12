import { Play, Pause, SkipForward, Volume2, X } from "lucide-react";
import { TrackProcess } from "../types";
import { formatTime } from "../utils/formatTime";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  currentTrack: TrackProcess | undefined;
  onProgressChange?: (progress: number) => void;
  onTerminate?: () => void;
  onInterrupt?: () => void;
}

const PlayerControls = ({
  isPlaying,
  onPlayPause,
  onNext,
  currentTrack,
  onProgressChange,
  onTerminate,
  onInterrupt,
}: PlayerControlsProps) => {
  // Local progress state for smooth updating
  const [progress, setProgress] = useState(currentTrack?.progress || 0);

  // Update local progress when track changes
  useEffect(() => {
    if (currentTrack) {
      setProgress(currentTrack.progress);
    }
  }, [currentTrack?.id]);

  // Progress timer for playing tracks
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (currentTrack.duration * 10);
        if (newProgress >= 100) {
          clearInterval(timer);
          onNext();
          return 0;
        }
        // Update the parent component with progress
        if (onProgressChange) {
          onProgressChange(newProgress);
        }
        return newProgress;
      });
    }, 100); // Update every 100ms for smoother animation

    return () => clearInterval(timer);
  }, [isPlaying, currentTrack, onProgressChange, onNext]);

  // Calculate current time based on track progress
  const getCurrentTime = () => {
    if (!currentTrack) return "0:00";
    const currentTime = (progress / 100) * currentTrack.duration;
    return formatTime(currentTime);
  };

  // Handle manual seeking
  const handleSeek = (value: number[]) => {
    setProgress(value[0]);
    if (onProgressChange) {
      onProgressChange(value[0]);
    }
  };

  // Get state display text
  const getStateDisplay = () => {
    if (!currentTrack) return "";

    switch (currentTrack.state) {
      case "new":
        return "Process Created";
      case "ready":
        return "Process Ready";
      case "running":
        return "Process Executing";
      case "waiting":
        return "Process Waiting";
      case "end":
        return "Process Terminated";
      default:
        return "Unknown State";
    }
  };

  // Get state color class
  const getStateColorClass = () => {
    if (!currentTrack) return "";

    switch (currentTrack.state) {
      case "new":
        return "text-blue-400";
      case "ready":
        return "text-amber-400";
      case "running":
        return "text-green-500";
      case "waiting":
        return "text-orange-400";
      case "end":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="neumorphic p-4">
      {/* Progress bar */}
      <div className="mb-4">
        {currentTrack && (
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSeek}
            className="my-2"
            disabled={currentTrack.state === "end"}
          />
        )}

        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{getCurrentTime()}</span>
          <span>
            {currentTrack ? formatTime(currentTrack.duration) : "0:00"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          className="neumorphic p-3 rounded-full hover:bg-card/60 transition-colors"
          onClick={onNext}>
          <SkipForward size={18} />
        </button>

        <button
          className="neumorphic p-4 rounded-full hover:bg-card/60 transition-colors"
          onClick={onPlayPause}
          disabled={currentTrack?.state === "end"}>
          {isPlaying ? (
            <Pause size={24} className="text-primary" />
          ) : (
            <Play size={24} className="text-primary" />
          )}
        </button>

        <button className="neumorphic p-3 rounded-full hover:bg-card/60 transition-colors">
          <Volume2 size={18} />
        </button>

        {onTerminate && (
          <button
            className="neumorphic p-3 rounded-full hover:bg-card/60 transition-colors bg-destructive/20"
            onClick={onTerminate}>
            <X size={18} className="text-destructive" />
          </button>
        )}

        {onInterrupt && (
          <button
            onClick={onInterrupt}
            disabled={!onInterrupt}
            className="btn btn-warning neumorphic p-3 rounded-full hover:bg-card/60 transition-colors bg-destructive/20">
            Interrupt
          </button>
        )}
      </div>

      {/* Process execution info */}
      <div className="mt-4 glass p-2 rounded-lg">
        <div className="text-xs text-center">
          <span className={getStateColorClass()}>{getStateDisplay()}</span>
          {currentTrack?.state === "running" && (
            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
