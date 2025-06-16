// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,       // e.g., 'localhost'
  user: process.env.DB_USER,       // e.g., 'root'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,   // e.g., 'your_database_name'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database as ID', db.threadId);
});

module.exports = db;
