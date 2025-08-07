#!/bin/bash

echo "🚀 Quick Install Script for NeuroConnect Platform"
echo "================================================"

# Frontend dependencies (run from root)
echo "📦 Installing Frontend Dependencies..."
npm install next@14.2.25 react@^19 react-dom@^19 \
@radix-ui/react-accordion@1.2.2 @radix-ui/react-alert-dialog@1.1.4 @radix-ui/react-avatar@1.1.2 \
@radix-ui/react-checkbox@1.1.3 @radix-ui/react-dialog@1.1.4 @radix-ui/react-dropdown-menu@2.1.4 \
@radix-ui/react-label@2.1.1 @radix-ui/react-popover@1.1.4 @radix-ui/react-select@2.1.4 \
@radix-ui/react-separator@1.1.1 @radix-ui/react-slot@1.1.1 @radix-ui/react-switch@1.1.2 \
@radix-ui/react-tabs@1.1.2 @radix-ui/react-toast@1.2.4 @radix-ui/react-tooltip@1.1.6 \
tailwindcss@^3.4.17 autoprefixer@^10.4.20 postcss@^8.5 class-variance-authority@^0.7.1 \
clsx@^2.1.1 tailwind-merge@^2.5.5 tailwindcss-animate@^1.0.7 lucide-react@^0.454.0 \
next-themes@^0.4.4 react-hook-form@^7.54.1 @hookform/resolvers@^3.9.1 zod@^3.24.1 \
firebase@^10.3.1 socket.io-client@^4.7.2 recharts@2.15.0 date-fns@4.1.0 \
sonner@^1.7.1 cmdk@1.0.4

echo "🛠️ Installing Frontend Dev Dependencies..."
npm install --save-dev typescript@5.7.3 @types/node@^22 @types/react@^18 @types/react-dom@^18

# Backend setup
echo "📁 Setting up Backend..."
mkdir -p backend
cd backend

echo "📦 Installing Backend Dependencies..."
npm init -y
npm install express@^4.18.2 socket.io@^4.7.2 cors@^2.8.5 helmet@^7.0.0 \
compression@^1.7.4 express-rate-limit@^6.8.1 firebase-admin@^11.10.1 \
bcryptjs@^2.4.3 jsonwebtoken@^9.0.2 dotenv@^16.3.1 multer@^1.4.5-lts.1 \
uuid@^9.0.0 validator@^13.9.0 winston@^3.10.0 morgan@^1.10.0

npm install --save-dev nodemon@^3.0.1 jest@^29.6.2 supertest@^6.3.3

cd ..

echo "✅ Installation Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up Firebase project"
echo "2. Create .env files with your configuration"
echo "3. Run 'npm run dev' for frontend"
echo "4. Run 'cd backend && npm run dev' for backend"
