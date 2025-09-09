package com.SpringAi.Ollama.with.SpringAi.Service;

import com.SpringAi.Ollama.with.SpringAi.Repo.OtpTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpCleanupService {

    private final OtpTokenRepository otpTokenRepository;

    // Run every hour (3600000 ms)
    @Transactional
    @Scheduled(fixedRate = 3600000)
    public void cleanExpiredOtps() {
        int before = otpTokenRepository.findAll().size();

        otpTokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());

        int after = otpTokenRepository.findAll().size();

        System.out.println("🧹 OTP Cleanup executed. Before: " + before + " | After: " + after);
    }
}