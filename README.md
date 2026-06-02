# NextHire

**NextHire** is a modern, student-focused micro-internship and skill-proof platform. It allows startups and recruiters to post real-world micro-tasks, and students can submit their proof of work. NextHire moves away from traditional resumes and embraces a performance-based evaluation system.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration for both recruiters and administrators.
- **Task Board**: Recruiters can post tasks with descriptions, requirements, and deadlines.
- **Proof of Work**: Students can browse tasks and submit their work (links, repositories) for evaluation.
- **Modern UI/UX**: A beautiful, vibrant light-themed interface built with React, featuring glassmorphism elements and a custom hero poster.
- **Full-Stack Architecture**: Powered by a robust Node.js backend and a React (Vite) frontend.

## 🛠️ Tech Stack

### Frontend (`/client`)
- React.js (Vite)
- React Router DOM
- Vanilla CSS (Custom Light Theme, Glassmorphism)
- Lucide React Icons

### Backend (`/server`)
- Node.js & Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for Authentication
- bcrypt.js for password hashing

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreya21-cloud/Next_Hire.git
   cd Next_Hire
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`).
   ```bash
   # Run the backend server
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   # Run the development server
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is open-source and available under the MIT License.
 
-----------