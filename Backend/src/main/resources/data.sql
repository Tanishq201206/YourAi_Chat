-- roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name = name;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_USER') ON DUPLICATE KEY UPDATE name = name;

-- users
-- admin / Admin@123 (bcrypt)
-- E-MAIL= admin@example.com (YOU HAVE TO CHANEGE IT WITH AN REAL EMAIL FOR RECEVING THE OTP)
-- Admins have to be made manually in database and have to enabled with Flag = 1
INSERT INTO users (id, username, email, password, enabled)
VALUES (1, 'admin', 'admin@example.com', '$2b$12$9uRgBH6fZhWzDwdm3DOt8u1BHhhxK/QrqaAT5LTjWL8PZRxAosKgC', true)
ON DUPLICATE KEY UPDATE username = username;

-- demo user / User@123 (bcrypt)
-- E-MAIL= user@example.com (YOU HAVE TO CHANEGE IT WITH AN REAL EMAIL FOR RECEVING THE OTP)
-- for more user they have to register at runtime
INSERT INTO users (id, username, email, password, enabled)
VALUES (2, 'user', 'user@example.com', '$2b$12$3IYf2VqY1Sxg5mX0rB0fPe2Yv7JQ8nQZp3xV6X9b8mZGLnN5KQH1e', true)
ON DUPLICATE KEY UPDATE username = username;

-- user_roles
INSERT INTO user_roles (user_id, role_id) VALUES (1,1) ON DUPLICATE KEY UPDATE user_id=user_id;
INSERT INTO user_roles (user_id, role_id) VALUES (2,2) ON DUPLICATE KEY UPDATE user_id=user_id;
