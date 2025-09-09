package com.SpringAi.Ollama.with.SpringAi.Repo;

import com.SpringAi.Ollama.with.SpringAi.Entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findByEmailAndOtp(String email, String otp);
    void deleteByEmail(String email);
    void deleteByExpiryDateBefore(LocalDateTime time);
}