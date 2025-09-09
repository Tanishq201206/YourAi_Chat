# Backend Endpoints

This file lists detected REST endpoints by scanning controller source files. Please verify paths and add auth/params manually.

## Detected endpoints

- **REQUEST /api/admin/chat/api/admin/chat** — handler: `sessions` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AdminChatController.java`)
- **GET /api/admin/chat/sessions** — handler: `listSessions` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AdminChatController.java`)
- **GET /api/admin/chat/sessions/user/{email}** — handler: `listUserSessions` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AdminChatController.java`)
- **DELETE /api/admin/chat/sessions/{sessionId}** — handler: `deleteSession` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AdminChatController.java`)
- **GET /api/admin/chat/sessions/{sessionId}/messages** — handler: `listMessages` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AdminChatController.java`)
- **GET /api/admin/chat/stats** — handler: `getStats` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AdminChatController.java`)
- **REQUEST /api/auth/api/auth** — handler: `user` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **POST /api/auth/login** — handler: `login` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **POST /api/auth/logout** — handler: `logout` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **POST /api/auth/register** — handler: `register` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **GET /api/auth/status** — handler: `getCurrentUser` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **POST /api/auth/verify-login** — handler: `verifyLogin` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **POST /api/auth/verify-register** — handler: `verifyRegister` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/AuthController.java`)
- **GET /api/chat** — handler: `chatGet` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/ChatController.java`)
- **POST /api/chat** — handler: `chatPost` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/ChatController.java`)
- **REQUEST /api/chat-memory/api/chat-memory** — handler: `response` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **GET /api/chat-memory/history/{sessionId}** — handler: `getHistory` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **POST /api/chat-memory/new** — handler: `newSession` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **POST /api/chat-memory/rename-auto/{sessionId}** — handler: `autoRenameSession` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **GET /api/chat-memory/sessions** — handler: `getUserSessions` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **DELETE /api/chat-memory/{sessionId}** — handler: `deleteSession` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **POST /api/chat-memory/{sessionId}** — handler: `chatInSession` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **PATCH /api/chat-memory/{sessionId}/rename** — handler: `renameSession` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/MemoryChatController.java`)
- **REQUEST /api/chat/api/chat** — handler: `ChatController` (source: `src/main/java/com/SpringAi/Ollama/with/SpringAi/Controller/ChatController.java`)