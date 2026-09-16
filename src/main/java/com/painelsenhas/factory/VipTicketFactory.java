package com.painelsenhas.factory;

import com.painelsenhas.model.Ticket;
import com.painelsenhas.model.TicketType;

/**
 * ConcreteCreator: gera senhas VIP.
 * Prefixo "V", prioridade 3 (mais alta) — sempre a primeira
 * a ser chamada enquanto houver alguém dessa fila.
 */
public class VipTicketFactory extends TicketFactory {

    private static final String PREFIXO = "V";
    private static final int PRIORIDADE = 3;

    @Override
    protected Ticket criarSenha(int numero) {
        return new Ticket(numero, TicketType.VIP, PREFIXO, PRIORIDADE);
    }
}
