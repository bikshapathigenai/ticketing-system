import axios from 'axios';

// Base REST API URL for Spring Boot Controller (@RequestMapping("/api/tickets"))
const API_BASE_URL = 'http://localhost:8080/api/tickets';

// Create an Axios instance with standard configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000, // 4-second timeout for quick fallback detection
});

// In-Memory Mock Data Store (Used when Spring Boot API is offline)
let mockTickets = [
  {
    id: 1,
    title: 'VPN Connection Dropout',
    description: 'User experiences periodic disconnects when connected to APAC VPN node.',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 2,
    title: 'Laptop Screen Replacement',
    description: 'Display panel flickering on Dell XPS 15 near hinges.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 3,
    title: 'Request New Monitor Stand',
    description: 'Dual monitor desk mount arm requested for workstation B-402.',
    status: 'CLOSED',
    priority: 'LOW',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

let useMockFallback = false;

export const ticketService = {
  /**
   * Check if mock mode is currently enabled
   */
  isMockEnabled: () => useMockFallback,

  /**
   * Toggle between live Spring Boot API and Mock API mode
   */
  setMockMode: (enabled) => {
    useMockFallback = enabled;
  },

  /**
   * Fetch all tickets from backend GET /api/tickets
   */
  getAllTickets: async () => {
    if (useMockFallback) {
      // Simulate network delay
      await new Promise((res) => setTimeout(res, 400));
      return [...mockTickets];
    }

    try {
      const response = await apiClient.get('');
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        console.warn('Spring Boot API unreachable. Enabling Mock Mode fallback.');
        useMockFallback = true;
        return [...mockTickets];
      }
      throw handleApiError(error);
    }
  },

  /**
   * Fetch single ticket by ID from backend GET /api/tickets/{id}
   */
  getTicketById: async (id) => {
    if (useMockFallback) {
      await new Promise((res) => setTimeout(res, 300));
      const found = mockTickets.find((t) => String(t.id) === String(id));
      if (!found) {
        const err = new Error(`Ticket with ID ${id} not found.`);
        err.status = 404;
        throw err;
      }
      return { ...found };
    }

    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new ticket via POST /api/tickets
   */
  createTicket: async (ticketData) => {
    if (useMockFallback) {
      await new Promise((res) => setTimeout(res, 500));
      const newTicket = {
        id: Date.now(),
        ...ticketData,
        createdAt: new Date().toISOString(),
      };
      mockTickets = [newTicket, ...mockTickets];
      return newTicket;
    }

    try {
      const response = await apiClient.post('', ticketData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update existing ticket via PUT /api/tickets/{id}
   */
  updateTicket: async (id, ticketData) => {
    if (useMockFallback) {
      await new Promise((res) => setTimeout(res, 500));
      const index = mockTickets.findIndex((t) => String(t.id) === String(id));
      if (index === -1) {
        const err = new Error(`Ticket with ID ${id} not found.`);
        err.status = 404;
        throw err;
      }
      mockTickets[index] = { ...mockTickets[index], ...ticketData };
      return mockTickets[index];
    }

    try {
      const response = await apiClient.put(`/${id}`, ticketData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete ticket via DELETE /api/tickets/{id}
   */
  deleteTicket: async (id) => {
    if (useMockFallback) {
      await new Promise((res) => setTimeout(res, 400));
      mockTickets = mockTickets.filter((t) => String(t.id) !== String(id));
      return true;
    }

    try {
      await apiClient.delete(`/${id}`);
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

/**
 * Normalizes Axios error response into a human-readable object.
 */
function handleApiError(error) {
  if (error.response) {
    // Server responded with non-2xx status code (e.g. 400, 404, 500)
    const status = error.response.status;
    const message =
      typeof error.response.data === 'string'
        ? error.response.data
        : error.response.data?.message || `Request failed with HTTP status ${status}`;

    return {
      status,
      message,
      details: error.response.data,
    };
  } else if (error.request) {
    // Request sent but no response received (Network error / server down)
    return {
      status: 0,
      message: 'Unable to connect to Spring Boot server at http://localhost:8080.',
    };
  } else {
    // Request setup error
    return {
      status: 500,
      message: error.message || 'An unexpected error occurred.',
    };
  }
}
