# Event Booking System - Full-Stack Assessment

## Overview
Build a complete event booking platform with both backend API and frontend web application. Users can browse events, book tickets, and organizers can manage their events.

## Time Allocation
- **Submission Deadline**: 1 Week from start 5/3/2026
- **Estimated effort**: 25-30 hours 
- Work at your own pace

## Technology Stack

### Backend (Choose One)
- **Option A: Python** prefered 
  - Framework: Flask or FastAPI
  - ORM: SQLAlchemy or Django ORM
  - Database: PostgreSQL, MySQL, or MongoDB

- **Option B: Node.js**
  - Framework: Express.js or NestJS
  - ORM: Sequelize, TypeORM, or Prisma
  - Database: PostgreSQL, MySQL, or MongoDB

### Frontend (Required)
- **Framework**: React 18+ or Next.js 14+
- **Styling**: Tailwind CSS (recommended) or CSS Modules or styled-components
- **State Management**: Context API, Redux Toolkit, or Zustand (your choice)
- **HTTP Client**: Axios or Fetch API
- **Form Handling**: React Hook Form or Formik (recommended)
- **Routing**: React Router (if using React) or Next.js routing

### Required
- **Authentication**: JWT-based
- **Containerization**: Docker + docker-compose
- **Testing**: Basic unit tests for critical functionality

## System Features

###  User Features (Public)

#### 1. Browse Events
- View list of upcoming events
- Filter by:
  - Category (Technology, Music, Sports, Business, etc.)
  - Date range
  - City/Location
  - Price range
- Search by event name or description
- Sort by date, price, or popularity

#### 2. Event Details
- View comprehensive event information
- See venue location on map (bonus: integrate map)
- Check available seats in real-time
- View organizer information
- See event reviews/ratings (optional)

#### 3. User Authentication
- Register new account
- Login with email and password
- View own profile
- Update profile information
- Password reset (optional)

#### 4. Booking Management
- Book tickets for events
- Select number of seats
- See total price calculation
- Receive booking confirmation
- View booking history
- Cancel bookings (with rules)
- Download booking receipt (bonus)

### Organizer Features

#### 1. Event Management
- Create new events
- Edit existing events (own events only)
- Delete events (if no confirmed bookings)
- Mark event as cancelled
- View event statistics:
  - Total bookings
  - Revenue
  - Attendance rate

#### 2. Booking Management
- View all bookings for their events
- See attendee list
- Export attendee list (CSV/Excel - bonus)
- Mark attendees as checked-in (bonus)

### 👑 Admin Features (Optional Bonus)

- Manage all events
- Manage all users
- Create/manage event categories
- View platform statistics
- Approve/reject events (moderation)

## User Interface Requirements

### Pages to Implement

#### 1. Public Pages
- **Home/Landing Page**
  - Hero section with featured events
  - Upcoming events showcase
  - Categories section
  - How it works section
  
- **Events List Page**
  - Grid/list view of events
  - Filters sidebar
  - Search bar
  - Pagination or infinite scroll
  
- **Event Detail Page**
  - Event image/banner
  - Event details (date, time, location, price)
  - Available seats indicator
  - Booking form
  - Organizer info
  - Similar events (optional)
  
- **Login/Register Pages**
  - Clean form design
  - Validation feedback
  - Toggle between login/register
  
- **User Profile Page**
  - User information
  - Booking history
  - Edit profile

#### 2. Organizer Pages
- **Organizer Dashboard**
  - Overview statistics
  - Recent bookings
  - Upcoming events
  
- **My Events Page**
  - List of organizer's events
  - Quick actions (edit, view bookings, cancel)
  
- **Create/Edit Event Page**
  - Event creation form
  - Image upload
  - Category selection
  - Location input
  - Date/time pickers
  
- **Event Bookings Page**
  - List of all bookings for an event
  - Filter by status
  - Search attendees

### UI/UX Requirements

#### Design Guidelines
- **Responsive Design**: Must work on mobile, tablet, and desktop
- **Loading States**: Show spinners/skeletons while loading
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation feedback
- **Accessibility**: Basic ARIA labels and keyboard navigation
- **Visual Feedback**: Success/error notifications (toast messages)

#### Component Requirements
- Reusable components (Button, Card, Input, Modal, etc.)
- Consistent color scheme and typography
- Professional, modern design
- Smooth transitions and animations (subtle)

## Technical Requirements

### Backend API (Reference swagger.yaml)

All endpoints from the swagger.yaml file must be implemented:

**Authentication:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

**Events:**
- GET `/api/events` (with filters, pagination, search, sort)
- GET `/api/events/:id`
- POST `/api/events` (organizers only)
- PUT `/api/events/:id` (owner only)
- DELETE `/api/events/:id` (owner only)

**Bookings:**
- GET `/api/bookings` (user's bookings)
- POST `/api/bookings` (create booking)
- GET `/api/bookings/:id`
- DELETE `/api/bookings/:id` (cancel booking)

**Categories:**
- GET `/api/categories`
- POST `/api/categories` (admin only)

**Organizer Endpoints:**
- GET `/api/organizer/events` (own events)
- GET `/api/organizer/events/:id/bookings` (event bookings)

### Frontend Requirements

#### State Management
- User authentication state (logged in user)
- Events list state (with filters)
- Booking state
- Loading and error states
- Form state management

#### API Integration
- Axios/Fetch API configuration
- JWT token management (store in localStorage/cookies)
- Automatic token refresh (optional)
- Request/response interceptors
- Error handling middleware

#### Routing & Navigation
- Public routes (home, events, event detail, login)
- Protected routes (profile, bookings, organizer pages)
- Redirect unauthenticated users
- Navigation menu with role-based items
- Breadcrumbs (optional)

#### Forms & Validation
- Client-side validation
- Server error handling
- Prevent duplicate submissions
- File upload for event images
- Date/time pickers

## Project Structure

### Backend Structure (Example for FastAPI)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── event.py
│   │   ├── booking.py
│   │   └── category.py
│   │
│   ├── schemas/
│   │   ├── user.py
│   │   ├── event.py
│   │   └── booking.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── events.py
│   │   ├── bookings.py
│   │   └── categories.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── event_service.py
│   │   └── booking_service.py
│   │
│   ├── middleware/
│   │   ├── auth.py
│   │   └── error_handler.py
│   │
│   └── utils/
│       ├── jwt.py
│       └── validators.py
│
├── tests/
├── alembic/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

### Frontend Structure (Example for React)
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Loading.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventList.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── EventFilters.jsx
│   │   │   └── EventForm.jsx
│   │   │
│   │   └── bookings/
│   │       ├── BookingCard.jsx
│   │       ├── BookingList.jsx
│   │       └── BookingForm.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── MyBookingsPage.jsx
│   │   ├── OrganizerDashboard.jsx
│   │   └── CreateEventPage.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── EventContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useEvents.js
│   │   └── useBookings.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   └── bookingService.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx
│
├── package.json
├── Dockerfile
├── .env.example
└── tailwind.config.js
```

## Evaluation Criteria

| Category | Weight | Details |
|----------|--------|---------|
| **Backend API** | 25% | Endpoints working, RESTful design, error handling |
| **Frontend UI/UX** | 25% | Design quality, responsiveness, user experience |
| **Feature Completeness** | 20% | Core features working, booking flow complete |
| **Code Quality** | 10% | Clean code, component structure, reusability |
| **State Management** | 5% | Proper state handling, no prop drilling |
| **Authentication** | 5% | JWT working, protected routes, role-based access |
| **Database Design** | 5% | Schema design, relationships |
| **Testing** | 3% | Basic tests for critical paths |
| **Documentation** | 2% | Clear README, setup instructions |

## Must-Have Features (80%)

### Backend
1.  User registration and login (JWT)
2.  Role-based access (User, Organizer, Admin)
3.  CRUD operations for events (with authorization)
4.  Event filtering, searching, and pagination
5.  Booking creation with seat validation
6.  View own bookings
7.  Cancel bookings (with business rules)
8.  Organizer can view their event bookings

### Frontend
9.  Responsive home page with event showcase
10.  Events list with filters (category, date, location, price)
11.  Event detail page with booking form
12.  User authentication (login/register pages)
13.  Protected routes (redirect if not logged in)
14.  User profile page
15.  Booking history page
16.  Organizer dashboard with event management
17.  Create/edit event form
18.  Loading states and error handling
19.  Toast notifications for actions
20.  Mobile-responsive design

## Should-Have Features (15%)

21.  Search functionality (debounced)
22.  Sort events (by date, price, popularity)
23.  Event image upload
24.  Form validation with helpful messages
25.  Booking confirmation modal/page
26.  Organizer can see booking statistics
27.  Proper error boundaries (React)
28.  Skeleton loaders (better UX)
29.  Docker setup with docker-compose
30.  Basic unit tests (>30% coverage)

## Nice-to-Have Features (5%)

31.  Event reviews and ratings
32.  Map integration for event location
33.  Email notifications (booking confirmation)
34.  Export bookings to CSV/Excel
35.  Dark mode toggle
36.  Infinite scroll for events list
37.  Event recommendations
38.  Admin dashboard with statistics
39.  Calendar view of events
40.  Social sharing (share event on social media)

## Business Logic

### Booking Rules
1. **Availability Check**
   - Cannot book if no seats available
   - Cannot book more seats than available
   - Check availability before confirming booking

2. **Cancellation Rules**
   - Users can cancel their own bookings
   - Cannot cancel if event is in the past
   - Cannot cancel within 24 hours of event (configurable)
   - Seats returned to available pool on cancellation

3. **Event Rules**
   - Only organizers can create events
   - Only event owner can edit/delete their events
   - Cannot delete event with confirmed bookings
   - Can cancel event (marks all bookings as cancelled)
   - Past events cannot be edited

4. **Price Calculation**
   - Total = price × number_of_seats
   - Display total before confirmation
   - Support for free events (price = 0)

5. **Role Authorization**
   - **User**: Browse, book, view own bookings
   - **Organizer**: All user permissions + create/manage events
   - **Admin**: Full access to all resources

## Getting Started

### Prerequisites
```bash
# Backend
- Python 3.10+ or Node.js 18+
- PostgreSQL 13+ (or Docker)

# Frontend
- Node.js 18+
- npm or yarn

# Both
- Docker Desktop (optional but recommended)
- Git
```

### Quick Start with Docker

```bash
# 1. Clone repository
git clone <your-repo-url>
cd event-booking-system

# 2. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker-compose up -d

# 4. Run database migrations
docker-compose exec backend alembic upgrade head
# OR for Node.js:
docker-compose exec backend npm run migrate

# 5. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# Python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Node.js
npm install

# Setup database
createdb event_booking

# Run migrations
alembic upgrade head  # Python
npm run migrate       # Node.js

# Start server
uvicorn app.main:app --reload  # Python
npm run dev                     # Node.js
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start  # React
npm run dev  # Next.js
```

## Testing Your Implementation

### Test User Accounts
Create these test accounts for demonstration:

```
Regular User:
Email: user@example.com
Password: user123

Organizer:
Email: organizer@example.com
Password: org123

Admin (optional):
Email: admin@example.com
Password: admin123
```

### Test Flow
1. **As a visitor:**
   - View homepage
   - Browse events
   - Try to book → redirect to login
   
2. **Register new user:**
   - Create account
   - Login
   - View events
   - Book a ticket
   - View booking in profile
   
3. **As organizer:**
   - Login
   - Create new event
   - View event bookings
   - Edit event details
   
4. **Test edge cases:**
   - Try booking when no seats available
   - Try editing someone else's event
   - Try cancelling past booking
   - Test form validations

## Submission Requirements

### 1. Code Repository
- Complete backend and frontend code
- Docker setup (docker-compose.yml)
- Environment configuration (.env.example files)
- Database migrations
- README with setup instructions

### 2. Documentation

#### Update README.md
- Your chosen tech stack
- Setup instructions (detailed)
- How to run the application
- Test accounts for demo
- API endpoints overview (or link to /docs)
- Known limitations
- Screenshots (optional but recommended)

#### Create FEATURES.md
Document what you implemented:
- Completed features
- Partial implementations
- Not implemented
- Bonus features added

### 3. Running Application
- docker-compose up should start everything
- Frontend accessible at http://localhost:3000
- Backend API at http://localhost:8000
- Database properly seeded with categories

### 4. Testing
```bash
# Backend tests
pytest  # or npm test

# Frontend tests (if implemented)
npm test

# Should have >30% coverage minimum
```

## Demo Requirements

Be prepared to demonstrate:

1. **User Journey:**
   - Browse events
   - Register/login
   - Book a ticket
   - View booking

2. **Organizer Journey:**
   - Login as organizer
   - Create event
   - View bookings

3. **Responsive Design:**
   - Show mobile view
   - Show tablet view
   - Show desktop view

4. **Error Handling:**
   - Invalid login
   - Booking unavailable event
   - Form validation

## Common Pitfalls to Avoid

### Backend
-  Not validating available seats before booking
-  Missing authorization checks
- Not handling concurrent bookings
- Exposing sensitive data in API responses
- Not using environment variables

### Frontend
-  Not handling loading states
-  Poor mobile responsiveness
-  Not clearing forms after submission
-  Storing JWT in localStorage without consideration
-  Not validating forms before submission
-  Prop drilling instead of proper state management
-  Not handling API errors gracefully

## FAQ

**Q: Can I use a UI library like Material-UI or Chakra UI?**
A: Yes, but Tailwind CSS is recommended. Using a component library is fine.

**Q: Do I need to implement all "Nice to Have" features?**
A: No, they are optional bonus points. Focus on Must-Have first.

**Q: Can I use TypeScript?**
A: Yes! Highly recommended for better code quality.

**Q: Do I need real image upload or can I use URLs?**
A: URLs are fine for MVP. Real upload is a bonus.

**Q: Should I deploy the application?**
A: Not required, but bonus points if you do (Vercel, Railway, etc.)

**Q: Can I use Next.js instead of React?**
A: Yes! Next.js is actually preferred.

**Q: What about email notifications?**
A: Nice to have, but not required. Focus on core features first.

## Before You Submit - Checklist

- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] docker-compose up works
- [ ] Can register and login
- [ ] Can browse and filter events
- [ ] Can create booking (with seat validation)
- [ ] Can view booking history
- [ ] Organizer can create events
- [ ] Organizer can view event bookings
- [ ] Protected routes work correctly
- [ ] Mobile responsive
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Toast notifications work
- [ ] README updated with instructions
- [ ] .env.example files provided
- [ ] No .env files in repo
- [ ] Tests pass (if implemented)

## Submission

### How to Submit
1. Ensure all code is pushed to this repository
2. Tag your final version: `git tag v1.0.0`
3. Ensure docker-compose up works on fresh clone
4. Send email to [email protected]:
   - Subject: "Event Booking System - [Your Name]"
   - Include:
     - Your name
     - Time spent
     - Tech stack chosen
     - Screenshots (optional)
     - Deployed URL (if applicable)
     - Any notes about your implementation

**Submission Deadline**: [WILL BE PROVIDED WHEN REPO IS SHARED]

---

## Resources

### Backend
- FastAPI: https://fastapi.tiangolo.com/
- Express.js: https://expressjs.com/
- SQLAlchemy: https://www.sqlalchemy.org/
- JWT: https://jwt.io/

### Frontend
- React: https://react.dev/
- Next.js: https://nextjs.org/
- Tailwind CSS: https://tailwindcss.com/
- React Hook Form: https://react-hook-form.com/
- React Router: https://reactrouter.com/

### Tools
- Docker: https://docs.docker.com/
- PostgreSQL: https://www.postgresql.org/docs/

---

**Good luck! Build something great! **