import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketForm } from '../components/TicketForm';
import { ErrorAlert } from '../components/ErrorAlert';
import { ticketService } from '../services/ticketService';
import { PlusCircle } from 'lucide-react';

/**
 * Page 2: CreateTicketPage (Route: '/create')
 * Handles ticket submission workflow by wrapping TicketForm and executing POST /api/tickets.
 * 
 * CORE CONCEPT - PROGRAMMATIC NAVIGATION (useNavigate):
 * useNavigate() hook allows functional components to redirect the user to a different route
 * programmatically (e.g., navigating back to '/' after POST request succeeds).
 */
export function CreateTicketPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Called by TicketForm when client-side validation passes.
   * Sends HTTP POST request to Spring Boot API endpoint.
   */
  const handleCreateTicket = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Send POST /api/tickets request
      await ticketService.createTicket(formData);
      
      // Programmatic Navigation back to Ticket List on success
      navigate('/', { state: { message: 'Ticket created successfully!' } });
    } catch (err) {
      console.error('Error creating ticket:', err);
      // Catch HTTP 400 validation error or HTTP 500 server error
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }} className="fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <PlusCircle size={28} color="var(--accent-primary)" />
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Create New Support Ticket</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Submit an IT ticket to request assistance or report a system glitch.
          </p>
        </div>
      </div>

      {/* ERROR UI DISPLAY FOR HTTP 400 / 500 ERRORS */}
      {error && <ErrorAlert error={error} />}

      <div className="glass-card">
        <TicketForm
          onSubmit={handleCreateTicket}
          isSubmitting={isSubmitting}
          mode="create"
        />
      </div>
    </div>
  );
}
