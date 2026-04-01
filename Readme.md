# 📝 NotesVault

**The Ultimate Secure Workspace for Your Thoughts 🚀⚡**

---

## 📌 Project Overview

NotesVault is a full-stack web application designed for secure and fast note management.
It allows users to store, organize, and access their notes in a clean and distraction-free interface.

> "Your second brain, but more secure." 🔥🛡️

---

## 🔐 Key Features

### 🛡️ Security

* JWT Authentication for secure sessions
* OTP Verification using Nodemailer (6-digit email codes)
* Secure password reset system

### ⚡ User Experience

* 📌 Smart Pinning – Pin important notes to the top
* 🧱 Masonry Layout – Responsive grid (Pinterest-style)
* 🔍 Instant Search – Real-time filtering of notes
* 🗑️ Hard Delete – Permanent one-click deletion

---

## 🛠️ Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | HTML5, CSS3, JavaScript |
| Backend  | Node.js, Express.js     |
| Database | MongoDB (Mongoose)      |
| Security | JWT, Nodemailer         |

---

## 📂 Project Structure

```
NotesVault/
├── backend/             # Server, Auth & Database Logic
│   ├── middleware/     # Security layers
│   ├── models/         # Mongoose schemas
│   └── routes/         # API endpoints
└── frontend/           # UI & client-side logic
    ├── auth.js
    └── dashboard.js
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```
git clone https://github.com/rohitmunjal/NotesVault.git
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file and add:

```
MONGO_URI=your_mongo_uri  
JWT_SECRET=your_secret  
EMAIL=your_email  
PASSWORD=your_password  
```

Run server:

```
npm start
```

---

### 3️⃣ Frontend Setup

* Open `index.html` using Live Server
* Make sure API URLs are correctly set in `dashboard.js`

---

## 🚀 Features in Action

* Secure authentication with OTP
* Real-time note management
* Clean and responsive UI

---

## 📌 Future Improvements

* Dark mode 🌙
* Tags & categories
* Cloud sync enhancements
