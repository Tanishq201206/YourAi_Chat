package com.SpringAi.Ollama.with.SpringAi.Repo;

import com.SpringAi.Ollama.with.SpringAi.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}