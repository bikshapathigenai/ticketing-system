import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

/**
 * TicketForm Component
 * Reusable Controlled Component used for both Creating and Editing tickets.
 * 
 * CORE CONCEPT - CONTROLLED COMPONENTS:
 * In React, form inputs are "controlled" when their values are bound to React state.
 * React becomes the "single source of truth" for input values. Every keystroke triggers
 * an onChange event that updates component state, ensuring the UI always reflects state.
 */
export function TicketForm({ initialData = null, onSubmit, isSubmitting = false, mode = 'create' }) {
  const navigate = useNavigate();

  // 1. CONTROLLED COMPONENT STATE: Holds state for all form fields tightly bound to input elements
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'MEDIUM',
  });

  // Client-side validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // 2. Populate form state if editing an existing ticket (runs when initialData props changes)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'OPEN',
        priority: initialData.priority || 'MEDIUM',
      });
    }
  }, [initialData]);

  /**
   * Universal change handler for controlled inputs.
   * Dynamically extracts 'name' and 'value' from e.target to update the specific state field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user starts typing in a field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Immutable state update pattern using functional update
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Validate form fields before submitting request to API
   */
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Ticket Title is required.';
    } else if (formData.title.trim().length < 4) {
      errors.title = 'Title must be at least 4 characters long.';
    }

    if (!formData.description.trim()) {
      errors.description = 'Please provide a brief description of the issue.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent standard browser full-page form submit reload
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      {/* Title Field (Controlled Text Input) */}
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Ticket Title <span style={{ color: '#f43f5e' }}>*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          placeholder="e.g., VPN connection failure on APAC node"
          value={formData.title} // Bounded value from React State
          onChange={handleChange} // Handler updating React State on every keypress
          disabled={isSubmitting}
        />
        {validationErrors.title && (
          <span style={{ fontSize: '0.8rem', color: '#fb7185', marginTop: '0.2rem' }}>
            {validationErrors.title}
          </span>
        )}
      </div>

      {/* Grid Layout for Status and Priority Select Dropdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Status Dropdown (Controlled Select) */}
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={formData.status} // Bounded value from React State
            onChange={handleChange} // Handler updating React State
            disabled={isSubmitting}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Priority Dropdown (Controlled Select) */}
        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority Level
          </label>
          <select
            id="priority"
            name="priority"
            className="form-control"
            value={formData.priority} // Bounded value from React State
            onChange={handleChange} // Handler updating React State
            disabled={isSubmitting}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Description Field (Controlled Textarea Input) */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Detailed Description <span style={{ color: '#f43f5e' }}>*</span>
        </label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          placeholder="Provide step-by-step details, error logs, or environment specs..."
          value={formData.description} // Bounded value from React State
          onChange={handleChange} // Handler updating React State
          disabled={isSubmitting}
          rows={5}
        />
        {validationErrors.description && (
          <span style={{ fontSize: '0.8rem', color: '#fb7185', marginTop: '0.2rem' }}>
            {validationErrors.description}
          </span>
        )}
      </div>

      {/* Form Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} /> Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              {mode === 'edit' ? 'Saving Changes...' : 'Creating Ticket...'}
            </>
          ) : (
            <>
              <Save size={16} />
              {mode === 'edit' ? 'Update Ticket' : 'Submit Ticket'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
