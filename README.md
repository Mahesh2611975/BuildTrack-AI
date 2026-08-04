# 🏗️ BuildTrack AI - Backend

BuildTrack AI Backend is a RESTful API built with **FastAPI** for managing construction projects, employees, inventory, equipment, payroll, procurement, and reporting.

> 🚧 **Project Status:** Backend Development (v1.0)

---

## 🚀 Tech Stack

- FastAPI
- Python 3.12+
- PostgreSQL
- SQLAlchemy ORM
- Alembic
- JWT Authentication
- Pydantic
- ReportLab (PDF Reports)
- OpenPyXL (Excel Export - In Progress)

---

## 📂 Project Structure

```
backend/
│
├── alembic/
├── app/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── repository/
│   ├── reports/
│   ├── schemas/
│   ├── services/
│   ├── payroll/
│   ├── utils/
│   └── main.py
│
├── requirements.txt
└── README.md
```

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Login
- Protected APIs

---

## 👨 Employee Management

- Add Employee
- Update Employee
- Delete Employee
- Employee List

---

## 👷 Contractor Management

- Add Contractor
- Update Contractor
- Delete Contractor

---

## 🚚 Supplier Management

- Supplier CRUD

---

## 🏗️ Project Management

- Create Project
- Update Project
- Assign Employees
- Project Dashboard

---

## 📋 Task Management

- Create Tasks
- Assign Tasks
- Track Status

---

## 📅 Attendance

- Employee Attendance
- Attendance Reports

---

## 📦 Inventory

### Materials

- Material Management
- Stock Quantity

### Material Issue

- Issue Materials
- Auto Stock Deduction

### Material Return

- Return Materials
- Auto Stock Update

### Purchase Orders

- Purchase Order Management

---

## 🚜 Equipment Management

- Equipment Registration
- Equipment Assignment
- Equipment Work Logs
- Equipment Dashboard

---

## 💰 Finance

### Expenses

- Expense Management

### Budget Dashboard

- Budget Tracking
- Expense Analytics

---

## 💵 Payroll

- Salary Structure
- Payroll Calculation
- Salary Engine

---

## 📊 Dashboard

- Project Dashboard
- Equipment Dashboard
- Budget Dashboard

---

## 📄 Reports

- Employee Report (PDF)
- Report Engine
- Additional Reports (In Progress)

---

# 🔒 Authentication

The API uses **JWT Bearer Token Authentication**.

After login:

```
Authorization: Bearer <access_token>
```

---

# ▶️ Run Locally

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/BuildTrack-AI.git
```

### Navigate

```bash
cd BuildTrack-AI/backend
```

### Create Virtual Environment

```bash
python -m venv .venv
```

### Activate

Windows

```bash
.venv\Scripts\activate
```

Linux/macOS

```bash
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Alembic

```bash
alembic upgrade head
```

### Start Server

```bash
uvicorn app.main:app --reload
```

---

# 📖 API Documentation

Swagger UI

```
http://127.0.0.1:8000/docs
```

ReDoc

```
http://127.0.0.1:8000/redoc
```

---

# 🚧 Upcoming Features

- React Frontend
- Excel Export
- Salary Slip PDF
- Advanced Reports
- AI Predictions
- Email Service
- Notifications
- WebSockets
- Mobile API Support

---

# 📌 Project Status

Backend development is nearly complete.

Current focus:

- Backend Testing
- React Frontend
- Reports
- Deployment
- AI Features

---

# 👨‍💻 Developer

**Mahesh Yadav**

Computer Science Engineering Student

---

⭐ If you found this project useful, consider giving it a star.
