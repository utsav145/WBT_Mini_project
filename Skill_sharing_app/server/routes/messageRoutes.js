const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Get all messages for a user (both sent and received)
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [messages] = await db.promise().query(
      `SELECT 
        m.*,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY m.created_at DESC`,
      [userId, userId]
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

// Get conversation between two users
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const [messages] = await db.promise().query(
      `SELECT 
        m.*,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId, otherUserId, currentUserId]
    );

    // Mark unread messages as read
    await db.promise().query(
      `UPDATE messages 
       SET is_read = TRUE 
       WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE`,
      [currentUserId, otherUserId]
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ message: 'Error fetching conversation', error: err.message });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const [result] = await db.promise().query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );

    // Get the newly created message with user details
    const [newMessage] = await db.promise().query(
      `SELECT 
        m.*,
        sender.name as sender_name,
        sender.email as sender_email,
        receiver.name as receiver_name,
        receiver.email as receiver_email
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newMessage[0]);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

// Get unread message count
router.get('/unread', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await db.promise().query(
      'SELECT COUNT(*) as unread_count FROM messages WHERE receiver_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({ unreadCount: result[0].unread_count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ message: 'Error fetching unread count', error: err.message });
  }
});

module.exports = router; 