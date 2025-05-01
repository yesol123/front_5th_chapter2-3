import { create } from "zustand"

interface ModalState {
  showAddDialog: boolean
  showEditDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showPostDetailDialog: boolean
  showUserModal: boolean
  setShowAddDialog: (value: boolean) => void
  setShowEditDialog: (value: boolean) => void
  setShowAddCommentDialog: (value: boolean) => void
  setShowEditCommentDialog: (value: boolean) => void
  setShowPostDetailDialog: (value: boolean) => void
  setShowUserModal: (value: boolean) => void
}

export const useModalStore = create<ModalState>()((set) => ({
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModal: false,
  setShowAddDialog: (value) => set({ showAddDialog: value }),
  setShowEditDialog: (value) => set({ showEditDialog: value }),
  setShowAddCommentDialog: (value) => set({ showAddCommentDialog: value }),
  setShowEditCommentDialog: (value) => set({ showEditCommentDialog: value }),
  setShowPostDetailDialog: (value) => set({ showPostDetailDialog: value }),
  setShowUserModal: (value) => set({ showUserModal: value }),
}))
