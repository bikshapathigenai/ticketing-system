package com.example.ticketing.service;

import com.example.ticketing.model.Ticket;
import java.util.List;
import java.util.Optional;

/**
 * Service interface declaring business logic contracts for IT Ticket management.
 */
public interface TicketService {
    List<Ticket> getAllTickets();
    Optional<Ticket> getTicketById(Long id);
    Ticket createTicket(Ticket ticket);
    Ticket updateTicket(Long id, Ticket updatedTicket);
    boolean deleteTicket(Long id);
}
