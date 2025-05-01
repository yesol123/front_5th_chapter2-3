import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "@/features/posts/api/postApi"
import { commentApi } from "@/features/posts/api/commentApi" 
import { PostInput } from "@/features/posts/PostInput"
import { Post } from "@/entities/post/types"

export const usePosts = (options: {
  skip: number
  limit: number
  sortBy?: string
  sortOrder?: string
  tag?: string
}) => {
  const queryClient = useQueryClient()

  // 게시물 목록
  const postsQuery = useQuery({
    queryKey: ["posts", options],
    queryFn: () =>
      postApi.fetchPosts(
        options.skip,
        options.limit,
        options.sortBy,
        options.sortOrder,
        options.tag
      ),
    staleTime: 1000 * 60,
  })

  // 게시물 추가
  const addMutation = useMutation({
    mutationFn: (newPost: PostInput) => postApi.addPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", options] });
    },
  })

  // 게시물 수정
  const updateMutation = useMutation({
    mutationFn: (post: Post) => postApi.updatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", options] });
    },
  })

  // 게시물 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", options] });
    },
  })

  // ✅ 검색 기능
  const searchPosts = async (query: string) => {
    try {
      const res = await postApi.searchPosts(query)
      return res
    } catch (err) {
      console.error("검색 오류:", err)
      return []
    }
  }

  // ✅ 상세 보기용 fetch (상태는 외부 컴포넌트에서 관리)
  const fetchPostDetail = async (postId: number) => {
    try {
      const post = await postApi.fetchPostById(postId)
      const comments = await commentApi.fetchByPostId(postId)  // 또는 commentApi
      return { post, comments }
    } catch (err) {
      console.error("상세 보기 오류:", err)
      return null
    }
  }

  return {
    posts: postsQuery.data?.posts ?? [],
    total: postsQuery.data?.total ?? 0,
    loading: postsQuery.isLoading,
    fetchError: postsQuery.error,
    addPost: addMutation.mutate,
    updatePost: updateMutation.mutate,
    deletePost: deleteMutation.mutate,
    searchPosts, // ✅ 외부에서 호출 가능
    fetchPostDetail, // ✅ 외부에서 호출 가능
    fetchPosts: postApi.fetchPosts,
  }
}
