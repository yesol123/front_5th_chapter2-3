import { useState } from "react"
import { Post } from "../types/Post"
import { PostInput } from "../types/PostInput"

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchPosts = async ({ skip = 0, limit = 10 }: { skip: number; limit: number }) => {
    setLoading(true)
    try {
      const postsRes = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
      const postsData = await postsRes.json()

      const usersRes = await fetch("/api/users?limit=0&select=username,image")
      const usersData = await usersRes.json()

      const postsWithAuthors: Post[] = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithAuthors)
      setTotal(postsData.total)
    } catch (err) {
      console.error("게시물 불러오기 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  const addPost = async (newPost: PostInput) => {
    try {
      const res = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data: Post = await res.json()
      setPosts((prev) => [data, ...prev])
    } catch (err) {
      console.error("게시물 추가 오류:", err)
    }
  }

  const updatePost = async (updatedPost: Post) => {
    try {
      const res = await fetch(`/api/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      })
      const data: Post = await res.json()
      setPosts((prev) =>
        prev.map((post) => (post.id === data.id ? data : post))
      )
    } catch (err) {
      console.error("게시물 수정 오류:", err)
    }
  }

  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" })
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch (err) {
      console.error("게시물 삭제 오류:", err)
    }
  }

  return {
    posts,
    total,
    loading,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
  }
}