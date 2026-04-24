# Quantum Tasks

Quantum Tasks is a high-performance, minimal task management application designed for developers and power users who value speed and a clean, distraction-free interface. Built with a focus on "flow state," it combines an elegant dark-themed UI with powerful organizational features.

## 🚀 Key Features

- **Secure Authentication**: JWT-based user accounts with password hashing (bcrypt).
- **Modern UX/UI**: Fluid animations powered by Framer Motion and a high-contrast dark design system.
- **Project Organization**: Group tasks into focused projects to maintain clarity.
- **Priority Management**: Visual cues for High, Medium, and Low priority tasks.
- **Real-time Search**: Instant fuzzy search across titles, descriptions, and tags.
- **Tagging System**: Add custom metadata to tasks for granular filtering.
- **Responsive Design**: Fully optimized for both desktop focus and mobile productivity.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ (Vite)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: SQLite (via `better-sqlite3`)
- **Security**: JWT, Helmet.js, Express Rate Limit

## 📸 Screenshots

*(Placeholders - update with your live app screenshots)*
- **Dashboard**: [Link to Dashboard Screenshot]
- **Authentication**: [Link to Login/Register Screenshot]
- **Task Creation**: [Link to Modal Screenshot]

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/quantum-tasks.git
cd quantum-tasks
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root:
```env
PORT=3000
JWT_SECRET=your_secret_string
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 📖 Usage

1. **Register**: Create a new account to start tracking your tasks.
2. **Projects**: Use the sidebar to create projects (e.g., "Work," "Personal," "Side Project").
3. **Tasks**: Click "New Task" to add items. Use commas to separate tags.
4. **Filtering**: Select a project in the sidebar or use the search bar to find specific items.
5. **Actions**: Click a task's circle to complete it, or use the hover actions to edit/delete.

## 🔗 API Overview

The backend exposes a RESTful API protected by JWT middleware:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Create a new user account |
| `/api/auth/login` | `POST` | Authenticate and receive JWT |
| `/api/tasks` | `GET` | Fetch all tasks for the logged-in user |
| `/api/tasks` | `POST` | Create a new task |
| `/api/tasks/:id` | `PATCH` | Update an existing task |
| `/api/projects` | `GET` | List all user projects |

## 🔮 Future Improvements

- [ ] **Collaborative Boards**: Share projects with other users.
- [ ] **AI Task Summarization**: Automatically generate task descriptions using Gemini API.
- [ ] **Calendar Integration**: Sync tasks with Google Calendar or Outlook.
- [ ] **Data Export**: Export tasks to JSON or CSV formats.

---
Developed by [Your Name/Handle] with focus on performance and simplicity.
