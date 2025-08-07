// Optimized API client with connection pooling, caching, and retry logic

interface CacheItem {
  data: any
  timestamp: number
  ttl: number
}

interface RequestConfig extends RequestInit {
  retry?: number
  timeout?: number
  cache?: boolean
  cacheTTL?: number
}

class OptimizedApiClient {
  private baseURL: string
  private token: string | null = null
  private cache = new Map<string, CacheItem>()
  private requestQueue = new Map<string, Promise<any>>()
  private retryDelays = [1000, 2000, 4000] // Exponential backoff

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.startCacheCleanup()
  }

  setToken(token: string) {
    this.token = token
  }

  private startCacheCleanup() {
    // Clean expired cache entries every 5 minutes
    setInterval(
      () => {
        const now = Date.now()
        for (const [key, item] of this.cache) {
          if (now - item.timestamp > item.ttl) {
            this.cache.delete(key)
          }
        }
      },
      5 * 60 * 1000,
    )
  }

  private getCacheKey(url: string, options: RequestInit = {}): string {
    return `${url}_${JSON.stringify(options.body || "")}_${options.method || "GET"}`
  }

  private getFromCache(key: string): any | null {
    const item = this.cache.get(key)
    if (item && Date.now() - item.timestamp < item.ttl) {
      return item.data
    }
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl })

    // Limit cache size
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  private async requestWithTimeout(url: string, options: RequestInit, timeout = 10000): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private async request(endpoint: string, config: RequestConfig = {}): Promise<any> {
    const { retry = 3, timeout = 10000, cache: useCache = false, cacheTTL = 5 * 60 * 1000, ...options } = config

    const url = `${this.baseURL}${endpoint}`
    const cacheKey = this.getCacheKey(url, options)

    // Check cache for GET requests
    if (useCache && (!options.method || options.method === "GET")) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    // Deduplicate identical requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)
    }

    const requestPromise = this.executeRequest(url, options, retry, timeout)
    this.requestQueue.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise

      // Cache successful GET requests
      if (useCache && (!options.method || options.method === "GET")) {
        this.setCache(cacheKey, result, cacheTTL)
      }

      return result
    } finally {
      this.requestQueue.delete(cacheKey)
    }
  }

  private async executeRequest(url: string, options: RequestInit, retryCount: number, timeout: number): Promise<any> {
    const requestOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await this.requestWithTimeout(url, requestOptions, timeout)

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: "Request failed" }))

          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw new Error(error.error || "Client error")
          }

          // Retry server errors (5xx)
          if (attempt < retryCount) {
            await this.delay(this.retryDelays[attempt] || 4000)
            continue
          }

          throw new Error(error.error || "Server error")
        }

        return await response.json()
      } catch (error) {
        if (attempt < retryCount && this.isRetryableError(error)) {
          await this.delay(this.retryDelays[attempt] || 4000)
          continue
        }
        throw error
      }
    }
  }

  private isRetryableError(error: any): boolean {
    return (
      error.name === "AbortError" ||
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("timeout")
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Optimized batch requests
  async batchRequest(requests: Array<{ endpoint: string; config?: RequestConfig }>): Promise<any[]> {
    const promises = requests.map(({ endpoint, config }) =>
      this.request(endpoint, config).catch((error) => ({ error: error.message })),
    )
    return Promise.all(promises)
  }

  // ==================== OPTIMIZED API METHODS ====================

  // Auth methods
  async register(userData: { email: string; password: string; name: string }) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // User methods with caching
  async getUserProfile() {
    return this.request("/api/users/profile", {
      cache: true,
      cacheTTL: 2 * 60 * 1000, // 2 minutes
    })
  }

  async updateUserProfile(profileData: any) {
    const result = await this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })

    // Invalidate cache
    this.cache.clear()
    return result
  }

  // Job methods with optimized caching
  async getJobs(params?: {
    search?: string
    location?: string
    type?: string
    page?: number
    limit?: number
  }) {
    const queryString = params ? new URLSearchParams(params as any).toString() : ""
    return this.request(`/api/jobs${queryString ? `?${queryString}` : ""}`, {
      cache: true,
      cacheTTL: 3 * 60 * 1000, // 3 minutes for job listings
    })
  }

  async createJob(jobData: any) {
    return this.request("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    })
  }

  // Community methods with caching
  async getCommunities(search?: string) {
    const queryString = search ? `?search=${encodeURIComponent(search)}` : ""
    return this.request(`/api/communities${queryString}`, {
      cache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes for communities
    })
  }

  // Chat methods with real-time optimization
  async getChatMessages(roomId: string, page = 1, limit = 50) {
    return this.request(`/api/chat/${roomId}/messages?page=${page}&limit=${limit}`, {
      cache: true,
      cacheTTL: 30 * 1000, // 30 seconds for messages
    })
  }

  // Bulk operations for better performance
  async bulkCreateTodos(todos: any[]) {
    return this.batchRequest(
      todos.map((todo) => ({
        endpoint: "/api/todos",
        config: { method: "POST", body: JSON.stringify(todo) },
      })),
    )
  }

  // Health check with performance metrics
  async getHealthStatus() {
    return this.request("/api/health", {
      cache: false,
      timeout: 5000,
    })
  }

  // Clear cache manually
  clearCache() {
    this.cache.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Singleton instance with connection pooling
export const apiClient = new OptimizedApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")

export default apiClient
