#🔗 LinkDB
Visual SQL Query Builder & Database Schema Designer

Design databases visually. Build relationships intuitively. Export SQL instantly.

🌟 Overview

LinkDB is a modern visual SQL query builder and database schema designer that helps developers, students, and startups design databases without writing complex SQL manually.

Inspired by tools like drawSQL, LinkDB focuses on:

⚡ Speed

🧠 Clarity

🎨 Visual-first design

🚀 Developer productivity

✨ Key Features
🧱 Visual Schema Designer

Drag & drop tables

Add columns and data types visually

Edit primary keys, unique constraints, and defaults

🔗 Relationship Builder

Draw relationships between tables

Define foreign keys visually

Clear one-to-one, one-to-many relationships

🧠 SQL Generation

Auto-generate clean SQL queries

Export schema as SQL

Supports MySQL / PostgreSQL / SQLite

💾 Save & Manage Designs

Save multiple schema designs

Load, update, and delete designs

User-specific private schemas

🔐 Authentication

Secure login & signup

JWT-based authentication

Each user sees only their own designs

🖥️ Full Preview Mode

Toggle between Edit Preview & Full Preview

Hide side panels for focused canvas view

Smooth animated transitions

⚡ Premium UX

Figma-like canvas interactions

Animated side panels

Responsive & clean UI

🛠️ Tech Stack
🎨 Frontend

⚛️ React + TypeScript

🐻 Zustand (State Management)

🎨 Tailwind CSS

🎞️ Framer Motion

🔗 React Flow (@xyflow/react)

🧩 Backend

🟢 Node.js

🚂 Express.js

🍃 MongoDB + Mongoose

🔐 JWT Authentication

📂 Project Structure
linkdb/
├── client/                 # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── contexts/
│   └── main.tsx
│
├── server/                 # Backend (Node.js)
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/linkdb.git
cd linkdb

2️⃣ Frontend Setup
cd client
npm install
npm run dev


Create .env file:

VITE_API_URL=http://localhost:5000

3️⃣ Backend Setup
cd server
npm install
npm run dev


Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

🔐 API Endpoints
👤 Authentication
POST /api/auth/register
POST /api/auth/login

📐 Designs
GET    /api/designs
POST   /api/designs
PUT    /api/designs/:id
DELETE /api/designs/:id


🔒 All design routes are protected with JWT authentication.

🎨 UI Highlights

🧭 Collapsible Schema Explorer

⚙️ Toggleable Properties Panel

🎥 Smooth sidebar animations

🖥️ Full-screen canvas preview

💡 Keyboard-friendly interactions

🧠 Use Cases

👨‍💻 Backend Developers – plan database architecture

🎓 Students – learn DB design visually

🚀 Startups – design schemas faster

🧑‍🏫 Educators – teach database concepts

🏗️ Architects – document complex schemas
