package com.painelsenhas.auth.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Detalhe de infraestrutura: Spring Data JPA gera as queries.
 * Fica escondido atrás da porta de saída {@code UsuarioRepositoryPort}.
 */
public interface UserJpaRepository extends JpaRepository<ApplicationUser, String> {

    Optional<ApplicationUser> findByEmail(String email);
}
