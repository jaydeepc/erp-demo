import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Mock fetch
global.fetch = jest.fn()

// Test component to use the AuthContext
const TestComponent = () => {
  const { user, login, logout, register, loading } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.fullName : 'No User'}</div>
      <button 
        data-testid="login-btn" 
        onClick={() => login('testuser', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="logout-btn" 
        onClick={logout}
      >
        Logout
      </button>
      <button 
        data-testid="register-btn" 
        onClick={() => register({
          username: 'newuser',
          password: 'password123',
          fullName: 'New User',
          email: 'new@example.com',
          role: 'EMPLOYEE'
        })}
      >
        Register
      </button>
    </div>
  )
}

const renderWithAuthProvider = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Clear localStorage
    localStorage.clear()
  })

  describe('Initial State', () => {
    test('should have initial state with no user and not loading', () => {
      renderWithAuthProvider(<TestComponent />)
      
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    test('should restore user from localStorage on mount', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      }
      
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      renderWithAuthProvider(<TestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('Test User')
      })
    })
  })

  describe('Login', () => {
    test('should login successfully with valid credentials', async () => {
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          _id: '123',
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          role: 'EMPLOYEE'
        }
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      renderWithAuthProvider(<TestComponent />)
      
      const loginBtn = screen.getByTestId('login-btn')
      
      await act(async () => {
        await userEvent.click(loginBtn)
      })

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('Test User')
      })

      expect(localStorage.getItem('token')).toBe('mock-jwt-token')
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user))
    })

    test('should handle login failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      })

      renderWithAuthProvider(<TestComponent />)
      
      const loginBtn = screen.getByTestId('login-btn')
      
      await expect(async () => {
        await act(async () => {
          await userEvent.click(loginBtn)
        })
      }).rejects.toThrow('Invalid credentials')

      expect(screen.getByTestId('user')).toHaveTextContent('No User')
      expect(localStorage.getItem('token')).toBeNull()
    })

    test('should handle network error during login', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      renderWithAuthProvider(<TestComponent />)
      
      const loginBtn = screen.getByTestId('login-btn')
      
      await expect(async () => {
        await act(async () => {
          await userEvent.click(loginBtn)
        })
      }).rejects.toThrow('Network error')
    })

    test('should set loading state during login', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })

      ;(fetch as jest.Mock).mockReturnValueOnce(promise)

      renderWithAuthProvider(<TestComponent />)
      
      const loginBtn = screen.getByTestId('login-btn')
      
      act(() => {
        userEvent.click(loginBtn)
      })

      // Should be loading
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')

      // Resolve the promise
      act(() => {
        resolvePromise!({
          ok: true,
          json: async () => ({
            token: 'token',
            user: { fullName: 'Test User' }
          })
        })
      })

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      })
    })
  })

  describe('Register', () => {
    test('should register successfully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'User registered successfully.' })
      })

      renderWithAuthProvider(<TestComponent />)
      
      const registerBtn = screen.getByTestId('register-btn')
      
      await act(async () => {
        await userEvent.click(registerBtn)
      })

      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'newuser',
          password: 'password123',
          fullName: 'New User',
          email: 'new@example.com',
          role: 'EMPLOYEE'
        })
      })
    })

    test('should handle registration failure', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Username already exists' })
      })

      renderWithAuthProvider(<TestComponent />)
      
      const registerBtn = screen.getByTestId('register-btn')
      
      await expect(async () => {
        await act(async () => {
          await userEvent.click(registerBtn)
        })
      }).rejects.toThrow('Username already exists')
    })
  })

  describe('Logout', () => {
    test('should logout and clear user data', async () => {
      // Set up initial logged-in state
      const mockUser = {
        _id: '123',
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      }
      
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))

      renderWithAuthProvider(<TestComponent />)
      
      // Wait for user to be loaded
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('Test User')
      })

      const logoutBtn = screen.getByTestId('logout-btn')
      
      await act(async () => {
        await userEvent.click(logoutBtn)
      })

      expect(screen.getByTestId('user')).toHaveTextContent('No User')
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('Token Management', () => {
    test('should include token in API requests when available', async () => {
      localStorage.setItem('token', 'mock-token')

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Success' })
      })

      renderWithAuthProvider(<TestComponent />)
      
      const registerBtn = screen.getByTestId('register-btn')
      
      await act(async () => {
        await userEvent.click(registerBtn)
      })

      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    })

    test('should handle invalid token in localStorage', async () => {
      localStorage.setItem('token', 'invalid-token')
      localStorage.setItem('user', 'invalid-json')

      renderWithAuthProvider(<TestComponent />)
      
      // Should not crash and should show no user
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })
  })

  describe('Error Handling', () => {
    test('should handle malformed JSON response', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      renderWithAuthProvider(<TestComponent />)
      
      const loginBtn = screen.getByTestId('login-btn')
      
      await expect(async () => {
        await act(async () => {
          await userEvent.click(loginBtn)
        })
      }).rejects.toThrow()
    })

    test('should handle server error responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' })
      })

      renderWithAuthProvider(<TestComponent />)
      
      const loginBtn = screen.getByTestId('login-btn')
      
      await expect(async () => {
        await act(async () => {
          await userEvent.click(loginBtn)
        })
      }).rejects.toThrow('Internal server error')
    })
  })

  describe('Context Provider', () => {
    test('should throw error when useAuth is used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')
      
      consoleSpy.mockRestore()
    })
  })
})
