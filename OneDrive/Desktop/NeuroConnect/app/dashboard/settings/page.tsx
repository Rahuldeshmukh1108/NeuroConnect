"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Type,
  Volume2,
  Eye,
  Upload,
  Save,
  LogOut,
  Camera,
  Briefcase,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useAccessibility } from "@/components/accessibility-provider"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

// Re-using interfaces from jobs page for consistency
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  skills: string[]
  bio: string
  portfolio?: string
  resumeUrl?: string
  role?: "jobSeeker" | "recruiter" // Added role to user profile
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { fontSize, setFontSize, language, setLanguage, highContrast, setHighContrast } = useAccessibility()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        return JSON.parse(storedProfile)
      }
    }
    return {
      id: user?.id || "mock-user-id",
      name: user?.name || "",
      email: user?.email || "",
      bio: "Passionate about neurodiversity advocacy and creating inclusive spaces for everyone.",
      location: "San Francisco, CA",
      website: "https://myportfolio.com",
      phone: "+1 (555) 123-4567",
      avatar: user?.avatar || "/placeholder.svg?height=80&width=80",
      role: undefined, // Default role
    }
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    communityUpdates: true,
    jobAlerts: true,
    gameReminders: false,
    weeklyDigest: true,
  })

  const [accessibility, setAccessibility] = useState({
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    autoplay: false,
    soundEffects: true,
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    profilePublic: true,
    allowDirectMessages: true,
    showOnlineStatus: true,
  })

  const [isUploading, setIsUploading] = useState(false)

  // Sync profile state with localStorage on changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
    localStorage.setItem("userRole", profile.role || "") // Also update userRole in localStorage
  }, [profile])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, or GIF).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file)

      // Update profile with new avatar
      setProfile((prev) => ({ ...prev, avatar: imageUrl }))

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const saveProfile = () => {
    // Validate required fields
    if (!profile.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return
    }

    if (!profile.email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profile.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    }, 500)
  }

  const saveNotifications = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      })
    }, 500)
  }

  const saveAccessibility = () => {
    // Apply settings immediately
    if (accessibility.reducedMotion) {
      document.documentElement.style.setProperty("--motion-reduce", "1")
    } else {
      document.documentElement.style.removeProperty("--motion-reduce")
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Accessibility settings updated",
        description: "Your accessibility preferences have been saved.",
      })
    }, 500)
  }

  const updatePassword = () => {
    if (!security.currentPassword) {
      toast({
        title: "Current password required",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    if (!security.newPassword) {
      toast({
        title: "New password required",
        description: "Please enter a new password.",
        variant: "destructive",
      })
      return
    }

    if (security.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      setSecurity((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    }, 500)
  }

  const enable2FA = () => {
    setSecurity((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))

    toast({
      title: security.twoFactorEnabled ? "2FA disabled" : "2FA enabled",
      description: security.twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled for your account.",
    })
  }

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
  }

  const deleteAccount = () => {
    // This would typically show a confirmation dialog
    toast({
      title: "Account deletion",
      description: "This feature requires additional confirmation. Please contact support.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, preferences, and accessibility options.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback className="text-lg">{profile.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Change Avatar"}
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">{profile.bio.length}/500 characters</p>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Your Role</Label>
                <Select
                  value={profile.role || ""}
                  onValueChange={(value: "jobSeeker" | "recruiter") => setProfile({ ...profile, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jobSeeker">
                      <User className="mr-2 h-4 w-4 inline-block" /> Job Seeker
                    </SelectItem>
                    <SelectItem value="recruiter">
                      <Briefcase className="mr-2 h-4 w-4 inline-block" /> Recruiter
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">This determines your experience in the Job Portal.</p>
              </div>

              <Button onClick={saveProfile} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about updates and activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Community Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new posts and community activity</p>
                  </div>
                  <Switch
                    checked={notifications.communityUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, communityUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Job Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about new job opportunities</p>
                  </div>
                  <Switch
                    checked={notifications.jobAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, jobAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Game Reminders</Label>
                    <p className="text-sm text-muted-foreground">Gentle reminders to play brain training games</p>
                  </div>
                  <Switch
                    checked={notifications.gameReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, gameReminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of your activity and achievements</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                  />
                </div>
              </div>

              <Button onClick={saveNotifications} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Accessibility Settings
              </CardTitle>
              <CardDescription>Customize the interface to match your accessibility needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Appearance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
              </div>

              {/* Language Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Language & Region
                </h3>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Motion & Interaction */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Type className="mr-2 h-5 w-5" />
                  Motion & Interaction
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch
                      checked={accessibility.reducedMotion}
                      onCheckedChange={(checked) => setAccessibility({ ...accessibility, reducedMotion: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Keyboard Navigation</Label>
                      <p className="text-sm text-muted-foreground">Enhanced keyboard navigation support</p>
                    </div>
                    <Switch
                      checked={accessibility.keyboardNavigation}
                      onCheckedChange={(checked) => setAccessibility({ ...accessibility, keyboardNavigation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Screen Reader Support</Label>
                      <p className="text-sm text-muted-foreground">Optimize for screen reader compatibility</p>
                    </div>
                    <Switch
                      checked={accessibility.screenReader}
                      onCheckedChange={(checked) => setAccessibility({ ...accessibility, screenReader: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Audio
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">Play sound effects for interactions</p>
                    </div>
                    <Switch
                      checked={accessibility.soundEffects}
                      onCheckedChange={(checked) => setAccessibility({ ...accessibility, soundEffects: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autoplay Media</Label>
                      <p className="text-sm text-muted-foreground">Automatically play videos and audio</p>
                    </div>
                    <Switch
                      checked={accessibility.autoplay}
                      onCheckedChange={(checked) => setAccessibility({ ...accessibility, autoplay: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveAccessibility} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Accessibility Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your account security and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={security.currentPassword}
                      onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" onClick={updatePassword}>
                    Update Password
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  <Button
                    variant="outline"
                    onClick={enable2FA}
                    className={security.twoFactorEnabled ? "bg-green-50 border-green-200" : ""}
                  >
                    {security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                  {security.twoFactorEnabled && (
                    <p className="text-sm text-green-600">✓ Two-factor authentication is enabled</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Privacy Settings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Make profile public</span>
                      <Switch
                        checked={security.profilePublic}
                        onCheckedChange={(checked) => setSecurity({ ...security, profilePublic: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Allow direct messages</span>
                      <Switch
                        checked={security.allowDirectMessages}
                        onCheckedChange={(checked) => setSecurity({ ...security, allowDirectMessages: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show online status</span>
                      <Switch
                        checked={security.showOnlineStatus}
                        onCheckedChange={(checked) => setSecurity({ ...security, showOnlineStatus: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sign Out</Label>
                <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
                <Button variant="destructive" onClick={deleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
