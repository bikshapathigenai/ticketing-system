import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';

/**
 * Page 1: TicketListPage (Route: '/')
 * Renders the table of all IT tickets, allowing filtering, searching, editing, and deleting.
 * 
 * CORE CONCEPT - LOADING & ERROR STATES:
 * Asynchronous HTTP network calls have 3 UI states:
 * 1. Loading: Displays spinner while GET request is in flight.
 * 2. Error: Catches HTTP status exceptions (400, 500, network down) and shows alert.
 * 3. Success (Data): Displays rendered list of items once promise resolves.
 */
export function TicketListPage() {
  const navigate = useNavigate();

  // State Management
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  /**
   * CORE CONCEPT - useEffect:
   * Triggers initial data fetching when component mounts. The empty dependency array []
   * guarantees that fetchTickets() executes exactly once after initial render.
   */
  useEffect(() => {
    fetchTickets();
  }, []);

  /**
   * Fetch tickets from REST API backend via ticketService
   */
  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle DELETE request when user clicks Delete button on a ticket row
   */
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ticket #${id}: "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await ticketService.deleteTicket(id);
      // Optimistic update: Remove deleted ticket from local component state immediately
      setTickets((prev) => prev.filter((t) => String(t.id) !== String(id)));
    } catch (err) {
      alert(`Failed to delete ticket: ${err.message || 'Server error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter tickets by Status dropdown and Search input query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'ALL' || (ticket.status || 'OPEN').toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>IT Support Tickets</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage, track, and resolve system issues across your organization.
          </p>
        </div>

        {/* Create Ticket Button (Navigates to /create) */}
        <Link to="/create" className="btn btn-primary">
          <Plus size={18} /> Create New Ticket
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px auto',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search tickets by title or description..."
              className="form-control"
              style={{ paddingLeft: '2.75rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.6rem 0.75rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button onClick={fetchTickets} className="btn btn-secondary" title="Refresh ticket list">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ERROR STATE UI DISPLAY */}
      {error && <ErrorAlert error={error} onRetry={fetchTickets} />}

      {/* LOADING STATE UI DISPLAY */}
      {isLoading ? (
        <LoadingSpinner message="Fetching IT support tickets from server..." />
      ) : (
        /* SUCCESS / DATA STATE DISPLAY */
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {filteredTickets.length === 0 ? (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <AlertCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                No Tickets Found
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your search query or status filter.'
                  : 'No tickets exist in the system yet. Click "Create New Ticket" to add one!'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th>Ticket Details</th>
                    <th style={{ width: '150px' }}>Status</th>
                    <th style={{ width: '130px' }}>Priority</th>
                    <th style={{ width: '150px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      {/* Ticket ID */}
                      <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
                        #{ticket.id}
                      </td>

                      {/* Title & Description */}
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                          {ticket.title}
                        </div>
                        <div style={{
                          fontSize: '0.825rem',
                          color: 'var(--text-secondary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxHeight: '2.6em'
                        }}>
                          {ticket.description}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <StatusBadge status={ticket.status} />
                      </td>

                      {/* Priority Badge */}
                      <td>
                        <PriorityBadge priority={ticket.priority} />
                      </td>

                      {/* Action Buttons (Edit & Delete) */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {/* EDIT BUTTON: Uses useNavigate to jump to /edit/:id */}
                          <button
                            onClick={() => navigate(`/edit/${ticket.id}`)}
                            className="btn btn-sm btn-secondary"
                            title="Edit ticket"
                          >
                            <Edit2 size={14} /> Edit
                          </button>

                          {/* DELETE BUTTON: Sends HTTP DELETE /api/tickets/{id} */}
                          <button
                            onClick={() => handleDelete(ticket.id, ticket.title)}
                            className="btn btn-sm btn-danger"
                            disabled={deletingId === ticket.id}
                            title="Delete ticket"
                          >
                            <Trash2 size={14} />
                            {deletingId === ticket.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
