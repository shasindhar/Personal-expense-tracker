# 💰 Personal Expense Tracker
A full-stack personal finance management application built with **React + Vite** (frontend) and **Spring Boot + MongoDB** (backend). Track income, expenses, savings, and set per-category budget limits — all secured with JWT authentication.
---
## 📸 Screenshots
### Dashboard
![Dashboard](photos/the%20final%20dashboard.png)
### Add Expense / Data Entry
![Add Entry](photos/data%20entering%20page.png)
### Budget Management
![Budget](photos/expense%20tracker%20page.png)
### Savings Tracking
![Savings](photos/saving%20page.png)
---
## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
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
- **Login** — Authenticate with email and password; receive a JWT token
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
- **🚨 100% alert** — "[Category] limit reached!"
- Toasts auto-dismiss after 6 seconds
---
## 📁 Project Structure
```
expense-tracker/
├── src/                        # Frontend (React)
│   ├── pages/                  # Pages like Login, Register, Dashboard, etc.
│   ├── components/             # Reusable UI components
│   ├── context/                # Global states (e.g. BudgetContext)
│   ├── services/               # API / Axios interactions
│   └── App.jsx                 # Routes & layout
│
└── backend/                    # Backend (Spring Boot)
    └── src/main/java/com/tracker/
        ├── controller/         # Auth, Expense, Budget controllers
        ├── service/            # Business Logic
        ├── model/              # User, Expense, BudgetLimit models
        ├── repository/         # MongoDB Data Access Interfaces
        └── config/             # Security & JWT settings
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
### 3. Start the Frontend
Open a **new terminal** and navigate to the project root:
```bash

cd expense-tracker
npm install       # Only needed the first time
npm run dev
```

The frontend will start at **http://localhost:3000**
---

## 🌱 Environment Variables
Copy `.env.example` to `.env` in the `expense-tracker` root and fill in your values:
```bash
cp expense-tracker/.env.example expense-tracker/.env

```
| Variable                  | Description                              | Default                          |
|---------------------------|------------------------------------------|----------------------------------|
| `MONGODB_URI`             | MongoDB connection string                | `mongodb://localhost:27017/expensedb` |
| `JWT_SECRET`              | Secret key for signing JWT tokens        | (set a strong random string)     |
| `JWT_EXPIRATION`          | Token expiry in milliseconds             | `86400000` (24 hours)            |
These are configured in `expense-tracker/backend/src/main/resources/application.properties`.
---

## 💡 Notes
- **Offline / Demo mode** — If the backend is not running, the app automatically falls back to mock data so the UI remains usable for demonstration.
- **Budget limits are per-user** — Each account has its own independent budget limits stored in MongoDB.
- **All monetary values are in Indian Rupees (₹)
