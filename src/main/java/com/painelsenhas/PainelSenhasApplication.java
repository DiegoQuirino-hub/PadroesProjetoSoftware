package com.painelsenhas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Equivalente ao Program.cs — ponto de entrada da aplicação.
 *
 * Program.cs (C#)              →  PainelSenhasApplication.java (Java)
 * AddRazorComponents           →  spring-boot-starter-web (REST API)
 * AddAuthentication/Identity   →  spring-boot-starter-security + SecurityConfig
 * AddDbContext<>(UseSqlServer) →  spring-boot-starter-data-jpa + application.properties
 * AddSingleton<QueueService>   →  QueueService.getInstance() (Singleton clássico mantido)
 */
@SpringBootApplication
public class PainelSenhasApplication {

    public static void main(String[] args) {
        SpringApplication.run(PainelSenhasApplication.class, args);
    }
}
