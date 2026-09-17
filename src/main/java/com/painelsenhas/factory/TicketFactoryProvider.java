package com.painelsenhas.factory;

import com.painelsenhas.model.TicketType;

/**
 * Ponto único que sabe mapear TicketType -> Factory concreta.
 * Isolar essa escolha aqui é o que permite ao QueueController/QueueService
 * pedir "uma senha do tipo X" sem conhecer NormalTicketFactory,
 * PreferencialTicketFactory ou VipTicketFactory diretamente.
 */
public final class TicketFactoryProvider {

    private TicketFactoryProvider() {}

    public static TicketFactory getFactory(TicketType tipo) {
        return switch (tipo) {
            case NORMAL -> new NormalTicketFactory();
            case PREFERENCIAL -> new PreferencialTicketFactory();
            case VIP -> new VipTicketFactory();
        };
    }
}
