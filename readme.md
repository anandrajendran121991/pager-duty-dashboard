# FullstackPlate 🚀

A **Dockerized full-stack boilerplate** with **React (Vite)** frontend and **Express (Node.js)** backend. Both apps have **hot reload** enabled inside Docker.

---

## 📂 Project Structure

```
project-root/
  docker-compose.yml
  frontend/           # React + Vite app
  backend/            # Express backend app
```

---

## 🔥 Features

- ⚡ **Frontend**: React + Vite (HMR enabled)
- 🖥️ **Backend**: Express with Nodemon (auto restart on save)
- 🐳 **Dockerized**: Ready to run with `docker-compose`
- 🎯 **Hot Reload**: Works seamlessly in both frontend & backend
- 🔐 Modern Node.js runtime (22 LTS)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/anandrajendran121991/fullstackplate.git
cd fullstackplate
```

### 2. Start the stack

```bash
docker-compose up --build
```

### 3. Access apps

- Frontend → [http://localhost:5175](http://localhost:5175)
- Backend → [http://localhost:5001](http://localhost:5001)

---

## 🛠 Development

### Frontend (React + Vite)

- Source in `react-frontend/`
- Auto reloads browser on changes
- Default port: **5175**

### Backend (Express)

- Source in `express-backend/`
- Auto restarts with Nodemon on changes
- Default port: **5001**

---

## 🔗 Frontend → Backend Proxy

We use **Vite’s dev server proxy** to forward API requests to the backend.
This avoids CORS issues and keeps API calls simple.

- Frontend calls `/api/...`
- Vite proxies to backend service (`express-backend:3000` in docker-compose)

Example:

```js
// frontend
fetch("/api/hello").then((res) => res.json());
```

```js
// backend
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express Backend 🚀" });
});
```

---

## ⚙️ Commands

### Start containers

```bash
docker-compose up
```

### Rebuild containers

```bash
docker-compose build --no-cache
```

### Stop containers

```bash
docker-compose down
```

---

## 📌 Next Steps

- Develop frontend features and backend features
- Add **tests** (Jest for backend, Vitest for frontend)
