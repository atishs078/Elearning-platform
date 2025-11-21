import { create } from "zustand";

const useData = create((set) => ({
  host: "http://10.100.15.61:8080",
  setHost: (newHost) => set({ host: newHost })
}));

export default useData;
