export interface Comment {
    id: number
    postId: number
    userId: number
    body: string
    likes: number
    user: {
      username: string
    }
  }