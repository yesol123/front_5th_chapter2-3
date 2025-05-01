import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { PostFilter } from "@/widgets/PostsManager/PostsFilter"
import { PostsTable } from "@/widgets/PostsManager/PostsTable"
import { PostDialog } from "@/widgets/PostsManager/PostDialog"
import { PostDetailDialog } from "@/widgets/PostsManager/PostDetailDialog"
import { CommentEditDialog } from "@/widgets/PostsManager/CommentEditDialog"

import { Plus } from "lucide-react"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui"

import { usePosts } from "@/hooks/usePosts"
import { useComments } from "@/hooks/useComments"

import { useFilterStore } from "@/shared/store/UseFilterSotre"
import { useModalStore } from "@/shared/store/UseModalSotre"
import { useSelectionStore } from "@/shared/store/UseSelectionStore"
import { Post } from "@/entities/post/types"
import { User } from "@/entities/user/types"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    skip,
    limit,
    tags,
    setTags,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    setSkip,
    setLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
  } = useFilterStore()

  const {
    showAddDialog,
    showEditDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    showUserModal,
    setShowAddDialog,
    setShowEditDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setShowUserModal,
  } = useModalStore()

  const {
    selectedPost,
    selectedComment,
    selectedUser,
    newComment,
    setSelectedPost,
    setSelectedComment,
    setSelectedUser,
    setNewComment,
  } = useSelectionStore()

  const { posts, total, loading, fetchPosts, addPost, updatePost, deletePost } = usePosts({
    skip,
    limit,
    sortBy,
    sortOrder,
    tag: selectedTag,
  })
  const {
    comments,
    isLoading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  } = useComments(selectedPost?.id ?? 0)

  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/posts/tags")
      const data = await res.json()
      setTags(data) 
    } catch (err) {
      console.error("태그 가져오기 오류:", err)
    }
  }
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts({ skip, limit })
      return
    }
    try {
      const res = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data = await res.json()
      console.log(data)
    } catch (err) {
      console.error("검색 오류:", err)
    }
  }

  const openPostDetail = (post:Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const openUserModal = async (user:User) => {
    if (!user) return
    try {
      const res = await fetch(`/api/users/${user.id}`)
      const data = await res.json()
      setSelectedUser(data)
      setShowUserModal(true)
    } catch (err) {
      console.error("사용자 정보 오류:", err)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>게시물 관리자</span>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-1" /> 게시물 추가
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <PostFilter
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={searchPosts}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            tags={tags} // 태그 스토어에 따라 대체 가능
          />

          {loading ? (
            <div className="text-center p-8">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              onDelete={deletePost}
              onEdit={(post) => {
                setSelectedPost(post)
                setShowEditDialog(true)
              }}
              onOpenDetail={openPostDetail}
              onOpenUser={openUserModal}
              skip={skip}
              limit={limit}
              total={total}
              onNext={() => setSkip(skip + limit)}
              onPrev={() => setSkip(Math.max(0, skip - limit))}
            />
          )}
        </CardContent>

        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>작성자 정보</DialogTitle>
            </DialogHeader>
            {selectedUser ? (
              <div className="space-y-2">
                <div>이름: {selectedUser.username}</div>
                <div>이메일: {selectedUser.email}</div>
                <div>나이: {selectedUser.age}</div>
                <div>전화번호: {selectedUser.phone}</div>
                <div>회사: {selectedUser.company?.name}</div>
                <div>직책: {selectedUser.company?.title}</div>
              </div>
            ) : (
              <div>로딩 중...</div>
            )}
          </DialogContent>
        </Dialog>
      </Card>

      <PostDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        mode="add"
        onSubmit={(data) => addPost(data)}
      />

      <PostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        mode="edit"
        initialData={selectedPost!}
        onSubmit={(data) => {
          if (!selectedPost) return
          updatePost({ ...selectedPost, ...data })
        }}
      />

      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={Array.isArray(comments) ? comments : []}
        newCommentBody={newComment.body}
        onChangeNewComment={(body) => setNewComment({ ...newComment, body })}
        onAddComment={async () => {
          if (!selectedPost || !newComment.body.trim()) {
            alert("댓글 내용과 게시물이 선택되어야 합니다.")
            return
          }
        
          try {
            await addComment({
              body: newComment.body,
              postId: selectedPost.id,
            })
            setNewComment({ body: "", postId: selectedPost.id })
          } catch (err) {
            console.error("댓글 추가 실패:", err)
          }
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onDeleteComment={(id) => {
          if (!selectedPost) return
          deleteComment({id, postId:selectedPost.id})}}
        onLikeComment={(id) =>{
          if (!selectedPost) return
          likeComment({id, postId:selectedPost.id, newLikes:1})
        }}
      />

      <CommentEditDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onSubmit={(body) => {
          if (!selectedComment) return
          updateComment({ ...selectedComment, body })
        }}
      />
    </>
  )
}

export default PostsManager
