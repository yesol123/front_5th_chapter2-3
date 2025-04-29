import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Edit2,
  MessageSquare,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react"

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
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../shared/ui"

import { usePosts } from "../hooks/usePosts"
import { useComments } from "../hooks/useComments"

import { Post } from "../types/Post"
import { Comment } from "../types/Comment"
import { User } from "../types/User"
import { PostInput } from "../types/PostInput"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [skip, setSkip] = useState<number>(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState<number>(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState<string>(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")
  
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState<PostInput>({ title: "", body: "", userId: 1 })

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<Omit<Comment, "id" | "likes" | "user">>({
    body: "",
    postId: null,
    userId: 1,
  })

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [tags, setTags] = useState<string[]>([])

  const {
    posts,
    total,
    loading,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
  } = usePosts()

  const {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  } = useComments()

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

  const highlightText = (text: string, highlight: string) => {
    if (!text || !highlight.trim()) return <span>{text}</span>
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        )}
      </>
    )
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  const openUserModal = async (user: User) => {
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
    fetchPosts({ skip, limit })
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
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 검색, 필터 */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPosts()}
            />
          </div>
          <Select value={selectedTag} onValueChange={(v) => setSelectedTag(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="태그 선택" />
            </SelectTrigger>
            <SelectContent>
            {tags.map((tag) => (
    <SelectItem key={tag.slug} value={tag.slug}>
      {tag.name}
    </SelectItem>
  ))}
            </SelectContent>
          </Select>
        </div>

        {/* 게시물 테이블 */}
        {loading ? (
          <div className="text-center p-8">로딩 중...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>반응</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>
                    <div>{highlightText(post.title, searchQuery)}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-1 text-[10px] rounded cursor-pointer ${
                            tag === selectedTag
                              ? "bg-blue-500 text-white"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => post.author && openUserModal(post.author)}
                    >
                      <img src={post.author?.image} className="w-6 h-6 rounded-full" alt="" />
                      <span>{post.author?.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.reactions?.likes || 0}</span>
                      <ThumbsDown className="w-4 h-4" />
                      <span>{post.reactions?.dislikes || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPost(post)
                          setShowEditDialog(true)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default PostsManager
