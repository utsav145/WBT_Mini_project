import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaRegComment, FaSearch, FaUserPlus } from 'react-icons/fa';
import { messageService } from '../services/messageService';
import { hireService } from '../services/hireService';
import { profileApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/MessagingLanding.css';

const MessagingLanding = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireMessage, setHireMessage] = useState('');
  const [hireRequests, setHireRequests] = useState({ received: [], sent: [] });

  // Load all users (except current user)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const profiles = await profileApi.getAllProfiles();
        const otherUsers = profiles.filter(profile => profile.id !== user?.id);
        setUsers(otherUsers);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user]);

  // Load messages when a user is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser) return;

      try {
        const conversation = await messageService.getConversation(selectedUser.id);
        setMessages(conversation);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages');
      }
    };

    loadMessages();
  }, [selectedUser]);

  // Load hire requests
  useEffect(() => {
    const loadHireRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view hire requests');
          return;
        }

        const requests = await hireService.getMyRequests();
        setHireRequests(requests);
      } catch (err) {
        console.error('Error loading hire requests:', err);
        if (err.message.includes('authentication')) {
          setError('Please log in to view hire requests');
        } else {
          setError('Failed to load hire requests');
        }
      }
    };

    loadHireRequests();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const handleSend = async () => {
    if (input.trim() === '' || !selectedUser) return;
    
    // Don't allow sending messages to deleted profiles
    if (selectedUser.isDeleted) {
      setError('Cannot send messages to deleted profiles');
      return;
    }

    try {
      const newMessage = await messageService.sendMessage(selectedUser.id, input.trim());
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHireRequest = async () => {
    if (!selectedUser || !hireMessage.trim()) return;

    try {
      await hireService.sendHireRequest(selectedUser.id, hireMessage.trim());
      setShowHireModal(false);
      setHireMessage('');
      // Refresh hire requests
      const requests = await hireService.getMyRequests();
      setHireRequests(requests);
    } catch (err) {
      console.error('Error sending hire request:', err);
      setError('Failed to send hire request');
    }
  };

  const handleRequestResponse = async (requestId, status) => {
    try {
      await hireService.updateRequestStatus(requestId, status);
      // Refresh hire requests
      const requests = await hireService.getMyRequests();
      setHireRequests(requests);
    } catch (err) {
      console.error('Error updating hire request:', err);
      setError('Failed to update hire request');
    }
  };

  if (loading) {
    return (
      <div className="messaging-landing">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-landing">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      {/* Sidebar with users */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h4>Messages</h4>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              className="auth-input" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="chat-users-list">
          <ul>
            {filteredUsers.map(user => (
              <li 
                key={user.id} 
                className={`${selectedUser && selectedUser.id === user.id ? 'active' : ''} ${user.isDeleted ? 'deleted' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-info">
                  <img 
                    src={user.image || 'https://via.placeholder.com/40'} 
                    alt={user.name} 
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <span className="user-name">
                      {user.name}
                      {user.isDeleted && <span className="deleted-badge">(Deleted)</span>}
                    </span>
                    <span className="user-title">{user.positionTitle}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-section">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="chat-header-user">
                <img 
                  src={selectedUser.image || 'https://via.placeholder.com/40'} 
                  alt={selectedUser.name} 
                  className="chat-header-avatar"
                />
                <div className="chat-header-info">
                  <h5>
                    {selectedUser.name}
                    {selectedUser.isDeleted && <span className="deleted-badge">(Deleted)</span>}
                  </h5>
                  <span>{selectedUser.positionTitle}</span>
                </div>
              </div>
              {!selectedUser.isDeleted && (
                <button 
                  className="hire-button"
                  onClick={() => setShowHireModal(true)}
                >
                  <FaUserPlus /> Hire
                </button>
              )}
            </div>
            
            <div className="chat-messages">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`chat-message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="no-messages">
                  <FaRegComment size={32} />
                  <p>Start a conversation with {selectedUser.name}</p>
                </div>
              )}
            </div>

            {!selectedUser.isDeleted && (
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button onClick={handleSend}>
                  <FaPaperPlane /> Send
                </button>
              </div>
            )}
            {selectedUser.isDeleted && (
              <div className="chat-input disabled">
                <p>This profile has been deleted. You can view the conversation history but cannot send new messages.</p>
              </div>
            )}
          </>
        ) : (
          <div className="no-conversation">
            <div className="icon">👋</div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Hire Request Modal */}
      {showHireModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Send Hire Request</h3>
            <textarea
              placeholder="Enter your hire request message..."
              value={hireMessage}
              onChange={(e) => setHireMessage(e.target.value)}
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={() => setShowHireModal(false)}>Cancel</button>
              <button onClick={handleHireRequest}>Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Hire Requests List */}
      <div className="hire-requests">
        <h4>Hire Requests</h4>
        <div className="requests-section">
          <h5>Received Requests</h5>
          {hireRequests.received.map(request => (
            <div key={request.id} className="request-item">
              <div className="request-info">
                <strong>{request.employer_name}</strong>
                <p>{request.message}</p>
                <small>{new Date(request.created_at).toLocaleDateString()}</small>
              </div>
              {request.status === 'pending' && (
                <div className="request-actions">
                  <button onClick={() => handleRequestResponse(request.id, 'accepted')}>Accept</button>
                  <button onClick={() => handleRequestResponse(request.id, 'rejected')}>Reject</button>
                </div>
              )}
              {request.status !== 'pending' && (
                <span className={`request-status ${request.status}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="requests-section">
          <h5>Sent Requests</h5>
          {hireRequests.sent.map(request => (
            <div key={request.id} className="request-item">
              <div className="request-info">
                <strong>{request.employee_name}</strong>
                <p>{request.message}</p>
                <small>{new Date(request.created_at).toLocaleDateString()}</small>
              </div>
              <span className={`request-status ${request.status}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagingLanding;
