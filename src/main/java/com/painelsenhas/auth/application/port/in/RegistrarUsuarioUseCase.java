package com.painelsenhas.auth.application.port.in;

/**
 * Porta de entrada: registrar um novo usuário.
 */
public interface RegistrarUsuarioUseCase {

    /**
     * @throws EmailJaCadastradoException se já existir usuário com esse e-mail
     */
    void registrar(String email, String senhaEmTextoPuro);

    class EmailJaCadastradoException extends RuntimeException {
        public EmailJaCadastradoException() {
            super("E-mail já cadastrado.");
        }
    }
}
