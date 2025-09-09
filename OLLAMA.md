# OLLAMA (local LLM runner) - Quick Guide

1. Download & install Ollama for Windows: https://ollama.com/download (choose the .exe)
2. Open Command Prompt and pull your model(s), for example:
   ```bash
   ollama pull llama3.1
   ollama pull qwen2.5:7b-instruct
   ```
3. Start/verify Ollama (defaults to http://localhost:11434)
   ```bash
   ollama serve   # if needed
   curl http://localhost:11434/api/tags
   ```
4. Configure Spring Boot (application.properties or application.yml):
   ```properties
   spring.ai.ollama.base-url=http://localhost:11434
   spring.ai.ollama.chat.options.model=llama3.1
   spring.ai.ollama.chat.options.temperature=0.2
   ```
5. If Ollama fails to start: check port 11434, model availability, and system memory.