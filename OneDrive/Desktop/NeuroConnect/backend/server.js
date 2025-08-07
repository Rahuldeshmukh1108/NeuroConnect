const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const cluster = require("cluster")
const os = require("os")
const admin = require("firebase-admin")
require("dotenv").config()

let serviceAccount
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY environment variable:", error)
  console.error("Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is set and is a valid JSON string.")
  process.exit(1)
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "neurodivergent-fdc88.appspot.com",
  })
}

const db = admin.firestore()
const bucket = admin.storage().bucket()

if (cluster.isPrimary && process.env.NODE_ENV === "production") {
  const numCPUs = os.cpus().length
  console.log(`Master ${process.pid} is running`)
  console.log(`Forking ${numCPUs} workers...`)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code}, signal ${signal}`)
    console.log("Starting a new worker...")
    cluster.fork()
  })
} else {
  const app = express()
  const server = http.createServer(app)
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true,
  })

  const PORT = process.env.PORT || 3001

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )
  app.use(compression())
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    }),
  )

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP",
  })
  app.use("/api/", limiter)

  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true, limit: "10mb" }))

  const storage = multer.memoryStorage()
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
      const mimetype = allowedTypes.test(file.mimetype)
      if (mimetype && extname) {
        return cb(null, true)
      } else {
        cb(new Error("Invalid file type. Allowed types: jpeg, jpg, png, gif, pdf, doc, docx."))
      }
    },
  })

  const authCache = new Map()
  const AUTH_CACHE_TTL = 5 * 60 * 1000

  const authenticateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        return res.status(401).json({ error: "Access token required" })
      }

      const cached = authCache.get(token)
      if (cached && Date.now() - cached.timestamp < AUTH_CACHE_TTL) {
        req.user = cached.user
        return next()
      }

      const decodedToken = await admin.auth().verifyIdToken(token)

      authCache.set(token, {
        user: decodedToken,
        timestamp: Date.now(),
      })

      if (authCache.size > 1000) {
        const firstKey = authCache.keys().next().value
        authCache.delete(firstKey)
      }

      req.user = decodedToken
      next()
    } catch (error) {
      console.error("Auth error:", error.message)
      res.status(403).json({ error: "Invalid or expired token" })
    }
  }

  app.get("/api/health", (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
      pid: process.pid,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    }
    res.json(healthcheck)
  })

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields: email, password, and name." })
      }

      console.log(`[Backend Register] Creating user profile for: ${email}`)

      // Since Firebase user is already created on frontend, we just create the Firestore profile
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]

      if (!token) {
        return res.status(401).json({ error: "Access token required" })
      }

      const decodedToken = await admin.auth().verifyIdToken(token)
      const userRef = db.collection("users").doc(decodedToken.uid)

      await userRef.set({
        email: decodedToken.email,
        name: name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        profile: {
          avatar: "",
          bio: "",
          preferences: {},
        },
      })

      console.log(`[Backend Register] Successfully created Firestore profile for UID: ${decodedToken.uid}`)
      res.status(201).json({ message: "User profile created successfully", userId: decodedToken.uid })
    } catch (error) {
      console.error("Registration error:", error.message)
      if (error.code && error.code.startsWith("auth/")) {
        return res.status(400).json({ error: error.message })
      }
      res.status(500).json({ error: "Registration failed. Please try again." })
    }
  })

  app.post("/api/auth/social-login", authenticateToken, async (req, res) => {
    try {
      const userRef = db.collection("users").doc(req.user.uid)
      const userDoc = await userRef.get()

      if (!userDoc.exists) {
        console.log(`[Backend Social Login] Creating Firestore profile for new user with UID: ${req.user.uid}`)
        await userRef.set({
          email: req.user.email,
          name: req.user.name || req.user.display_name || "User",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          profile: {
            avatar: req.user.picture || "",
            bio: "",
            preferences: {},
          },
        })
        res.status(201).json({ message: "User profile created successfully." })
      } else {
        console.log(`[Backend Social Login] User profile already exists for UID: ${req.user.uid}`)
        res.status(200).json({ message: "User profile already exists." })
      }
    } catch (error) {
      console.error("Social login processing error:", error.message)
      res.status(500).json({ error: "Failed to process social login." })
    }
  })

  // User routes
  app.get("/api/users/profile", authenticateToken, async (req, res) => {
    try {
      const userDoc = await db.collection("users").doc(req.user.uid).get()

      if (!userDoc.exists) {
        // Create profile if it doesn't exist
        console.log(`[Backend Profile Fetch] Creating Firestore profile for user: ${req.user.uid}`)
        const userRef = db.collection("users").doc(req.user.uid)
        const newProfile = {
          email: req.user.email,
          name: req.user.name || req.user.display_name || "User",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          profile: {
            avatar: req.user.picture || "",
            bio: "",
            preferences: {},
          },
        }
        await userRef.set(newProfile)
        return res.json(newProfile)
      }

      const userData = userDoc.data()
      res.json(userData)
    } catch (error) {
      console.error("Profile fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch profile" })
    }
  })

  app.put("/api/users/profile", authenticateToken, async (req, res) => {
    try {
      const userDocRef = db.collection("users").doc(req.user.uid)
      const userDoc = await userDocRef.get()

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User profile not found" })
      }

      await userDocRef.update({
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      res.json({ message: "Profile updated successfully" })
    } catch (error) {
      console.error("Profile update error:", error.message)
      res.status(500).json({ error: "Failed to update profile" })
    }
  })

  // Jobs routes with pagination and caching
  app.get("/api/jobs", async (req, res) => {
    try {
      const { search, location, type, page = 1, limit = 20 } = req.query
      let query = db.collection("jobs")

      if (search) {
        query = query.where("title", ">=", search).where("title", "<=", search + "\uf8ff")
      }
      if (location) {
        query = query.where("location", "==", location)
      }
      if (type) {
        query = query.where("type", "==", type)
      }

      query = query.orderBy("createdAt", "desc")
      const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
      query = query.offset(offset).limit(Number.parseInt(limit))

      const snapshot = await query.get()
      const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      res.json({ jobs, page: Number.parseInt(page), limit: Number.parseInt(limit) })
    } catch (error) {
      console.error("Jobs fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch jobs" })
    }
  })

  app.post("/api/jobs", authenticateToken, async (req, res) => {
    try {
      const jobData = {
        ...req.body,
        createdBy: req.user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
      const jobRef = await db.collection("jobs").add(jobData)
      res.status(201).json({ message: "Job created successfully", jobId: jobRef.id })
    } catch (error) {
      console.error("Job creation error:", error.message)
      res.status(500).json({ error: "Failed to create job" })
    }
  })

  // Communities routes
  app.get("/api/communities", async (req, res) => {
    try {
      const { search } = req.query
      let query = db.collection("communities")

      if (search) {
        query = query.where("name", ">=", search).where("name", "<=", search + "\uf8ff")
      }

      query = query.orderBy("createdAt", "desc")
      const snapshot = await query.limit(50).get()
      const communities = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      res.json(communities)
    } catch (error) {
      console.error("Communities fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch communities" })
    }
  })

  // Chat routes
  app.get("/api/chat/:roomId/messages", authenticateToken, async (req, res) => {
    try {
      const { roomId } = req.params
      const { page = 1, limit = 50 } = req.query

      const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
      const snapshot = await db
        .collection("chats")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .offset(offset)
        .limit(Number.parseInt(limit))
        .get()

      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.json(messages)
    } catch (error) {
      console.error("Messages fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch messages" })
    }
  })

  app.post("/api/chat/:roomId/messages", authenticateToken, async (req, res) => {
    try {
      const { roomId } = req.params
      const { message } = req.body

      if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message content cannot be empty." })
      }

      const messageData = {
        message,
        userId: req.user.uid,
        userEmail: req.user.email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }

      await db.collection("chats").doc(roomId).collection("messages").add(messageData)
      res.status(201).json({ message: "Message sent successfully" })
    } catch (error) {
      console.error("Message send error:", error.message)
      res.status(500).json({ error: "Failed to send message" })
    }
  })

  // Todos routes
  app.get("/api/todos", authenticateToken, async (req, res) => {
    try {
      const snapshot = await db
        .collection("todos")
        .where("userId", "==", req.user.uid)
        .orderBy("createdAt", "desc")
        .get()

      const todos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.json(todos)
    } catch (error) {
      console.error("Todos fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch todos" })
    }
  })

  app.post("/api/todos", authenticateToken, async (req, res) => {
    try {
      const todoData = {
        ...req.body,
        userId: req.user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }
      const todoRef = await db.collection("todos").add(todoData)
      res.status(201).json({ message: "Todo created successfully", todoId: todoRef.id })
    } catch (error) {
      console.error("Todo creation error:", error.message)
      res.status(500).json({ error: "Failed to create todo" })
    }
  })

  // File upload route
  app.post("/api/upload", authenticateToken, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const originalFileName = req.file.originalname
      const safeFileName = originalFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_")
      const fileName = `${Date.now()}_${safeFileName}`
      const file = bucket.file(fileName)

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      })

      stream.on("error", (error) => {
        console.error("Upload stream error:", error.message)
        res.status(500).json({ error: "Upload failed during streaming" })
      })

      stream.on("finish", async () => {
        try {
          await file.makePublic()
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
          res.status(200).json({ url: publicUrl, fileName })
        } catch (error) {
          console.error("File public URL or Firestore update error:", error.message)
          res.status(500).json({ error: "Upload failed after streaming" })
        }
      })

      stream.end(req.file.buffer)
    } catch (error) {
      console.error("File upload error:", error.message)
      res.status(500).json({ error: "Upload failed" })
    }
  })

  // Games routes
  app.get("/api/games/scores", authenticateToken, async (req, res) => {
    try {
      const snapshot = await db.collection("gameScores").orderBy("score", "desc").limit(100).get()
      const scores = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.json(scores)
    } catch (error) {
      console.error("Scores fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch scores" })
    }
  })

  app.post("/api/games/scores", authenticateToken, async (req, res) => {
    try {
      const scoreData = {
        ...req.body,
        userId: req.user.uid,
        userEmail: req.user.email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }
      await db.collection("gameScores").add(scoreData)
      res.status(201).json({ message: "Score submitted successfully" })
    } catch (error) {
      console.error("Score submission error:", error.message)
      res.status(500).json({ error: "Failed to submit score" })
    }
  })

  // Schemes routes
  app.get("/api/schemes", async (req, res) => {
    try {
      const snapshot = await db.collection("schemes").get()
      const schemes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      res.json(schemes)
    } catch (error) {
      console.error("Schemes fetch error:", error.message)
      res.status(500).json({ error: "Failed to fetch schemes" })
    }
  })

  // Error handling middleware
  app.use((error, req, res, next) => {
    console.error("Server error (catch-all):", error.stack)
    res.status(500).json({ error: "Internal server error. Please try again later." })
  })

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" })
  })

  // Socket.IO optimization with connection pooling
  const activeConnections = new Map()
  const roomUsers = new Map()

  io.on("connection", (socket) => {
    activeConnections.set(socket.id, {
      userId: null,
      rooms: new Set(),
      lastActivity: Date.now(),
    })
    console.log(`Socket connected: ${socket.id}`)

    socket.on("user_join", (userData) => {
      const connection = activeConnections.get(socket.id)
      if (connection) {
        connection.userId = userData.id
        connection.lastActivity = Date.now()
        console.log(`User ${userData.id} joined with socket ${socket.id}`)
      }
    })

    socket.on("join_room", (roomId) => {
      socket.join(roomId)
      const connection = activeConnections.get(socket.id)
      if (connection) {
        connection.rooms.add(roomId)
        if (!roomUsers.has(roomId)) {
          roomUsers.set(roomId, new Set())
        }
        roomUsers.get(roomId).add(socket.id)
        console.log(`Socket ${socket.id} joined room ${roomId}. Room users: ${roomUsers.get(roomId).size}`)
      }
    })

    socket.on("send_message", async (roomId, message) => {
      try {
        if (!message || typeof message !== "object" || !message.text) {
          return socket.emit("message_error", { error: "Message format invalid." })
        }

        const chatRoomMessagesRef = db.collection("chats").doc(roomId).collection("messages")
        const messageRef = chatRoomMessagesRef.doc()
        const messageData = {
          ...message,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          roomId: roomId,
          userId: activeConnections.get(socket.id)?.userId || "anonymous",
        }

        await messageRef.set(messageData)
        io.to(roomId).emit("receive_message", {
          id: messageRef.id,
          ...messageData,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Socket message send error:", error.message)
        socket.emit("message_error", { error: "Failed to send message via socket." })
      }
    })

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`)
      const connection = activeConnections.get(socket.id)
      if (connection && connection.rooms) {
        connection.rooms.forEach((roomId) => {
          const users = roomUsers.get(roomId)
          if (users) {
            users.delete(socket.id)
            if (users.size === 0) {
              roomUsers.delete(roomId)
            }
          }
        })
      }
      activeConnections.delete(socket.id)
    })
  })

  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully")
    server.close(() => {
      console.log("HTTP server closed.")
      process.exit(0)
    })
    setTimeout(() => {
      console.error("Forcing shutdown after timeout.")
      process.exit(1)
    }, 10000)
  })

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully")
    server.close(() => {
      console.log("HTTP server closed.")
      process.exit(0)
    })
    setTimeout(() => {
      console.error("Forcing shutdown after timeout.")
      process.exit(1)
    }, 10000)
  })

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`)
  })
}
