package com.SpringAi.Ollama.with.SpringAi.Repo;

import com.SpringAi.Ollama.with.SpringAi.Entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
    Page<ChatMessage> findBySessionId(String sessionId, Pageable pageable);


}