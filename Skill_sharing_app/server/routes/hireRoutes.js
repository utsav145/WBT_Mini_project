const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Send hire request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { employeeId, message } = req.body;
    const employerId = req.user.id;

    // Validate input
    if (!employerId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!employeeId || !message) {
      return res.status(400).json({ message: 'Employee ID and message are required' });
    }

    // Check if there's already a pending request
    const [existingRequest] = await pool.promise().query(
      'SELECT * FROM hire_requests WHERE employer_id = ? AND employee_id = ? AND status = "pending"',
      [employerId, employeeId]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({ message: 'You already have a pending hire request with this user' });
    }

    // Create new hire request
    const [result] = await pool.promise().query(
      'INSERT INTO hire_requests (employer_id, employee_id, message) VALUES (?, ?, ?)',
      [employerId, employeeId, message]
    );

    res.status(201).json({ 
      message: 'Hire request sent successfully',
      requestId: result.insertId 
    });
  } catch (error) {
    console.error('Error sending hire request:', error);
    res.status(500).json({ message: 'Error sending hire request' });
  }
});

// Get hire requests for current user
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get requests where user is the employee
    const [receivedRequests] = await pool.promise().query(
      `SELECT hr.*, 
        u1.name as employer_name, u1.email as employer_email,
        u2.name as employee_name, u2.email as employee_email
       FROM hire_requests hr
       JOIN users u1 ON hr.employer_id = u1.id
       JOIN users u2 ON hr.employee_id = u2.id
       WHERE hr.employee_id = ?`,
      [userId]
    );

    // Get requests where user is the employer
    const [sentRequests] = await pool.promise().query(
      `SELECT hr.*, 
        u1.name as employer_name, u1.email as employer_email,
        u2.name as employee_name, u2.email as employee_email
       FROM hire_requests hr
       JOIN users u1 ON hr.employer_id = u1.id
       JOIN users u2 ON hr.employee_id = u2.id
       WHERE hr.employer_id = ?`,
      [userId]
    );

    res.json({
      received: receivedRequests,
      sent: sentRequests
    });
  } catch (error) {
    console.error('Error fetching hire requests:', error);
    res.status(500).json({ message: 'Error fetching hire requests' });
  }
});

// Update hire request status (accept/reject)
router.patch('/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Verify the request exists and user is the employee
    const [request] = await pool.promise().query(
      'SELECT * FROM hire_requests WHERE id = ? AND employee_id = ?',
      [requestId, userId]
    );

    if (request.length === 0) {
      return res.status(404).json({ message: 'Hire request not found' });
    }

    if (request[0].status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    // Update the request status
    await pool.promise().query(
      'UPDATE hire_requests SET status = ? WHERE id = ?',
      [status, requestId]
    );

    res.json({ message: `Hire request ${status} successfully` });
  } catch (error) {
    console.error('Error updating hire request:', error);
    res.status(500).json({ message: 'Error updating hire request' });
  }
});

module.exports = router; 