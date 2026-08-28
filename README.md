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
