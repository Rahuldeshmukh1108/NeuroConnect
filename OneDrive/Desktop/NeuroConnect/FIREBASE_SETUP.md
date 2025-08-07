# Firebase Setup Guide for NeuroConnect Platform

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `neuroconnect-platform`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

## 3. Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to your users
5. Click "Done"

## 4. Enable Storage

1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore
5. Click "Done"

## 5. Generate Service Account Key

1. Go to "Project Settings" (gear icon)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebase-service-account-key.json`
6. Place it in your backend root directory
7. **NEVER commit this file to version control**

## 6. Get Web App Configuration

1. In Project Settings, go to "General" tab
2. Scroll down to "Your apps"
3. Click "Web" icon to add web app
4. Enter app nickname: "NeuroConnect Web"
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the configuration object

## 7. Firestore Security Rules

Replace the default rules with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Jobs are readable by all authenticated users
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.postedByUserId == request.auth.uid);
    }
    
    // Applications
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        (resource.data.seekerId == request.auth.uid || 
         get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.postedByUserId == request.auth.uid);
    }
    
    // Communities are readable by all
    match /communities/{communityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Community members
    match /community_members/{memberId} {
      allow read, write: if request.auth != null;
    }
    
    // Posts are readable by community members
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Messages are readable by participants
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Todos are private to user
    match /todos/{todoId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Schemes are readable by all
    match /schemes/{schemeId} {
      allow read: if request.auth != null;
    }
    
    // Game scores are private to user
    match /game_scores/{scoreId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Post likes
    match /post_likes/{likeId} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 8. Storage Security Rules

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    
    // Allow authenticated users to upload resumes
    match /resumes/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024
        && (request.resource.contentType == 'application/pdf' ||
            request.resource.contentType == 'application/msword' ||
            request.resource.contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
  }
}
\`\`\`

## 9. Firestore Data Structure

### Collections Structure:

\`\`\`
/users/{userId}
  - id: string
  - name: string
  - email: string
  - createdAt: timestamp
  - profile: {
      bio: string
      location: string
      skills: array
      phone: string
      portfolio: string
      resumeUrl: string
      avatar: string
      role: string (jobSeeker|recruiter)
    }
  - settings: {
      theme: string
      fontSize: string
      language: string
      highContrast: boolean
      notifications: object
    }

/jobs/{jobId}
  - title: string
  - company: string
  - location: string
  - salary: string
  - type: string
  - description: string
  - requirements: array
  - tags: array
  - postedDate: timestamp
  - isRemote: boolean
  - postedByUserId: string
  - isActive: boolean
  - applicantCount: number

/applications/{applicationId}
  - jobId: string
  - seekerId: string
  - status: string
  - appliedDate: timestamp
  - coverLetter: string
  - interviewDetails: object (optional)

/communities/{communityId}
  - name: string
  - description: string
  - memberCount: number
  - isPrivate: boolean
  - tags: array
  - avatar: string
  - creatorId: string
  - isActive: boolean
  - createdAt: timestamp

/community_members/{memberId}
  - communityId: string
  - userId: string
  - role: string (admin|moderator|member)
  - joinedAt: timestamp

/posts/{postId}
  - authorId: string
  - content: string
  - communityId: string
  - isAnonymous: boolean
  - timestamp: timestamp
  - likes: number
  - comments: number

/messages/{messageId}
  - senderId: string
  - senderName: string
  - senderAvatar: string
  - content: string
  - timestamp: timestamp
  - roomId: string
  - isAnonymous: boolean (optional)

/todos/{todoId}
  - userId: string
  - title: string
  - description: string
  - status: string (todo|in-progress|done)
  - priority: string (low|medium|high)
  - dueDate: timestamp (optional)
  - createdAt: timestamp
  - updatedAt: timestamp

/schemes/{schemeId}
  - title: string
  - description: string
  - category: string
  - eligibility: array
  - benefits: array
  - applicationProcess: string
  - tags: array
  - isActive: boolean
  - createdAt: timestamp

/game_scores/{scoreId}
  - userId: string
  - gameType: string
  - score: number
  - level: number
  - duration: number
  - timestamp: timestamp

/post_likes/{likeId}
  - postId: string
  - userId: string
  - timestamp: timestamp
\`\`\`

## 10. Environment Variables

Create `.env` file in your backend directory:

\`\`\`env
FIREBASE_PROJECT_ID=your-project-id
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
\`\`\`

## 11. Frontend Firebase Configuration

Create `lib/firebase.ts` in your Next.js app:

\`\`\`typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
\`\`\`

## 12. Install Dependencies

Backend:
\`\`\`bash
npm install express socket.io cors multer firebase-admin bcryptjs jsonwebtoken dotenv helmet express-rate-limit compression
npm install -D nodemon jest
\`\`\`

Frontend (add to existing):
\`\`\`bash
npm install firebase
\`\`\`

## 13. Start Development

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Backend runs on http://localhost:3001
4. Frontend runs on http://localhost:3000

## 14. Testing the Setup

1. Register a new user
2. Create a job posting
3. Apply to a job
4. Join a community
5. Send messages in chat
6. Create todos
7. Upload avatar

## Security Considerations

1. Never commit service account keys
2. Use environment variables for sensitive data
3. Implement proper validation on both client and server
4. Set up proper CORS policies
5. Use HTTPS in production
6. Implement rate limiting
7. Validate file uploads
8. Sanitize user inputs
