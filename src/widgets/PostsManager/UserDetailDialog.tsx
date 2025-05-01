import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "../../shared/ui"
  import { User } from "../../entities/user/types"
  
  interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
  }
  
  export const UserDetailDialog = ({ open, onOpenChange, user }: Props) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>작성자 정보</DialogTitle>
          </DialogHeader>
          {user ? (
            <div className="space-y-2">
              <div>이름: {user.username}</div>
              <div>이메일: {user.email}</div>
              <div>나이: {user.age}</div>
              <div>전화번호: {user.phone}</div>
              <div>회사: {user.company?.name}</div>
              <div>직책: {user.company?.title}</div>
            </div>
          ) : (
            <div>로딩 중...</div>
          )}
        </DialogContent>
      </Dialog>
    )
  }