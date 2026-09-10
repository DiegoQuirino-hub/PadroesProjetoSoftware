package com.painelsenhas.fila.application.port.in;

/**
 * Porta de entrada: emitir uma nova senha na fila.
 * O adapter web (QueueController) depende desta interface, nunca do QueueService diretamente.
 */
public interface GerarSenhaUseCase {

    int gerarNovaSenha();
}
