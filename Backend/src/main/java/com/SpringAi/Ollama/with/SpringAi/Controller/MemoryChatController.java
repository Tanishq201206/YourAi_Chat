package com.SpringAi.Ollama.with.SpringAi.Controller;

import com.SpringAi.Ollama.with.SpringAi.Entity.ChatMessage;
import com.SpringAi.Ollama.with.SpringAi.Service.ChatMemoryService;
import com.SpringAi.Ollama.with.SpringAi.Service.RealWorldService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.*;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.*;

@RestController
@RequestMapping("/api/chat-memory")
@RequiredArgsConstructor
public class MemoryChatController {

    private final OllamaChatModel chatModel;
    private final ChatMemoryService chatService;

    private final RealWorldService realWorldService;



    /**
     * Send message with memory + stream back the response (structured events)
     */
    @PostMapping(value = "/{sessionId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatInSession(@PathVariable String sessionId,
                                      @RequestBody Map<String, String> body) {

        String userMsg = body.getOrDefault("message", "Say hi!");
        String systemMsg = body.getOrDefault("system", "You are a helpful assistant.");

        // fetch history from MongoDB
        List<ChatMessage> history = chatService.getMessages(sessionId);

        // build prompt
        List<Message> msgs = new ArrayList<>();
        msgs.add(new SystemMessage(systemMsg));

        for (ChatMessage m : history) {
            if ("user".equals(m.getRole())) {
                msgs.add(new UserMessage(m.getContent()));
            } else if ("assistant".equals(m.getRole())) {
                msgs.add(new AssistantMessage(m.getContent()));
            }
        }

        msgs.add(new UserMessage(userMsg));

        // save user message immediately
        chatService.addMessage(sessionId, "user", userMsg);



        // Auto-name session if title is still null or "New Chat"
//        chatService.getSession(sessionId).ifPresent(session -> {
//            if (session.getTitle() == null || session.getTitle().equals("New Chat")) {
//                String autoTitle = userMsg.length() > 20
//                        ? userMsg.substring(0, 20) + "..."
//                        : userMsg;
//                session.setTitle(autoTitle);
//                session.setUpdatedAt(java.time.LocalDateTime.now());
//                chatService.saveSession(session);
//            }
//        });

        // --- Real-time: date/time short-circuit ---
        if (realWorldService.looksLikeDateOrTime(userMsg)) {
            String toolAnswer = realWorldService.answerDateOrTime(userMsg);
            chatService.addMessage(sessionId, "assistant", toolAnswer);
            return Flux.just(toolAnswer); // SSE single chunk
        }


        StringBuilder fullReply = new StringBuilder();
        return chatModel.stream(new Prompt(msgs))
                .map(chunk -> {
                    String piece = chunk.getResult().getOutput().getText();
                    fullReply.append(piece);
                    return String.format("{\"type\":\"token\",\"content\":\"%s\"}", piece);
                })
                .startWith("{\"type\":\"start\"}")
                .concatWith(Mono.just("{\"type\":\"end\"}"))
                .doOnComplete(() -> {
                    chatService.addMessage(sessionId, "assistant", fullReply.toString());
                });

    }

    /**
     * Start a new chat session (user taken from JWT)
     */
    @PostMapping("/new")
    public ResponseEntity<?> newSession(@RequestParam(required = false) String title) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(chatService.startNewSession(userEmail, title));
    }

    /**
     * List all sessions for logged-in user
     */
    @GetMapping("/sessions")
    public ResponseEntity<?> getUserSessions() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(chatService.getUserSessions(userEmail));
    }

    /**
     * Get history of one session
     */
    @GetMapping("/history/{sessionId}")
    public ResponseEntity<?> getHistory(@PathVariable String sessionId) {
        return ResponseEntity.ok(chatService.getMessages(sessionId));
    }

    /**
     * Delete a session (and its messages)
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable String sessionId) {
        chatService.deleteSession(sessionId);
        return ResponseEntity.ok(Map.of("message", "Chat deleted successfully"));
    }

    @PatchMapping("/{sessionId}/rename")
    public ResponseEntity<?> renameSession(@PathVariable String sessionId,
                                           @RequestParam String title) {
        chatService.renameSession(sessionId, title);
        return ResponseEntity.ok(Map.of("message", "Chat renamed successfully"));
    }

    @PostMapping("/rename-auto/{sessionId}")
    public ResponseEntity<?> autoRenameSession(@PathVariable String sessionId) {
        var sessionOpt = chatService.getSession(sessionId);

        if (sessionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var session = sessionOpt.get();

        // ✅ Skip if already renamed
        if (session.getTitle() != null && !session.getTitle().equals("New Chat")) {
            return ResponseEntity.ok(Map.of(
                    "status", "skipped",
                    "existingTitle", session.getTitle()
            ));
        }

        var messages = chatService.getMessages(sessionId);
        if (messages.isEmpty()) {
            return ResponseEntity.badRequest().body("No messages to summarize");
        }

        String firstMessage = messages.get(0).getContent();
        String newTitle = generateTitleWithLLM(firstMessage);

        session.setTitle(newTitle);
        chatService.saveSession(session);

        return ResponseEntity.ok(Map.of(
                "status", "renamed",
                "newTitle", newTitle
        ));
    }

    // ✅ Helper Method with fallback
    private String generateTitleWithLLM(String firstMessage) {
        try {
            String systemPrompt = "Summarize the following user message in max 5 words. " +
                    "Return only the title, no extra text.";

            Prompt prompt = new Prompt(List.of(
                    new SystemMessage(systemPrompt),
                    new UserMessage(firstMessage)
            ));

            var response = chatModel.call(prompt);
            String result = response.getResult().getOutput().getText().trim();

            if (result.isEmpty()) {
                return fallbackTitle(firstMessage);
            }
            return result;

        } catch (Exception e) {
            return fallbackTitle(firstMessage);
        }
    }


    // ✅ Fallback methodo
    private String fallbackTitle(String msg) {
        return msg.length() > 30 ? msg.substring(0, 20) + "..." : msg;
    }



}
