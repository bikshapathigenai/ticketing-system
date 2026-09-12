package com.example.ticketing.repository;

import com.example.ticketing.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA Repository interface for Ticket entity operations.
 * Provides default implementations for save, findById, findAll, deleteById, etc.
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
