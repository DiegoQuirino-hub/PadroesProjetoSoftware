package com.painelsenhas.controller;

import com.painelsenhas.model.ApplicationUser;
import com.painelsenhas.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Equivalente às páginas de Identity (Register/Login) geradas pelo ASP.NET Identity.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado.");
        }

        ApplicationUser user = new ApplicationUser();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEmailConfirmed(true); // sem envio de e-mail, equivalente ao IdentityNoOpEmailSender

        userRepository.save(user);
        return ResponseEntity.ok("Usuário registrado com sucesso.");
    }

    // POST /api/auth/login — com HTTP Basic o Spring Security já valida automaticamente,
    // mas este endpoint retorna confirmação explícita quando as credenciais são válidas.
    @PostMapping("/login")
    public ResponseEntity<String> login() {
        return ResponseEntity.ok("Autenticado com sucesso.");
    }

    // GET /api/auth/me — equivalente à página Auth.razor com [Authorize]
    @GetMapping("/me")
    public ResponseEntity<String> me(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok("Olá, " + auth.getName() + "!");
    }

    public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}
}
