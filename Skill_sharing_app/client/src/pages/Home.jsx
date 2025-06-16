import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';  // Import AOS CSS

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  // Initialize AOS and force scrolling behavior when component mounts
  useEffect(() => {
    // Initialize AOS with custom settings
    AOS.init({
      duration: 1000, // animation duration
      easing: 'ease-out', // easing function
      once: true, // whether animation should happen only once while scrolling
      mirror: false, // whether elements should animate out while scrolling past them
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
    });
    
    // Force scrolling behavior
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Override parent container styles that might prevent scrolling
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.overflow = 'auto';
      rootElement.style.height = 'auto';
    }
    
    // Find parent containers and adjust their overflow
    const mainLayout = document.querySelector('.main-layout');
    if (mainLayout) {
      mainLayout.style.overflow = 'auto';
      mainLayout.style.height = 'auto';
    }
    
    const mainPanel = document.querySelector('.main-panel');
    if (mainPanel) {
      mainPanel.style.overflow = 'auto';
      mainPanel.style.height = 'auto';
    }
    
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      
      if (rootElement) {
        rootElement.style.overflow = '';
        rootElement.style.height = '';
      }
      
      if (mainLayout) {
        mainLayout.style.overflow = '';
        mainLayout.style.height = '';
      }
      
      if (mainPanel) {
        mainPanel.style.overflow = '';
        mainPanel.style.height = '';
      }
    };
  }, []);

  return (
    <div className="scrollable-home-content" style={{ 
      height: 'auto !important', 
      minHeight: '100vh !important', 
      width: '100% !important', 
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
      position: 'relative !important',
      display: 'block !important'
    }}>
      <style>
        {`
          .scrollable-home-content {
            height: auto !important;
            overflow-y: auto !important;
          }
          
          html, body, #root, .main-layout, .main-panel, .page-content {
            overflow-y: auto !important;
            height: auto !important;
          }
        `}
      </style>
      
      {/* Header */}
      <header
        style={{
          background: '#1e1e2f',
          padding: '1.5rem 5%',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        data-aos="fade-down"
      >
        <h1 style={{ fontSize: '1.8rem' }}>SkillSharers</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/about-us')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            About Us
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat`,
          height: '70vh', // Reduced from 90vh to give more room
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
          padding: '0 5%',
        }}
        data-aos="zoom-in"
      >
        <div>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Learn New Skills from Industry Experts
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Join thousands of learners and mentors from across the globe.
          </p>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#ff7b54',
              border: 'none',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer',
            }}
            data-aos="fade-up"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '4rem 5%' }}>
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
          data-aos="fade-right"
        >
          <img
            src="https://images.unsplash.com/photo-1573496529574-be85d6a60704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
            alt="About Skill Sharing"
            style={{
              width: '45%',
              borderRadius: '10px',
            }}
            data-aos="flip-left"
          />
          <div style={{ flex: '1' }}>
            <h2
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: '2rem',
                color: '#1e1e2f',
              }}
              data-aos="fade-left"
            >
              About Our Website
            </h2>
            <p>
              SkillSharers is a modern platform that connects learners and
              professionals across the globe to share knowledge and grow together.
              We aim to make learning accessible, flexible, and personal. Whether
              you're looking to enhance your resume, learn a hobby, or switch
              careers—SkillSharers offers mentors, courses, and resources to help
              you succeed. Our platform promotes peer-to-peer collaboration, video
              sessions, and practical projects for real-world learning.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '4rem 5%' }} data-aos="fade-up">
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem',
            color: '#1e1e2f',
          }}
        >
          Popular Categories
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '2rem 1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
            data-aos="zoom-in"
          >
            Web Development
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '2rem 1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
            data-aos="zoom-in"
          >
            Data Science
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '2rem 1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
            data-aos="zoom-in"
          >
            Digital Marketing
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '2rem 1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
            data-aos="zoom-in"
          >
            UI/UX Design
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '2rem 1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
            data-aos="zoom-in"
          >
            Cybersecurity
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '2rem 1rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
            data-aos="zoom-in"
          >
            Public Speaking
          </div>
        </div>
      </section>

 <section style={{ padding: '4rem 5%' }}>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2rem',
          color: '#1e1e2f',
        }}
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        Top Mentors
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Mentor"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
            }}
          />
          <h3>Ananya Sharma</h3>
          <p>Frontend Developer</p>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <img
            src="https://randomuser.me/api/portraits/men/55.jpg"
            alt="Mentor"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
            }}
          />
          <h3>Ravi Kumar</h3>
          <p>Full Stack Engineer</p>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="Mentor"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
            }}
          />
          <h3>Meera Joshi</h3>
          <p>Data Scientist</p>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Mentor"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1rem',
            }}
          />
          <h3>Karan Singh</h3>
          <p>Cloud Architect</p>
        </div>
      </div>
    </section>

      {/* Testimonials Section */}
      <section
        style={{
          backgroundColor: '#f1f1f1',
          padding: '4rem 5%',
        }}
        data-aos="fade-up"
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem',
            color: '#1e1e2f',
          }}
        >
          What Our Users Say
        </h2>
        <div
          style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}
        >
          <p>"This platform helped me land a remote job by learning from real developers!"</p>
          <p>- Saniya Deshmukh</p>
        </div>
        <div
          style={{
            background: '#fff',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
          }}
        >
          <p>"Great mentors and amazing content. It's like Udemy but more personalized!"</p>
          <p>- Rohan Patel</p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#101020',
          color: '#ccc',
          textAlign: 'center',
          padding: '2rem 5%',
        }}
        data-aos="fade-up"
      >
        <p>© 2025 SkillSharers. All rights reserved.</p>
        <p>Developed with ❤️ by Team SkillSharers</p>
      </footer>
    </div>
  );
}

export default Home;
