package com.painelsenhas.model;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * Product do padrão Factory Method.
 * Cada Ticket carrega um código próprio (prefixo + número sequencial
 * do seu tipo) e uma prioridade, ambos definidos pela Factory que o criou.
 */
public class Ticket {

    private final int numero;
    private final TicketType tipo;
    private final String prefixo;
    private final int prioridade;
    private final String codigo;
    private final String horaGeracao;

    public Ticket(int numero, TicketType tipo, String prefixo, int prioridade) {
        this.numero = numero;
        this.tipo = tipo;
        this.prefixo = prefixo;
        this.prioridade = prioridade;
        this.codigo = prefixo + String.format("%03d", numero);
        this.horaGeracao = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    public int getNumero() { return numero; }
    public TicketType getTipo() { return tipo; }
    public String getPrefixo() { return prefixo; }
    public int getPrioridade() { return prioridade; }
    public String getCodigo() { return codigo; }
    public String getHoraGeracao() { return horaGeracao; }

    @Override
    public String toString() {
        return codigo;
    }
}
