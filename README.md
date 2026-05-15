# HireAI — AI-Powered Candidate Shortlisting System

A production-quality full-stack web application that helps recruiters add candidates, define job requirements, and shortlist candidates using **rule-based matching** + **AI-enhanced ranking** via the OpenRouter API.

---

## 🏗️ Architecture

```
├── client/          → React + Vite + TailwindCSS frontend
├── server/          → Node.js + Express backend
├── .env             → Environment variables
└── package.json     → Root scripts (concurrently)
```

**Backend Pattern:** Controller → Service → Model (clean architecture)  
**Frontend Pattern:** Pages → Components → Hooks → Services

---

## ⚙️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 19, Vite, TailwindCSS 3, Axios, Recharts, Lucide Icons |
| Backend    | Node.js, Express 4, Mongoose 8      |
| Database   | MongoDB (Atlas or local)             |
| AI         | OpenRouter API (configurable model)  |
| Dev Tools  | Nodemon, Concurrently                |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+
- **MongoDB** (Atlas cluster or local installation)
- **OpenRouter API Key** from [openrouter.ai](https://openrouter.ai)

### 1. Clone & Install

```bash
# Install all dependencies (root + server + client)
npm run install:all
```

### 2. Configure Environment

Edit `.env` in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/candidate-shortlister
OPENROUTER_API_KEY=sk-or-v1-your-actual-key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

This adds 10 sample candidates for testing.

### 4. Run Development Servers

```bash
npm run dev
```

This starts both:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

---

## 📡 API Documentation

### Candidate APIs

| Method | Endpoint                      | Description                    |
|--------|-------------------------------|--------------------------------|
| POST   | `/api/candidates`             | Create a new candidate         |
| GET    | `/api/candidates`             | List candidates (search/filter)|
| GET    | `/api/candidates/:id`         | Get single candidate           |
| PUT    | `/api/candidates/:id`         | Update candidate               |
| DELETE | `/api/candidates/:id`         | Delete candidate               |
| GET    | `/api/candidates/stats/count` | Get total count                |

**Query Parameters for GET /api/candidates:**
- `search` — Search by name or bio
- `skills` — Filter by skills (comma-separated)
- `minExp` — Minimum experience
- `maxExp` — Maximum experience
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)

### Matching APIs

| Method | Endpoint       | Description                   |
|--------|----------------|-------------------------------|
| POST   | `/api/match`   | Rule-based candidate matching |

**Request Body:**
```json
{
  "requiredSkills": ["React", "Node.js"],
  "preferredSkills": ["MongoDB"],
  "minExperience": 2
}
```

### AI APIs

| Method | Endpoint                      | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | `/api/ai/shortlist`           | AI-powered candidate ranking    |
| POST   | `/api/ai/interview-questions` | Generate interview questions    |

**Shortlist Request Body:**
```json
{
  "requiredSkills": ["React", "Node.js"],
  "preferredSkills": ["MongoDB"],
  "minExperience": 2,
  "jobDescription": "Senior Full-Stack Developer"
}
```

---

## 🧮 Matching Algorithm

### Scoring Formula

```
Required Score  = (matchedRequired / totalRequired) × 70
Preferred Score = (matchedPreferred / totalPreferred) × 20
Experience Score = meetsMinimum ? 10 : (candidateExp / minExp) × 10
Total Score     = Required + Preferred + Experience (max 100)
```

### Match Levels

| Score    | Level   |
|----------|---------|
| ≥ 75     | High    |
| 50 – 74  | Medium  |
| < 50     | Low     |

---

## 🤖 AI Features

- **Intelligent Ranking** — AI analyzes candidates beyond keyword matching
- **Suitability Explanations** — Detailed reasoning for each candidate
- **Missing Skills Detection** — What candidates lack
- **Hiring Recommendations** — Strongly Recommend / Recommend / Consider / Not Recommended
- **Interview Focus Areas** — Suggested topics for interviews
- **Interview Question Generation** — Custom questions per candidate

---

## 📁 Project Structure

```
server/
├── config/db.js              → MongoDB connection
├── models/Candidate.js       → Mongoose schema
├── services/
│   ├── candidateService.js   → CRUD business logic
│   ├── matchService.js       → Scoring algorithm
│   └── aiService.js          → OpenRouter integration
├── controllers/              → HTTP handlers
├── routes/                   → Express routers
├── middleware/                → Validation, error handling
└── utils/seedData.js         → Sample data seeder

client/src/
├── pages/                    → Dashboard, CandidateList, AddCandidate, JobMatch
├── components/               → Sidebar, Navbar, CandidateCard, MatchScoreBar, etc.
├── hooks/                    → useCandidates, useMatch
└── services/api.js           → Axios API client
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
# Deploy dist/ to Vercel
```

### Backend (Render / Railway)

- Set environment variables in the hosting dashboard
- Entry point: `server/index.js`
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`

### Database

- Use [MongoDB Atlas](https://cloud.mongodb.com) for managed hosting

---

## 📄 License

MIT
