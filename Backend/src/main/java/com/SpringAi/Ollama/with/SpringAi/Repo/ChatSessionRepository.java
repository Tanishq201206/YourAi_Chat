package com.SpringAi.Ollama.with.SpringAi.Repo;

import com.SpringAi.Ollama.with.SpringAi.Entity.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatSessionRepository extends MongoRepository<ChatSession, String> {
    List<ChatSession> findByUserEmail(String userEmail);
    Page<ChatSession> findAll(Pageable pageable);


    Page<ChatSession> findByUserEmail(String email, Pageable pageable);

}