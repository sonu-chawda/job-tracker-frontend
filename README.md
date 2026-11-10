# JobTrackr: AI Job Application Tracker (Frontend)

React frontend for JobTrackr, a tracker that helps job seekers manage applications and use AI to match their resume with job descriptions, draft cover letters and prepare for interviews.

**Backend repo:** https://github.com/sonu-chawda/job-tracker-backend
**Live demo:** coming soon

## Pages

| Page | What it does |
|---|---|
| Landing | Product overview, features and how it works |
| Login / Register | JWT based authentication |
| Dashboard | Stats, status charts, recent applications and follow-ups due |
| Applications | List view with search, filter, sort and pagination, plus a drag and drop Kanban board |
| Application detail | Overview, AI Match, Cover Letter, Interview Prep, Follow-up and status history |
| Resume | Save a base resume and tailor it for any application |
| Settings | Profile and dark mode |
| Admin | User management and platform stats (ADMIN only) |
| 404 | Not found page |

## Features

- Responsive layout with light and dark themes
- Kanban board: drag a card to another column to change its status
- Protected routes and automatic redirect to login when the token expires
- Toast notifications, loading skeletons and empty states
- Charts with Recharts
- Original SVG illustrations and CSS mockups

## Tech stack

React 18, Vite, React Router 6, Axios, Recharts, Lucide icons, plain CSS with theme variables.

## Getting started

**Prerequisites:** Node.js 18 or newer and the backend running on `http://localhost:8080`.

```bash
git clone https://github.com/sonu-chawda/job-tracker-frontend.git
cd job-tracker-frontend
npm install
cp .env.example .env
npm run dev
```

The app opens at `http://localhost:5173`.

Environment variable:

| Name | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Backend base URL |

## Project structure

```
src/
  pages/        Landing, Auth, Dashboard, Applications, ApplicationDetail, Resume, Settings, Admin, NotFound
  components/   Layout, Board (Kanban), AiPanel, Modal, Toast, Avatar, StatusBadge, Illustrations
  api.js        Axios instance with token and 401 handling
  AuthContext.jsx, ThemeContext.jsx
```

## Author

**Sonu Chawda**, Java Full Stack Developer
LinkedIn: https://www.linkedin.com/in/sonuchawda
