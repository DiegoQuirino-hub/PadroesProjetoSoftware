package com.painelsenhas.fila.application.port.in;

import com.painelsenhas.fila.domain.InstanceInfo;

import java.util.List;

/**
 * Porta de entrada: consultas de leitura sobre a fila.
 */
public interface ConsultarFilaUseCase {

    int senhaAtual();

    List<Integer> historico();

    InstanceInfo instancia();
}
