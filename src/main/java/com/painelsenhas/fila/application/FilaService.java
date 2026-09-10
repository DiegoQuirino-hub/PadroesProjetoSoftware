package com.painelsenhas.fila.application;

import com.painelsenhas.fila.application.port.in.ConsultarFilaUseCase;
import com.painelsenhas.fila.application.port.in.GerarSenhaUseCase;
import com.painelsenhas.fila.domain.InstanceInfo;
import com.painelsenhas.fila.domain.QueueService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Camada de aplicação: orquestra os casos de uso da fila.
 *
 * NÃO guarda estado — todo o estado vive no Singleton {@link QueueService}, acessado
 * sempre por {@code getInstance()}. O padrão Singleton clássico é mantido de propósito;
 * este serviço é apenas a fachada hexagonal que isola o adapter web dessa dependência.
 */
@Service
public class FilaService implements GerarSenhaUseCase, ConsultarFilaUseCase {

    @Override
    public int gerarNovaSenha() {
        int novaSenha = QueueService.getInstance().generateTicket();
        QueueService.getInstance().callNext(novaSenha);
        return novaSenha;
    }

    @Override
    public int senhaAtual() {
        return QueueService.getInstance().getLastTicket();
    }

    @Override
    public List<Integer> historico() {
        return QueueService.getInstance().getHistory();
    }

    @Override
    public InstanceInfo instancia() {
        QueueService instance = QueueService.getInstance();
        return new InstanceInfo(instance.getInstanceId(), instance.getCreatedAt());
    }
}
