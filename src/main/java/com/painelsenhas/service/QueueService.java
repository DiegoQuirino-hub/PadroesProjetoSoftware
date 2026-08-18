package com.painelsenhas.service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Equivalente ao QueueService.cs — padrão Singleton clássico preservado.
 * Thread-safe com synchronized no getInstance().
 */
public class QueueService {

    // 1. Atributo estático privado que guarda a única instância da classe
    private static QueueService uniqueInstance;

    // Atributos de negócio da classe
    private int currentTicket;
    private List<Integer> calledTickets;

    // Identidade da instância — existe só para tornar o Singleton visível na demo:
    // toda requisição, de qualquer cliente, deve enxergar o mesmo instanceId.
    private final String instanceId;
    private final String createdAt;

    // 2. Construtor privado: ninguém fora desta classe pode dar "new QueueService()"
    private QueueService() {
        this.currentTicket = 0;
        this.calledTickets = new ArrayList<>();
        this.instanceId = Integer.toHexString(System.identityHashCode(this));
        this.createdAt = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    // 3. Método estático público: o único ponto de acesso global à instância
    //    synchronized garante thread-safety em ambiente web (ausente no original C#)
    public static synchronized QueueService getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new QueueService();
        }
        return uniqueInstance;
    }

    public int generateTicket() {
        this.currentTicket = this.currentTicket + 1;
        return this.currentTicket;
    }

    public int getLastTicket() {
        return this.currentTicket;
    }

    public void callNext(int ticket) {
        this.calledTickets.add(ticket);
    }

    public List<Integer> getHistory() {
        return this.calledTickets;
    }

    public String getInstanceId() {
        return this.instanceId;
    }

    public String getCreatedAt() {
        return this.createdAt;
    }
}
