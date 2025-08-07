"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageSquare } from "lucide-react"
import { io, type Socket } from "socket.io-client"
import { useToast } from "@/hooks/use-toast"

// Re-using interfaces from jobs page for consistency
interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Job {
  id: string
  title: string
  company: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  jobId: string
  content: string
  timestamp: Date
}

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  currentUser: UserProfile
  otherUser: UserProfile
  job: Job
}

// Mock messages (replace with Firestore later)
let mockMessages: Message[] = []
if (typeof window !== "undefined") {
  const storedMessages = localStorage.getItem("mockMessages")
  if (storedMessages) {
    mockMessages = JSON.parse(storedMessages, (key, value) => {
      if (key === "timestamp") {
        return new Date(value)
      }
      return value
    })
  }
}

const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose, currentUser, otherUser, job }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // Filter messages relevant to this specific chat (between these two users for this job)
      const relevantMessages = mockMessages.filter(
        (msg) =>
          msg.jobId === job.id &&
          ((msg.senderId === currentUser.id && msg.receiverId === otherUser.id) ||
            (msg.senderId === otherUser.id && msg.receiverId === currentUser.id)),
      )
      setMessages(relevantMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()))

      // Initialize Socket.IO client
      // Replace with your actual backend URL
      socketRef.current = io("http://localhost:3001") // Example: Your Socket.IO server URL

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO server")
        // Join a room specific to this chat (e.g., based on job ID and user IDs)
        const roomId = [currentUser.id, otherUser.id, job.id].sort().join("-")
        socketRef.current?.emit("join_room", roomId)
      })

      socketRef.current.on("receive_message", (message: Message) => {
        // Ensure the received message is for the current chat
        const currentRoomId = [currentUser.id, otherUser.id, job.id].sort().join("-")
        const messageRoomId = [message.senderId, message.receiverId, message.jobId].sort().join("-")

        if (currentRoomId === messageRoomId) {
          setMessages((prevMessages) => {
            const newMsg = { ...message, timestamp: new Date(message.timestamp) }
            const updatedMessages = [...prevMessages, newMsg]
            localStorage.setItem("mockMessages", JSON.stringify(updatedMessages))
            return updatedMessages
          })
        }
      })

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server")
      })

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket.IO connection error:", err.message)
        toast({
          title: "Chat Error",
          description: "Could not connect to chat server. Please try again later.",
          variant: "destructive",
        })
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isOpen, currentUser, otherUser, job, toast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      jobId: job.id,
      content: newMessage.trim(),
      timestamp: new Date(),
    }

    // Emit message to server
    const roomId = [currentUser.id, otherUser.id, job.id].sort().join("-")
    socketRef.current?.emit("send_message", roomId, message)

    // Optimistically update UI
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message]
      localStorage.setItem("mockMessages", JSON.stringify(updatedMessages))
      return updatedMessages
    })
    setNewMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Chat with {otherUser.name}
          </DialogTitle>
          <DialogDescription>
            Regarding job: <span className="font-semibold">{job.title}</span> at{" "}
            <span className="font-semibold">{job.company}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md bg-muted/20">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Start your conversation!</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.senderId === currentUser.id ? "justify-end" : "justify-start"
                }`}
              >
                {msg.senderId !== currentUser.id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.senderId === currentUser.id
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-background text-foreground rounded-bl-none border"
                  }`}
                >
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
        <div className="flex gap-2 pt-4">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatDialog
