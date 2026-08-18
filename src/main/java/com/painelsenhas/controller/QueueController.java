package com.painelsenhas.controller;

import com.painelsenhas.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Equivalente às actions do Atendente.razor e Display.razor,
 * expostas como REST API.
 *
 * Atendente.razor → POST /api/fila/gerar
 * Display.razor   → GET  /api/fila/atual e GET /api/fila/historico
 */
@RestController
@RequestMapping("/api/fila")
@CrossOrigin(origins = "*")
public class QueueController {

    // POST /api/fila/gerar
    // Equivalente ao método GerarNovaSenha() do Atendente.razor
    @PostMapping("/gerar")
    public ResponseEntity<Integer> gerarNovaSenha() {
        int novaSenha = QueueService.getInstance().generateTicket();
        QueueService.getInstance().callNext(novaSenha);
        return ResponseEntity.ok(novaSenha);
    }

    // GET /api/fila/atual
    // Equivalente ao GetLastTicket() exibido no Display.razor
    @GetMapping("/atual")
    public ResponseEntity<Integer> getSenhaAtual() {
        int atual = QueueService.getInstance().getLastTicket();
        return ResponseEntity.ok(atual);
    }

    // GET /api/fila/historico
    // Equivalente ao GetHistory() listado no Display.razor
    @GetMapping("/historico")
    public ResponseEntity<List<Integer>> getHistorico() {
        List<Integer> historico = QueueService.getInstance().getHistory();
        return ResponseEntity.ok(historico);
    }

    // GET /api/fila/instancia
    // Prova em tempo real do Singleton: todo cliente que consultar essa rota,
    // não importa a aba/navegador, recebe o mesmo instanceId — pois é a mesma
    // instância de QueueService compartilhada por toda a aplicação.
    @GetMapping("/instancia")
    public ResponseEntity<InstanceInfo> getInstancia() {
        QueueService instance = QueueService.getInstance();
        return ResponseEntity.ok(new InstanceInfo(instance.getInstanceId(), instance.getCreatedAt()));
    }

    public record InstanceInfo(String instanceId, String createdAt) {}
}
