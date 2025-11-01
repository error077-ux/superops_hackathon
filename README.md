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

### Screenshot

<img width="1906" height="949" alt="Screenshot 2025-11-01 204442" src="https://github.com/user-attachments/assets/70cc58b2-132d-4857-97fa-64aa83e4b0ea" />
<img width="1916" height="1037" alt="Screenshot 2025-11-01 204423" src="https://github.com/user-attachments/assets/b13f93b7-2c32-4b12-a811-37be80971624" />
<img width="1324" height="872" alt="Screenshot 2025-11-01 204507" src="https://github.com/user-attachments/assets/ca2229c5-c609-4f0f-86a5-e02d09f19d7b" />
<img width="1770" height="857" alt="Screenshot 2025-11-01 204457" src="https://github.com/user-attachments/assets/1185eebd-dedf-491e-b994-e584dd279003" />
<img width="1919" height="1036" alt="Screenshot 2025-11-01 204605" src="https://github.com/user-attachments/assets/bd4e5a95-c979-4b6b-b8f9-bd0c1c6bc19c" />
<img width="1919" height="1034" alt="Screenshot 2025-11-01 204527" src="https://github.com/user-attachments/assets/673837d0-0872-4fb5-acdf-e508b3d779cc" />
<img width="1809" height="915" alt="Screenshot 2025-11-01 204517" src="https://github.com/user-attachments/assets/f28ae8ec-7fb1-407b-9587-c18e37af79f0" />

