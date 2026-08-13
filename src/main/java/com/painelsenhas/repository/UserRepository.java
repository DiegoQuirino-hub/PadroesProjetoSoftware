package com.painelsenhas.repository;

import com.painelsenhas.model.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Equivalente ao ApplicationDbContext.cs + consultas do Identity.
 * Spring Data JPA gera as queries automaticamente.
 */
public interface UserRepository extends JpaRepository<ApplicationUser, String> {

    Optional<ApplicationUser> findByEmail(String email);
}
