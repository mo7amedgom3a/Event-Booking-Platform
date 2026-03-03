# Event Booking Platform - Frontend

This repository directory contains the React/Vite-based frontend module for the Event Booking Platform.

## Folder Structure

```text
frontend/
├── public/               # Static assets (images, generic config files)
└── src/
    ├── components/       # Presentational components and primitive UI slices (shadcn)
    ├── context/          # React Context providers (AuthContext, etc.)
    ├── hooks/            # Custom reusable React hooks (useAuth, useEvents)
    ├── lib/              # Utility functions, validators, and formatters
    ├── pages/            # View components that correspond to app routes
    ├── services/         # Services containing API endpoints wrappers (axios/fetch)
    ├── App.tsx           # Global application layout and route registry
    ├── index.css         # Global tailwind styles
    └── main.tsx          # Application entry point binding React to the DOM
├── package.json          # Dependencies and script definitions
├── vite.config.ts        # Vite configuration
└── tailwind.config.ts    # Tailwind CSS and theme overrides
```

## Main Packages Used

This project was securely bootstrapped utilizing Vite for unmatched speed, backed by leading modern tools:

- **React (`react`, `react-dom`)**: Core robust UI library representing the application logic views.
- **Vite (`vite`)**: Incredibly fast module bundler, development server, and build compiler.
- **React Router DOM (`react-router-dom`)**: Deployed for single-page client-side navigational routing.
- **Tailwind CSS (`tailwindcss`)**: The backbone of our utility-class oriented, responsive styles.
- **Radix UI (`@radix-ui/react-*`)**: Underpins our unstyled primitive accessibility hooks leveraged across UI panels.
- **React Hook Form (`react-hook-form` & `@hookform/resolvers`)**: Handling complicated, high-performance form states with real-time feedback.
- **Zod (`zod`)**: TypeScript-first validation schemas verifying input accuracy.
- **React Query (`@tanstack/react-query`)**: Employs efficient, cached layout syncing of asynchronous API data queries.
- **React Leaflet (`react-leaflet`, `leaflet`)**: Displays custom map views detailing event geographies.
- **date-fns**: Straightforward date localization, modification, and parsing.
- **Recharts**: Displays informative dashboards metrics for organizer visualizations.

## How to Run It

### Standard Local Setup

Navigate deeply to the frontend directory:

```bash
cd frontend
```

1. **Install Local Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Secure an environment file reflecting backend routes:

   ```bash
   cp .env.example .env
   ```

   _(Ensure the default Vite environment targets your locally running backend API, e.g., `VITE_API_URL=http://localhost:8000`)_

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Once started, the Vite server spins up a fully-functional HMR (Hot Module Replacement) session, predominantly binding to `http://localhost:5173`.

### Running via Docker

If run via the holistic structure at the project root, the frontend will be built inside a container and automatically served on standardized port `80`.

From the project root:

```bash
docker-compose up --build -d
```

The interface is subsequently found on `http://localhost`.

## UI Implementation Status

Based on the required design guidelines and mockups outlined in `task-docs/UI_DESIGN.md`, the following elements have been delivered:

### ✅ Implemented Designs

- **Home Page**: Complete with a dynamic Hero Section, Featured Events carousel/grid, Browse by Category filters, and a "How It Works" explanatory section.
- **Events List Page**: Fully functional with a collapsible filter sidebar (categories, date range, price range, location search) and responsive event cards. Includes active sorting and pagination.
- **Event Detail Page**: Showcases a large banner image, comprehensive event metadata, interactive maps integration (via React Leaflet), available seat indicator with progress, and a dynamic booking widget capturing quantity and calculating total price.
- **Authentication Pages (Login/Register)**: Centered card layouts featuring real-time client-side form validation, clear error messaging, and role toggling during registration.
- **User Profile Page**: Contains personal information breakdown along with a dedicated "My Bookings" display rendering booking statuses and cancellation avenues.
- **Organizer Dashboard**: Offers a high-level statistics summary (total events, active events, bookings, revenue) accompanied by a "My Events" fast-action management list and a recent bookings feed.
- **Create/Edit Event Form**: A multi-step form capturing basic info, rich text descriptions, image uploads, mapped coordinates, and ticketing capacities.
- **Component Library**: Primitive Shadcn-driven UI blocks handling Buttons, nested Cards, standard Inputs, Modals/Dialogs, and automatic Toasts.
- **Accessibility & UX**: Includes skeleton loader displays, loading spinners, mobile-first responsive considerations (collapsible menus), and empty states.

### ❌ Not Implemented / Pending UI Features

- **Admin Dashboard**: No dedicated administrative overview pages for platform-wide user moderation, category curation, or global metric statistics.
- **Event Reviews & Ratings Component**: The UI components capturing and displaying star ratings and event feedback have not been added.
- **Social Sharing**: Buttons for sharing individual event details seamlessly onto social media platforms.
- **CSV Data Export UI**: Buttons or flows on the organizer dashboard allowing data downloads in Excel/CSV formats.
