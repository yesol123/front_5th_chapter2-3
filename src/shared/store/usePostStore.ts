import { create } from "zustand"
import { Post } from "@/entities/post/types"

interface PostStore {
  posts: Post[]
  total: number
  loading: boolean
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  total: 0,
  loading: false,
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
}))