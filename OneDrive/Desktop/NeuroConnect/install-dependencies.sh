#!/bin/bash

echo "🚀 Installing Dependencies for NeuroConnect Platform"
echo "=================================================="

# Create backend directory if it doesn't exist
echo "📁 Creating backend directory..."
mkdir -p backend
cd backend

echo "📦 Initializing backend package.json..."
npm init -y

echo "🔧 Installing Backend Dependencies..."
echo "Installing Express.js and core server dependencies..."
npm install express@^4.18.2
npm install socket.io@^4.7.2
npm install cors@^2.8.5
npm install helmet@^7.0.0
npm install compression@^1.7.4
npm install express-rate-limit@^6.8.1

echo "🔥 Installing Firebase dependencies..."
npm install firebase-admin@^11.10.1

echo "🔐 Installing Authentication dependencies..."
npm install bcryptjs@^2.4.3
npm install jsonwebtoken@^9.0.2

echo "⚙️ Installing Utility dependencies..."
npm install dotenv@^16.3.1
npm install multer@^1.4.5-lts.1
npm install uuid@^9.0.0
npm install validator@^13.9.0

echo "📝 Installing Logging dependencies..."
npm install winston@^3.10.0
npm install morgan@^1.10.0

echo "🧪 Installing Development dependencies..."
npm install --save-dev nodemon@^3.0.1
npm install --save-dev jest@^29.6.2
npm install --save-dev supertest@^6.3.3

echo "✅ Backend dependencies installed!"
echo ""

# Go back to root directory for frontend
cd ..

echo "🎨 Installing Frontend Dependencies..."
echo "Installing Next.js and React dependencies..."
npm install next@14.2.25
npm install react@^19
npm install react-dom@^19

echo "🎯 Installing UI Component dependencies..."
npm install @radix-ui/react-accordion@1.2.2
npm install @radix-ui/react-alert-dialog@1.1.4
npm install @radix-ui/react-aspect-ratio@1.1.1
npm install @radix-ui/react-avatar@1.1.2
npm install @radix-ui/react-checkbox@1.1.3
npm install @radix-ui/react-collapsible@1.1.2
npm install @radix-ui/react-context-menu@2.2.4
npm install @radix-ui/react-dialog@1.1.4
npm install @radix-ui/react-dropdown-menu@2.1.4
npm install @radix-ui/react-hover-card@1.1.4
npm install @radix-ui/react-label@2.1.1
npm install @radix-ui/react-menubar@1.1.4
npm install @radix-ui/react-navigation-menu@1.2.3
npm install @radix-ui/react-popover@1.1.4
npm install @radix-ui/react-progress@1.1.1
npm install @radix-ui/react-radio-group@1.2.2
npm install @radix-ui/react-scroll-area@1.2.2
npm install @radix-ui/react-select@2.1.4
npm install @radix-ui/react-separator@1.1.1
npm install @radix-ui/react-slider@1.2.2
npm install @radix-ui/react-slot@1.1.1
npm install @radix-ui/react-switch@1.1.2
npm install @radix-ui/react-tabs@1.1.2
npm install @radix-ui/react-toast@1.2.4
npm install @radix-ui/react-toggle@1.1.1
npm install @radix-ui/react-toggle-group@1.1.1
npm install @radix-ui/react-tooltip@1.1.6

echo "🔥 Installing Firebase client dependencies..."
npm install firebase@^10.3.1

echo "🎨 Installing Styling dependencies..."
npm install tailwindcss@^3.4.17
npm install autoprefixer@^10.4.20
npm install postcss@^8.5
npm install class-variance-authority@^0.7.1
npm install clsx@^2.1.1
npm install tailwind-merge@^2.5.5
npm install tailwindcss-animate@^1.0.7

echo "📱 Installing Additional UI dependencies..."
npm install lucide-react@^0.454.0
npm install next-themes@^0.4.4
npm install cmdk@1.0.4
npm install sonner@^1.7.1
npm install vaul@^0.9.6
npm install embla-carousel-react@8.5.1
npm install react-resizable-panels@^2.1.7

echo "📊 Installing Chart and Data dependencies..."
npm install recharts@2.15.0
npm install date-fns@4.1.0
npm install react-day-picker@9.8.0

echo "📝 Installing Form dependencies..."
npm install react-hook-form@^7.54.1
npm install @hookform/resolvers@^3.9.1
npm install zod@^3.24.1

echo "🔌 Installing Socket.IO client..."
npm install socket.io-client@^4.7.2

echo "🎮 Installing Additional UI components..."
npm install input-otp@1.4.1
npm install geist@^1.3.1

echo "🛠️ Installing Development dependencies..."
npm install --save-dev typescript@5.7.3
npm install --save-dev @types/node@^22
npm install --save-dev @types/react@^18
npm install --save-dev @types/react-dom@^18
npm install --save-dev eslint@^8
npm install --save-dev eslint-config-next@14.2.25

echo "✅ All dependencies installed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up Firebase project and download service account key"
echo "2. Create .env file with your Firebase configuration"
echo "3. Run 'npm run dev' in root directory for frontend"
echo "4. Run 'npm run dev' in backend directory for backend server"
echo ""
echo "🎉 Setup complete! Happy coding!"
