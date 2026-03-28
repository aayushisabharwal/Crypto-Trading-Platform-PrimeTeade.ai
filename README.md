# Crypto Trading Platform

A production-grade crypto trading platform with JWT authentication, role-based access control, and comprehensive trade management.

## 🚀 Features

### Backend
- **User Authentication**: JWT-based authentication with password hashing (bcrypt)
- **Role-Based Access**: User and Admin roles with protected routes
- **Trade Management**: Complete CRUD operations for trades
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Input validation, XSS protection, rate limiting, helmet.js
- **Logging**: Winston logger with file rotation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM
- **Pagination**: Built-in pagination for list endpoints
- **Filtering/Sorting**: Advanced query parameters for filtering and sorting

### Frontend
- **React SPA**: Modern React application with hooks
- **Authentication**: Login/Register with JWT storage
- **Dashboard**: Statistics and quick actions
- **Trade Management**: Create, read, update, delete trades
- **Responsive Design**: Mobile-friendly UI
- **Toast Notifications**: Real-time feedback

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-trading-platform.git
cd crypto-trading-platform/backend