const API_URL = 'http://localhost:5000/api';

export const messageService = {
  // Get all messages for the current user
  getAllMessages: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return response.json();
  },

  // Get conversation between two users
  getConversation: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/conversation/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }
    return response.json();
  },

  // Send a new message
  sendMessage: async (receiverId, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ receiverId, content })
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  },

  // Get unread message count
  getUnreadCount: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/unread`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }
    return response.json();
  }
}; 