-- bcrypt("password123") のハッシュ値を使用
INSERT INTO users (name, email, password, role) VALUES
('管理者', 'admin@example.com', '$2y$10$N9qo8uLOickgx2ZMRZo5i.UrKkO0tZf6EVzKZs5gHkWnh9mG7xY3K', 'admin'),
('田中 太郎', 'taro@example.com', '$2y$10$N9qo8uLOickgx2ZMRZo5i.UrKkO0tZf6EVzKZs5gHkWnh9mG7xY3K', 'user'),
('鈴木 花子', 'hanako@example.com', '$2y$10$N9qo8uLOickgx2ZMRZo5i.UrKkO0tZf6EVzKZs5gHkWnh9mG7xY3K', 'user');
