package com.SpringAi.Ollama.with.SpringAi.Controller;

import com.SpringAi.Ollama.with.SpringAi.Service.ChatMemoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
public class AdminChatController {

    private final ChatMemoryService chatService;

    /** 📌 Get ALL sessions (paginated) */
    @GetMapping("/sessions")
    public ResponseEntity<?> listSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return ResponseEntity.ok(chatService.getAllSessions(pageable));
    }

    /** 📌 Get sessions of a specific user (paginated) */
    @GetMapping("/sessions/user/{email}")
    public ResponseEntity<?> listUserSessions(
            @PathVariable String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return ResponseEntity.ok(chatService.getUserSessions(email, pageable));
    }

    /** 📌 Get messages from one session (paginated) */
    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<?> listMessages(
            @PathVariable String sessionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return ResponseEntity.ok(chatService.getMessages(sessionId, pageable));
    }

    /** 📌 Delete a chat session */
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable String sessionId) {
        chatService.deleteSession(sessionId);
        return ResponseEntity.ok(Map.of("status", "deleted", "sessionId", sessionId));
    }

    /** 📌 Usage stats */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = Map.of(
                "totalSessions", chatService.countSessions(),
                "totalMessages", chatService.countMessages(),
                "activeUsers", chatService.countActiveUsers()
        );
        return ResponseEntity.ok(stats);
    }
}
