import { create } from 'zustand';

export interface InterviewLog {
  id: string;
  title: string;
  date: string;
  score: number;
  durationMin?: number;
}

interface InterviewState {
  streak: number;
  recentLogs: InterviewLog[];
  setStreak: (streak: number) => void;
  addLog: (log: InterviewLog) => void;
}

// Development dummy data
const DUMMY_DATA = __DEV__
  ? {
      streak: 12,
      recentLogs: [
        {
          id: '1',
          title: 'Frontend Developer Interview',
          date: '2023-10-25',
          score: 85,
          durationMin: 35,
        },
        {
          id: '2',
          title: 'System Design Interview',
          date: '2023-10-24',
          score: 72,
          durationMin: 50,
        },
        {
          id: '3',
          title: 'Behavioral Interview',
          date: '2023-10-22',
          score: 90,
          durationMin: 25,
        },
      ],
    }
  : {
      streak: 0,
      recentLogs: [],
    };

export const useInterviewStore = create<InterviewState>(set => ({
  streak: DUMMY_DATA.streak,
  recentLogs: DUMMY_DATA.recentLogs,
  setStreak: streak => set({ streak }),
  addLog: log => set(state => ({ recentLogs: [log, ...state.recentLogs] })),
}));
