package com.example.ticketing;

import com.example.ticketing.model.Priority;
import com.example.ticketing.model.Status;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.repository.TicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Main Spring Boot Application Entry Point.
 */
@SpringBootApplication
public class TicketingApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketingApplication.class, args);
    }

    /**
     * Pre-populates the in-memory H2 database with sample IT tickets on startup.
     */
    @Bean
    public CommandLineRunner initDatabase(TicketRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Ticket(null, "VPN Connection Dropout", 
                        "User experiences periodic disconnects when connected to APAC VPN node.", 
                        Status.OPEN, Priority.HIGH));
                        
                repository.save(new Ticket(null, "Laptop Screen Replacement", 
                        "Display panel flickering on Dell XPS 15 near hinges.", 
                        Status.IN_PROGRESS, Priority.MEDIUM));
                        
                repository.save(new Ticket(null, "Request New Monitor Stand", 
                        "Dual monitor desk mount arm requested for workstation B-402.", 
                        Status.CLOSED, Priority.LOW));

                repository.save(new Ticket(null, "Database Permission Access", 
                        "Grant read-only access to staging PostgreSQL instance for QA automated test suite.", 
                        Status.OPEN, Priority.HIGH));
            }
        };
    }
}
