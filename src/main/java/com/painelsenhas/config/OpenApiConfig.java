package com.painelsenhas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Metadados exibidos no topo da página do Swagger UI (/swagger-ui.html).
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openApiInfo() {
        return new OpenAPI().info(new Info()
                .title("PainelSenhas API")
                .description("API do sistema de painel de senhas — usada para demonstrar o padrão Singleton (QueueService).")
                .version("1.0.0"));
    }
}
