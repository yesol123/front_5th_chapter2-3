import { create } from "zustand"

interface FilterState {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  selectedTag: string
  tags: string[]
  setSkip: (value: number) => void
  setLimit: (value: number) => void
  setSearchQuery: (value: string) => void
  setSortBy: (value: string) => void
  setSortOrder: (value: string) => void
  setSelectedTag: (value: string) => void
  setTags: (value: string[]) => void
}

export const useFilterStore = create<FilterState>()((set) => ({
  skip: 0,
  limit: 10,
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  selectedTag: "",
  tags: [],
  setSkip: (value) => set({ skip: value }),
  setLimit: (value) => set({ limit: value }),
  setSearchQuery: (value) => set({ searchQuery: value }),
  setSortBy: (value) => set({ sortBy: value }),
  setSortOrder: (value) => set({ sortOrder: value }),
  setSelectedTag: (value) => set({ selectedTag: value }),
  setTags: (value) => set({ tags: value }),
}))