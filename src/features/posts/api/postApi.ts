import { Post } from "@/entities/post/types"
import { User } from "@/entities/user/types"

export const postApi = {
  fetchPosts: async (
    skip: number,
    limit: number,
    sortBy?: string,
    sortOrder?: string,
    tag?: string
  ): Promise<{ posts: Post[]; total: number }> => {
    const postUrl = tag
      ? `/api/posts/tag/${tag}`
      : `/api/posts?limit=${limit}&skip=${skip}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    const userUrl = `/api/users?limit=0&select=username,image`

    const [postRes, userRes] = await Promise.all([
      fetch(postUrl),
      fetch(userUrl),
    ])
    const postData = await postRes.json()
    const userData = await userRes.json()

    const postsWithAuthor = postData.posts.map((post: Post) => ({
      ...post,
      author: userData.users.find((user: User) => user.id === post.userId),
    }))

    return { posts: postsWithAuthor, total: postData.total }
  },

  fetchPostById: async (postId: number): Promise<Post> => {
    const res = await fetch(`/api/posts/${postId}`)
    const data = await res.json()
    return data.post
  },

  // ✅ 여기 추가된 부분
  searchPosts: async (query: string): Promise<Post[]> => {
    const res = await fetch(`/api/posts/search?q=${query}`)
    const data = await res.json()
    return data.posts || []
  },

  addPost: async (post: Omit<Post, "id">) => {
    const res = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    return await res.json()
  },

  updatePost: async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
    return await res.json()
  },

  deletePost: async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" })
  },
}