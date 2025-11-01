# 🌐 SuperOps Hackathon Project

A full-stack web application built for the **SuperOps Hackathon**, featuring an interactive frontend, Python backend, and integration between both services. The project follows an **industrial-grade architecture** with modular structure, environment configuration, and API-based communication.

---

## 📁 Project Structure
```
superops_hackathon/
├── backend/
│ ├── venv/ # Python virtual environment
│ ├── .env # Backend environment variables
│ ├── app.py # Flask entry point
│ ├── requirements.txt # Backend dependencies
│ ├── static/ # Static files (if any)
│ └── templates/ # HTML templates (if Flask uses them)
│
├── frontend/
│ ├── src/ # React source code
│ ├── public/ # Public assets
│ ├── .env # Frontend environment variables
│ ├── package.json # Frontend dependencies
│ ├── vite.config.js # Vite configuration
│ └── README.md # Frontend-specific docs (optional)
│
├── .env # Root-level environment configuration
├── README.md # Project documentation (this file)
└── .gitignore # Ignored files for Git
```


---

## ⚙️ Tech Stack

**Frontend:**
- React.js (Vite)
- Axios (for API calls)
- TailwindCSS / ShadCN UI (for design)
- Lucide Icons (UI icons)

**Backend:**
- Python 3.x
- Flask
- Flask-CORS
- OpenAI API (if integrated)
- dotenv (for environment management)

**Hosting / Deployment:**
- GitHub Codespaces (for development)
- AWS / Render / Railway (optional for production)

---

## 🔑 Environment Setup

### 1️⃣ Backend (`backend/.env`)
```env
FLASK_ENV=development
PORT=5000
OPENAI_API_KEY=your_api_key_here
```

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
### 💻 Step 3: Start the Frontend

```
cd frontend
npm install
npm run dev
```

### 🧠 Common Issues

| Issue                                             | Solution                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| `EACCES: permission denied` when running frontend | Run `sudo lsof -i :5173` then `kill -9 <PID>`                       |
| Backend not responding                            | Check `.env` and confirm backend is running at `localhost:5000`     |
| Virtual environment not activating                | Ensure you’re in PowerShell or Bash; use correct activation command |
| `cut` not recognized on Windows                   | Replace command with PowerShell equivalent (see below)              |


