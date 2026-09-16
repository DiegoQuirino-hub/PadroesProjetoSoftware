package com.painelsenhas.model;

/**
 * Tipos de senha emitidos pelo painel.
 * Cada tipo terá sua própria Factory concreta (Factory Method)
 * e sua própria prioridade de atendimento.
 */
public enum TicketType {
    NORMAL,
    PREFERENCIAL,
    VIP
}
