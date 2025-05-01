import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"
import { Search } from "lucide-react"

interface PostFilterProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  onSearchSubmit: () => void
  selectedTag: string
  onTagChange: (value: string) => void
  tags: { slug: string; name: string }[]
}

export const PostFilter = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  selectedTag,
  onTagChange,
  tags,
}: PostFilterProps) => {
  return (
    <div className="flex gap-4 mb-4">
      {/* 검색창 */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
        />
      </div>

      {/* 태그 선택 */}
      <Select value={selectedTag} onValueChange={onTagChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent  className="max-h-[200px] overflow-y-auto">
          {tags.map((tag) => (
            <SelectItem key={tag.slug} value={tag.slug}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
