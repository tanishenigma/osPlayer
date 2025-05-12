
import { TrackProcess } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateThreads = (active = false) => [
  {
    id: uuidv4(),
    type: 'decode' as const,
    progress: Math.floor(Math.random() * 100),
    active,
  },
  {
    id: uuidv4(),
    type: 'buffer' as const,
    progress: Math.floor(Math.random() * 100),
    active,
  },
  {
    id: uuidv4(),
    type: 'play' as const,
    progress: Math.floor(Math.random() * 100),
    active,
  },
];

export const initialTracks: TrackProcess[] = [
  {
    id: uuidv4(),
    title: "Digital Dreams",
    artist: "SynthWave",
    duration: 237,
    coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=150&auto=format&fit=crop",
    state: 'new',
    threads: generateThreads(),
    progress: 0,
  },
  {
    id: uuidv4(),
    title: "Neural Network",
    artist: "Quantum Bits",
    duration: 184,
    coverUrl: "https://images.unsplash.com/photo-1596554517938-4a9498cf4c14?q=80&w=150&auto=format&fit=crop",
    state: 'ready',
    threads: generateThreads(),
    progress: 0,
  },
  {
    id: uuidv4(),
    title: "Memory Allocation",
    artist: "Stack Overflow",
    duration: 312,
    coverUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=150&auto=format&fit=crop",
    state: 'waiting',
    threads: generateThreads(),
    progress: 75,
  },
  {
    id: uuidv4(),
    title: "Idle Process",
    artist: "System.Sleep",
    duration: 205,
    coverUrl: "https://images.unsplash.com/photo-1558304970-abd589baebe5?q=80&w=150&auto=format&fit=crop",
    state: 'end',
    threads: generateThreads(),
    progress: 100,
  },
];
