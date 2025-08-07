"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Mail, Lock, User, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { FaGoogle } from "react-icons/fa"

// Email validation function using Abstract API
const validateEmailWithAbstractAPI = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=0483f966fd444293807a2c5b34a0a471&email=${encodeURIComponent(email)}`,
    )
    const data = await response.json()

    // Check if email is deliverable and not disposable
    return data.deliverability === "DELIVERABLE" && !data.is_disposable_email.value
  } catch (error) {
    console.error("Email validation error:", error)
    // If API fails, allow signup to continue (fallback)
    return true
  }
}

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailValidating, setEmailValidating] = useState(false)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const { signUp, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleEmailBlur = async () => {
    if (!email || !email.includes("@")) {
      setEmailValid(null)
      return
    }

    setEmailValidating(true)
    try {
      const isValid = await validateEmailWithAbstractAPI(email)
      setEmailValid(isValid)

      if (!isValid) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid, deliverable email address.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setEmailValid(null)
    } finally {
      setEmailValidating(false)
    }
  }

  const getErrorMessage = (error: any) => {
    if (error.message.includes("auth/email-already-in-use")) {
      return "This email is already registered. Please sign in or use a different email."
    }
    if (error.message.includes("auth/weak-password")) {
      return "The password is too weak. Please use a stronger password (at least 6 characters)."
    }
    if (error.message.includes("auth/invalid-email")) {
      return "Please enter a valid email address."
    }
    return "Sign up failed. Please try again or contact support."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    // Check email validity
    if (emailValid === false) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid, deliverable email address.",
        variant: "destructive",
      })
      return
    }

    // Validate email if not already validated
    if (emailValid === null) {
      setEmailValidating(true)
      const isValid = await validateEmailWithAbstractAPI(email)
      setEmailValidating(false)

      if (!isValid) {
        setEmailValid(false)
        toast({
          title: "Invalid Email",
          description: "Please enter a valid, deliverable email address.",
          variant: "destructive",
        })
        return
      }
      setEmailValid(true)
    }

    setLoading(true)
    try {
      await signUp(email, password, name)
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to NeuroConnect! You can now access your dashboard.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Sign up failed",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Welcome to NeuroConnect!",
        description: "Your account has been created successfully with Google.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Google signup error:", error)
      toast({
        title: "Google Sign-up failed",
        description: "Could not create an account with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NeuroConnect</span>
          </Link>
          <h1 className="text-3xl font-bold">Join NeuroConnect</h1>
          <p className="text-muted-foreground mt-2">Create your account and start your journey today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleSignUp}
              disabled={loading}
              variant="outline"
              className="w-full gap-2 mb-4 bg-transparent"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FaGoogle className="h-4 w-4" />}
              Sign up with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailValid(null)
                    }}
                    onBlur={handleEmailBlur}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-3">
                    {emailValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {!emailValidating && emailValid === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {!emailValidating && emailValid === false && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                {emailValid === false && (
                  <p className="text-sm text-red-500">Please enter a valid, deliverable email address.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-500">Passwords do not match.</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading || emailValidating || emailValid === false}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
