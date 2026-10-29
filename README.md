# NxtWave AI Workshop Growth Engine

A full-stack growth engineering platform built for the **NxtWave Growth Intern – Growth Challenge Round 1**.

This application demonstrates an end-to-end growth marketing strategy, product ownership, automated viral referral mechanics, real-time analytics, and AI-assisted campaign operations designed to scale a free virtual workshop:

> **"Build Your First AI Project in 60 Minutes"**  
> *Target Audience: Final-year engineering students in India (Class of 2025/2026).*

---

## 🎯 Campaign Constraints & Objectives

| Objective / Constraint | Strategy & Parameter |
| :--- | :--- |
| **Registration Target** | **500 student registrations** |
| **Campaign Duration** | **7 Days** (Day 1 through Day 7) |
| **Budget Ceiling** | **₹2,000 Total** (Blended CAC ceiling: ₹4.00/student) |
| **Core Growth Vectors** | College WhatsApp Groups (200), Student Ambassadors (150), Technical Clubs (100), Direct Outreach (50) |
| **Simulation Mode** | Real student records and synthetic demo records are strictly isolated and labeled |
| **Integrity & Compliance** | Zero unsolicited spam, no false placement guarantees, full anti-fraud referral protection |

---

## 🛠️ Architecture & Tech Stack

```
nxtwave/
├── client/                     # Frontend (React 19, Vite, Tailwind CSS, Recharts, Lucide Icons)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, SimulationBanner, RegistrationForm, ReferralShareCard
│   │   ├── pages/              # LandingPage, CampaignDashboardPage, ReferralAmbassadorPage,
│   │   │                       # GrowthStrategyPlannerPage, AiGrowthAssistantPage
│   │   ├── services/           # api.js (centralized REST client with proxy support)
│   │   ├── App.jsx             # Top-level view router and state manager
│   │   └── index.css           # Global typography (Plus Jakarta Sans) and Tailwind styles
│   ├── vite.config.js          # Development server with /api proxy to port 5000
│   └── package.json
│
├── server/                     # Backend API (Node.js, Express, better-sqlite3)
│   ├── src/
│   │   ├── db.js               # SQLite connection (WAL mode), schema, and initial seeder
│   │   ├── server.js           # REST API endpoints, rate limiting, and CORS
│   │   ├── services/
│   │   │   ├── referralService.js          # Code generator, email normalizer, anti-fraud attribution
│   │   │   ├── campaignAnalyticsService.js # 7-day velocity, CAC, funnel, and synthetic seeder
│   │   │   ├── aiService.js                # Google Gemini API + Deterministic Growth Engine fallback
│   │   │   └── messageLibraryService.js    # Pre-approved compliant growth message copy
│   │   └── tests/
│   │       └── runTests.js     # 14 automated unit & integration tests
│   ├── package.json
│   └── .env.example
│
├── package.json                # Root package configuration
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24.21.0)
- **npm** v9+

### 2. Clone & Install Dependencies

Clone or navigate to the workspace directory:

```bash
cd nxtwave
```

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server/` directory:
```bash
cd ../server
cp .env.example .env
```

Contents of `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/nxtwave_growth.sqlite

# Optional: Google Gemini AI API Key
# If omitted or left empty, the application functions seamlessly in demo mode
# using its built-in deterministic Growth Engine without throwing errors.
GEMINI_API_KEY=
```

---

## 🖥️ Running the Application

### Option A: Run Backend and Frontend in Separate Terminals

**Terminal 1 — Start the Backend Server:**
```bash
cd server
npm start
```
*API server runs at:* `http://localhost:5000`

**Terminal 2 — Start the Vite Frontend Client:**
```bash
cd client
npm run dev
```
*Web application runs at:* `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

The project includes an automated unit and integration test suite testing registration validation, duplicate email prevention (case normalization), referral code generation, anti-fraud self-referral blocks, synthetic data separation, target calculations, and the AI fallback engine.

To run the automated tests:
```bash
cd server
npm test
```

### Verified Test Results:
```
======================================================
🧪 RUNNING AUTOMATED GROWTH ENGINE TEST SUITE
======================================================

--- Test Suite 1: Registration Validation ---
  ✅ PASS: Rejects missing full name
  ✅ PASS: Rejects invalid email format
  ✅ PASS: Rejects out-of-range graduation year
  ✅ PASS: Accepts valid payload and normalizes email

--- Test Suite 2: Registration & Duplicate Prevention ---
  ✅ PASS: Registers a new student successfully and generates unique referral code
  ✅ PASS: Rejects duplicate email (exact match)
  ✅ PASS: Rejects duplicate email with mixed case and leading/trailing whitespace

--- Test Suite 3: Referral Attribution & Anti-Fraud ---
  ✅ PASS: Attributes referral when a peer registers using a referral code
  ✅ PASS: Prevents self-referral inflation

--- Test Suite 4: Real vs Synthetic Metric Separation ---
  ✅ PASS: Seeds synthetic data and correctly isolates real vs synthetic records

--- Test Suite 5: Campaign Budget & Target Calculations ---
  ✅ PASS: Campaign targets total exactly 500 registrations
  ✅ PASS: Total budget allocation equals exactly ₹2,000
  ✅ PASS: Remaining registrations to target calculated accurately

--- Test Suite 6: AI Growth Assistant Fallback Engine ---
  ✅ PASS: AI Assistant responds reliably in deterministic fallback mode

======================================================
SUMMARY: 14 passed, 0 failed
======================================================
```

---

## 💡 Core Features Breakdown

### A. Student-Facing Workshop Landing Page
- **Hero & Value Proposition**: Clear headline: *"Build Your First AI Project in 60 Minutes"*.
- **3 Core Pillars**: Master AI architecture, live hands-on guided build, and placement-ready portfolio proof.
- **Workshop Agenda**: 4 distinct phases (0-15m Architecture, 15-45m Guided Coding, 45-55m Testing & GitHub, 55-60m Resume & Next Steps).
- **Responsive Registration Form**: Client-side and server-side validation, duplicate prevention, and confetti celebration.
- **Configurable Placeholders**: Workshop date, time, virtual platform, and mentors clearly indicated as placeholders.

### B. Registration & Referral Backend
- **Data Persistence**: SQLite in WAL mode (`better-sqlite3`).
- **Input Sanitization**: Email normalized to lowercase and trimmed.
- **Unique Referral Codes**: Alphanumeric codes (`NXT-NAME####`).
- **Anti-Fraud Mechanics**: Self-referrals blocked; duplicate registrations return existing code without inflating counts.
- **Rate Limiting**: Built-in in-memory rate limiter protecting registration endpoints against automated abuse.

### C. Viral Referral & Ambassador Engine
- **Instant WhatsApp Sharing**: 1-click share button pre-populated with student link and workshop copy.
- **1-Click Copy Link**: Shareable tracking URL containing `?ref=...&channel=student_ambassador`.
- **Live Peer Tracker**: Students can query their referral code to see their confirmed peer signups and progress across Ambassador Tiers (*Advocate*, *Silver*, *Gold Campus Champion*).
- **Campaign Link & UTM Generator**: Custom URL creator for WhatsApp class groups, club partners, and CRs.

### D. Campaign Growth Dashboard
- **500 Target Progress**: Live percentage bar and remaining registrations required.
- **Budget Tracking**: ₹ spent vs ₹2,000 cap and dynamic blended CAC calculation.
- **7-Day Velocity Chart**: Area and bar charts comparing daily signups and cumulative trajectory against target pace.
- **Acquisition Channel Distribution**: Interactive pie and bar charts showing WhatsApp groups, Ambassadors, Technical Clubs, and Email.
- **Conversion Funnel**: Tracks visitor progression from discovery to registration and referral activation.
- **Data Isolation**: Clearly toggles between *All Records*, *Real Submissions Only*, and *Synthetic Demo Data*.
- **Demo Controls**: One-click *Reload Demo Data* (342 registrations across 6 days) and *Reset Demo Data*.

### E. Growth Strategy & ₹2,000 Budget Planner
- **Illustrative 500 Target Allocation**:
  - College WhatsApp Groups: **200 registrations (40%)**
  - Student Ambassadors & Viral Links: **150 registrations (30%)**
  - Technical Clubs & Campus Societies: **100 registrations (20%)**
  - Personalized Email & Direct Outreach: **50 registrations (10%)**
  - *Total: 500 registrations*
- **7-Day Day-by-Day Tactical Roadmap**: Action items, spending triggers, and milestones for Days 1 through 7.
- **Editable ₹2,000 Budget**:
  - Promotional Assets & Creative: **₹500**
  - Targeted Micro-Promotion: **₹800**
  - Ambassador & Community Activation: **₹400**
  - Contingency Reserve: **₹300**
  - *Total: ₹2,000*
- **Zero-Cost (₹0) Organic Alternative**: Full plan for achieving 500 registrations with ₹0 ad spend via community partnerships and viral peer loops.

### F. AI Growth Assistant & Prompt Studio
- **Dual Engine**: Connects to **Google Gemini API** (`gemini-1.5-flash`) when `GEMINI_API_KEY` is present; seamlessly falls back to a deterministic rule-based growth engine when no API key is provided.
- **5 Instant Missions**:
  1. *WhatsApp Promo Hook*
  2. *Technical Club Pitch*
  3. *Growth Experiments (₹2k Cap)*
  4. *Channel Diagnosis*
  5. *Executive Daily Summary*
- **Custom Growth Query Studio**: Allows organizers to ask custom campaign questions.

### G. Pre-Approved Campaign Message Library
- Pre-approved, compliant, ethical message templates:
  - College WhatsApp Class Group Script
  - Student Ambassador Invitation Pitch
  - Technical Club Partnership Proposal
  - Placement-Focused Student Email
  - Final Day 7 Registration Reminder
- 1-click copy with dynamic college and link placeholder replacements.

---

## 🌐 Production Deployment Guide

### Recommended Deployment Architecture:
1. **Frontend**: Deploy static Vite build to **Vercel**, **Netlify**, or **Cloudflare Pages**.
2. **Backend**: Deploy Node.js server to **Render**, **Railway**, or **Fly.io**.

### Step-by-Step Backend Deployment (e.g. Render / Railway):
1. Push code to your GitHub repository.
2. In Render or Railway, create a new **Web Service** connected to your repository.
3. Configure settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
4. Set Environment Variables:
   - `PORT`: `5000` (or leave default assigned by host)
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key
5. **Persistent Storage for SQLite**:
   - In Render/Railway, attach a **Persistent Disk** (e.g., mounted at `/data`).
   - Set `DATABASE_PATH=/data/nxtwave_growth.sqlite` to ensure database persistence across container restarts.

### Transitioning to PostgreSQL (Production Alternative):
If hosting on a stateless platform without persistent disks (such as Heroku or standard container tiers):
1. Provision a managed PostgreSQL instance (e.g., Supabase, Neon, or AWS RDS).
2. Replace `better-sqlite3` with `pg` or `knex`.
3. The SQL schema in `server/src/db.js` uses standard ANSI SQL (`registrations`, `campaign_settings`, `page_views`) and maps directly to PostgreSQL with `SERIAL PRIMARY KEY`.

### Frontend Deployment (e.g. Vercel):
1. In Vercel, import your repository.
2. Set Root Directory: `client`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://nxtwave-growth-api.onrender.com/api`).

---

## ⚖️ Compliance & Ethical Standards

- **Educational Simulation**: All student records in the initial demo dataset are synthetic and clearly marked with yellow badges (*Synthetic Demo*). Real submissions are tagged with green badges (*Real Student*).
- **No Spam**: The platform never automatically dispatches emails or messages. All sharing actions require manual user confirmation.
- **Transparent Claims**: No guarantees of job placement, salaries, or commercial endorsements are made. All workshop dates and meeting platforms are explicitly designated as configurable placeholders.

---

## 👨‍💻 Candidate Submission Notes

Built by an aspiring Growth Intern candidate for the **NxtWave Growth Challenge Round 1**. Demonstrates full-stack capability, growth marketing frameworks, data-driven optimization, and product execution.
