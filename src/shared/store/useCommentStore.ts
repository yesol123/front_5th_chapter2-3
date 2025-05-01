import { create } from "zustand"
import { Comment } from "@/entities/comment/types"

interface CommentStore {
  comments: { [postId: number]: Comment[] }
  setComments: (postId: number, comments: Comment[]) => void
  addComment: (postId: number, comment: Comment) => void
  updateComment: (postId: number, updated: Comment) => void
  deleteComment: (postId: number, commentId: number) => void
  likeComment: (postId: number, commentId: number) => void
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: {},

  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), comment],
      },
    })),

  updateComment: (postId, updated) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].map((c) =>
          c.id === updated.id ? updated : c
        ),
      },
    })),

  deleteComment: (postId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].filter((c) => c.id !== commentId),
      },
    })),

  likeComment: (postId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        ),
      },
    })),
}))