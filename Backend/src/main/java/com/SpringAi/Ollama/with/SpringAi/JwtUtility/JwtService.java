package com.SpringAi.Ollama.with.SpringAi.JwtUtility;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secretKey;

    @Value("${security.jwt.expiration}")
    private long jwtExpiration;

    // Generate token with claims
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract username/email
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract roles from claims (robust: supports List or comma-separated String)
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        if (claims == null) return Collections.emptyList();

        Object rolesObj = claims.get("roles");
        if (rolesObj == null) return Collections.emptyList();

        // If roles is a List
        if (rolesObj instanceof List<?> list) {
            return list.stream().map(Object::toString).collect(Collectors.toList());
        }

        // If roles is a single String (maybe comma separated)
        if (rolesObj instanceof String s) {
            String trimmed = s.trim();
            if (trimmed.isEmpty()) return Collections.emptyList();
            // split comma-separated
            if (trimmed.contains(",")) {
                return Arrays.stream(trimmed.split(","))
                        .map(String::trim)
                        .filter(x -> !x.isEmpty())
                        .collect(Collectors.toList());
            } else {
                return List.of(trimmed);
            }
        }

        // Fallback
        return Collections.emptyList();
    }

    // Check if token is valid
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username != null && username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic claim extractor
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // helper for Auth verify login
    public long getJwtExpiration() {
        return jwtExpiration;
    }
}
