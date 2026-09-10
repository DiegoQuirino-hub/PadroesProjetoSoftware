package com.painelsenhas.auth.adapter.out.persistence;

import com.painelsenhas.auth.application.port.out.UsuarioRepositoryPort;
import org.springframework.stereotype.Component;

/**
 * Adapter de saída: implementa a porta de persistência usando Spring Data JPA.
 */
@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UserJpaRepository jpa;

    public UsuarioRepositoryAdapter(UserJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public boolean existePorEmail(String email) {
        return jpa.findByEmail(email).isPresent();
    }

    @Override
    public void salvar(String email, String passwordHash) {
        ApplicationUser user = new ApplicationUser();
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setEmailConfirmed(true); // sem envio de e-mail, equivalente ao IdentityNoOpEmailSender
        jpa.save(user);
    }
}
