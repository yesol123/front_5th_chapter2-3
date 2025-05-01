export const userApi = {
    async fetchAll() {
      const res = await fetch("/api/users?limit=0&select=username,image")
      const data = await res.json()
      return data.users
    },
  
    async fetchById(userId: number) {
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()
      return data
    },
  }