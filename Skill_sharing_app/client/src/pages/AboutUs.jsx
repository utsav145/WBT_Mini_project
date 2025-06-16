import React, { useEffect } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

import '../styles/AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Force scrolling behavior
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Override parent container styles that might prevent scrolling
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.overflow = 'auto';
      rootElement.style.height = 'auto';
    }
    
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      
      if (rootElement) {
        rootElement.style.overflow = '';
        rootElement.style.height = '';
      }
    };
  }, []);

  const teamMembers = [
    {
      name: "Tejas Nikumbh",
      role: "Frontend Developer",
      img: "/images/tejas.jpg",
      desc: "Tejas is responsible for creating the user interface and ensuring a smooth user experience.",
      github: "https://github.com/Tejasnikumbh18",
      linkedin: "https://linkedin.com/in/tejasnikumbh"
    },
    {
      name: "Utsav Gavli",
      role: "Backend Developer",
      img: "/images/utsav.jpg",
      desc: "Utsav handles server-side logic and database integration, ensuring performance and security.",
      github: "https://github.com/utsav145",
      linkedin: "https://linkedin.com/in/utsavgavli"
    },
    {
      name: "Yash Gourshettiwar",
      role: "Product Manager",
      img: "/images/Yash.jpg",
      desc: "Yash ensures that product vision aligns with user needs and oversees timely project delivery.",
      github: "https://github.com/YashGours",
      linkedin: "https://linkedin.com/in/yashgourshettiwar"
    },
  ];

  return (
    <div className="about-us-container">
      {/* Custom Navbar */}
      <nav className="about-navbar">
        <span className="logo">SkillShare</span>
        <button className="home-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At SkillShare, we believe in the power of knowledge sharing and community learning.
            Our platform connects skilled professionals with eager learners, creating a vibrant
            ecosystem where expertise is shared and valued.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Skill Sharing</h3>
              <p>Share your expertise and learn from others in a collaborative environment.</p>
            </div>
            <div className="feature-card">
              <h3>Community</h3>
              <p>Join a vibrant community of learners and educators passionate about growth.</p>
            </div>
            <div className="feature-card">
              <h3>Flexibility</h3>
              <p>Learn and teach at your own pace, on your own schedule.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                className="team-member"
                key={index}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <img src={member.img} alt={member.name} className="team-img" />
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-desc">{member.desc}</p>
                <div className="social-links">
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                  >
                    <FaGithub />
                  </a>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                  >
                    <FaLinkedin />
                  </a>
                  <a 
                    href={`https://twitter.com/${member.name.toLowerCase().replace(' ', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                  >
                    <FaTwitter />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <ul className="values-list">
            <li>Empowering through education</li>
            <li>Building strong communities</li>
            <li>Fostering continuous learning</li>
            <li>Promoting skill development</li>
            <li>Creating meaningful connections</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
