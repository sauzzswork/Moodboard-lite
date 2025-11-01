import { create } from 'zustand';

const useMoodboardStore = create((set) => ({
  todayMoodBoard: null,
  allMoodBoards: [],
  loading: true,
  error: '',

  setTodayMoodBoard: (mb) => set({ todayMoodBoard: mb }),
  setAllMoodBoards: (mbs) => set({ allMoodBoards: mbs }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (msg) => set({ error: msg }),
  deleteMoodBoard: (id) =>
    set((state) => ({
      allMoodBoards: state.allMoodBoards.filter((mb) => mb._id !== id),
      todayMoodBoard: state.todayMoodBoard?._id === id ? null : state.todayMoodBoard,
    })),
}));

export default useMoodboardStore;
