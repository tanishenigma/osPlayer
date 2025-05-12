// Define process state types
export type ProcessState = "new" | "ready" | "running" | "waiting" | "end";

// Define thread types
export type ThreadType = "decode" | "buffer" | "play";

// Thread interface
export interface Thread {
  id: string;
  type: ThreadType;
  progress: number;
  active: boolean;
}

// Music track as process
export interface TrackProcess {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  state: ProcessState;
  threads: Thread[];
  progress: number;
}
