-- Password is 'admin123' hashed with bcrypt
INSERT INTO Admin (username, password)
VALUES ('admin', '$2b$10$8nMJXg.YhQtQpBIrpOxFn.c0qTh0TBc9l9g5VLqYO7uFEMAyoqIpC')
ON DUPLICATE KEY UPDATE password = VALUES(password);
