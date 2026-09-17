package com.painelsenhas.controller;

import com.painelsenhas.model.Ticket;
import com.painelsenhas.model.TicketType;
import com.painelsenhas.service.QueueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Atendente.razor → POST /api/fila/gerar/{tipo} e /api/fila/chamar-proximo
 * Display.razor   → GET  /api/fila/atual, /api/fila/historico, /api/fila/espera
 */
@RestController
@RequestMapping("/api/fila")
@CrossOrigin(origins = "*")
@Tag(name = "Fila de Senhas", description = "Emissão de senhas via Factory Method (Normal, Preferencial, VIP) sobre a fila Singleton QueueService")
public class QueueController {

    // POST /api/fila/gerar/{tipo}  (tipo = normal | preferencial | vip)
    @PostMapping("/gerar/{tipo}")
    @Operation(
        summary = "Emite uma nova senha do tipo informado",
        description = "Seleciona a Factory concreta correspondente (NormalTicketFactory, PreferencialTicketFactory ou VipTicketFactory) e enfileira a senha criada."
    )
    public ResponseEntity<?> gerarNovaSenha(@PathVariable String tipo) {
        try {
            TicketType tipoSenha = TicketType.valueOf(tipo.trim().toUpperCase());
            Ticket senha = QueueService.getInstance().generateTicket(tipoSenha);
            return ResponseEntity.ok(senha);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body("Tipo inválido. Use: normal, preferencial ou vip.");
        }
    }

    // POST /api/fila/chamar-proximo
    @PostMapping("/chamar-proximo")
    @Operation(
        summary = "Chama a próxima senha respeitando prioridade",
        description = "Ordem de atendimento: VIP > Preferencial > Normal. Dentro do mesmo tipo, respeita a ordem de chegada (FIFO)."
    )
    public ResponseEntity<Ticket> chamarProxima() {
        Ticket chamada = QueueService.getInstance().callNext();
        if (chamada == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(chamada);
    }

    // GET /api/fila/atual
    @GetMapping("/atual")
    @Operation(summary = "Consulta a última senha chamada")
    public ResponseEntity<Ticket> getSenhaAtual() {
        Ticket atual = QueueService.getInstance().getUltimaChamada();
        if (atual == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(atual);
    }

    // GET /api/fila/historico
    @GetMapping("/historico")
    @Operation(summary = "Lista o histórico de senhas chamadas")
    public ResponseEntity<List<Ticket>> getHistorico() {
        return ResponseEntity.ok(QueueService.getInstance().getHistory());
    }

    // GET /api/fila/espera
    @GetMapping("/espera")
    @Operation(summary = "Quantidade de senhas aguardando, por tipo")
    public ResponseEntity<Map<TicketType, Integer>> getFilaEmEspera() {
        return ResponseEntity.ok(QueueService.getInstance().getFilaEmEspera());
    }

    // GET /api/fila/instancia — prova do Singleton (mantido do projeto original)
    @GetMapping("/instancia")
    @Operation(
        summary = "Prova do Singleton: identidade da instância",
        description = "Retorna o hash de identidade e o horário de criação do único QueueService vivo no servidor."
    )
    public ResponseEntity<InstanceInfo> getInstancia() {
        QueueService instance = QueueService.getInstance();
        return ResponseEntity.ok(new InstanceInfo(instance.getInstanceId(), instance.getCreatedAt()));
    }

    public record InstanceInfo(String instanceId, String createdAt) {}
}
