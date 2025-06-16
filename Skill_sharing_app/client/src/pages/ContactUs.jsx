import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    contact: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        website: '',
        contact: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageStyle = {
    backgroundColor: '#ffffff',
    minHeight: 'auto',
    padding: '20px',
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div className="d-flex align-items-center justify-content-center text-dark" style={pageStyle}>
      <div className="row w-100 max-w-5xl overflow-hidden" style={glassStyle}>
        {/* Left Column: Contact Form */}
        <div className="col-md-6 p-5 bg-white text-dark rounded-start">
          <h2 className="mb-4 text-center fw-bold">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="form-control" 
                placeholder="Your full name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                placeholder="Your email" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="website" className="form-label">Website</label>
              <input 
                type="url" 
                id="website" 
                className="form-control" 
                placeholder="Your Website" 
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">Contact Number</label>
              <input 
                type="tel" 
                id="contact" 
                className="form-control" 
                placeholder="Your phone number" 
                required 
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="form-label">Your Message</label>
              <textarea 
                id="message" 
                className="form-control" 
                rows="4" 
                placeholder="Write your message here..." 
                required 
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Get in Touch + Social Media */}
        <div className="col-md-6 d-flex flex-column justify-content-center text-white p-5 rounded-end"
          style={{ background: 'rgba(0, 0, 60, 0.5)' }}>
          <div className="my-auto">
            <h2 className="fw-bold mb-4">Get in Touch</h2>
            <p><strong>Name:</strong> Tejas Nikumbh</p>
            <p><strong>Email:</strong> tejas@example.com</p>
            <p><strong>Phone:</strong> +91 1234567891</p>
            <p><strong>Address:</strong> Jalgaon, Maharashtra, India</p>
            <hr className="my-4 border-light" />

            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <p className="mt-4">We'd love to hear from you. Drop us a message anytime!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
