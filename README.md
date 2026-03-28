# 🚀 Scalable Full-Stack API with Authentication & RBAC

A production-ready full-stack application demonstrating secure backend architecture with JWT authentication, role-based access control (RBAC), and a React frontend for API interaction.

---

## ✨ Features

### 🔧 Backend (Primary Focus)
- JWT Authentication (Access + Refresh Tokens)
- Password hashing using bcrypt
- Role-Based Access Control (User/Admin)
- CRUD APIs (Task Management)
- API versioning (`/api/v1`)
- Centralized error handling & validation
- Swagger API documentation
- MongoDB with Mongoose
- Rate limiting & security middleware
- Redis integration (caching & token blacklist)

---

### 🎨 Frontend (React)
- User Registration & Login
- Protected Dashboard (JWT-based)
- Task CRUD operations
- Error & success notifications
- Clean responsive UI

---

## 🛠 Tech Stack

### Backend
- Node.js + Express.js  
- MongoDB (Mongoose)  
- JWT (Authentication)  
- bcrypt (Password hashing)  
- Redis (Caching & security)  
- Swagger (API docs)  

### Frontend
- React.js  
- React Router  
- Axios  
- React Hot Toast  

---


## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/aayushisabharwal/Crypto-Trading-Platform-PrimeTeade.ai.git
cd Crypto-Trading-Platform-PrimeTeade.ai
2️⃣ Backend Setup
cd backend
npm install
npm run dev

Runs on:

http://localhost:3000
3️⃣ Frontend Setup
cd frontend
npm install
npm start
📚 API Documentation

Swagger UI:

http://localhost:3000/api-docs
🔐 Authentication Flow
User registers → password hashed using bcrypt
User logs in → receives JWT tokens
Protected routes → verified via middleware
Role-based access → restricts admin/user routes
🧪 Core APIs
Auth
POST /api/v1/auth/register
POST /api/v1/auth/login
Tasks
GET /api/v1/tasks
POST /api/v1/tasks
PUT /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
🔒 Security Features
JWT-based authentication
Password hashing (bcrypt)
Input validation & sanitization
Rate limiting
Secure headers (Helmet)
Redis-based token blacklist
📈 Scalability Notes
Modular MVC + Service Layer architecture
Stateless authentication (JWT)
Redis for caching & performance
Easily extendable to microservices
Ready for Docker & cloud deployment
🎯 Assignment Coverage

✔ Authentication & Authorization
✔ Role-Based Access Control
✔ CRUD APIs
✔ API Documentation
✔ Database integration
✔ Basic frontend UI
✔ Security best practices
✔ Scalable architecture

👤 Author

Aayushi Sabharwal

💡 Notes

Redis is integrated for caching and token blacklisting.
A fallback mechanism is used for local development when Redis is unavailable.

🚀 Ready for Demo
Backend running on: http://localhost:3000
Frontend running locally via React
Swagger docs available at /api-docs

---

Now just:

```bash
git add README.md
git commit -m "Added final README"
git push
