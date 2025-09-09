package com.SpringAi.Ollama.with.SpringAi.Controller;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OllamaChatModel chatModel;

    @Autowired
    public ChatController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }


    @GetMapping
    public Map<String, String> chatGet(@RequestParam(defaultValue = "Say hi!") String message) {
        String reply = chatModel.call(message);
        return Map.of("reply", reply);
    }


    @PostMapping
    public Map<String, String> chatPost(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "Say hi!");
        String reply = chatModel.call(message);
        return Map.of("reply", reply);
    }
}
