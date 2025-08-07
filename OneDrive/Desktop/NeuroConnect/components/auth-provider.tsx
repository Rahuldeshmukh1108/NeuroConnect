"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { auth } from "@/lib/firebase"
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { apiClient } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  profile?: any
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  sendPasswordResetEmail: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const userCache = new Map<string, { user: User; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

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
  if (userCache.size > 100) {
    const oldestKeyResult = userCache.keys().next()
    if (!oldestKeyResult.done) {
      const oldestKey = oldestKeyResult.value
      userCache.delete(oldestKey)
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authStateResolved, setAuthStateResolved] = useState(false)

  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const cachedUser = getCachedUser(firebaseUser.uid)
      if (cachedUser) {
        console.log("User profile from cache:", cachedUser.id)
        return cachedUser
      }

      const token = await firebaseUser.getIdToken()
      apiClient.setToken(token)

      try {
        const profile = await apiClient.getUserProfile()

        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: profile.name || firebaseUser.displayName || "",
          avatar: profile.profile?.avatar || firebaseUser.photoURL || "",
          profile: profile,
          emailVerified: firebaseUser.emailVerified,
        }

        setCachedUser(firebaseUser.uid, userData)
        console.log("Fetched and cached user profile:", userData.id)
        return userData
      } catch (profileError: any) {
        // If profile doesn't exist, create it for verified users
        if (profileError.message?.includes("User profile not found")) {
          console.log("Creating profile for user:", firebaseUser.uid)

          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "",
            avatar: firebaseUser.photoURL || "",
            profile: null,
            emailVerified: firebaseUser.emailVerified,
          }

          setCachedUser(firebaseUser.uid, userData)
          return userData
        }
        throw profileError
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      return null
    }
  }, [])

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
          userCache.clear()
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

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const token = await userCredential.user.getIdToken()
        apiClient.setToken(token)

        const userData = await fetchUserProfile(userCredential.user)
        if (userData) {
          setUser(userData)
        } else {
          throw new Error("Failed to load user profile after sign-in.")
        }
      } catch (error: any) {
        console.error("Sign in error:", error)
        throw new Error(error.message || "Sign in failed")
      } finally {
        setLoading(false)
      }
    },
    [fetchUserProfile],
  )

  const signInWithGoogle = useCallback(async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userCredential = result.user
      const token = await userCredential.getIdToken()
      apiClient.setToken(token)

      // For Google sign-in, create profile if it doesn't exist
      try {
        await apiClient.socialLogin()
      } catch (error) {
        console.log("Social login API call completed")
      }

      const userData = await fetchUserProfile(userCredential)
      if (userData) {
        setUser(userData)
      } else {
        throw new Error("Failed to load user profile after Google sign-in.")
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      throw new Error(error.message || "Google Sign-in failed")
    } finally {
      setLoading(false)
    }
  }, [fetchUserProfile])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })

      // Get token and create backend profile immediately
      const token = await userCredential.user.getIdToken()
      apiClient.setToken(token)

      // Create user profile in backend
      try {
        await apiClient.register(email, password, name)
      } catch (backendError) {
        console.error("Backend profile creation error:", backendError)
        // If backend fails, still continue with the signup process
      }

      // Create user data for immediate use
      const userData: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
        name: name,
        avatar: "",
        profile: {
          email: userCredential.user.email,
          name: name,
          createdAt: new Date().toISOString(),
          profile: {
            avatar: "",
            bio: "",
            preferences: {},
          },
        },
        emailVerified: true, // We're treating successful signup as verified
      }

      setCachedUser(userCredential.user.uid, userData)
      setUser(userData)
    } catch (error: any) {
      console.error("Sign up error:", error)
      const errorMessage = error.response?.data?.error || error.message || "Sign up failed"
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

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

  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      userCache.delete(auth.currentUser.uid)
      const userData = await fetchUserProfile(auth.currentUser)
      setUser(userData)
    }
  }, [fetchUserProfile])

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password reset error:", error)
      throw new Error("Failed to send password reset email.")
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      user,
      loading: loading || !authStateResolved,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      refreshUser,
      sendPasswordResetEmail,
    }),
    [user, loading, authStateResolved, signIn, signUp, signInWithGoogle, signOut, refreshUser, sendPasswordResetEmail],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
