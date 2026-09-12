import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Plus, List, Server } from 'lucide-react';
import { ticketService } from '../services/ticketService';

/**
 * Navbar Component
 * Navigation header with active route highlighting using React Router.
 */
export function Navbar() {
  const location = useLocation();
  const isMock = ticketService.isMockEnabled();

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Title */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--accent-glow)'
          }}>
            <Ticket color="#fff" size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: '1.1' }}>TechDesk</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IT Ticketing Hub</span>
          </div>
        </Link>

        {/* Navigation Links & API Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* API Server Mode Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '20px',
            background: isMock ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${isMock ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            fontSize: '0.75rem',
            fontWeight: '600',
            color: isMock ? '#fbbf24' : '#34d399'
          }} title={isMock ? 'Running on Mock Data (Spring Boot offline)' : 'Connected to Spring Boot REST API'}>
            <Server size={12} />
            {isMock ? 'Mock API Mode' : 'Spring Boot API'}
          </div>

          <nav style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              to="/"
              className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <List size={16} /> All Tickets
            </Link>

            <Link
              to="/create"
              className={`btn ${location.pathname === '/create' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Create Ticket
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
