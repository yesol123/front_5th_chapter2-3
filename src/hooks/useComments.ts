import { useState } from "react"
import { Comment } from "../types/Comment"

export const useComments = () => {
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({})

  const fetchComments = async (postId: number) => {
    if (comments[postId]) return
    try {
      const res = await fetch(`/api/comments/post/${postId}`)
      const data = await res.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (err) {
      console.error("댓글 불러오기 오류:", err)
    }
  }

  const addComment = async (newComment: Omit<Comment, "id" | "likes" | "user">) => {
    try {
      const res = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data: Comment = await res.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
    } catch (err) {
      console.error("댓글 추가 오류:", err)
    }
  }

  const updateComment = async (updatedComment: { id: number; body: string; postId: number }) => {
    try {
      const res = await fetch(`/api/comments/${updatedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: updatedComment.body }),
      })
      const data: Comment = await res.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((c) =>
          c.id === data.id ? data : c
        ),
      }))
    } catch (err) {
      console.error("댓글 수정 오류:", err)
    }
  }

  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, { method: "DELETE" })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== id),
      }))
    } catch (err) {
      console.error("댓글 삭제 오류:", err)
    }
  }

  const likeComment = async (id: number, postId: number) => {
    const target = comments[postId]?.find((c) => c.id === id)
    if (!target) return

    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: target.likes + 1 }),
      })
      const data: Comment = await res.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.id === data.id ? { ...data, likes: c.likes + 1 } : c
        ),
      }))
    } catch (err) {
      console.error("댓글 좋아요 오류:", err)
    }
  }

  return {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  }
}