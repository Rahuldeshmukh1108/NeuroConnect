"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Send,
  Heart,
  MessageSquare,
  UserPlus,
  Shield,
  Globe,
  Lock,
  Search,
  Hash,
  Plus,
  Trash2,
  MessageCircle,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { io, type Socket } from "socket.io-client"

interface Community {
  id: string
  name: string
  description: string
  memberCount: number
  isPrivate: boolean
  tags: string[]
  avatar: string
  creatorId?: string // To track who created it for deletion
}

interface Post {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  timestamp: Date
  likes: number
  comments: number
  communityId: string // "global" for global feed, or community ID
  isAnonymous?: boolean
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  chatRoomId: string // Unique ID for DM or group chat
  isAnonymous?: boolean
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
}

// Mock current user (replace with actual auth user later)
const currentUser: UserProfile = {
  id: "user1",
  name: "Current User",
  email: "current@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

// Mock data for users (for searching people)
const mockUsers: UserProfile[] = [
  currentUser,
  { id: "user2", name: "Alex", email: "alex@example.com", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "user3", name: "Jordan", email: "jordan@example.com", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "user4", name: "Sarah M.", email: "sarah@example.com", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "user5", name: "Mike Chen", email: "mike@example.com", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "user6", name: "Emily R.", email: "emily@example.com", avatar: "/placeholder.svg?height=32&width=32" },
]

// Initial mock data for communities
const initialCommunities: Community[] = [
  {
    id: "global",
    name: "Global Neurodivergent Community",
    description: "The main community for all NeuroConnect users.",
    memberCount: 5000,
    isPrivate: false,
    tags: ["Global", "All Users", "Support"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "1",
    name: "Autism Support Network",
    description: "A supportive community for individuals on the autism spectrum and their families.",
    memberCount: 1247,
    isPrivate: false,
    tags: ["Autism", "Support", "Family"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "ADHD Warriors",
    description: "Connect with others who understand the ADHD journey. Share tips, strategies, and victories.",
    memberCount: 892,
    isPrivate: false,
    tags: ["ADHD", "Productivity", "Tips"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Neurodivergent Professionals",
    description: "Career advice, networking, and professional development for neurodivergent individuals.",
    memberCount: 634,
    isPrivate: true,
    tags: ["Career", "Professional", "Networking"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Sensory Processing Support",
    description: "Understanding and managing sensory processing differences together.",
    memberCount: 445,
    isPrivate: false,
    tags: ["Sensory", "Processing", "Coping"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Initial mock data for posts
const initialPosts: Post[] = [
  {
    id: "p1",
    authorId: "user4",
    authorName: "Sarah M.",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    content:
      "Just wanted to share that I finally got the job I've been working towards! The interview accommodations made all the difference. Don't give up on your dreams! 💪",
    timestamp: new Date("2024-01-20T10:30:00"),
    likes: 24,
    comments: 8,
    communityId: "global", // Example: posted to global feed
  },
  {
    id: "p2",
    authorId: "user1", // Current user posting anonymously
    authorName: "Anonymous",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    content:
      "Having a really tough day with sensory overload. The grocery store was too much today. Any tips for managing these situations?",
    timestamp: new Date("2024-01-20T14:15:00"),
    likes: 12,
    comments: 15,
    communityId: "4", // Posted to Sensory Processing Support
    isAnonymous: true,
  },
  {
    id: "p3",
    authorId: "user5",
    authorName: "Mike Chen",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    content:
      "Found this amazing productivity app that works great with my ADHD brain. It breaks tasks into tiny steps and has great visual cues. Happy to share the link if anyone's interested!",
    timestamp: new Date("2024-01-20T16:45:00"),
    likes: 18,
    comments: 6,
    communityId: "2", // Posted to ADHD Warriors
  },
  {
    id: "p4",
    authorId: "user2",
    authorName: "Alex",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    content: "Welcome everyone to the NeuroConnect community hub!",
    timestamp: new Date("2024-01-19T09:00:00"),
    likes: 30,
    comments: 5,
    communityId: "global",
  },
]

// Initial mock data for chat messages (personal and group)
// Stored as a Map where key is chatRoomId (e.g., "user1-user2" or "community-1")
const initialChatMessages = new Map<string, ChatMessage[]>()
initialChatMessages.set("user1-user2", [
  {
    id: "chat1-1",
    senderId: "user2",
    senderName: "Alex",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Hey! How's your day going?",
    timestamp: new Date("2024-01-20T09:00:00"),
    chatRoomId: "user1-user2",
  },
  {
    id: "chat1-2",
    senderId: "user1",
    senderName: "You",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Pretty good! Just finished my morning routine. How about you?",
    timestamp: new Date("2024-01-20T09:05:00"),
    chatRoomId: "user1-user2",
  },
  {
    id: "chat1-3",
    senderId: "user2",
    senderName: "Alex",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Same here! I'm trying out that new task management technique we talked about.",
    timestamp: new Date("2024-01-20T09:10:00"),
    chatRoomId: "user1-user2",
  },
])
initialChatMessages.set("community-global", [
  {
    id: "gc1-1",
    senderId: "user4",
    senderName: "Sarah M.",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Does anyone else struggle with phone calls? I get so anxious before making them.",
    timestamp: new Date("2024-01-20T14:30:00"),
    chatRoomId: "community-global",
  },
  {
    id: "gc1-2",
    senderId: "user6",
    senderName: "Emily R.",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "Yes! I always write down what I want to say first. It helps me feel more prepared.",
    timestamp: new Date("2024-01-20T14:32:00"),
    chatRoomId: "community-global",
  },
  {
    id: "gc1-3",
    senderId: "user1",
    senderName: "Anonymous",
    senderAvatar: "/placeholder.svg?height=32&width=32",
    content: "That's a great tip! I also practice the conversation in my head beforehand.",
    timestamp: new Date("2024-01-20T14:35:00"),
    chatRoomId: "community-global",
    isAnonymous: true,
  },
])

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const [communities, setCommunities] = useState<Community[]>(initialCommunities)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() => {
    // Auto-join global community and any previously joined ones from mock
    const stored = localStorage.getItem("joinedCommunityIds")
    return stored ? JSON.parse(stored) : ["global", "1", "2"]
  })
  const [newPostContent, setNewPostContent] = useState("")
  const [isPostAnonymous, setIsPostAnonymous] = useState(false)
  const [selectedPostCommunityId, setSelectedPostCommunityId] = useState("global")
  const [communitySearchTerm, setCommunitySearchTerm] = useState("")
  const [peopleSearchTerm, setPeopleSearchTerm] = useState("")

  // Chat states
  const [chatMessages, setChatMessages] = useState<Map<string, ChatMessage[]>>(() => {
    const stored = localStorage.getItem("communityChatMessages")
    return stored ? new Map(JSON.parse(stored)) : initialChatMessages
  })
  const [currentChatMessage, setCurrentChatMessage] = useState("")
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null)
  const [selectedChatPartner, setSelectedChatPartner] = useState<UserProfile | null>(null) // For DMs
  const [selectedGroupChatCommunity, setSelectedGroupChatCommunity] = useState<Community | null>(null) // For group chats
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const { toast } = useToast()

  // Community creation dialog states
  const [isCreateCommunityDialogOpen, setIsCreateCommunityDialogOpen] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [newCommunityIsPrivate, setNewCommunityIsPrivate] = useState(false)
  const [newCommunityTags, setNewCommunityTags] = useState("")

  // State for comment input
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({})

  // Effect for Socket.IO connection and message handling
  useEffect(() => {
    // Explicitly define transports and forceNew for robustness
    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      forceNew: true,
      reconnection: true, // Ensure reconnection attempts
      reconnectionAttempts: Number.POSITIVE_INFINITY, // Unlimited attempts
      reconnectionDelay: 1000, // Start with 1 second delay
      reconnectionDelayMax: 5000, // Max 5 seconds delay
      randomizationFactor: 0.5, // Randomize delay
    })

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server for community chat")
      // Join rooms for all joined communities and active DMs
      joinedCommunityIds.forEach((id) => {
        socketRef.current?.emit("join_room", `community-${id}`)
      })
      // For DMs, you'd typically join rooms for active conversations
      // For simplicity, we'll just handle messages for the selected chat
    })

    socketRef.current.on("receive_message", (message: ChatMessage) => {
      console.log("Received message:", message)
      setChatMessages((prev) => {
        const newMap = new Map(prev)
        const roomMessages = newMap.get(message.chatRoomId) || []
        const updatedMessages = [...roomMessages, { ...message, timestamp: new Date(message.timestamp) }]
        newMap.set(message.chatRoomId, updatedMessages)
        localStorage.setItem("communityChatMessages", JSON.stringify(Array.from(newMap.entries())))
        return newMap
      })
    })

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server")
    })

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message)
      toast({
        title: "Chat Error",
        description: "Could not connect to chat server. Please ensure the backend server is running.",
        variant: "destructive",
      })
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [joinedCommunityIds, toast]) // Reconnect if joined communities change

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, selectedChatRoomId])

  // Persist joined communities
  useEffect(() => {
    localStorage.setItem("joinedCommunityIds", JSON.stringify(joinedCommunityIds))
  }, [joinedCommunityIds])

  const joinCommunity = (communityId: string) => {
    setJoinedCommunityIds((prev) => {
      const newJoined = [...prev, communityId]
      socketRef.current?.emit("join_room", `community-${communityId}`) // Join the socket room
      return newJoined
    })
    toast({
      title: "Joined community",
      description: "You've successfully joined the community!",
    })
  }

  const leaveCommunity = (communityId: string) => {
    setJoinedCommunityIds((prev) => prev.filter((id) => id !== communityId))
    toast({
      title: "Left community",
      description: "You've left the community.",
    })
    // Optionally, leave the socket room here if your backend supports it
  }

  const deleteCommunity = (communityId: string) => {
    setCommunities((prev) => prev.filter((c) => c.id !== communityId))
    setPosts((prev) => prev.filter((p) => p.communityId !== communityId)) // Remove posts from this community
    setJoinedCommunityIds((prev) => prev.filter((id) => id !== communityId)) // Ensure user leaves if joined
    setChatMessages((prev) => {
      const newMap = new Map(prev)
      newMap.delete(`community-${communityId}`) // Remove group chat messages
      localStorage.setItem("communityChatMessages", JSON.stringify(Array.from(newMap.entries())))
      return newMap
    })
    toast({
      title: "Community Deleted",
      description: "The community has been successfully deleted.",
    })
  }

  const createPost = () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: isPostAnonymous ? "Anonymous" : currentUser.name,
      authorAvatar: isPostAnonymous
        ? "/placeholder.svg?height=32&width=32"
        : currentUser.avatar || "/placeholder.svg?height=32&width=32",
      content: newPostContent.trim(),
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      communityId: selectedPostCommunityId,
      isAnonymous: isPostAnonymous,
    }

    setPosts((prev) => [newPost, ...prev]) // Add new post to the top
    toast({
      title: "Post created",
      description: "Your post has been shared with the community!",
    })
    setNewPostContent("")
    setIsPostAnonymous(false)
  }

  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
    toast({
      title: "Post liked!",
      description: "You've liked this post.",
      duration: 1500,
    })
  }

  const handleCommentPost = (postId: string) => {
    const commentText = commentInput[postId]?.trim()
    if (!commentText) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive",
        duration: 1500,
      })
      return
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post)),
    )
    setCommentInput((prev) => ({ ...prev, [postId]: "" })) // Clear input
    toast({
      title: "Comment added!",
      description: "Your comment has been added.",
      duration: 1500,
    })
    // In a real app, you would send the comment content to a backend here
    console.log(`Comment on post ${postId}: "${commentText}"`)
  }

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInput((prev) => ({ ...prev, [postId]: value }))
  }

  const handleSendMessage = useCallback(() => {
    if (!currentChatMessage.trim() || !selectedChatRoomId) return

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || "/placeholder.svg?height=32&width=32",
      content: currentChatMessage.trim(),
      timestamp: new Date(),
      chatRoomId: selectedChatRoomId,
    }

    socketRef.current?.emit("send_message", selectedChatRoomId, message)

    setChatMessages((prev) => {
      const newMap = new Map(prev)
      const roomMessages = newMap.get(selectedChatRoomId) || []
      const updatedMessages = [...roomMessages, message]
      newMap.set(selectedChatRoomId, updatedMessages)
      localStorage.setItem("communityChatMessages", JSON.stringify(Array.from(newMap.entries())))
      return newMap
    })
    setCurrentChatMessage("")
  }, [currentChatMessage, selectedChatRoomId, currentUser])

  const startPersonalChat = (user: UserProfile) => {
    const chatRoomId = [currentUser.id, user.id].sort().join("-")
    setSelectedChatRoomId(chatRoomId)
    setSelectedChatPartner(user)
    setSelectedGroupChatCommunity(null)
    setActiveTab("chat")
    // Ensure the room is joined on the socket server
    socketRef.current?.emit("join_room", chatRoomId)
  }

  const startGroupChat = (community: Community) => {
    const chatRoomId = `community-${community.id}`
    setSelectedChatRoomId(chatRoomId)
    setSelectedGroupChatCommunity(community)
    setSelectedChatPartner(null)
    setActiveTab("chat")
    // Ensure the room is joined on the socket server
    socketRef.current?.emit("join_room", chatRoomId)
  }

  const handleCreateCommunity = () => {
    if (!newCommunityName.trim() || !newCommunityDescription.trim()) {
      toast({
        title: "Error",
        description: "Community name and description cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const newCommunity: Community = {
      id: `comm-${Date.now()}`,
      name: newCommunityName.trim(),
      description: newCommunityDescription.trim(),
      memberCount: 1, // Creator is the first member
      isPrivate: newCommunityIsPrivate,
      tags: newCommunityTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      avatar: `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(newCommunityName.trim())}`,
      creatorId: currentUser.id,
    }

    setCommunities((prev) => [...prev, newCommunity])
    setJoinedCommunityIds((prev) => [...prev, newCommunity.id]) // Creator automatically joins
    setIsCreateCommunityDialogOpen(false)
    setNewCommunityName("")
    setNewCommunityDescription("")
    setNewCommunityIsPrivate(false)
    setNewCommunityTags("")
    toast({
      title: "Community Created",
      description: `"${newCommunity.name}" has been successfully created!`,
    })
  }

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(communitySearchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(communitySearchTerm.toLowerCase()) ||
      community.tags.some((tag) => tag.toLowerCase().includes(communitySearchTerm.toLowerCase())),
  )

  const filteredUsers = mockUsers.filter(
    (user) => user.id !== currentUser.id && user.name.toLowerCase().includes(peopleSearchTerm.toLowerCase()),
  )

  const getChatListItems = () => {
    const chatList: {
      id: string
      type: "personal" | "group"
      name: string
      avatar: string
      lastMessageContent: string
      lastMessageTimestamp: Date
      partnerId?: string // For personal chats
      communityId?: string // For group chats
    }[] = []

    // Add personal chats
    mockUsers.forEach((user) => {
      if (user.id === currentUser.id) return
      const chatRoomId = [currentUser.id, user.id].sort().join("-")
      const messages = chatMessages.get(chatRoomId)
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        chatList.push({
          id: chatRoomId,
          type: "personal",
          name: user.name,
          avatar: user.avatar || "/placeholder.svg",
          lastMessageContent: lastMessage.content,
          lastMessageTimestamp: lastMessage.timestamp,
          partnerId: user.id,
        })
      }
    })

    // Add group chats from joined communities
    communities.forEach((community) => {
      if (joinedCommunityIds.includes(community.id)) {
        const chatRoomId = `community-${community.id}`
        const messages = chatMessages.get(chatRoomId)
        if (messages && messages.length > 0) {
          const lastMessage = messages[messages.length - 1]
          chatList.push({
            id: chatRoomId,
            type: "group",
            name: community.name,
            avatar: community.avatar || "/placeholder.svg",
            lastMessageContent: lastMessage.content,
            lastMessageTimestamp: lastMessage.timestamp,
            communityId: community.id,
          })
        } else if (community.id === "global") {
          // Always show global chat even if no messages yet
          chatList.push({
            id: chatRoomId,
            type: "group",
            name: community.name,
            avatar: community.avatar || "/placeholder.svg",
            lastMessageContent: "Start chatting in the global community!",
            lastMessageTimestamp: new Date(),
            communityId: community.id,
          })
        }
      }
    })

    // Sort by last message timestamp
    return chatList.sort((a, b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime())
  }

  const currentChatMessages = selectedChatRoomId ? chatMessages.get(selectedChatRoomId) || [] : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground mt-2">
          Connect with like-minded individuals in supportive communities with real-time chat.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 lg:grid-cols-4">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
          <TabsTrigger value="communities">Discover</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        {/* Community Feed (Global) */}
        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
              <CardDescription>Share your thoughts, experiences, or ask for support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share your thoughts, ask questions, or celebrate your wins..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous-post"
                      checked={isPostAnonymous}
                      onChange={(e) => setIsPostAnonymous(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="anonymous-post" className="text-sm">
                      Post anonymously
                    </Label>
                  </div>

                  <select
                    value={selectedPostCommunityId}
                    onChange={(e) => setSelectedPostCommunityId(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                    aria-label="Select community to post to"
                  >
                    <option value="global">Global Neurodivergent Community</option>
                    {communities
                      .filter((c) => c.id !== "global" && joinedCommunityIds.includes(c.id))
                      .map((community) => (
                        <option key={community.id} value={community.id}>
                          {community.name}
                        </option>
                      ))}
                  </select>
                </div>

                <Button onClick={createPost} disabled={!newPostContent.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Posts (Global Feed)</h2>
            {posts.filter((post) => post.communityId === "global").length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No posts in the global feed yet. Be the first to share!
              </p>
            )}
            {posts
              .filter((post) => post.communityId === "global")
              .map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.authorName} />
                        <AvatarFallback>{post.isAnonymous ? "?" : post.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{post.isAnonymous ? "Anonymous" : post.authorName}</h3>
                          {post.isAnonymous && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="mr-1 h-3 w-3" />
                              Anonymous
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">{post.timestamp.toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          in {communities.find((c) => c.id === post.communityId)?.name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="leading-relaxed">{post.content}</p>

                    <div className="flex items-center space-x-4 pt-2 border-t">
                      <Button variant="ghost" size="sm" onClick={() => handleLikePost(post.id)}>
                        <Heart className="mr-2 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {post.comments}
                      </Button>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder="Add a comment..."
                        value={commentInput[post.id] || ""}
                        onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleCommentPost(post.id)}
                      />
                      <Button onClick={() => handleCommentPost(post.id)} disabled={!commentInput[post.id]?.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Add comment</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* My Communities (Joined Communities Feed) */}
        <TabsContent value="my-communities" className="space-y-6">
          <h2 className="text-xl font-semibold">My Joined Communities</h2>
          {joinedCommunityIds.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              You haven't joined any communities yet. Discover new ones!
            </p>
          ) : (
            <div className="grid gap-6">
              {communities
                .filter((c) => joinedCommunityIds.includes(c.id))
                .map((community) => (
                  <Card key={community.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={community.avatar || "/placeholder.svg"} alt={community.name} />
                            <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-xl">{community.name}</CardTitle>
                              {community.isPrivate ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Globe className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <CardDescription className="text-base">{community.description}</CardDescription>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Users className="mr-1 h-4 w-4" />
                                {community.memberCount.toLocaleString()} members
                              </div>
                              <div className="flex items-center">
                                {community.isPrivate ? (
                                  <>
                                    <Lock className="mr-1 h-4 w-4" />
                                    Private
                                  </>
                                ) : (
                                  <>
                                    <Globe className="mr-1 h-4 w-4" />
                                    Public
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {community.id !== "global" && ( // Cannot leave global community
                            <Button variant="outline" onClick={() => leaveCommunity(community.id)}>
                              Leave
                            </Button>
                          )}
                          <Button onClick={() => startGroupChat(community)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Chat
                          </Button>
                          {community.creatorId === currentUser.id && ( // Only creator can delete
                            <Button variant="destructive" size="icon" onClick={() => deleteCommunity(community.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete community</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {community.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Hash className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 space-y-3">
                        <h3 className="font-semibold">Posts in {community.name}</h3>
                        {posts.filter((post) => post.communityId === community.id).length === 0 && (
                          <p className="text-muted-foreground text-sm">No posts in this community yet.</p>
                        )}
                        {posts
                          .filter((post) => post.communityId === community.id)
                          .map((post) => (
                            <Card key={post.id} className="p-3">
                              <div className="flex items-start space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.authorName} />
                                  <AvatarFallback>{post.isAnonymous ? "?" : post.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium text-sm">
                                      {post.isAnonymous ? "Anonymous" : post.authorName}
                                    </span>
                                    {post.isAnonymous && (
                                      <Badge variant="secondary" className="text-xs mb-1">
                                        <Shield className="mr-1 h-3 w-3" />
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {post.timestamp.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm leading-snug">{post.content}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1"
                                  onClick={() => handleLikePost(post.id)}
                                >
                                  <Heart className="mr-1 h-3 w-3" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="h-auto p-1">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  {post.comments}
                                </Button>
                              </div>
                              <div className="flex space-x-2 mt-2">
                                <Input
                                  placeholder="Add a comment..."
                                  value={commentInput[post.id] || ""}
                                  onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && handleCommentPost(post.id)}
                                />
                                <Button
                                  onClick={() => handleCommentPost(post.id)}
                                  disabled={!commentInput[post.id]?.trim()}
                                >
                                  <Send className="h-4 w-4" />
                                  <span className="sr-only">Add comment</span>
                                </Button>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Discover Communities */}
        <TabsContent value="communities" className="space-y-6">
          {/* Search Communities */}
          <Card>
            <CardHeader>
              <CardTitle>Discover Communities</CardTitle>
              <CardDescription>Find and join communities that match your interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  value={communitySearchTerm}
                  onChange={(e) => setCommunitySearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search communities"
                />
              </div>
              <Button onClick={() => setIsCreateCommunityDialogOpen(true)} className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Community
              </Button>
            </CardContent>
          </Card>

          {/* Communities List */}
          <div className="grid gap-6">
            {filteredCommunities.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No communities found matching your search.</p>
            )}
            {filteredCommunities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={community.avatar || "/placeholder.svg"} alt={community.name} />
                        <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-xl">{community.name}</CardTitle>
                          {community.isPrivate ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <CardDescription className="text-base">{community.description}</CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {community.memberCount.toLocaleString()} members
                          </div>
                          <div className="flex items-center">
                            {community.isPrivate ? (
                              <>
                                <Lock className="mr-1 h-4 w-4" />
                                Private
                              </>
                            ) : (
                              <>
                                <Globe className="mr-1 h-4 w-4" />
                                Public
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {community.id !== "global" && ( // Cannot join/leave global community explicitly
                      <Button
                        variant={joinedCommunityIds.includes(community.id) ? "outline" : "default"}
                        onClick={() =>
                          joinedCommunityIds.includes(community.id)
                            ? leaveCommunity(community.id)
                            : joinCommunity(community.id)
                        }
                      >
                        {joinedCommunityIds.includes(community.id) ? (
                          "Leave"
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Join
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {community.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        <Hash className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Search People */}
        <TabsContent value="people" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect with People</CardTitle>
              <CardDescription>Search for users and start a personal chat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name..."
                  value={peopleSearchTerm}
                  onChange={(e) => setPeopleSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search users"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredUsers.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No users found matching your search.</p>
            )}
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button onClick={() => startPersonalChat(user)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Real-Time Chat Section */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {" "}
            {/* Adjust height as needed */}
            {/* Chat List Sidebar */}
            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>Your personal and group chats</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  {getChatListItems().length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No active chats. Start a conversation!</p>
                  )}
                  {getChatListItems().map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                        selectedChatRoomId === chat.id ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        if (chat.type === "personal") {
                          startPersonalChat(mockUsers.find((u) => u.id === chat.partnerId)!)
                        } else {
                          startGroupChat(communities.find((c) => c.id === chat.communityId)!)
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-1">
                          {chat.name}
                          {chat.type === "group" && <Users className="h-3 w-3 text-muted-foreground" />}
                          {chat.type === "personal" && <User className="h-3 w-3 text-muted-foreground" />}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessageContent}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chat.lastMessageTimestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Chat Window */}
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader>
                {selectedChatRoomId ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          selectedChatPartner?.avatar ||
                          selectedGroupChatCommunity?.avatar ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={selectedChatPartner?.name || selectedGroupChatCommunity?.name || "Chat"}
                      />
                      <AvatarFallback>
                        {(selectedChatPartner?.name || selectedGroupChatCommunity?.name || "C").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {selectedChatPartner?.name || selectedGroupChatCommunity?.name || "Select a Chat"}
                      </CardTitle>
                      <CardDescription>{selectedChatPartner ? "Personal Chat" : "Group Chat"}</CardDescription>
                    </div>
                  </div>
                ) : (
                  <CardTitle>Select a Chat</CardTitle>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                {selectedChatRoomId ? (
                  <>
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        {currentChatMessages.length === 0 ? (
                          <div className="text-center text-muted-foreground py-8">Start your conversation!</div>
                        ) : (
                          currentChatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-3 ${
                                msg.senderId === currentUser.id ? "justify-end" : "justify-start"
                              }`}
                            >
                              {msg.senderId !== currentUser.id && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={msg.senderAvatar || "/placeholder.svg"} alt={msg.senderName} />
                                  <AvatarFallback>
                                    {msg.isAnonymous ? "?" : msg.senderName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  msg.senderId === currentUser.id
                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                    : "bg-muted text-foreground rounded-bl-none border"
                                }`}
                              >
                                {msg.isAnonymous && msg.senderId !== currentUser.id && (
                                  <Badge variant="secondary" className="text-xs mb-1">
                                    <Shield className="mr-1 h-3 w-3" />
                                    Anonymous
                                  </Badge>
                                )}
                                {msg.senderId !== currentUser.id && !msg.isAnonymous && (
                                  <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-70 mt-1 block text-right">
                                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              {msg.senderId === currentUser.id && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                                  <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2 pt-4">
                      <Input
                        placeholder="Type your message..."
                        value={currentChatMessage}
                        onChange={(e) => setCurrentChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage()
                          }
                        }}
                        className="flex-1"
                        aria-label="Type your message"
                      />
                      <Button onClick={handleSendMessage} disabled={currentChatMessage.trim() === ""}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageCircle className="h-16 w-16 mb-4" />
                    <p className="text-lg">Select a chat from the left to start messaging.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Community Dialog */}
      <Dialog open={isCreateCommunityDialogOpen} onOpenChange={setIsCreateCommunityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Community</DialogTitle>
            <DialogDescription>Fill in the details to create your own community.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="community-name" className="text-right">
                Name
              </Label>
              <Input
                id="community-name"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="community-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="community-description"
                value={newCommunityDescription}
                onChange={(e) => setNewCommunityDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="community-tags" className="text-right">
                Tags (comma-separated)
              </Label>
              <Input
                id="community-tags"
                value={newCommunityTags}
                onChange={(e) => setNewCommunityTags(e.target.value)}
                placeholder="e.g., ADHD, Support, Career"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="community-private" className="text-right">
                Private
              </Label>
              <input
                type="checkbox"
                id="community-private"
                checked={newCommunityIsPrivate}
                onChange={(e) => setNewCommunityIsPrivate(e.target.checked)}
                className="col-span-3 h-4 w-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCommunityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCommunity}>Create Community</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
