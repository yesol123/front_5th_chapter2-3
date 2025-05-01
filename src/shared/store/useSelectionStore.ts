import { create } from "zustand"
import { Post } from "@/entities/post/types"
import { Comment } from "@/entities/comment/types"
import { User } from "@/entities/user/types"
import { PostInput } from "@/features/posts/PostInput"

interface SelectionState {
  selectedPost: Post | null
  selectedComment: Comment | null
  selectedUser: User | null
  newPost: PostInput
  newComment: Omit<Comment, "id" | "likes" | "user">
  setSelectedPost: (value: Post | null) => void
  setSelectedComment: (value: Comment | null) => void
  setSelectedUser: (value: User | null) => void
  setNewPost: (value: PostInput) => void
  setNewComment: (value: Omit<Comment, "id" | "likes" | "user">) => void
}

export const useSelectionStore = create<SelectionState>()((set) => ({
  selectedPost: null,
  selectedComment: null,
  selectedUser: null,
  newPost: { title: "", body: "", userId: 1 },
  newComment: { body: "", postId: null, userId: 1 },
  setSelectedPost: (value) => set({ selectedPost: value }),
  setSelectedComment: (value) => set({ selectedComment: value }),
  setSelectedUser: (value) => set({ selectedUser: value }),
  setNewPost: (value) => set({ newPost: value }),
  setNewComment: (value) => set({ newComment: value }),
}))