import { Comment } from "@/entities/comment/types"

export const commentApi = {
  async fetchByPostId(postId: number): Promise<Comment[]> {
    const res = await fetch(`/api/comments/post/${postId}`)
    const data = await res.json()
    return data.comments || []
  },

  async addComment(comment: Omit<Comment, "id" | "likes" | "user">): Promise<Comment> {
    const res = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    })
    const data = await res.json()
    return { ...data, postId: comment.postId }  // ✅ postId 명시적으로 포함
  },

  async updateComment(id: number, body: string): Promise<Comment> {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    })
    return await res.json()
  },

  async deleteComment(id: number): Promise<void> {
    await fetch(`/api/comments/${id}`, { method: "DELETE" })
  },

  async likeComment(id: number, newLikes: number): Promise<Comment> {
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: newLikes }),
    })
    return await res.json()
  },
}
