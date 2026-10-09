# Talent Growth — Full-Stack Blog Platform

A full-stack blog platform built with React and Express, backed by MongoDB Atlas. It features JWT authentication, rich Markdown editing, live preview, full-text search, server-side pagination, nested comments, and user profile management.

---

## 🌐 Live Production Deployments

- **Frontend Application**: [https://talent-growth-blog-frontend.vercel.app](https://talent-growth-blog-frontend.vercel.app/)
- **Backend REST API**: [https://talent-growth-blog-api.vercel.app/api](https://talent-growth-blog-api.vercel.app/api)

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, Marked, DOMPurify
- **Backend**: Node.js, Express, MongoDB Atlas via Mongoose, JSON Web Tokens (JWT), bcryptjs
- **Design Language**: Hallmark Editorial Craft (Newsreader Serif + Plus Jakarta Sans, warm paper palette `#FAFAF8`, 8-state interactive controls)
- **Deployment**: Vercel (Frontend SPA + Backend Serverless Functions)

---

## Repository Structure

```
full_stack_developer_test_case/
├── backend/
│   ├── api/
│   │   └── index.js             # Vercel serverless entry point
│   ├── src/
│   │   ├── config/              # Environment config & MongoDB connection pool
│   │   ├── constants/           # HTTP status constants
│   │   ├── errors/              # Domain-specific error class hierarchy
│   │   ├── middleware/          # JWT auth, rate limiter, validator & error handler
│   │   ├── models/              # User, Post, and Comment Mongoose schemas
│   │   ├── repositories/        # Data access abstraction layer
│   │   ├── services/            # Business logic orchestration
│   │   ├── controllers/         # HTTP request/response handlers
│   │   ├── validators/          # Declarative request schema rules
│   │   ├── routes/              # Express feature routers
│   │   ├── utils/               # JWT, bcrypt, text analysis & API response helpers
│   │   └── app.js               # Express application initialization
│   ├── tests/                   # Automated API integration tests (Supertest + Jest)
│   ├── server.js                # Local server entry
│   ├── vercel.json              # Backend Vercel serverless configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                 # Centralized Axios client & API services
│   │   ├── components/
│   │   │   ├── common/          # Atomic 8-state UI controls (Button, Input, Modal, etc.)
│   │   │   ├── layout/          # Navbar, Footer, and AppLayout
│   │   │   ├── posts/           # PostCard, SearchBar, CategoryFilter, MarkdownEditor
│   │   │   └── comments/        # CommentSection, CommentItem, CommentForm
│   │   ├── context/             # AuthContext & ToastContext
│   │   ├── hooks/               # useAuth, useToast, useDebounce
│   │   ├── pages/               # Routed pages (Home, Detail, Create, Edit, Profile, Auth)
│   │   ├── routes/              # AppRoutes and ProtectedRoute guards
│   │   ├── styles/              # Hallmark design tokens & Tailwind directives
│   │   └── utils/               # Date formatters & DOMPurify Markdown sanitization
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json              # SPA rewrite rule for client routing
│   └── package.json
└── README.md
```

---

## Demo Accounts & Seeder

The project ships with a seeder that fills the database with 5 author personas, 8 full-length technical articles, and 17 comments — enough for the platform to feel like a running publication rather than an empty shell.

### Run the seeder

```bash
cd backend

# First run — skip if seed users already exist
npm run seed

# Force a clean slate and re-seed
npm run seed:clean
```

### Demo credentials

All five accounts share the same password: `Password123!`

| Name | Email |
|---|---|
| Elena Rostova | `elena@talentgrowth.dev` |
| Marcus Chen | `marcus@talentgrowth.dev` |
| Aria Tanaka | `aria@talentgrowth.dev` |
| Devon Miller | `devon@talentgrowth.dev` |
| Sarah Jenkins | `sarah@talentgrowth.dev` |

The seeder is idempotent: running `npm run seed` a second time without `--clean` is a no-op if seed users are already present.

---

## Getting Started Locally


### 1. Prerequisites
- Node.js 18+ (tested on v22)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
```
Configure your `.env` variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/talent-growth?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```
Install dependencies and run:
```bash
npm install
npm run dev
```
The API server starts at `http://localhost:5000/api`.

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
cp .env.example .env
```
Ensure `frontend/.env` points to the backend:
```env
VITE_API_URL=http://localhost:5000/api
```
Install dependencies and run:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## API Specification

All responses follow a consistent envelope structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed",
  "data": { ... }
}
```

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Log in with email and password, returns signed JWT
- `GET /api/auth/me` — Fetch current user profile (Bearer token required)
- `PUT /api/auth/profile` — Update name, bio, and avatar (Bearer token required)

### Posts (`/api/posts`)
- `GET /api/posts` — Retrieve paginated posts. Query params:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 50)
  - `search`: Search keywords against title and content
  - `category`: Filter by category (`General`, `Engineering`, `Design`, `Product`, `Career`, `Notes`)
  - `author`: Filter by author user ID
- `GET /api/posts/:id` — Retrieve single post with populated author info
- `POST /api/posts` — Create a new post (Bearer token required)
- `PUT /api/posts/:id` — Update a post (Bearer token required; author-only)
- `DELETE /api/posts/:id` — Delete a post and its associated comments (Bearer token required; author-only)

### Comments (`/api/posts/:id/comments` & `/api/comments/:id`)
- `GET /api/posts/:id/comments` — List all comments for a post
- `POST /api/posts/:id/comments` — Add comment to a post (Bearer token required)
- `PUT /api/comments/:id` — Edit an existing comment (Bearer token required; author-only)
- `DELETE /api/comments/:id` — Delete a comment (Bearer token required; author-only)

---

## Running Automated Tests

Run the integration test suite covering auth flows, post management, and nested comments:

```bash
cd backend
npm test
```

---

## Deployment to Vercel

### Deploying Frontend
1. Import the repository in Vercel.
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://your-backend.vercel.app/api`)
4. Deploy. The included `frontend/vercel.json` ensures client-side routing works on page refreshes.

### Deploying Backend
1. Import the repository in Vercel as a second project (or monorepo app).
2. Set Root Directory to `backend`.
3. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret string
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your deployed frontend Vercel URL
4. Deploy. `backend/api/index.js` acts as the serverless function handler with Mongoose connection pooling.

---

## Design Decisions & Architectural Notes

1. **Clean Architecture Separation**: Business rules reside strictly within the service layer. Controllers only handle HTTP concerns, while repositories isolate Mongoose queries.
2. **Author Authorization**: Handled directly in services and controllers to ensure users cannot tamper with stories or comments they do not own.
3. **XSS Protection**: Markdown input is rendered using `marked` and sanitized with `DOMPurify` before injecting into the DOM, preventing script injection.
4. **Serverless Connection Pooling**: `backend/src/config/database.js` caches the Mongoose connection globally across serverless function invocations on Vercel to avoid connection limits and latency spikes.
5. **Hallmark Design Discipline**: Uses high-contrast serif typography for headings, clean sans-serif for reading ergonomics, warm paper background tones, and 8-state interactive feedback on buttons and inputs.
