package com.painelsenhas.auth.application.port.out;

/**
 * Porta de saída: persistência de usuários. A implementação (JPA) vive no adapter.
 */
public interface UsuarioRepositoryPort {

    boolean existePorEmail(String email);

    void salvar(String email, String passwordHash);
}
