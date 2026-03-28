# 🚀 Crypto Trading Platform - Scalable Full-Stack API with Authentication & RBAC

A production-ready full-stack crypto trading platform demonstrating secure backend architecture with JWT authentication, role-based access control (RBAC), and a React frontend for API interaction.

---

## ✨ Features

### 🔧 Backend (Primary Focus)
- JWT Authentication using secure tokens
- Password hashing with bcrypt
- Role-Based Access Control (User/Admin)
- CRUD APIs for trade management
- API versioning (`/api/v1`)
- Centralized error handling
- Input validation using express-validator
- Swagger API documentation
- MongoDB with Mongoose ODM
- Rate limiting & security middleware (Helmet)
- Logging with Winston

---

### 🎨 Frontend (React)
- User Registration & Login
- Protected Dashboard (JWT-based)
- Trade CRUD operations
- Trade statistics
- Error & success notifications
- Responsive UI

---

## 🛠 Tech Stack

### Backend
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT (Authentication)  
- bcryptjs (Password hashing)  
- Swagger (API docs)  
- Winston (Logging)  

### Frontend
- React.js  
- React Router  
- React Hot Toast  

---

## 📦 Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.js
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/aayushisabharwal/Crypto-Trading-Platform-PrimeTeade.ai.git
cd Crypto-Trading-Platform-PrimeTeade.ai
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```

Backend runs on:  
http://localhost:5000

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on:  
http://localhost:3000

---

## 📚 API Documentation

Swagger UI:  
http://localhost:5000/api-docs

---

## 🔐 Authentication Flow

- User registers → password hashed  
- User logs in → receives JWT token  
- Protected routes → verified via middleware  
- Role-based access → restricts admin routes  

---

## 🧪 Core APIs

### Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`

### Trades
- GET `/api/v1/trades`
- POST `/api/v1/trades`
- PUT `/api/v1/trades/:id`
- DELETE `/api/v1/trades/:id`

---

## 🔒 Security Features

- JWT-based authentication  
- Password hashing (bcrypt)  
- Input validation  
- Rate limiting  
- Secure headers (Helmet)  

---

## 📈 Scalability Notes

- Modular MVC + Service Layer architecture  
- Stateless authentication using JWT  
- Pagination for large datasets  
- Logging for monitoring  
- Easily extendable to microservices  

---

## 🎯 Assignment Coverage

✔ Authentication & Authorization  
✔ Role-Based Access Control  
✔ CRUD APIs  
✔ API Documentation  
✔ Database integration  
✔ Basic frontend UI  
✔ Security best practices  
✔ Scalable architecture  

---

## 👤 Author

**Aayushi Sabharwal**  
GitHub: https://github.com/aayushisabharwal

---

## 🚀 Ready for Demo

- Backend: http://localhost:5000  
- Frontend: http://localhost:1234 
- Swagger Docs: http://localhost:5000/api-docs  
