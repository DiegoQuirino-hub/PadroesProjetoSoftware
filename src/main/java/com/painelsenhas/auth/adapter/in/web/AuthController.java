package com.painelsenhas.auth.adapter.in.web;

import com.painelsenhas.auth.application.port.in.RegistrarUsuarioUseCase;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Adapter de entrada (REST) para autenticação.
 * Equivalente às páginas de Identity (Register/Login) geradas pelo ASP.NET Identity.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;

    public AuthController(RegistrarUsuarioUseCase registrarUsuarioUseCase) {
        this.registrarUsuarioUseCase = registrarUsuarioUseCase;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        try {
            registrarUsuarioUseCase.registrar(request.email(), request.password());
        } catch (RegistrarUsuarioUseCase.EmailJaCadastradoException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
