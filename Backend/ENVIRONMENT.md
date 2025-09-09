# Backend ENVIRONMENT (backend/.env or application.properties)

server.port=8088

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/yourai_chat?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=changeme

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/yourai_chat

# Spring AI + Ollama
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=llama3.1
spring.ai.ollama.chat.options.temperature=0.2

# CORS (example)
app.cors.allowed-origins=http://localhost:3000