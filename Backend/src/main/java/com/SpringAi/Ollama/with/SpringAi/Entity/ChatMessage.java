package com.SpringAi.Ollama.with.SpringAi.Entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    private String id;

    private String sessionId;   // references ChatSession.id
    private String role;        // "user" or "assistant"
    private String content;
    private LocalDateTime timestamp;
}