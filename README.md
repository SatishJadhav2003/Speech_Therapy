# 🎯 Speech Therapy Practice Web Application

A mobile-first Angular application designed to help users practice speech therapy exercises daily.

## 🚀 Tech Stack

- **Angular 18** (Latest Stable)
- **Tailwind CSS** (Mobile-first styling)
- **JSON Server** (Mock REST API backend)
- **TypeScript**
- **RxJS**

## 📁 Project Structure

```
src/app/
├── features/                    # Feature-based modules
│   ├── dashboard/              # Home/Dashboard (Phase 3)
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.css
│   ├── exercises/              # Exercise Management (Phase 1)
│   │   ├── exercise-list/
│   │   └── exercise-form/
│   ├── plans/                  # Plan Creation (Phase 2)
│   │   └── plan-create/
│   └── session/                # Active Session (Phase 4 & 5)
│       ├── session.component.ts
│       └── session.component.html
├── models/                     # Data models
│   ├── exercise.model.ts
│   ├── plan.model.ts
│   └── session.model.ts
├── services/                   # API services
│   ├── exercise.service.ts
│   └── plan.service.ts
└── shared/                     # Shared components
    └── bottom-nav/             # Bottom navigation
```

## 🎨 Features Implemented

### ✅ Phase 1 - Exercise Management
- Add custom speech exercises
- View list of exercises (mobile card layout)
- Edit and delete exercises
- Fields: name (required), description (optional), why (optional)

### ✅ Phase 2 - Plan Creation
- Create instant or scheduled plans
- Select multiple exercises per plan
- Set repetitions per exercise (default: 5, editable)
- Choose date and time for scheduled plans

### ✅ Phase 3 - Dashboard/Home
- Current active plan display
- Pending plans (today's practice)
- Upcoming scheduled plans
- Status indicators (pending/active/completed)
- Start/View plan buttons

### ✅ Phase 4 - Session Execution
- One-by-one exercise display
- Large tap counter button
- Auto-advance to next exercise when complete
- Visual progress indicator
- Navigation controls

### ✅ Phase 5 - Plan Completion
- Mark plan as completed
- Store completion timestamp
- Completion summary screen
- Status update (pending → completed)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v20.x recommended)
- npm (v10.x)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Start JSON Server (Terminal 1):**

```bash
npm run api
```

This will start the mock API server at `http://localhost:3000`

3. **Start Angular Dev Server (Terminal 2):**

```bash
npm start
```

The application will open at `http://localhost:4200`

## 📊 API Endpoints

JSON Server provides the following REST endpoints:

- **Exercises**
  - GET `/exercises` - List all exercises
  - GET `/exercises/:id` - Get single exercise
  - POST `/exercises` - Create exercise
  - PUT `/exercises/:id` - Update exercise
  - DELETE `/exercises/:id` - Delete exercise

- **Plans**
  - GET `/plans` - List all plans
  - GET `/plans/:id` - Get single plan
  - POST `/plans` - Create plan
  - PUT `/plans/:id` - Update plan
  - PATCH `/plans/:id` - Partial update
  - DELETE `/plans/:id` - Delete plan

## 🎯 Data Flow

1. **Exercise Management**: User creates exercises → Service → JSON Server → db.json
2. **Plan Creation**: Select exercises → Set repetitions → Create plan (status: pending)
3. **Session Execution**: Start plan → Update status (active) → Tap counter → Complete (status: completed)
4. **Dashboard Display**: Fetch plans → Filter by status/date → Display in sections

## 🎨 UI/UX Design

- **Mobile-First**: Optimized for touch devices
- **Large Touch Targets**: Buttons min 48x48px
- **Bottom Navigation**: Easy thumb access
- **Therapy-friendly Colors**: Indigo, Green, Amber
- **Progress Indicators**: Always show session progress

## 🔌 Replacing JSON Server

To connect to a real backend:

1. Update `apiUrl` in `exercise.service.ts` and `plan.service.ts`
2. Add authentication interceptors if needed
3. Update models if API contracts differ

All HTTP calls are centralized in services for easy replacement.

## 🧪 Testing Workflow

1. Create 3-4 exercises
2. Create an instant plan with 2-3 exercises
3. Start session from dashboard
4. Tap counter for each exercise
5. Complete session and view summary

## 🔮 Future Enhancements

- User authentication
- AI speech analysis
- Progress tracking
- Push notifications
- Exercise videos
- Therapist portal

## 📱 Mobile Optimizations

- Responsive Tailwind breakpoints
- Touch-friendly buttons
- Bottom navigation
- Minimal scrolling during sessions
- Large readable text
- High contrast colors

---

**Built with ❤️ for speech therapy practitioners and patients**

