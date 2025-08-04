A modern React TypeScript frontend application with authentication and property management.

## Features

- 🚀 **Vite** - Fast development and build tool
- ⚡ **React** with TypeScript
- 🔐 **Better Auth** integration with backend API
- 🎨 **DaisyUI + Tailwind CSS** for styling
- 🏠 **Properties System** - Authenticated property listings with modal details
- � **Responsive Design** - Modern UI components

## Development Setup

### Prerequisites

1. **Backend running on port 3001** - Make sure your Better Auth backend is running at `http://localhost:3001`
2. **Database** - PostgreSQL with Better Auth schema

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Port Configuration

- **Frontend (Vite):** `http://localhost:3000`
- **Backend (Express):** `http://localhost:3001` 
- **API Proxy:** `/api/*` requests are proxied to the backend

Your backend `.env` should have:
```env
PORT=3001
CORS_ENABLED=true
CORS_ORIGIN="http://localhost:3000"
```

## Authentication Flow

1. **Unauthenticated users** → Redirected to `/auth`
2. **Sign In/Sign Up** → Uses Better Auth client methods
3. **Successful auth** → Redirected to `/dashboard`
4. **Protected routes** → Auto-redirect to `/auth` if not authenticated
5. **Session management** → Handled by Better Auth with cookies

## Properties System

- **Properties Table** - Lists all available properties
- **Clickable Rows** - Click any property to view details
- **Modal Details** - Fetches detailed property info from `/api/properties/:id`
- **Authentication Required** - All property data requires valid session

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── SignInForm.tsx   # Email/password sign in
│   ├── SignUpForm.tsx   # User registration
│   ├── UserProfile.tsx  # User info display
│   └── PropertiesTable.tsx # Properties listing with modal details
├── pages/               
│   ├── AuthPage.tsx     # Authentication page
│   └── DashboardPage.tsx # Protected dashboard
├── lib/                 
│   └── auth.ts         # Better Auth client config
├── App.tsx             # Main app with routing
└── index.css          # Tailwind CSS styles
```

## Backend Integration

This frontend connects to the backend API server at `http://localhost:3001` and expects:

- `/api/auth/*` - Authentication endpoints (Better Auth)
- `/api/properties` - Get all properties (protected)
- `/api/properties/:id` - Get property details (protected)

All API requests use `credentials: 'include'` for cookie-based authentication.

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
