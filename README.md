📌 Roxiler Store Rating System — Full Stack (Next.js + Node.js + Prisma + MySQL)

A complete store rating system built for the Roxiler Systems Internship Assignment.
This project includes:

✔ Admin Panel
✔ Store Owner Dashboard
✔ User Store Rating System
✔ Authentication with JWT
✔ Prisma ORM + MySQL
✔ Beautiful UI using Next.js + TailwindCSS

🚀 Project Screenshots
⭐ Home Page 
![Home Page](./screenshots/Home.png)

⭐ Store Rating
![Home Page](./screenshots/Rating.png)

💡 Why Prisma?

Prisma is used because:

✅ Developer-friendly — no need to write long SQL queries
✅ Auto-generates the database client
✅ Supports migrations (prisma migrate)
✅ Strict schema ensures fewer bugs
✅ Super fast CRUD operations
✅ Works perfectly with MySQL (required by Roxiler)

Prisma allowed us to easily manage:

Users

Stores

Ratings

Relations (User → Store → Rating)

and ensured a safe, maintainable backend.

👤 User Roles & Features
🔷 Admin (System Administrator)

✔ Add Users
✔ Add Stores
✔ Add Store Owners
✔ Dashboard: Total Users, Stores, Ratings
✔ View all stores with filters
✔ View all users with filters
✔ View user details
✔ Logout

🟩 Store Owner

✔ View store’s average rating
✔ View all users who rated their store
✔ Update password
✔ Logout

🔵 Normal User

✔ Sign up / Log in
✔ View all stores
✔ Search by Name / Address
✔ Submit or update rating (1–5 stars)
✔ View their submitted rating
✔ Logout

🔧 Backend Setup (roxiler-backend)
1️⃣ Install dependencies
cd roxiler-backend
npm install

2️⃣ Configure MySQL Database
Create a database:
CREATE DATABASE roxiler;

3️⃣ Create .env file
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/roxiler"
JWT_SECRET="roxiler_secret_key"

4️⃣ Run Prisma migration
npx prisma migrate dev --name init

5️⃣ Start the server
npm start


Backend runs at:
👉 http://localhost:5000

🎨 Frontend Setup (roxiler-frontend)
1️⃣ Install dependencies
cd roxiler-frontend
npm install

2️⃣ Start the development server
npm run dev

Frontend runs at:
👉 http://localhost:3000


🔐 Authentication Flow
JWT used for all protected routes
Token saved in browser cookies
Frontend redirects based on role:

Role	Redirect
admin	/admin/dashboard
store-owner	/store-owner/ratings
user	/user/stores

🛠 Tech Stack
Frontend
Next.js 16
React 19
Tailwind CSS
Axios
js-cookie

Backend
Node.js
Express
Prisma ORM
MySQL
JSON Web Token

📦 How to Build for Production
Backend
npm run build
npm start

Frontend
npm run build
npm star
