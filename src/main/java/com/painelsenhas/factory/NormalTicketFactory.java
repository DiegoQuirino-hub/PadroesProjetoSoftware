package com.painelsenhas.factory;

import com.painelsenhas.model.Ticket;
import com.painelsenhas.model.TicketType;

/**
 * ConcreteCreator: gera senhas comuns.
 * Prefixo "N", prioridade 1 (mais baixa) — é a última a ser chamada
 * quando houver Preferencial ou VIP aguardando.
 */
public class NormalTicketFactory extends TicketFactory {

    private static final String PREFIXO = "N";
    private static final int PRIORIDADE = 1;

    @Override
    protected Ticket criarSenha(int numero) {
        return new Ticket(numero, TicketType.NORMAL, PREFIXO, PRIORIDADE);
    }
}
