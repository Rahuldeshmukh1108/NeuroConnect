# 🚀 Complete Installation Guide for NeuroConnect Platform

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- Firebase account

## Step-by-Step Installation

### 1. Clone or Setup Project Structure
\`\`\`bash
# Create project directory
mkdir neuroconnect-platform
cd neuroconnect-platform

# Initialize git (optional)
git init
\`\`\`

### 2. Frontend Dependencies Installation

#### Core Next.js and React
\`\`\`bash
npm install next@14.2.16 react@^18 react-dom@^18
\`\`\`

#### UI Components (Radix UI)
\`\`\`bash
# Install all Radix UI components at once
npm install @radix-ui/react-accordion@1.2.2 @radix-ui/react-alert-dialog@1.1.4 @radix-ui/react-aspect-ratio@1.1.1 @radix-ui/react-avatar@1.1.2 @radix-ui/react-checkbox@1.1.3 @radix-ui/react-collapsible@1.1.2 @radix-ui/react-context-menu@2.2.4 @radix-ui/react-dialog@1.1.4 @radix-ui/react-dropdown-menu@2.1.4 @radix-ui/react-hover-card@1.1.4 @radix-ui/react-label@2.1.1 @radix-ui/react-menubar@1.1.4 @radix-ui/react-navigation-menu@1.2.3 @radix-ui/react-popover@1.1.4 @radix-ui/react-progress@1.1.1 @radix-ui/react-radio-group@1.2.2 @radix-ui/react-scroll-area@1.2.2 @radix-ui/react-select@2.1.4 @radix-ui/react-separator@1.1.1 @radix-ui/react-slider@1.2.2 @radix-ui/react-slot@1.1.1 @radix-ui/react-switch@1.1.2 @radix-ui/react-tabs@1.1.2 @radix-ui/react-toast@1.2.4 @radix-ui/react-toggle@1.1.1 @radix-ui/react-toggle-group@1.1.1 @radix-ui/react-tooltip@1.1.6
\`\`\`

#### Styling Dependencies
\`\`\`bash
npm install tailwindcss@^3.4.17 autoprefixer@^10.4.20 postcss@^8.5 class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^2.5.5 tailwindcss-animate@^1.0.7
\`\`\`

#### Icons and UI Enhancements
\`\`\`bash
npm install lucide-react@^0.454.0 next-themes@^0.4.4 cmdk@1.0.4 sonner@^1.7.1 vaul@^0.9.6 embla-carousel-react@8.5.1 react-resizable-panels@^2.1.7
\`\`\`

#### Forms and Validation
\`\`\`bash
npm install react-hook-form@^7.54.1 @hookform/resolvers@^3.9.1 zod@^3.24.1
\`\`\`

#### Charts and Data Visualization
\`\`\`bash
npm install recharts@2.15.0 date-fns@4.1.0 react-day-picker@9.8.0
\`\`\`

#### Firebase and Real-time Communication
\`\`\`bash
npm install firebase@^10.3.1 socket.io-client@^4.7.2
\`\`\`

#### Additional UI Components
\`\`\`bash
npm install input-otp@1.4.1 geist@^1.3.1
\`\`\`

#### Development Dependencies
\`\`\`bash
npm install --save-dev typescript@5.7.3 @types/node@^22 @types/react@^18 @types/react-dom@^18 eslint@^8 eslint-config-next@14.2.25
\`\`\`

### 3. Backend Dependencies Installation

#### Create Backend Directory
\`\`\`bash
mkdir backend
cd backend
npm init -y
\`\`\`

#### Core Server Dependencies
\`\`\`bash
npm install express@^4.18.2 socket.io@^4.7.2 cors@^2.8.5 helmet@^7.1.0 compression@^1.7.4 express-rate-limit@^7.1.5
\`\`\`

#### Firebase and Authentication
\`\`\`bash
npm install firebase-admin@^12.0.0 bcryptjs@^2.4.3 jsonwebtoken@^9.0.2
\`\`\`

#### Utilities and File Handling
\`\`\`bash
npm install dotenv@^16.3.1 multer@^1.4.5-lts.1 uuid@^9.0.0 validator@^13.9.0
\`\`\`

#### Logging
\`\`\`bash
npm install winston@^3.10.0 morgan@^1.10.0
\`\`\`

#### Development Dependencies
\`\`\`bash
npm install --save-dev nodemon@^3.0.1 jest@^29.6.2 supertest@^6.3.3
\`\`\`

### 4. Project Structure Setup
\`\`\`
neuroconnect-platform/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── backend/               # Express.js backend
│   ├── server.js         # Main server file
│   ├── package.json      # Backend dependencies
│   └── .env              # Backend environment variables
├── package.json          # Frontend dependencies
├── .env.local           # Frontend environment variables
└── README.md
\`\`\`

### 5. Environment Variables Setup

#### Frontend (.env.local)
\`\`\`bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

#### Backend (.env)
\`\`\`bash
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
\`\`\`

### 6. Running the Application

#### Start Frontend (from root directory)
\`\`\`bash
npm run dev
\`\`\`

#### Start Backend (from backend directory)
\`\`\`bash
cd backend
npm run dev
\`\`\`

### 7. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Enable Storage
6. Download service account key
7. Add configuration to environment variables

### 8. Verification Commands

#### Check Frontend Dependencies
\`\`\`bash
npm list --depth=0
\`\`\`

#### Check Backend Dependencies
\`\`\`bash
cd backend
npm list --depth=0
\`\`\`

#### Test Installation
\`\`\`bash
# Frontend
npm run build

# Backend
cd backend
npm test
\`\`\`

## 🎉 Installation Complete!

Your NeuroConnect platform is now ready for development. The installation includes:

✅ **Frontend**: Next.js 14 with React 19
✅ **UI Components**: Complete shadcn/ui component library
✅ **Styling**: Tailwind CSS with animations
✅ **Backend**: Express.js with Socket.IO
✅ **Database**: Firebase Firestore
✅ **Authentication**: Firebase Auth
✅ **Real-time**: Socket.IO for chat
✅ **File Upload**: Multer with Firebase Storage
✅ **Security**: Helmet, CORS, Rate limiting
✅ **Development**: Hot reload, TypeScript support

## Next Steps
1. Configure Firebase project
2. Set up environment variables
3. Run both frontend and backend servers
4. Start developing your features!
