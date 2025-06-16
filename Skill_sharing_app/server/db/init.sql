-- Create hire_requests table
CREATE TABLE IF NOT EXISTS hire_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employer_id INT NOT NULL,
    employee_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id),
    FOREIGN KEY (employee_id) REFERENCES users(id)
); 