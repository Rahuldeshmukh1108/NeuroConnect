"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { auth } from "@/lib/firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { apiClient } from "@/lib/api-optimized"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  profile?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Optimized user data fetching with caching
const userCache = new Map<string, { user: User; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCachedUser = (uid: string): User | null => {
  const cached = userCache.get(uid)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user
  }
  userCache.delete(uid)
  return null
}

const setCachedUser = (uid: string, user: User) => {
  userCache.set(uid, { user, timestamp: Date.now() })

  // Cleanup old cache entries
  if (userCache.size > 100) {
    const oldestKey = userCache.keys().next().value
    userCache.delete(oldestKey)
  }
}

export function OptimizedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authStateResolved, setAuthStateResolved] = useState(false)

  // Optimized user profile fetching
  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      // Check cache first
      const cachedUser = getCachedUser(firebaseUser.uid)
      if (cachedUser) {
        return cachedUser
      }

      // Get fresh token and set it
      const token = await firebaseUser.getIdToken()
      apiClient.setToken(token)

      // Fetch user profile
      const profile = await apiClient.getUserProfile()

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: profile.name || firebaseUser.displayName || "",
        avatar: profile.profile?.avatar || "",
        profile,
      }

      // Cache the user data
      setCachedUser(firebaseUser.uid, userData)

      return userData
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      return null
    }
  }, [])

  // Optimized auth state listener
  useEffect(() => {
    let isMounted = true

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return

      try {
        if (firebaseUser) {
          const userData = await fetchUserProfile(firebaseUser)
          if (isMounted) {
            setUser(userData)
          }
        } else {
          setUser(null)
          apiClient.setToken("")
          userCache.clear() // Clear cache on sign out
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setAuthStateResolved(true)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [fetchUserProfile])

  // Optimized sign in with error handling
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      apiClient.setToken(token)

      // User state will be updated by the auth state listener
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw new Error(error.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  }, [])

  // Optimized sign up
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      apiClient.setToken(token)

      // Register user profile in backend
      await apiClient.register({ email, password, name })

      // User state will be updated by the auth state listener
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw new Error(error.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }, [])

  // Optimized sign out
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      apiClient.setToken("")
      userCache.clear()
    } catch (error) {
      console.error("Sign out error:", error)
      throw new Error("Sign out failed")
    }
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      // Clear cache for this user
      userCache.delete(auth.currentUser.uid)

      const userData = await fetchUserProfile(auth.currentUser)
      setUser(userData)
    }
  }, [fetchUserProfile])

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading: loading || !authStateResolved,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, loading, authStateResolved, signIn, signUp, signOut, refreshUser],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an OptimizedAuthProvider")
  }
  return context
}
