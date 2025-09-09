# ENVIRONMENT (global overview)

This file lists common environment variables used by the repo. Use folder-level ENVIRONMENT.md files for per-service values.

# Backend (Spring Boot)
- server.port=8088
- SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/yourai_chat
- SPRING_DATASOURCE_USERNAME=root
- SPRING_DATASOURCE_PASSWORD=changeme
- SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/yourai_chat
- SPRING_AI_OLLAMA_BASE_URL=http://localhost:11434
- SPRING_AI_OLLAMA_MODEL=llama3.1

# Frontend (React)
- VITE_API_BASE_URL=http://localhost:8088   # or REACT_APP_API_BASE_URL for CRA