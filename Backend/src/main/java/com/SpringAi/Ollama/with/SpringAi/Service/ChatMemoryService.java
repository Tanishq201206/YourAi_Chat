package com.SpringAi.Ollama.with.SpringAi.Service;

import com.SpringAi.Ollama.with.SpringAi.Entity.ChatMessage;
import com.SpringAi.Ollama.with.SpringAi.Entity.ChatSession;
import com.SpringAi.Ollama.with.SpringAi.Repo.ChatMessageRepository;
import com.SpringAi.Ollama.with.SpringAi.Repo.ChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatMemoryService {

    private final ChatSessionRepository sessionRepo;
    private final ChatMessageRepository messageRepo;

    // Create new session
    public ChatSession startNewSession(String userEmail, String title) {
        ChatSession session = ChatSession.builder()
                .userEmail(userEmail)
                .title(title != null ? title : "New Chat")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return sessionRepo.save(session);
    }

    // Add message to a session
    public void addMessage(String sessionId, String role, String content) {
        ChatMessage msg = ChatMessage.builder()
                .sessionId(sessionId)
                .role(role)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();
        messageRepo.save(msg);

        // update session timestamp
        sessionRepo.findById(sessionId).ifPresent(s -> {
            s.setUpdatedAt(LocalDateTime.now());
            sessionRepo.save(s);
        });
    }

    // Get messages of a session
    public List<ChatMessage> getMessages(String sessionId) {
        return messageRepo.findBySessionId(sessionId);
    }

    // Get all sessions for a user
    public List<ChatSession> getUserSessions(String userEmail) {
        return sessionRepo.findByUserEmail(userEmail);
    }

    public void deleteSession(String sessionId) {
        // delete all messages first
        messageRepo.deleteBySessionId(sessionId);
        // delete session itself
        sessionRepo.deleteById(sessionId);
    }
    public void renameSession(String sessionId, String newTitle) {
        sessionRepo.findById(sessionId).ifPresent(session -> {
            session.setTitle(newTitle);
            session.setUpdatedAt(LocalDateTime.now());
            sessionRepo.save(session);
        });
    }


    public Optional<ChatSession> getSession(String sessionId) {
        return sessionRepo.findById(sessionId);
    }

    public ChatSession saveSession(ChatSession session) {
        return sessionRepo.save(session);
    }


    // convenience wrapper
    public long countSessions() {
        return sessionRepo.count();
    }

    public long countMessages() {
        return messageRepo.count();
    }

    public long countActiveUsers() {
        // distinct userEmail across sessions
        return sessionRepo.findAll()
                .stream()
                .map(ChatSession::getUserEmail)
                .distinct()
                .count();
    }




    public Page<ChatSession> getAllSessions(Pageable pageable) {
        return sessionRepo.findAll(pageable);
    }

    public Page<ChatMessage> getMessages(String sessionId, Pageable pageable) {
        return messageRepo.findBySessionId(sessionId, pageable);
    }


    // ✅ new overload with pagination
    public Page<ChatSession> getUserSessions(String email, Pageable pageable) {
        return sessionRepo.findByUserEmail(email, pageable);
    }

}