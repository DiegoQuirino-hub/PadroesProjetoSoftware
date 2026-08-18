package com.painelsenhas.config;

import com.painelsenhas.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Equivalente à configuração do AddAuthentication() + AddIdentity() no Program.cs.
 *
 * Regras espelhando o comportamento original:
 *   - /api/fila/** → público (mesma lógica do Atendente.razor e Display.razor sem [Authorize])
 *   - /api/auth/**  → requer autenticação (equivalente à página Auth.razor com [Authorize])
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Cadeia dedicada a /api/fila/**: nenhum filtro de Basic Auth é aplicado aqui,
    // então um header Authorization inválido/cacheado pelo navegador (ex: de um
    // login que falhou) é simplesmente ignorado, em vez de gerar 401.
    @Bean
    @Order(1)
    public SecurityFilterChain filaFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/fila/**")
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
                .anyRequest().authenticated()
            )
            // authenticationEntryPoint customizado: NÃO envia o header WWW-Authenticate.
            // Sem ele, o navegador não abre o popup nativo de login em falhas de autenticação
            // vindas de fetch/XHR — o front-end trata o 401 sozinho (ver auth.js).
            .httpBasic(basic -> basic.authenticationEntryPoint((request, response, authException) ->
                response.sendError(401, "Não autenticado")
            ));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return email -> userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }
}
