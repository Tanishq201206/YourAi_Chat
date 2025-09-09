package com.SpringAi.Ollama.with.SpringAi.Service;

import com.SpringAi.Ollama.with.SpringAi.Entity.OtpToken;
import com.SpringAi.Ollama.with.SpringAi.Repo.OtpTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class LoginOtpService {

    private final OtpTokenRepository otpTokenRepository;

    private final MailService mailService;

    @Transactional
    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // clear old OTPs for this email
        otpTokenRepository.deleteByEmail(email);

        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setOtp(otp);
        otpToken.setExpiryDate(LocalDateTime.now().plusMinutes(5));

        otpTokenRepository.save(otpToken);

        // Send email
        mailService.sendOtpEmail(email, "Your Login OTP", otp);

        return otp;
    }

    @Transactional
    public boolean validateOtp(String email, String otp) {
        return otpTokenRepository.findByEmailAndOtp(email, otp)
                .filter(token -> token.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(token -> {
                    otpTokenRepository.deleteByEmail(email); // one-time use
                    return true;
                })
                .orElse(false);
    }
}