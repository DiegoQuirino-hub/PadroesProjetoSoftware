package com.painelsenhas.fila.domain;

/**
 * Value object de domínio: identidade da única instância viva de {@link QueueService}.
 * Usado para provar, em tempo de execução, que o Singleton é compartilhado.
 */
public record InstanceInfo(String instanceId, String createdAt) {}
