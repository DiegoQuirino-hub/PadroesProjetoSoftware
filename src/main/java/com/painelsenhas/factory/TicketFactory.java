package com.painelsenhas.factory;

import com.painelsenhas.model.Ticket;

/**
 * Creator abstrato do padrão Factory Method.
 *
 * QueueService (e o restante do sistema) só conhece esta classe —
 * nunca sabe se está lidando com uma senha Normal, Preferencial ou VIP.
 * Quem decide isso é a subclasse concreta, sobrescrevendo criarSenha().
 */
public abstract class TicketFactory {

    // Factory Method: cada subclasse concreta decide QUAL Ticket
    // instanciar e com qual prefixo/prioridade.
    protected abstract Ticket criarSenha(int numero);

    // Método "template" que usa o Factory Method acima.
    // Todo o fluxo comum de emissão passa por aqui, independente do tipo.
    public final Ticket emitirSenha(int numero) {
        Ticket senha = criarSenha(numero);
        // ponto de extensão comum a qualquer tipo de senha
        // (ex.: log, auditoria, notificação futura)
        return senha;
    }
}
