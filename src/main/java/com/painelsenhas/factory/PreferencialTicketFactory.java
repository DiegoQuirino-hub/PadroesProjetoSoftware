package com.painelsenhas.factory;

import com.painelsenhas.model.Ticket;
import com.painelsenhas.model.TicketType;

/**
 * ConcreteCreator: gera senhas preferenciais.
 * Prefixo "P", prioridade 2 — é chamada antes das senhas Normais,
 * mas depois das VIP.
 */
public class PreferencialTicketFactory extends TicketFactory {

    private static final String PREFIXO = "P";
    private static final int PRIORIDADE = 2;

    @Override
    protected Ticket criarSenha(int numero) {
        return new Ticket(numero, TicketType.PREFERENCIAL, PREFIXO, PRIORIDADE);
    }
}
