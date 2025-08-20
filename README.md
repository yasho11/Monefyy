# Monefyy – Monorepo

This is the **monorepo** for Monefyy, a personal finance tracking and budgeting app.  
It includes both the **backend API** and the future **frontend client**.

---

## 🚀 Features (Backend Done, Frontend Pending)
- User Authentication
  - Register, Login, Google OAuth
  - JWT-based protected routes
- Finance Profile
  - Yearly income, tax %, savings %, wants %, needs %
  - Validation (splits ≤ 100%, income ≥ 0)
  - Auto-calculated monthly breakdown
- Transactions
  - CRUD endpoints for user-specific transactions
- Postman-tested endpoints
- Frontend (to be developed later)

---

## 📦 Tech Stack
- Backend: Node.js + Express + TypeScript + PostgreSQL + Sequelize
- Frontend (planned): React or Next.js + TailwindCSS
- Auth: JWT + Google OAuth
- Database: PostgreSQL, pgAdmin for management

---

## 📂 Project Structure

```
monefyy/
├── apps/
│   ├── backend/      # Backend API
│   └── frontend/     # Frontend client (future)
├── docs/             # Documentation
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/YOUR_USERNAME/monefyy.git
cd monefyy
```

### 2. Backend Setup

```bash
cd apps/backend
npm install
```

Create `.env` inside `apps/backend/`:

```
PORT=5000
DATABASE_URL=postgres://monefyy_user:yourpassword@localhost:5432/monefyy
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

## 📡 API Endpoints (Backend)

### Auth

- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login with email/password
- `GET /api/auth/me` – Get current logged-in user

### Finance Profile

- `POST /api/finance` – Create finance profile
- `GET /api/finance` – Get current user’s finance profile
- `PUT /api/finance/:id` – Update finance profile

### Transactions

- `POST /api/transactions` – Add transaction
- `GET /api/transactions` – List all transactions
- `PUT /api/transactions/:id` – Update transaction
- `DELETE /api/transactions/:id` – Delete transaction

---

## 📌 Notes

- One monorepo for both backend & frontend
- Frontend development will start after backend is stable
- All code will be pushed to a **private GitHub repository**