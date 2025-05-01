import { User } from "../user/types"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: User
}

// 게시물 생성/수정에 사용하는 입력 타입
export interface PostInput {
  title: string
  body: string
  userId: number
}