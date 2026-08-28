# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Job Application Tracking System (JATS)

A full-stack application where **Recruiters** post job openings and **Candidates** apply to them,
with a status-tracking workflow: `APPLIED → SHORTLISTED → REJECTED / HIRED`.

Built as a fresher-level project to demonstrate core Java, Spring Boot, REST API design, JPA/Hibernate,
MySQL, and basic React — intentionally without authentication frameworks, microservices, or other
advanced tooling, so every part of it is simple to explain in an interview.

---

## 🚀 Live Demo / Screenshots

> _Add screenshots or a GIF walkthrough here once your UI is running, e.g._
> `![Job board screenshot](screenshots/job-board.png)`

---

## 📖 Overview

- Recruiters post jobs with a deadline and manage applicants.
- Candidates browse/search open jobs and apply.
- Applications move through a defined status pipeline with validation on every transition.
- Business rules are enforced server-side: no duplicate applications, no applying after a
  job's deadline, and only valid status transitions are allowed.

---

## ✨ Features

- Register users with a role (`CANDIDATE` or `RECRUITER`)
- Post / close a job (recruiter only)
- List open jobs and search by title + location
- Apply to a job (candidate only)
- View my applications (candidate) / view applicants for a job (recruiter)
- Update application status with transition validation (e.g. can't move `HIRED` back to `APPLIED`)
- Centralized, structured error responses for every failure case

---

## 🛠 Tech Stack

**Backend:** Java 21 · Spring Boot 3 · Spring Web · Spring Data JPA · Hibernate · MySQL · Maven · Bean Validation · Lombok

**Frontend:** React (Vite) · Fetch API · Plain CSS

**Tools:** Postman · Git/GitHub · IntelliJ IDEA · VS Code

---

## 🏗 Architecture

React Frontend (Vite, port 5173)
|
| REST calls (fetch)
v
Spring Boot REST API (port 8080)
|
Controller layer -> HTTP request/response only
|
Service layer -> business rules & validation
|
Repository layer -> Spring Data JPA
|
MySQL database


Standard 3-layer backend architecture (Controller → Service → Repository) — no microservices,
no message queues, no reactive stack.

---

## 🗄 Database Schema

**Tables:** `users`, `jobs`, `applications`

**Relationships**
- `users` (1) → (many) `jobs` — a recruiter posts many jobs
- `users` (1) → (many) `applications` — a candidate has many applications
- `jobs` (1) → (many) `applications` — a job receives many applications
- `applications` is the junction entity resolving the many-to-many relationship between
  candidates and jobs, and it also carries its own data (`status`, `appliedDate`).

   User (1) ---- posts ----> (M) Job
   User (1) ---- applies --> (M) Application
   Job (1) ---- receives -> (M) Application

---

## 📁 Project Structure

backend/ (Spring Boot)
├── src/main/java/com/jats
│ ├── controller # REST endpoints
│ ├── service # business logic
│ ├── repository # Spring Data JPA interfaces
│ ├── entity # JPA entities
│ ├── dto # request/response objects
│ ├── enums # Role, JobStatus, ApplicationStatus
│ ├── exception # custom exceptions + global handler
│ └── config # CORS configuration
└── src/main/resources/application.properties

frontend/ (React + Vite)
└── src
├── api.js # all backend API calls
├── App.jsx
├── App.css
└── components
├── RegisterForm.jsx
├── CandidateView.jsx
└── RecruiterView.jsx



---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users` | Register a user (candidate or recruiter) |
| GET | `/api/users/{id}` | Get a user by id |
| GET | `/api/users` | List all users |
| POST | `/api/jobs` | Recruiter posts a job |
| GET | `/api/jobs` | List all open jobs |
| GET | `/api/jobs/search?title=&location=` | Search open jobs |
| GET | `/api/jobs/recruiter/{recruiterId}` | Jobs posted by a recruiter |
| PUT | `/api/jobs/{id}/close?recruiterId=` | Close a job (owner only) |
| POST | `/api/applications` | Candidate applies to a job |
| GET | `/api/applications/candidate/{candidateId}` | A candidate's applications |
| GET | `/api/applications/job/{jobId}?recruiterId=` | Applicants for a job (owner only) |
| PUT | `/api/applications/{id}/status` | Update an application's status |

---

## ⚙️ Business Rules Enforced

- A candidate cannot apply twice to the same job.
- A candidate cannot apply after a job's deadline or to a closed job.
- Application status can only move forward along a defined path:
  `APPLIED → SHORTLISTED/REJECTED`, `SHORTLISTED → HIRED/REJECTED`. `HIRED`/`REJECTED` are final.
- Only the recruiter who posted a job can close it or view its applicants.

---

## ▶️ How to Run Locally

### 1. Backend (Spring Boot)
```bash
cd backend
# Update src/main/resources/application.properties with your MySQL username/password
mvn clean install
mvn spring-boot:run
```
Runs at `http://localhost:8080`.

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

> Both servers must be running at the same time. CORS is configured in `WebConfig.java`
> to allow requests from `http://localhost:5173`.

### 3. Test with Postman (optional)
Import `postman/JATS.postman_collection.json` and run through: register recruiter → register
candidate → post job → apply → update status.

---

## 📝 Sample Request/Response

**POST /api/applications**
```json
// Request
{ "jobId": 1, "candidateId": 2 }

// Response 201
{
  "id": 1,
  "jobTitle": "Java Backend Developer",
  "candidateName": "Poornima",
  "status": "APPLIED",
  "appliedDate": "2026-08-27"
}
```

**Error response (duplicate application) — 409**
```json
{
  "timestamp": "2026-08-27T10:15:00",
  "status": 409,
  "message": "You have already applied to this job"
}
```

---

## 🔮 Future Improvements

- Spring Security + JWT for real authentication/authorization by role
- Pagination and sorting on job listings
- Resume file upload (multipart) for candidates
- Email notification when application status changes
- Unit tests (JUnit + Mockito) for the service layer
- Deploy backend + frontend (e.g. Render/Railway + Vercel/Netlify)

---

## 👤 Author

**Your Name**
POORNIMA



This project is open source and available under the [MIT License](LICENSE).

