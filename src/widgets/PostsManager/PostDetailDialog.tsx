import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import { Comment } from "@/entities/comment/types"
import { Post } from "@/entities/post/types"
import { useState } from "react"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments: Comment[]
  newCommentBody: string
  onChangeNewComment: (body: string) => void
  onAddComment: () => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number) => void
  onLikeComment: (commentId: number) => void
}

export const PostDetailDialog = ({
  open,
  onOpenChange,
  post,
  comments,
  newCommentBody,
  onChangeNewComment,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 상세</DialogTitle>
        </DialogHeader>

        {post && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-xl">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.body}</p>
            </div>

            <div>
              <h4 className="font-semibold">댓글</h4>
              <ul className="space-y-2">
                {comments.map((comment) => (
                  <li key={comment.id} className="border rounded p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{comment.user.username}</span>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-500"
                          onClick={() => onLikeComment(comment.id)}
                        >
                          👍 {comment.likes}
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={() => onEditComment(comment)}
                        >
                          수정
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => onDeleteComment(comment.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <p className="text-sm mt-1">{comment.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="댓글을 입력하세요"
                value={newCommentBody}
                onChange={(e) => onChangeNewComment(e.target.value)}
              />
              <Button
  disabled={!newCommentBody.trim()}
  onClick={async () => {
    await onAddComment()
  }}
>
  댓글 추가
</Button>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
