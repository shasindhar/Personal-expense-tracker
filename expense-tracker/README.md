# 💰 Expense Tracker

A full-stack personal finance management application built with **React + Vite** (frontend) and **Spring Boot + MongoDB** (backend). Track income, expenses, savings, and set per-category budget limits — all secured with JWT authentication.

🚀 **Live Demo:** [https://personal-expense-tracker-production-4579.up.railway.app](https://personal-expense-tracker-production-4579.up.railway.app)

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Pages & Functions](#pages--functions)

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Recharts   |
| Backend   | Spring Boot 3.2, Java 17, Maven          |
| Database  | MongoDB                                  |
| Auth      | JWT (JSON Web Tokens)                    |
| HTTP      | Axios (with JWT interceptor)             |

---

## ✨ Features

### 🔐 Authentication
- **Register** — Create a new account with name, email, and password
- **Login** — Authenticate with email and password or use **Google Sign-In**; receive a JWT token
- **JWT-protected routes** — All API endpoints require a valid Bearer token
- **Auto-logout** — Token stored in `localStorage`; cleared on logout

### 📊 Dashboard
- **Summary cards** — At-a-glance view of:
  - Total Income
  - Total Expenses
  - Total Savings
  - Net Balance (Income − Expenses − Savings)
  - Month Spend (current month expenses only)
  - Remaining Budget (total budget limit − total spent this month)
- **Spending by Category** — Pie chart showing expense breakdown per category
- **Monthly Overview** — Bar chart showing income, expenses, and savings per month
- **Category Budget Progress** — Progress bars per category with colour-coded status (On Track / Near Limit / Limit Reached)
- **Recent Transactions** — Full scrollable transaction table with delete support

### ➕ Add Entry (`/add-expense`)
- Choose entry type: **Expense**, **Income**, or **Savings**
- Fields: Title, Amount (₹), Category, Date, Notes (optional)
- **Budget alert notifications** — Automatically checks if adding an expense crosses 80% or 100% of the category's budget limit and shows a toast warning
- Pre-selects entry type when navigated to via URL query param (e.g. `?type=savings`)

### 🎯 Budget Manager (`/budget`)
- **Set a budget limit** — Choose a category and set a monthly spending cap
- **Edit a budget limit** — Click the pencil icon on any card or select the category in the form to update
- **Delete a budget limit** — Remove a budget cap with confirmation
- **Budget cards** — Each category shows:
  - Amount spent vs. limit
  - Remaining amount
  - Progress bar (green / amber / red)
  - Status badge: ✅ On Track, ⚠️ Near Limit, 🚨 Limit Reached
- **Unbudgeted spending** — Shows categories that have expenses but no budget limit set, with a quick "Set limit" shortcut
- **Per-user budgets** — Every user's budget limits are completely independent and stored separately in the database

### 🐷 Savings (`/savings`)
- **Total Savings Balance** — Shows the cumulative savings amount set aside
- **Add to Savings** — Button navigates to the Add Entry form pre-set to Savings type
- **Savings transaction list** — All savings entries sorted by date (most recent first)
- Savings are tracked separately from income and expenses

### 🔔 Budget Toast Notifications
- Triggered automatically after adding an expense
- **⚠️ 80% warning** — "You have used X% of your [Category] budget"
- **🚨 100% alert** — "[Category] expense limit reached!"
- Toasts auto-dismiss after 6 seconds

---

## 📁 Project Structure

```
expense-tracker/
├── src/                        # Frontend (React)
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Main financial overview
│   │   ├── AddExpense.jsx      # Add income/expense/savings entry
│   │   ├── Budget.jsx          # Budget manager
│   │   └── Savings.jsx         # Savings tracker
│   ├── components/
│   │   ├── ExpenseChart.jsx    # Pie & bar charts (Recharts)
│   │   └── ExpenseTable.jsx    # Transaction table
│   ├── context/
│   │   └── BudgetContext.jsx   # Global budget state & toast notifications
│   ├── services/
│   │   └── api.js              # Axios instance + all API calls
│   ├── utils/
│   │   └── auth.js             # Token helpers (get/set/remove)
│   └── App.jsx                 # Routes & layout
│
└── backend/                    # Backend (Spring Boot)
    └── src/main/java/com/tracker/
        ├── controller/
        │   ├── AuthController.java     # /api/auth/register, /api/auth/login
        │   ├── ExpenseController.java  # CRUD for expenses
        │   └── BudgetController.java   # Budget limit CRUD + spending summary
        ├── service/
        │   ├── AuthService.java        # Registration & login logic
        │   ├── ExpenseService.java     # Expense business logic
        │   └── BudgetLimitService.java # Budget limit & spending logic
        ├── model/
        │   ├── User.java
        │   ├── Expense.java
        │   └── BudgetLimit.java
        ├── repository/
        │   ├── UserRepository.java
        │   ├── ExpenseRepository.java
        │   └── BudgetLimitRepository.java
        └── config/
            ├── SecurityConfig.java         # Spring Security + CORS
            ├── JwtUtil.java                # JWT generation & validation
            └── JwtAuthenticationFilter.java # JWT request filter
```

---

## ✅ Prerequisites

Make sure the following are installed before running the project:

| Tool        | Version  | Download |
|-------------|----------|----------|
| Node.js     | v18+     | https://nodejs.org |
| Java JDK    | 17+      | https://adoptium.net |
| Maven       | 3.8+     | https://maven.apache.org |
| MongoDB     | 6+       | https://www.mongodb.com/try/download/community |

---

## 🚀 Running the Project

### 1. Start MongoDB
Make sure MongoDB is running locally on the default port `27017`.

```bash
# Windows (if installed as a service)
net start MongoDB

# Or start manually
mongod
```

### 2. Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd expense-tracker/backend
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**

> First run may take a few minutes to download Maven dependencies.

### 3. Start the Frontend

Open a **new terminal** and navigate to the project root:

```bash
cd expense-tracker
npm install       # Only needed the first time
npm run dev
```

The frontend will start at **http://localhost:3000**

### 4. Open the App

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌱 Environment Variables

Copy `.env.example` to `.env` and fill in your values. For the frontend, create a `.env` in the root:

```bash
cp .env.example .env
```

| Variable                  | Description                              | Default                          |
|---------------------------|------------------------------------------|----------------------------------|
| `VITE_GOOGLE_CLIENT_ID`   | Google OAuth Client ID for sign in       | (your google client id)          |
| `VITE_API_URL`            | Backend API URL                          | `http://localhost:8080/api`      |

For the backend, configure `backend/src/main/resources/application.properties` with:
| Variable                  | Description                              | Default                          |
|---------------------------|------------------------------------------|----------------------------------|
| `MONGODB_URI`             | MongoDB connection string                | `mongodb://localhost:27017/expensedb` |
| `JWT_SECRET`              | Secret key for signing JWT tokens        | (set a strong random string)     |
| `JWT_EXPIRATION`          | Token expiry in milliseconds             | `86400000` (24 hours)            |
| `google.client.id`        | Google OAuth Client ID for verification  | (your google client id)          |

---

## 📡 API Endpoints

All endpoints (except `/api/auth/*`) require the header:
```
Authorization: Bearer <your_jwt_token>
```

### Auth
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/api/auth/register`  | Create a new account   |
| POST   | `/api/auth/login`     | Login & get JWT token  |

### Expenses
| Method | Endpoint             | Description                         |
|--------|----------------------|-------------------------------------|
| GET    | `/api/expenses`      | Get all entries for logged-in user  |
| POST   | `/api/expenses`      | Create a new entry                  |
| DELETE | `/api/expenses/{id}` | Delete an entry by ID               |

### Budgets
| Method | Endpoint                          | Description                             |
|--------|-----------------------------------|-----------------------------------------|
| GET    | `/api/budgets`                    | Get all budget limits for current user  |
| PUT    | `/api/budgets/{category}`         | Create or update a budget limit         |
| DELETE | `/api/budgets/{category}`         | Remove a budget limit                   |
| GET    | `/api/budgets/spending`           | Get current-month spending per category |

---

## 📂 Other Scripts

```bash
# Type-check the frontend (no emit)
npm run lint

# Build the frontend for production
npm run build
```

---

## 💡 Notes

- **Budget limits are per-user** — Each account has its own independent budget limits stored in MongoDB; no defaults are pre-assigned to new users.
- **All monetary values are in Indian Rupees (₹).**
- **Production Ready** — The application relies entirely on the live backend and does not contain any mock data or fallback modes.
