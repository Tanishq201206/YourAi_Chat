# Backend

## Stack
- Spring Boot (Java 17+)
- Spring AI (Ollama provider)
- MySQL (JPA/Hibernate)
- MongoDB (for chat history / vector store)

## Run (development)
1. Ensure MySQL and MongoDB are running and accessible.
2. Configure `application.properties` or create `.env` with variables listed in `ENVIRONMENT.md`.
3. Run:
```bash
# Maven
mvn spring-boot:run

# Or Gradle
./gradlew bootRun
```
Backend default port detected: **8088**


**IMPORTANT**
# for first time database setup the file backend/src/main/resources/data.sql

# Backend Screenshots

Put your screenshots here. Example structure:

backend/docs/screenshots/
├── postman-login.png
├── postman-verifyotp.png
├── qestion-asking.png
├── logs-startup.png
├── db-connections.png
└── ollama-status.png





## Additional backend screenshots (recommended)

Place these screenshots into `backend/docs/screenshots/` and reference them below.


- `postman-login.png` — sample Postman request + response for /auth/login or similar.
- `postman-verifyotp.png` — sample Postman request + response for /auth/verify-login or similar.
- `qestion-asking.png` — sample Postman request + response for /api/chat-memory/** or similar.
- `startup-logs.png` — full Spring Boot startup console showing profiles and ports.
- `db-connections.png` — MySQL GUI or MongoDB Compass showing the created DB/collections.
- `ollama-status.png` — curl response from Ollama (`curl http://localhost:11434/api/tags`) or terminal showing model list.

## Screenshots

[Postman login](docs/screenshots/postman-login.png)
[Postman aerifyOtp](docs/screenshots/postman-verifyotp.png)
[Question asking](docs/screenshots/qestion-asking.png)
[Startup logs](docs/screenshots/startup-logs.png)
[Database connections](docs/screenshots/db-connections.png)
[Ollama status](docs/screenshots/ollama-status.png)

```

