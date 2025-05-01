import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
  Button,
} from "../../shared/ui"
import { useState, useEffect } from "react"
import { Post } from "@/entities/post/types"

interface PostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Post) => void
  initialData?: Post
  mode: "add" | "edit"
}

export const PostDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: PostDialogProps) => {
  const [form, setForm] = useState<Partial<Post>>({
    title: "",
    body: "",
    userId: 1,
  })

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    } else {
      setForm({ title: "", body: "", userId: 1 })
    }
  }, [initialData, open])

  const handleChange = (field: keyof Post, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (!form.title || !form.body || !form.userId) return
    onSubmit(form as Post)
    setForm({ title: "", body: "", userId: 1 })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "게시물 추가" : "게시물 수정"}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="제목"
          value={form.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <Textarea
          placeholder="내용"
          value={form.body || ""}
          onChange={(e) => handleChange("body", e.target.value)}
        />
{mode === "add" && (
  <Input
    placeholder="User ID"
    type="number"
    value={form.userId || ""}
    onChange={(e) => handleChange("userId", Number(e.target.value))}
  />
)}
        <Button onClick={handleSubmit}>
          {mode === "add" ? "게시물 추가" : "게시물 수정"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}