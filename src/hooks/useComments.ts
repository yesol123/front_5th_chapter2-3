import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Comment } from "@/entities/comment/types"
import { commentApi } from "@/features/posts/api/commentApi"

export const useComments = (postId: number) => {
  const queryClient = useQueryClient()

  // 댓글 조회
  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => commentApi.fetchByPostId(postId),
    enabled: !!postId,
    staleTime: 1000 * 60,
  })

  // 댓글 추가
  const addMutation = useMutation({
    mutationFn: (newComment: Omit<Comment, "id" | "likes" | "user">) =>
      commentApi.addComment(newComment), // ✅ postId 포함된 Comment 리턴
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", newComment.postId] })
    },
  })

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: ({ id, body, postId }: { id: number; body: string; postId: number }) =>
      commentApi.updateComment(id, body).then((updated) => ({ postId })),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })

  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: ({ id, postId }: { id: number; postId: number }) =>
      commentApi.deleteComment(id).then(() => ({ postId })),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })

  // 댓글 좋아요
  const likeMutation = useMutation({
    mutationFn: ({ id, newLikes, postId }: { id: number; newLikes: number; postId: number }) =>
      commentApi.likeComment(id, newLikes).then(() => ({ postId })),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })

  return {
    comments,
    isLoading,
    addComment: addMutation.mutateAsync, // ✅ mutateAsync로 변경
    updateComment: updateMutation.mutate,
    deleteComment: deleteMutation.mutate,
    likeComment: likeMutation.mutate,
  }
}
