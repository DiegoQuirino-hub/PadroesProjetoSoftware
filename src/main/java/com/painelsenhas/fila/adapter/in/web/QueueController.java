package com.painelsenhas.fila.adapter.in.web;

import com.painelsenhas.fila.application.port.in.ConsultarFilaUseCase;
import com.painelsenhas.fila.application.port.in.GerarSenhaUseCase;
import com.painelsenhas.fila.domain.InstanceInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Adapter de entrada (REST). Depende apenas das portas de entrada — nunca do
 * QueueService diretamente. Por trás das portas, o Singleton continua sendo a
 * única fonte de estado da fila.
 *
 * Atendente.razor → POST /api/fila/gerar
 * Display.razor   → GET  /api/fila/atual e GET /api/fila/historico
 */
@RestController
@RequestMapping("/api/fila")
@CrossOrigin(origins = "*")
@Tag(name = "Fila de Senhas", description = "Todo endpoint aqui chega, via porta de entrada, ao mesmo QueueService Singleton compartilhado por toda a aplicação")
public class QueueController {

    private final GerarSenhaUseCase gerarSenhaUseCase;
    private final ConsultarFilaUseCase consultarFilaUseCase;

    public QueueController(GerarSenhaUseCase gerarSenhaUseCase, ConsultarFilaUseCase consultarFilaUseCase) {
        this.gerarSenhaUseCase = gerarSenhaUseCase;
        this.consultarFilaUseCase = consultarFilaUseCase;
    }

    // POST /api/fila/gerar
    @PostMapping("/gerar")
    @Operation(summary = "Emite uma nova senha", description = "Incrementa o contador da instância compartilhada de QueueService e registra a chamada no histórico.")
    public ResponseEntity<Integer> gerarNovaSenha() {
        return ResponseEntity.ok(gerarSenhaUseCase.gerarNovaSenha());
    }

    // GET /api/fila/atual
    @GetMapping("/atual")
    @Operation(summary = "Consulta a senha atual", description = "Lê o último ticket gerado na instância compartilhada — o mesmo valor para qualquer cliente que chamar essa rota.")
    public ResponseEntity<Integer> getSenhaAtual() {
        return ResponseEntity.ok(consultarFilaUseCase.senhaAtual());
    }

    // GET /api/fila/historico
    @GetMapping("/historico")
    @Operation(summary = "Lista o histórico de senhas chamadas")
    public ResponseEntity<List<Integer>> getHistorico() {
        return ResponseEntity.ok(consultarFilaUseCase.historico());
    }

    // GET /api/fila/instancia
    // Prova em tempo real do Singleton: todo cliente que consultar essa rota,
    // não importa a aba/navegador, recebe o mesmo instanceId.
    @GetMapping("/instancia")
    @Operation(
        summary = "Prova do Singleton: identidade da instância",
        description = "Retorna o hash de identidade e o horário de criação do único QueueService vivo no servidor. Chame duas vezes: o instanceId nunca muda."
    )
    public ResponseEntity<InstanceInfo> getInstancia() {
        return ResponseEntity.ok(consultarFilaUseCase.instancia());
    }
}
