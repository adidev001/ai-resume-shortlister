1. Overview

Build a full-stack web application that allows recruiters to:

Add and manage candidate profiles
Define job requirements
Automatically shortlist candidates using:
Rule-based matching
AI-enhanced ranking using OpenRouter API
Display candidate rankings with explanations

The system should combine traditional skill matching with LLM-based reasoning to improve candidate evaluation quality.

Based on requirements from:


2. Objectives
Primary Goals
Reduce recruiter effort in manual candidate screening
Improve candidate-job matching accuracy
Provide explainable AI recommendations
Offer ranked candidate results
Success Metrics
Candidates ranked correctly by relevance
AI explanations generated successfully
API latency under 3 seconds for basic matching
Clean recruiter workflow
3. Tech Stack
Frontend
React
TailwindCSS
Axios
React Router
Recharts (optional graphs)
Backend
Node.js
Express.js
Database
MongoDB
Mongoose ODM
AI Integration
OpenRouter API
Model configurable via environment variables
Deployment
Vercel (frontend)
Render/Railway (backend)
MongoDB Atlas
4. Functional Requirements
4.1 Candidate Management

Recruiters can:

Add candidates
View all candidates
Search candidates
Filter candidates by skills/experience
Candidate Fields
Field	Type
name	String
email	String
skills	Array<String>
experience	Number
bio/projects	String
createdAt	Date

Reference:


4.2 Job Requirement Input

Recruiters can input:

Required skills
Preferred skills
Minimum experience

Reference:


4.3 Rule-Based Matching Engine

The backend should calculate:

Skill overlap percentage
Experience eligibility
Match category:
High
Medium
Low
Matching Formula
score = matchedSkills / requiredSkills

Reference logic:


4.4 AI-Based Candidate Ranking

Use OpenRouter API to:

Rank candidates intelligently
Analyze project relevance
Generate suitability explanations
Improve beyond keyword matching

Reference:


5. API Requirements
Candidate APIs
POST /api/candidates

Add a new candidate.

Request
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "skills": ["React", "Node.js"],
  "experience": 2,
  "bio": "Built scalable web apps"
}

Reference:


GET /api/candidates

Return all candidates.

Matching APIs
POST /api/match

Perform rule-based ranking.

Request
{
  "requiredSkills": ["React", "Node.js"],
  "preferredSkills": ["MongoDB"],
  "minExperience": 2
}
Response
[
  {
    "candidate": "Rahul Sharma",
    "matchScore": 92,
    "matchedSkills": ["React", "Node.js"],
    "matchLevel": "High"
  }
]
AI Shortlisting API
POST /api/ai/shortlist

Uses OpenRouter for advanced ranking.

AI Response Should Include
Ranked candidates
Suitability explanation
Missing skills
Hiring recommendation

Reference:


6. Frontend Requirements
Pages
Dashboard
Summary cards
Candidate count
Top matches
Add Candidate Page
Form validation
Skills input tags
Candidate List Page
Search
Filter
Pagination
Job Matching Page
Enter requirements
View ranked results

Reference:


7. UI Requirements
Design Style
Modern HR dashboard
Responsive
Clean card-based layout
Dark/light mode optional
Components
Navbar
Sidebar
Candidate cards
Match score progress bars
AI explanation accordion
8. Database Schema
const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  experience: Number,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

Reference:


9. Bonus Features

Implement if time permits:

AI-generated interview questions
Match score charts
Saved shortlist collections
Candidate bookmarking
Resume upload + parsing
Semantic vector matching

Reference:


10. Folder Structure
project/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── hooks/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── .env
├── package.json
└── README.md
11. Environment Variables
PORT=5000
MONGO_URI=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-5.2
CLIENT_URL=http://localhost:5173
12. Non-Functional Requirements
Performance
API responses < 3 seconds
Efficient MongoDB queries
Security
Validate all inputs
Sanitize AI prompts
Store secrets in .env
Scalability
Modular architecture
Reusable services
Stateless APIs
13. Deliverables

The coding agent must produce:

Full frontend
Full backend
MongoDB integration
OpenRouter integration
README setup instructions
API documentation
Sample seed data
Clean code with comments