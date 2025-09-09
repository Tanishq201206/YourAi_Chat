package com.SpringAi.Ollama.with.SpringAi.Repo;

import com.SpringAi.Ollama.with.SpringAi.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}