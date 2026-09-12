import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TicketForm } from '../components/TicketForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { ticketService } from '../services/ticketService';
import { Edit3 } from 'lucide-react';

/**
 * Page 3: EditTicketPage (Route: '/edit/:id')
 * Dynamic route component fetching ticket details by URL parameter on mount,
 * pre-populating controlled inputs, and issuing HTTP PUT requests on submit.
 * 
 * CORE CONCEPTS DEMONSTRATED:
 * 1. useParams(): Extracts the ':id' parameter from the current route URL.
 * 2. Lifecycle useEffect: Triggers GET /api/tickets/:id when component mounts or ID changes.
 * 3. Pre-filled Controlled Form: Passes fetched ticket object into TicketForm as initialData.
 */
export function EditTicketPage() {
  const { id } = useParams(); // Extract :id from dynamic URL path
  const navigate = useNavigate();

  // State Management
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Fetch ticket details on mount via GET /api/tickets/:id
   */
  useEffect(() => {
    const loadTicketDetails = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await ticketService.getTicketById(id);
        setTicket(data);
      } catch (err) {
        console.error(`Failed to load ticket #${id}:`, err);
        setFetchError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadTicketDetails();
    }
  }, [id]);

  /**
   * Sends HTTP PUT /api/tickets/:id request on form submit
   */
  const handleUpdateTicket = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Send PUT /api/tickets/:id request
      await ticketService.updateTicket(id, formData);
      
      // Navigate back to list view on success
      navigate('/', { state: { message: `Ticket #${id} updated successfully!` } });
    } catch (err) {
      console.error(`Failed to update ticket #${id}:`, err);
      setSubmitError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message={`Fetching details for Ticket #${id}...`} />;
  }

  if (fetchError) {
    return (
      <div style={{ maxWidth: '750px', margin: '0 auto' }} className="fade-in">
        <ErrorAlert
          error={fetchError}
          onRetry={() => window.location.reload()}
        />
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Back to Ticket List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Edit3 size={28} color="var(--accent-primary)" />
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Edit Ticket #{id}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Update the title, status, priority, or problem description.
          </p>
        </div>
      </div>

      {/* ERROR UI DISPLAY FOR HTTP PUT SUBMISSION ERRORS */}
      {submitError && <ErrorAlert error={submitError} />}

      {/* Glassmorphic Container wrapping pre-filled Controlled TicketForm */}
      <div className="glass-card">
        <TicketForm
          initialData={ticket} // Pre-fills inputs in TicketForm via useEffect
          onSubmit={handleUpdateTicket}
          isSubmitting={isSubmitting}
          mode="edit"
        />
      </div>
    </div>
  );
}
