# SkillSharers - Skill Sharing Platform

## Overview
SkillSharers is a modern web application that connects learners and professionals across the globe to share knowledge and grow together. The platform facilitates peer-to-peer learning, mentorship, and skill development through an intuitive and user-friendly interface.

## Features
- **User Authentication**: Secure login and registration system
- **Profile Management**: Customizable user profiles with skills, experience, and pricing information
- **Skill Sharing**: Platform for sharing expertise and learning from others
- **Community Building**: Connect with like-minded professionals and learners
- **Flexible Learning**: Learn and teach at your own pace
- **Rating System**: User ratings and reviews for quality assurance
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Responsive Design**: Modern UI that works across all devices

## Tech Stack
### Frontend
- React.js
- React Router for navigation
- Context API for state management
- CSS3 with modern styling
- React Icons
- React Toastify for notifications
- AOS (Animate On Scroll) for animations

### Backend
- Node.js
- Express.js
- MySQL Database
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=skill_sharing_db
JWT_SECRET=your_jwt_secret
```

4. Initialize the database
```bash
cd server
npm run start
```

5. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Project Structure
```
skill_sharing_app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── styles/        # CSS styles
│   └── public/            # Static files
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    └── middleware/       # Custom middleware
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the ISC License.

## Contact
Utsav Gavli - [utsavgavli463@gmail]
Project Link: [https://github.com/utsav145/WBT_Mini_project](https://github.com/utsav145/WBT_Mini_project)
