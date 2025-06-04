const User = require('../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model Tests', () => {
  describe('User Creation', () => {
    test('should create a valid user with all required fields', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.fullName).toBe(userData.fullName);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    test('should hash password before saving', async () => {
      const userData = {
        username: 'testuser2',
        password: 'plainpassword',
        fullName: 'Test User 2',
        email: 'test2@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password.length).toBeGreaterThan(50); // bcrypt hash length
      
      // Verify password can be compared
      const isMatch = await bcrypt.compare(userData.password, savedUser.password);
      expect(isMatch).toBe(true);
    });

    test('should set default role to EMPLOYEE', async () => {
      const userData = {
        username: 'testuser3',
        password: 'password123',
        fullName: 'Test User 3',
        email: 'test3@example.com'
        // role not specified
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.role).toBe('EMPLOYEE');
    });
  });

  describe('User Validation', () => {
    test('should require username', async () => {
      const userData = {
        password: 'password123',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should require password', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should require fullName', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should require email', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should validate email format', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        email: 'invalid-email',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should enforce unique username', async () => {
      const userData1 = {
        username: 'duplicateuser',
        password: 'password123',
        fullName: 'Test User 1',
        email: 'test1@example.com',
        role: 'EMPLOYEE'
      };

      const userData2 = {
        username: 'duplicateuser', // Same username
        password: 'password456',
        fullName: 'Test User 2',
        email: 'test2@example.com',
        role: 'MANAGER'
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    test('should enforce unique email', async () => {
      const userData1 = {
        username: 'user1',
        password: 'password123',
        fullName: 'Test User 1',
        email: 'duplicate@example.com',
        role: 'EMPLOYEE'
      };

      const userData2 = {
        username: 'user2',
        password: 'password456',
        fullName: 'Test User 2',
        email: 'duplicate@example.com', // Same email
        role: 'MANAGER'
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    test('should only allow valid roles', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'INVALID_ROLE'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow();
    });

    test('should allow EMPLOYEE role', async () => {
      const userData = {
        username: 'employee',
        password: 'password123',
        fullName: 'Employee User',
        email: 'employee@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.role).toBe('EMPLOYEE');
    });

    test('should allow MANAGER role', async () => {
      const userData = {
        username: 'manager',
        password: 'password123',
        fullName: 'Manager User',
        email: 'manager@example.com',
        role: 'MANAGER'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser.role).toBe('MANAGER');
    });
  });

  describe('User Methods', () => {
    test('should not return password in JSON', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      const user = new User(userData);
      const savedUser = await user.save();
      const userJSON = savedUser.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.username).toBe(userData.username);
      expect(userJSON.fullName).toBe(userData.fullName);
      expect(userJSON.email).toBe(userData.email);
      expect(userJSON.role).toBe(userData.role);
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create test users
      const users = [
        {
          username: 'employee1',
          password: 'password123',
          fullName: 'Employee One',
          email: 'emp1@example.com',
          role: 'EMPLOYEE'
        },
        {
          username: 'employee2',
          password: 'password123',
          fullName: 'Employee Two',
          email: 'emp2@example.com',
          role: 'EMPLOYEE'
        },
        {
          username: 'manager1',
          password: 'password123',
          fullName: 'Manager One',
          email: 'mgr1@example.com',
          role: 'MANAGER'
        }
      ];

      await User.insertMany(users);
    });

    test('should find user by username', async () => {
      const user = await User.findOne({ username: 'employee1' });
      
      expect(user).toBeTruthy();
      expect(user.username).toBe('employee1');
      expect(user.fullName).toBe('Employee One');
    });

    test('should find user by email', async () => {
      const user = await User.findOne({ email: 'mgr1@example.com' });
      
      expect(user).toBeTruthy();
      expect(user.username).toBe('manager1');
      expect(user.role).toBe('MANAGER');
    });

    test('should find users by role', async () => {
      const employees = await User.find({ role: 'EMPLOYEE' });
      const managers = await User.find({ role: 'MANAGER' });
      
      expect(employees).toHaveLength(2);
      expect(managers).toHaveLength(1);
      
      employees.forEach(emp => {
        expect(emp.role).toBe('EMPLOYEE');
      });
    });

    test('should count users correctly', async () => {
      const totalUsers = await User.countDocuments();
      const employeeCount = await User.countDocuments({ role: 'EMPLOYEE' });
      const managerCount = await User.countDocuments({ role: 'MANAGER' });
      
      expect(totalUsers).toBe(3);
      expect(employeeCount).toBe(2);
      expect(managerCount).toBe(1);
    });
  });
});
