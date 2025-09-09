package com.SpringAi.Ollama.with.SpringAi.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import com.SpringAi.Ollama.with.SpringAi.Service.MailService;

@Service
@RequiredArgsConstructor
public class RegisterOtpService {

    private final MailService mailService;
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> expiryCache = new ConcurrentHashMap<>();


    // Generate OTP and save in cache
    public String generateOtp(String email) {
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        otpCache.put(email, otp);
        expiryCache.put(email, LocalDateTime.now().plusMinutes(5));
        mailService.sendOtpEmail(email, "Your Registration OTP", otp);
        return otp;
    }

    // Validate OTP
    public boolean validateOtp(String email, String otp) {
        if (!otpCache.containsKey(email)) return false;
        if (expiryCache.get(email).isBefore(LocalDateTime.now())) {
            otpCache.remove(email);
            expiryCache.remove(email);
            return false;
        }
        boolean valid = otpCache.get(email).equals(otp);
        if (valid) {
            otpCache.remove(email);
            expiryCache.remove(email);
        }
        return valid;
    }
}
