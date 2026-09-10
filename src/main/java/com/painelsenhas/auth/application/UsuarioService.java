package com.painelsenhas.auth.application;

import com.painelsenhas.auth.application.port.in.RegistrarUsuarioUseCase;
import com.painelsenhas.auth.application.port.out.UsuarioRepositoryPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Camada de aplicação: caso de uso de registro de usuário.
 */
@Service
public class UsuarioService implements RegistrarUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepositoryPort usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void registrar(String email, String senhaEmTextoPuro) {
        if (usuarioRepository.existePorEmail(email)) {
            throw new EmailJaCadastradoException();
        }
        usuarioRepository.salvar(email, passwordEncoder.encode(senhaEmTextoPuro));
    }
}
