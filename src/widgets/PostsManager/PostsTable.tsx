import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "../../shared/ui"
import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react"
import { highlightText } from "@/shared/utils/highlightText"
import { Post } from "../../entities/post/types"

interface PostsTableProps {
  posts: Post[]
  searchQuery: string
  selectedTag: string
  onSelectTag: (tag: string) => void
  onDelete: (postId: number) => void
  onEdit: (post: Post) => void
  onOpenDetail: (post: Post) => void
  onOpenUser: (user: Post["author"]) => void
  skip: number
  limit: number
  total: number
  onNext: () => void
  onPrev: () => void
}

export const PostsTable = ({
  posts,
  searchQuery,
  selectedTag,
  onSelectTag,
  onDelete,
  onEdit,
  onOpenDetail,
  onOpenUser,
  skip,
  limit,
  total,
  onNext,
  onPrev,
}: PostsTableProps) => {
  return (
    <div className="space-y-4">
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
                      onClick={() => onSelectTag(tag)}
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
                  onClick={() => post.author && onOpenUser(post.author)}
                >
                  <img
                    src={post.author?.image}
                    className="w-6 h-6 rounded-full"
                    alt=""
                  />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenDetail(post)}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(post)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ 페이지네이션 영역 */}
      <div className="flex justify-between items-center pt-4">
        <Button onClick={onPrev} disabled={skip === 0}>
          이전
        </Button>
        <span className="text-sm text-muted-foreground">
          {skip + 1} - {Math.min(skip + limit, total)} / {total}
        </span>
        <Button onClick={onNext} disabled={skip + limit >= total}>
          다음
        </Button>
      </div>
    </div>
  )
}
