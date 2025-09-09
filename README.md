# YourAi_Chat — Full-stack AI Chat

> Full-stack AI chat application using Spring Boot + Spring AI (Ollama), MySQL, MongoDB and React.  
> This README describes end-to-end developer setup and local run instructions.

## 📝 Table of contents
1. [Overview](#overview)  
2. [Prerequisites](#prerequisites)  
3. [Repository layout](#repository-layout)  
4. [Quickstart (local)](#quickstart-local)  
5. [Backend — detailed setup (Spring Boot)](#backend---detailed-setup-spring-boot)  
6. [Frontend — detailed setup (React)](#frontend---detailed-setup-react)  
7. [Ollama (local LLM) setup & Spring AI](#ollama-local-llm-setup--spring-ai)  
8. [Screenshots & documentation locations](#screenshots--documentation-locations)  
9. [Troubleshooting](#troubleshooting)  


## 🗒️Overview
This monorepo contains two main parts:
- `backend/` — Spring Boot microservice that exposes REST APIs, orchestrates AI calls with Spring AI, persists metadata in MySQL and uses MongoDB for chat history or vector store.
- `frontend/` — React SPA that provides the UI and talks to the backend.

Detected defaults in your project:
- Backend server port: **8088**
- Frontend dev port: **3000**
- Ollama default API: **http://localhost:11434**

## 📚 Prerequisites
- Java 17+ (JDK)
- Maven (or Gradle)
- Node 18+ and npm
- MySQL 8.x
- MongoDB 5/6.x
- Ollama (Windows `.exe` installer)
- Git

## 📁Repository layout
```
YourAi_Chat/
├── backend/                # Spring Boot service (Java)
├── frontend/               # React app
├── README.md               # <-- this file (global)
├── ENVIRONMENT.md          # global environment overview
└── OLLAMA.md               # Ollama quick guide

```

## Quickstart (local)
1. Create/verify env vars (see ENVIRONMENT.md).
2. Start MySQL and MongoDB.
3. Start Ollama (if using local LLM).
4. Run backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   → http://localhost:8088
5. Run frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   → http://localhost:3000

## Backend — detailed setup (Spring Boot)
### Database setup (MySQL)
```sql
CREATE DATABASE yourai_chat;
CREATE USER 'youruser'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON yourai_chat.* TO 'youruser'@'localhost';
```
### 🔌 Config (application.properties)
```properties
server.port=8088
spring.datasource.url=jdbc:mysql://localhost:3306/yourai_chat
spring.datasource.username=youruser
spring.datasource.password=strongpassword
spring.data.mongodb.uri=mongodb://localhost:27017/yourai_chat
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=llama3.1
```
### Run
```bash
mvn clean install && mvn spring-boot:run
```

## Frontend — detailed setup (React)
### .env
```
VITE_API_BASE_URL=http://localhost:8088
```
### Run
```bash
npm install
npm start
```

## 🌐 Ollama (local LLM) setup & Spring AI (also /ollama.md is present for detailed setup)
1. Install from https://ollama.com/download
2. Pull model(s):
   ```bash
   ollama pull llama3.1
   ```
3. Verify:
   ```bash
   curl http://localhost:11434/api/tags
   ```

## 📸 Screenshots & documentation
- `backend/docs/screenshots/` —  Postman, logs, DB, Ollama
- `frontend/docs/screenshots/` — UI views, MFA setup


## 🛠️ Troubleshooting
- Backend port in use → change `server.port`
- Ollama unreachable → `ollama serve`
- DB refused → check MySQL/Mongo credentials
- CORS → update `app.cors.allowed-origins`

