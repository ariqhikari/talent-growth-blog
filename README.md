# Talent Growth Blog Platform

A production-ready full-stack blog platform built with **React + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB Atlas** (backend), featuring JWT authentication, Markdown editing, server-side search & pagination, and user profile management.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, Marked + DOMPurify
- **Backend**: Node.js, Express, MongoDB Atlas (Mongoose), JWT, bcryptjs
- **Deployment**: Vercel (frontend SPA + backend Serverless Functions)

## Architecture

Clean layered architecture with strict Separation of Concerns:
- **Transport Layer**: Routes, validation schemas, auth/authorization middleware
- **Controller Layer**: HTTP parsing & standardized response envelope
- **Domain / Service Layer**: Business logic, rules, computed fields
- **Repository / Data Access Layer**: Mongoose query abstraction

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB 6+)
- Vercel CLI (for deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd talent-growth-blog
   ```

2. Setup backend:
   ```bash
   cd backend
   cp .env.example .env
   # Fill in your MongoDB Atlas URI and JWT secret
   npm install
   npm run dev
   ```

3. Setup frontend:
   ```bash
   cd frontend
   cp .env.example .env
   # Set VITE_API_URL to your backend URL
   npm install
   npm run dev
   ```

### Environment Variables

#### Backend (`backend/.env`)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/talent-growth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## Features

- **Core**: Full CRUD for blog posts and comments with author-only authorization
- **Auth**: Secure registration and login with JWT, passwords hashed via bcryptjs
- **Search**: Real-time debounced search across post titles and content
- **Pagination**: Server-side pagination with navigation controls
- **Markdown**: Rich Markdown editor with live preview and XSS sanitization
- **Profiles**: User profile management with avatar customization

## Deployment (Vercel)

Both frontend and backend are deployed on Vercel:
- Frontend: deployed as a Vite SPA with rewrite rule for React Router
- Backend: deployed as Express wrapped in a Vercel Serverless Function

See `vercel.json` in each workspace for configuration.
