package com.SpringAi.Ollama.with.SpringAi.Entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {
    @Id
    private String id;

    private String userEmail;  // link to MySQL user
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}