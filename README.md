🎓 EduMaster – Role-Based Educational Platform
EduMaster is a React-based educational platform designed with role-based authentication and dashboards for three user roles: Super Admin, Admin, and Student.

This project integrates with the backend API at https://edu-master-delta.vercel.app to manage authentication, users, and role-specific functionality.

🚀 Features
🏆 Super Admin

Create new admin accounts

Manage all users (full API access)

👨‍💻 Admin

Manage courses and student subscriptions

Access admin-only APIs

🎓 Student

Sign up and log in

Access personal student dashboard

🔒 Role-Based Route Protection

Unauthorized users are redirected automatically

⚡ React Query & Axios for efficient API handling

🌱 Built with React, React Router, and Vite

📦 Tech Stack
Frontend: React, Vite, React Router, Axios, React Query

Backend API: EduMaster API

State Management: Context API

Authentication: JWT Tokens (role-based detection)

📁 Folder Structure
graphql
Copy
Edit
src/
├── api/ # Axios API functions
├── context/ # AuthContext for global state
├── hooks/ # Custom React Query hooks
├── pages/ # Page components (Login, Signup, Dashboards)
├── components/ # Shared UI components (LogoutButton, etc.)
├── App.jsx # Main app with role-based routes
└── main.jsx # App entry point
🛠️ Getting Started
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/<your-username>/edu-master.git
cd edu-master
2️⃣ Install Dependencies
bash
Copy
Edit
npm install
3️⃣ Run the App
bash
Copy
Edit
npm run dev
App runs locally at http://localhost:5173

🔐 Environment Variables
Create a .env file in the project root:

ini
Copy
Edit
VITE_API_BASE_URL=https://edu-master-delta.vercel.app
👥 User Roles & Access
Role Default Page Access
🏆 Super Admin /super-admin Create Admins, Manage All Users
👨‍💻 Admin /admin Manage Courses, Subscriptions
🎓 Student /student View Courses, Personal Dashboard

📌 API Endpoints Used
POST /auth/login – Login user

POST /auth/signup – Register student

POST /admin/create-admin – Create admin (Super Admin only)

GET /admin/all-admin – Get all admins (Super Admin only)

GET /admin/all-user – Get all users (Admin & Super Admin)

🤝 Contributing
This is a team project. To contribute:

Pull the latest changes:

bash
Copy
Edit
git pull origin main
Create your feature branch:

bash
Copy
Edit
git checkout -b feature/your-feature
Commit your changes:

bash
Copy
Edit
git commit -m "Add your feature"
Push to the branch:

bash
Copy
Edit
git push origin feature/your-feature
Open a pull request in GitHub

📄 License
This project is licensed for internal use by the EduMaster team.

✅ Notes for Team
Always pull before pushing to avoid conflicts.

Keep API tokens in .env, never hardcode them.

Stick to the folder structure for scalability.
