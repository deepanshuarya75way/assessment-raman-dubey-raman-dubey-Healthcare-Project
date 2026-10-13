# 🏥 DocConnect — Healthcare & Doctor Appointment System

A modern full-stack Healthcare Doctor Appointment booking and management application built with the **MERN** stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

---

## ✨ Features

- **Patient Portal:**
  - Browse doctors by speciality (General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist).
  - Book doctor appointments with date & time slot selection.
  - User authentication (JWT sign up / sign in) with protected routes.
  - Patient dashboard: view profile, edit details, upload avatar, view & cancel appointments.
  - Interactive Contact Us form.

- **Admin Panel (`/admin`):**
  - Dedicated admin dashboard with overview analytics (total doctors, appointments, users).
  - Manage doctors: Add new doctor, toggle availability, edit/delete doctors.
  - Manage appointments: mark appointments completed or cancelled.
  - Manage registered users.

- **Doctor Panel (`/doctor/login`):**
  - Dedicated doctor login & self-service setup.
  - View assigned appointments and manage schedule.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Axios, React Toastify.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Multer, Cors.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Healthcare-Project.git
cd Healthcare-Project
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@docconnect.com
ADMIN_PASSWORD=admin123
```

Seed initial doctor data (optional):
```bash
node seed/seedDoctors.js
node seed/seedAdmin.js
```

Start backend:
```bash
npm run dev
# or
node server.js
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 🌐 Deployment

- **Backend:** Can be deployed to [Render](https://render.com) or [Railway](https://railway.app).
- **Frontend:** Can be deployed to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
- **Database:** Hosted on [MongoDB Atlas](https://www.mongodb.com/atlas).
