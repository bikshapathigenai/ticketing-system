package com.example.ticketing.service;

import com.example.ticketing.model.Priority;
import com.example.ticketing.model.Status;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of TicketService managing CRUD business operations and data persistence.
 */
@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus(Status.OPEN);
        }
        if (ticket.getPriority() == null) {
            ticket.setPriority(Priority.MEDIUM);
        }
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket updateTicket(Long id, Ticket updatedTicket) {
        return ticketRepository.findById(id).map(existingTicket -> {
            if (updatedTicket.getTitle() != null && !updatedTicket.getTitle().trim().isEmpty()) {
                existingTicket.setTitle(updatedTicket.getTitle());
            }
            existingTicket.setDescription(updatedTicket.getDescription());
            if (updatedTicket.getStatus() != null) {
                existingTicket.setStatus(updatedTicket.getStatus());
            }
            if (updatedTicket.getPriority() != null) {
                existingTicket.setPriority(updatedTicket.getPriority());
            }
            return ticketRepository.save(existingTicket);
        }).orElseThrow(() -> new RuntimeException("Ticket with ID " + id + " not found"));
    }

    @Override
    public boolean deleteTicket(Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
