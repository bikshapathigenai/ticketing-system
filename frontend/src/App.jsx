import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TicketListPage } from './pages/TicketListPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { EditTicketPage } from './pages/EditTicketPage';

/**
 * Main App Component
 * 
 * CORE CONCEPT - REACT ROUTER SETUP:
 * 1. <BrowserRouter>: Wraps the entire application to enable HTML5 history API navigation.
 * 2. <Routes>: Container that evaluates URL paths against child <Route> definitions.
 * 3. <Route path="..." element={<Component />} />: Maps specific URL paths to React page components.
 *    - '/' -> TicketListPage (Main Dashboard Table)
 *    - '/create' -> CreateTicketPage (Form for POST requests)
 *    - '/edit/:id' -> EditTicketPage (Dynamic route with param for GET/PUT requests)
 */
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Persistent Top Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="app-container" style={{ flex: 1 }}>
          <Routes>
            {/* Page 1: Ticket List View */}
            <Route path="/" element={<TicketListPage />} />

            {/* Page 2: Create Ticket Form View */}
            <Route path="/create" element={<CreateTicketPage />} />

            {/* Page 3: Edit Ticket Form View (with dynamic :id URL parameter) */}
            <Route path="/edit/:id" element={<EditTicketPage />} />

            {/* Fallback Route for non-matching URLs */}
            <Route path="*" element={<TicketListPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.825rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(11, 15, 25, 0.5)'
        }}>
          IT Ticketing System — Full-Stack Spring Boot 3 & React CRUD Architecture
        </footer>
      </div>
    </BrowserRouter>
  );
}
