# Pager Duty Dashboard

Pager Duty Dashboard is a full-stack boilerplate built with **React (Vite)** on the frontend and **Express.js** on the backend.  
It provides a foundation for building real-time operational dashboards, integrating with incident management tools like **PagerDuty** to track, visualize, and manage system reliability.

## 🚀 Features

- ⚡️ **React + Vite Frontend** – Fast development with hot reload and modern tooling.
- 🛠 **Express.js Backend** – Simple, scalable API layer ready for integrations.
- 🔄 **Frontend ↔ Backend Proxy** – Simplified API calls during development.
- 🐳 **Dockerized Setup** – Consistent environment with Docker Compose.
- 🔔 **PagerDuty Integration (Planned)** – Fetch incidents, trigger alerts, and manage on-call rotations.
- 📊 **Future Extensions** – Post-incident management, analytics, and ops resilience metrics.

## 📂 Project Structure

```

pager-duty-dashboard/
├── backend/       # Express.js backend
├── frontend/      # React (Vite) frontend
├── docker-compose.yml
└── README.md

```

## 🏗 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anandrajendran121991/pager-duty-dashboard.git
```

### 2. Start with Docker

```bash
docker-compose up --build
```

- Frontend: [http://localhost:5175](http://localhost:5175)
- Backend: [http://localhost:3000](http://localhost:3000)

### 3. Hot Reload

- Frontend uses **Vite HMR** (auto-reload on save).
- Backend uses **Nodemon** (auto-restart server on changes).

---

## 🔮 Roadmap

- ✅ Basic React + Express setup
- ✅ Dockerized local development
- 🔲 PagerDuty API integration (list & create incidents)
- 🔲 Post-incident analysis workflows
- 🔲 Resilience metrics & reporting
