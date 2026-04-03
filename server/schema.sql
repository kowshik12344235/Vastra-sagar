CREATE TABLE IF NOT EXISTS sales (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  costPrice DECIMAL(10, 2) NOT NULL,
  sellingPrice DECIMAL(10, 2) NOT NULL,
  profit DECIMAL(10, 2) NOT NULL,
  date DATETIME NOT NULL,
  customerName VARCHAR(255),
  paymentMode VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert default admin user
-- NOTE: In a real app, passwords should be hashed.
INSERT IGNORE INTO users (username, password) VALUES ('admin', 'admin');
