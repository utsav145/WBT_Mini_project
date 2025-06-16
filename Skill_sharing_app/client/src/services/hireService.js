const API_URL = 'http://localhost:5000/api';

export const hireService = {
  // Send a hire request
  sendHireRequest: async (employeeId, message) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/hire-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ employeeId, message })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send hire request');
    }
    return response.json();
  },

  // Get all hire requests for current user
  getMyRequests: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/hire-requests/my-requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch hire requests');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching hire requests:', error);
      throw error;
    }
  },

  // Update hire request status
  updateRequestStatus: async (requestId, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(`${API_URL}/hire-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update hire request');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating hire request:', error);
      throw error;
    }
  }
}; 