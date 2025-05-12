import { useState } from "react";
import Header from "./Header";
import ProcessStateVisualizer from "./ProcessStateVisualizer";
import ThreadVisualizer from "./ThreadVisualizer";
import PlayerControls from "./PlayerControls";
import { TrackProcess, ProcessState } from "../types";
import { initialTracks } from "../data/tracks";

const MusicPlayerLayout = () => {
  const [tracks, setTracks] = useState<TrackProcess[]>(initialTracks);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Current track being processed (if any)
  const currentTrack = tracks.find((track) => track.id === currentTrackId);

  // Handle track selection
  const handleTrackSelect = (trackId: string) => {
    const updatedTracks = tracks.map((track) => {
      if (track.id === trackId) {
        const newState: ProcessState =
          track.state === "new" ? "ready" : track.state;
        return { ...track, state: newState };
      }
      return track;
    });

    setTracks(updatedTracks);
    setCurrentTrackId(trackId);
  };

  // Play/pause handler
  const handlePlayPause = () => {
    if (!currentTrackId) return;

    setIsPlaying(!isPlaying);

    setTracks(
      tracks.map((track) => {
        if (track.id === currentTrackId) {
          if (!isPlaying) {
            return {
              ...track,
              state: "running" as ProcessState,
              threads: track.threads.map((thread) => ({
                ...thread,
                active: true,
              })),
            };
          } else {
            return {
              ...track,
              state: "waiting" as ProcessState,
              threads: track.threads.map((thread) => ({
                ...thread,
                active: false,
              })),
            };
          }
        }
        return track;
      })
    );
  };

  // Update progress handler
  const handleProgressChange = (progress: number) => {
    if (!currentTrackId) return;

    setTracks(
      tracks.map((track) => {
        if (track.id === currentTrackId) {
          return { ...track, progress };
        }
        return track;
      })
    );

    if (progress >= 100) {
      setTracks(
        tracks.map((track) => {
          if (track.id === currentTrackId) {
            return {
              ...track,
              progress: 100,
              state: "end" as ProcessState,
              threads: track.threads.map((thread) => ({
                ...thread,
                active: false,
              })),
            };
          }
          return track;
        })
      );
      setIsPlaying(false);
    }
  };

  // Terminate current process
  const handleTerminate = () => {
    if (!currentTrackId) return;

    const updatedTracks = tracks.map((track) =>
      track.id === currentTrackId
        ? {
            ...track,
            state: "end" as ProcessState,
            progress: 100,
            threads: track.threads.map((thread) => ({
              ...thread,
              active: false,
              progress: 0,
            })),
          }
        : track
    );

    setTracks(updatedTracks);
    setIsPlaying(false);
  };

  // Interrupt current process and reset to "ready" state
  const handleInterrupt = () => {
    if (!currentTrackId) return;

    const updatedTracks = tracks.map((track) =>
      track.id === currentTrackId
        ? {
            ...track,
            state: "ready" as ProcessState,
            progress: 0,
            threads: track.threads.map((thread) => ({
              ...thread,
              active: false,
              progress: 0,
            })),
          }
        : track
    );

    setTracks(updatedTracks);
    setIsPlaying(false);
  };

  // Skip to next track (simulating scheduler)
  const handleNextTrack = () => {
    if (!currentTrackId) {
      if (tracks.length > 0) {
        handleTrackSelect(tracks[0].id);
      }
      return;
    }

    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % tracks.length;

    handleTrackSelect(tracks[nextIndex].id);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="os-panel col-span-1">
          <h2 className="text-xl font-bold mb-4">Process States</h2>
          <ProcessStateVisualizer
            tracks={tracks}
            onTrackSelect={handleTrackSelect}
            currentTrackId={currentTrackId}
          />
        </div>

        <div className="os-panel col-span-1">
          <h2 className="text-xl font-bold mb-4">Thread Visualization</h2>
          {currentTrack ? (
            <ThreadVisualizer track={currentTrack} isPlaying={isPlaying} />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Select a track to visualize threads
            </div>
          )}

          <div className="mt-6">
            <PlayerControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNextTrack}
              currentTrack={currentTrack}
              onProgressChange={handleProgressChange}
              onTerminate={currentTrack ? handleTerminate : undefined}
              onInterrupt={currentTrack ? handleInterrupt : undefined} // Added interrupt handler
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerLayout;
