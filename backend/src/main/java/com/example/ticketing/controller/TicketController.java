package com.example.ticketing.controller;

import com.example.ticketing.model.Ticket;
import com.example.ticketing.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing IT Ticket endpoints for the React frontend.
 * Endpoint base path: /api/tickets
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(originPatterns = "*") // Allows React dev server connection
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * GET /api/tickets - Fetch all tickets.
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    /**
     * GET /api/tickets/{id} - Fetch a single ticket by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Ticket with ID " + id + " was not found."));
    }

    /**
     * POST /api/tickets - Create a new ticket.
     */
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket) {
        if (ticket.getTitle() == null || ticket.getTitle().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ticket title is required and cannot be empty.");
        }
        Ticket created = ticketService.createTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/tickets/{id} - Update an existing ticket by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        if (ticket.getTitle() != null && ticket.getTitle().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ticket title cannot be set to an empty string.");
        }
        try {
            Ticket updated = ticketService.updateTicket(id, ticket);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    /**
     * DELETE /api/tickets/{id} - Delete a ticket by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        boolean deleted = ticketService.deleteTicket(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cannot delete. Ticket with ID " + id + " does not exist.");
        }
    }
}
