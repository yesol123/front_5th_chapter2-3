import { User } from "../user/types"

export interface Comment {
  id: number
  body: string
  postId: number
  user: User
  likes: number
}