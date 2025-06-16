import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileCard.css'; // assuming you create a CSS file for this
import { FaTwitter, FaInstagram } from 'react-icons/fa'; // install if not already

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/profile/${profile.id}`);
  };

  // Parse skills if it's a JSON string
  const skills = typeof profile.skills === 'string' 
    ? JSON.parse(profile.skills) 
    : profile.skills || [];

  return (
    <div className="profile-card" onClick={handleNavigate}>
      <div className="profile-img-container">
        <img
          src={profile.image}
          alt={`${profile.name}'s avatar`}
          className="profile-img"
          style={{ 
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '50%',
            display: 'block',
            margin: '0 auto'
          }}
        />
      </div>
      <h3 className="profile-name">{profile.name}</h3>
      <p className="profile-bio">{profile.bio}</p>

      <div className="profile-skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    
     <div className="profile-socials">
       {profile.twitter && (
         <a
           href={profile.twitter}
           target="_blank"
           rel="noopener noreferrer"
           className="social-icon"
         >
           <FaTwitter />
         </a>
       )}
       {profile.instagram && (
         <a
           href={profile.instagram}
           target="_blank"
           rel="noopener noreferrer"
           className="social-icon"
         >
           <FaInstagram />
         </a>
       )}
     </div>

      <div 
        className="profile-rating" 
        style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}
      >
        {'★'.repeat(Math.floor(profile.rating || 4))}
        {'☆'.repeat(5 - Math.floor(profile.rating || 4))}
      </div>
    </div>
  );
};

export default ProfileCard;
