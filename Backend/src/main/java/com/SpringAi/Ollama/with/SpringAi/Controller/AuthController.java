package com.SpringAi.Ollama.with.SpringAi.Controller;


import com.SpringAi.Ollama.with.SpringAi.Entity.User;
import com.SpringAi.Ollama.with.SpringAi.Entity.Role;
import com.SpringAi.Ollama.with.SpringAi.JwtUtility.JwtService;
import com.SpringAi.Ollama.with.SpringAi.Repo.RoleRepository;
import com.SpringAi.Ollama.with.SpringAi.Repo.UserRepository;
import com.SpringAi.Ollama.with.SpringAi.Service.LoginOtpService;
import com.SpringAi.Ollama.with.SpringAi.Service.RegisterOtpService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RegisterOtpService registerOtpService;
    private final LoginOtpService loginOtpService;

    // 1) Register a new user (default role = USER)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(false); // not verified yet
        user.setRoles(Set.of(roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role not found"))));

        userRepository.save(user);

        // generate OTP for verification
        String otp = registerOtpService.generateOtp(email);

        return ResponseEntity.ok("Registration successful. Verify with OTP sent to email.");
    }

    // 2) Verify registration OTP
    @PostMapping("/verify-register")
    public ResponseEntity<?> verifyRegister(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (registerOtpService.validateOtp(email, otp)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok("Registration verified! You can now login.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }
    }

    // 3) Login with password (step 1 → generate login OTP)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (!user.isEnabled()) {
            return ResponseEntity.badRequest().body("Account not verified yet.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid credentials.");
        }

        // generate login OTP and save in DB
        loginOtpService.generateOtp(email);

        return ResponseEntity.ok("Login OTP sent to email.");
    }

    // 4) Verify login OTP (returns JWT)
    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLogin(@RequestBody Map<String, String> request,
                                         HttpServletResponse response) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (loginOtpService.validateOtp(email, otp)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Convert roles into simple string list
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("roles", user.getRoles().stream()
                    .map(Role::getName)
                    .toList());

            // Build a Spring Security UserDetails
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities(user.getRoles().stream()
                            .map(Role::getName)
                            .toArray(String[]::new))
                    .build();

            // Generate JWT
            String token = jwtService.generateToken(extraClaims, userDetails);

            // ✅ Set JWT as HttpOnly Cookie
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)         // JS can't read it
                    .secure(false)          // ⚠️ set true in production (needs HTTPS)
                    .sameSite("Strict")     // "Strict" or "Lax" depending on frontend needs
                    .path("/")              // available everywhere
                    .maxAge(jwtService.getJwtExpiration() / 1000) // convert ms → seconds
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            // ✅ Return both token in JSON + cookie
            return ResponseEntity.ok("Login successful"
            );
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired login OTP."
            );
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)   // true in prod
                .sameSite("Strict")
                .path("/")
                .maxAge(0) // expire immediately
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", authentication.getName(),
                "roles", authentication.getAuthorities()
                        .stream()
                        .map(a -> a.getAuthority())
                        .toList()
        ));
    }

}
