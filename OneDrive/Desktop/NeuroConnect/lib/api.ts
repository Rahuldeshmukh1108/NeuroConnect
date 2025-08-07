class ApiClient {
  private baseURL: string
  private token = ""

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getUserProfile() {
    return this.request("/api/users/profile")
  }

  async updateUserProfile(data: any) {
    return this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async socialLogin() {
    return this.request("/api/auth/social-login", {
      method: "POST",
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  }

  // Jobs API
  async getJobs(params?: { search?: string; location?: string; type?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const query = searchParams.toString()
    return this.request(`/api/jobs${query ? `?${query}` : ""}`)
  }

  async createJob(jobData: any) {
    return this.request("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    })
  }

  // Communities API
  async getCommunities(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : ""
    return this.request(`/api/communities${query}`)
  }

  // Chat API
  async getChatMessages(roomId: string, page = 1, limit = 50) {
    return this.request(`/api/chat/${roomId}/messages?page=${page}&limit=${limit}`)
  }

  async sendChatMessage(roomId: string, message: string) {
    return this.request(`/api/chat/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  // Todos API
  async getTodos() {
    return this.request("/api/todos")
  }

  async createTodo(todoData: any) {
    return this.request("/api/todos", {
      method: "POST",
      body: JSON.stringify(todoData),
    })
  }

  // Games API
  async getGameScores() {
    return this.request("/api/games/scores")
  }

  async submitGameScore(scoreData: any) {
    return this.request("/api/games/scores", {
      method: "POST",
      body: JSON.stringify(scoreData),
    })
  }

  // Schemes API
  async getSchemes() {
    return this.request("/api/schemes")
  }

  // File upload
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: "POST",
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Upload failed" }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
