import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Button,
  } from "@/shared/ui"
  import { useEffect, useState } from "react"
  import { Comment } from "@/entities/comment/types"
  
  interface CommentEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    comment: Comment | null
    onSubmit: (body: string) => void
  }
  
  export const CommentEditDialog = ({
    open,
    onOpenChange,
    comment,
    onSubmit,
  }: CommentEditDialogProps) => {
    const [body, setBody] = useState("")
  
    useEffect(() => {
      if (comment) setBody(comment.body)
    }, [comment])
  
    const handleSubmit = () => {
      if (!body.trim()) return
      onSubmit(body)
      setBody("")
      onOpenChange(false)
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="댓글 내용"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmit} disabled={!body.trim()}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  