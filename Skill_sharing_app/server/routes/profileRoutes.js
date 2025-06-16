const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const [profiles] = await db.promise().query('SELECT * FROM profiles');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profiles', error: err.message });
  }
});

// Get single profile by ID
router.get('/:id', async (req, res) => {
  try {
    const [profile] = await db.promise().query('SELECT * FROM profiles WHERE id = ?', [req.params.id]);
    if (profile.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Create new profile (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const {
      name, email, bio, fullBio, image, bannerImage, popularWork,
      workLink, twitter, instagram, positionTitle, companyName,
      experienceSummary, projectDescription, githubLink, skills,
      rating, price
    } = req.body;

    const [result] = await db.promise().query(
      `INSERT INTO profiles (
        name, email, bio, fullBio, image, bannerImage, popularWork,
        workLink, twitter, instagram, positionTitle, companyName,
        experienceSummary, projectDescription, githubLink, skills,
        rating, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, email, bio, fullBio, image, bannerImage, popularWork,
        workLink, twitter, instagram, positionTitle, companyName,
        experienceSummary, projectDescription, githubLink,
        JSON.stringify(skills), rating, price
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Profile created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating profile', error: err.message });
  }
});

// Update profile (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name, email, bio, fullBio, image, bannerImage, popularWork,
      workLink, twitter, instagram, positionTitle, companyName,
      experienceSummary, projectDescription, githubLink, skills,
      rating, price
    } = req.body;

    const [result] = await db.promise().query(
      `UPDATE profiles SET
        name = ?, email = ?, bio = ?, fullBio = ?, image = ?,
        bannerImage = ?, popularWork = ?, workLink = ?, twitter = ?,
        instagram = ?, positionTitle = ?, companyName = ?,
        experienceSummary = ?, projectDescription = ?, githubLink = ?,
        skills = ?, rating = ?, price = ?
      WHERE id = ?`,
      [
        name, email, bio, fullBio, image, bannerImage, popularWork,
        workLink, twitter, instagram, positionTitle, companyName,
        experienceSummary, projectDescription, githubLink,
        JSON.stringify(skills), rating, price, req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Delete profile
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is authorized to delete this profile
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Not authorized to delete this profile' });
    }

    // Instead of deleting, update the profile to mark it as deleted
    const [result] = await db.promise().query(
      'UPDATE profiles SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile' });
  }
});

module.exports = router; 