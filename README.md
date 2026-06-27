<div align="center">
  <h1 style="margin-bottom: 0;">⏱️ EleventhHour</h1>
  <p><strong>Last-Minute Life Saver | AI-Powered Task & Schedule Management</strong></p>
  
  <a href="https://eleventhhour.onrender.com" target="_blank">
      <img src="https://img.shields.io/badge/Live_Demo-View_App-06B6D4?style=for-the-badge" alt="Live Demo">
  </a>
</div>

<br>

EleventhHour is a full-stack, AI-driven productivity application designed to eliminate procrastination and the "deadline crunch." By translating overwhelming to-do lists into structured, actionable schedules, EleventhHour bridges the gap between task creation and execution.

Powered by **Google Gemini 3.1 Flash**, the application analyzes your tasks, priorities, and deadlines to proactively generate optimized time-blocks, keeping you focused and on track.

## ✨ Key Features
* **Proactive AI Scheduling:** Leverages Gemini 1.5 Pro to analyze pending tasks and automatically propose an optimized daily schedule.
* **Task Lifecycle Management:** Create, edit, and track tasks through discrete states (Pending, In Progress, Completed).
* **Interactive Progress Dashboards:** Visual metrics on daily productivity, completion percentages, and task distribution.
* **Secure Authentication:** Full-stack security architecture utilizing JSON Web Tokens (JWT) and Spring Security for secure, stateless sessions.
* **Seamless UI/UX:** Responsive, dark-themed interface built with React and Vite, featuring real-time state updates.

## 🛠️ Tech Stack

| Frontend | Backend | Database & Cloud |
| :--- | :--- | :--- |
| React.js<br>Vite<br>HTML5 / CSS3 | Java (Spring Boot)<br>Spring Security & JWT<br>Hibernate (ORM)<br>RESTful APIs | MySQL<br>Google Gemini 1.5 Pro API<br>Render (Cloud Hosting) |

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v16+)
* Java Development Kit (JDK 17+)
* Maven
* MySQL Server
* A Google Gemini API Key

### 1. Backend Setup (Spring Boot)
1. Clone the repository and navigate to the backend directory.
2. Configure your MySQL database and update the `application.properties` file:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eleventh_hour
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Security & AI
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key
