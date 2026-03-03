# Event Booking Platform

A comprehensive event booking system featuring a backend REST API and a frontend web application. Users can browse events, book tickets, and organizers can manage their events seamlessly.

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js & npm (for local frontend development)
- Python 3.10+ (for local backend development)
- PostgreSQL (if not using Docker)

### Running with Docker

The easiest way to get the entire platform running is via Docker Compose, which spins up the Database, Backend, and Frontend containers simultaneously.

1. **Configure Environment Variables**

   Set up the `.env` files for both the frontend and backend by copying the provided example structures:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. **Start the Containers**

   From the root directory of the project, run:

   ```bash
   docker-compose up --build -d
   ```

   This command brings up 3 interconnected containers:
   - `event_booking_db` (PostgreSQL 15 running on host port `5433`)
   - `event_booking_backend` (FastAPI backend mapping port `8000`)
   - `event_booking_frontend` (Vite/React frontend mapping port `80`)

3. **Access the Application**
   - **Frontend UI:** [http://localhost](http://localhost)
   - **Backend API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Detailed Documentation

For an in-depth dive into the technical stacks, scripts, and folder configurations, please refer to the dedicated READMEs inside each directory:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
