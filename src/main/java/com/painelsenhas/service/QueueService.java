package com.painelsenhas.service;

import com.painelsenhas.factory.TicketFactory;
import com.painelsenhas.factory.TicketFactoryProvider;
import com.painelsenhas.model.Ticket;
import com.painelsenhas.model.TicketType;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Continua Singleton clássico (getInstance() synchronized), como no
 * restante do projeto — só que agora orquestra o Factory Method para
 * emitir senhas de tipos diferentes (Normal, Preferencial, VIP).
 */
public class QueueService {

    private static QueueService uniqueInstance;

    // Ordem de chamada: VIP > Preferencial > Normal
    private static final List<TicketType> ORDEM_PRIORIDADE =
            List.of(TicketType.VIP, TicketType.PREFERENCIAL, TicketType.NORMAL);

    // Contador sequencial independente por tipo (N001, P001, V001...)
    private final Map<TicketType, Integer> contadores = new EnumMap<>(TicketType.class);
    // Fila de espera separada por tipo
    private final Map<TicketType, Queue<Ticket>> filas = new EnumMap<>(TicketType.class);
    private final List<Ticket> historico = new ArrayList<>();
    private Ticket ultimaChamada;

    private final String instanceId;
    private final String createdAt;

    private QueueService() {
        for (TicketType tipo : TicketType.values()) {
            contadores.put(tipo, 0);
            filas.put(tipo, new LinkedList<>());
        }
        this.instanceId = Integer.toHexString(System.identityHashCode(this));
        this.createdAt = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public static synchronized QueueService getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new QueueService();
        }
        return uniqueInstance;
    }

    /**
     * Emite uma nova senha do tipo informado usando o Factory Method
     * correspondente e a coloca na fila de espera daquele tipo.
     */
    public synchronized Ticket generateTicket(TicketType tipo) {
        int numero = contadores.merge(tipo, 1, Integer::sum);
        TicketFactory factory = TicketFactoryProvider.getFactory(tipo);
        Ticket senha = factory.emitirSenha(numero);
        filas.get(tipo).add(senha);
        return senha;
    }

    /**
     * Chama a próxima senha respeitando a prioridade entre os tipos
     * (VIP > Preferencial > Normal). Dentro do mesmo tipo, respeita
     * a ordem de chegada (FIFO) — é essa checagem em ORDEM_PRIORIDADE
     * que muda de comportamento conforme o tipo criado pela Factory.
     */
    public synchronized Ticket callNext() {
        for (TicketType tipo : ORDEM_PRIORIDADE) {
            Queue<Ticket> fila = filas.get(tipo);
            if (!fila.isEmpty()) {
                Ticket chamada = fila.poll();
                historico.add(chamada);
                ultimaChamada = chamada;
                return chamada;
            }
        }
        return null;
    }

    public Ticket getUltimaChamada() {
        return ultimaChamada;
    }

    public List<Ticket> getHistory() {
        return historico;
    }

    /** Quantas senhas de cada tipo ainda aguardam atendimento. */
    public Map<TicketType, Integer> getFilaEmEspera() {
        Map<TicketType, Integer> tamanhos = new EnumMap<>(TicketType.class);
        filas.forEach((tipo, fila) -> tamanhos.put(tipo, fila.size()));
        return tamanhos;
    }

    public String getInstanceId() { return instanceId; }
    public String getCreatedAt() { return createdAt; }
}
