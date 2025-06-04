const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const authRoutes = require('../../routes/auth');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'password123',
        fullName: 'New User',
        email: 'newuser@example.com',
        role: 'EMPLOYEE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully.');

      // Verify user was created in database
      const user = await User.findOne({ username: userData.username });
      expect(user).toBeTruthy();
      expect(user.fullName).toBe(userData.fullName);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    test('should register user with default EMPLOYEE role', async () => {
      const userData = {
        username: 'defaultrole',
        password: 'password123',
        fullName: 'Default Role User',
        email: 'default@example.com'
        // role not specified
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully.');

      const user = await User.findOne({ username: userData.username });
      expect(user.role).toBe('EMPLOYEE');
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = {
        username: 'incomplete',
        password: 'password123'
        // missing fullName and email
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toContain('required');
    });

    test('should return 400 for invalid email format', async () => {
      const userData = {
        username: 'invalidemail',
        password: 'password123',
        fullName: 'Invalid Email User',
        email: 'invalid-email-format',
        role: 'EMPLOYEE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('email');
    });

    test('should return 400 for duplicate username', async () => {
      const userData = {
        username: 'duplicateuser',
        password: 'password123',
        fullName: 'First User',
        email: 'first@example.com',
        role: 'EMPLOYEE'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create second user with same username
      const duplicateData = {
        ...userData,
        fullName: 'Second User',
        email: 'second@example.com'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateData)
        .expect(400);

      expect(response.body.message).toContain('already exists');
    });

    test('should return 400 for duplicate email', async () => {
      const userData = {
        username: 'firstemail',
        password: 'password123',
        fullName: 'First Email User',
        email: 'duplicate@example.com',
        role: 'EMPLOYEE'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const duplicateData = {
        ...userData,
        username: 'secondemail',
        fullName: 'Second Email User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateData)
        .expect(400);

      expect(response.body.message).toContain('already exists');
    });

    test('should return 400 for invalid role', async () => {
      const userData = {
        username: 'invalidrole',
        password: 'password123',
        fullName: 'Invalid Role User',
        email: 'invalid@example.com',
        role: 'INVALID_ROLE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('role');
    });

    test('should accept valid roles', async () => {
      const validRoles = ['EMPLOYEE', 'MANAGER'];

      for (let i = 0; i < validRoles.length; i++) {
        const role = validRoles[i];
        const userData = {
          username: `user${role.toLowerCase()}`,
          password: 'password123',
          fullName: `${role} User`,
          email: `${role.toLowerCase()}@example.com`,
          role: role
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.message).toBe('User registered successfully.');

        const user = await User.findOne({ username: userData.username });
        expect(user.role).toBe(role);
      }
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;

    beforeEach(async () => {
      // Create a test user for login tests
      testUser = await User.create({
        username: 'loginuser',
        password: 'password123',
        fullName: 'Login Test User',
        email: 'login@example.com',
        role: 'EMPLOYEE'
      });
    });

    test('should login successfully with valid credentials', async () => {
      const loginData = {
        username: 'loginuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe(testUser.username);
      expect(response.body.user.fullName).toBe(testUser.fullName);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.role).toBe(testUser.role);
      expect(response.body.user.password).toBeUndefined(); // Should not include password
    });

    test('should return 400 for missing username', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain('Username and password are required');
    });

    test('should return 400 for missing password', async () => {
      const loginData = {
        username: 'loginuser'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain('Username and password are required');
    });

    test('should return 401 for invalid username', async () => {
      const loginData = {
        username: 'nonexistentuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return 401 for invalid password', async () => {
      const loginData = {
        username: 'loginuser',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return valid JWT token', async () => {
      const loginData = {
        username: 'loginuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      const token = response.body.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts separated by dots
    });

    test('should login manager successfully', async () => {
      // Create a manager user
      const manager = await User.create({
        username: 'manageruser',
        password: 'password123',
        fullName: 'Manager User',
        email: 'manager@example.com',
        role: 'MANAGER'
      });

      const loginData = {
        username: 'manageruser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.user.role).toBe('MANAGER');
      expect(response.body.token).toBeDefined();
    });

    test('should handle case-sensitive username', async () => {
      const loginData = {
        username: 'LOGINUSER', // Different case
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should not include sensitive user data in response', async () => {
      const loginData = {
        username: 'loginuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.user.password).toBeUndefined();
      expect(response.body.user.__v).toBeUndefined();
    });
  });

  describe('Authentication Error Handling', () => {
    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.message).toContain('required');
    });

    test('should handle very long input values', async () => {
      const longString = 'a'.repeat(1000);
      const userData = {
        username: longString,
        password: 'password123',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    test('should handle SQL injection attempts', async () => {
      const maliciousData = {
        username: "'; DROP TABLE users; --",
        password: 'password123',
        fullName: 'Malicious User',
        email: 'malicious@example.com',
        role: 'EMPLOYEE'
      };

      // Should either reject or sanitize the input
      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousData);

      // Should not crash the server
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('Rate Limiting and Security', () => {
    test('should handle multiple rapid login attempts', async () => {
      // Create test user
      await User.create({
        username: 'rapidtest',
        password: 'password123',
        fullName: 'Rapid Test User',
        email: 'rapid@example.com',
        role: 'EMPLOYEE'
      });

      const loginData = {
        username: 'rapidtest',
        password: 'wrongpassword'
      };

      // Make multiple rapid requests
      const promises = Array(5).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(promises);
      
      // All should return 401 for wrong password
      responses.forEach(response => {
        expect(response.status).toBe(401);
      });
    });

    test('should not leak user existence through timing', async () => {
      const nonExistentUser = {
        username: 'nonexistent',
        password: 'password123'
      };

      const existingUser = {
        username: 'loginuser', // This user exists from beforeEach
        password: 'wrongpassword'
      };

      const start1 = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send(nonExistentUser)
        .expect(401);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send(existingUser)
        .expect(401);
      const time2 = Date.now() - start2;

      // Response times should be similar (within reasonable bounds)
      // This is a basic timing attack prevention test
      const timeDifference = Math.abs(time1 - time2);
      expect(timeDifference).toBeLessThan(100); // 100ms tolerance
    });
  });
});
