'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'EMPLOYEE',
  });

  const { login, register } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(registerData);
      setShowRegister(false);
      setError('Registration successful! Please login.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-10 via-steel-20 to-neutral-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-lavender-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-neutral-40) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Half - Hero Section */}
        <div className="hidden lg:flex flex-col relative">
          {/* Hero Content */}
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center max-w-lg animate-fade-in">
              {/* Logo Section */}
              <div className="mb-12">
                <div className="relative inline-block">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-140 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-100 rounded-full animate-ping"></div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-neutral-80 to-steel-160 bg-clip-text text-transparent mb-4">
                  Piramal ERP
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-100 to-blue-100 mx-auto rounded-full"></div>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl font-bold text-neutral-80 mb-6 leading-tight">
                Expense Management
                <span className="block text-2xl font-normal text-orange-100 mt-2">
                  Reimagined
                </span>
              </h2>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-80 shadow-lg">
                  ⚡ Fast Processing
                </span>
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-80 shadow-lg">
                  🔒 Secure
                </span>
                <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-neutral-80 shadow-lg">
                  📊 Analytics
                </span>
              </div>

              {/* Description */}
              <p className="text-xl text-neutral-60 leading-relaxed">
                Streamline your expense workflows with our intelligent platform. 
                <span className="block mt-2 text-orange-100 font-medium">
                  Built for modern teams.
                </span>
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="h-32 bg-white/90 backdrop-blur-sm border-t border-neutral-20/50 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-100">99.9%</div>
                <div className="text-sm text-neutral-60">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-100">24/7</div>
                <div className="text-sm text-neutral-60">Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-100">500+</div>
                <div className="text-sm text-neutral-60">Companies</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Half - Login Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {!showRegister ? (
              /* Login Form */
              <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-slide-up hover-lift">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-140 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-80 mb-2">Welcome Back</h2>
                  <p className="text-neutral-60">Sign in to your expense portal</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-100/10 border border-red-100/30 rounded-2xl backdrop-blur-sm message-slide-in">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-100 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="form-field">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-100 to-orange-140 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Sign In
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <button className="text-blue-100 text-sm font-medium hover:text-blue-140 transition-colors hover:underline">
                    Forgot your password?
                  </button>
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-neutral-20"></div>
                    <span className="px-4 text-sm text-neutral-60">or</span>
                    <div className="flex-1 border-t border-neutral-20"></div>
                  </div>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="w-full bg-gradient-to-r from-blue-100 to-blue-140 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            ) : (
              /* Register Form */
              <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-slide-up hover-lift">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-140 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-80 mb-2">Join Piramal ERP</h2>
                  <p className="text-neutral-60">Create your expense portal account</p>
                </div>

                {error && (
                  <div className={`mb-6 p-4 rounded-2xl backdrop-blur-sm message-slide-in ${
                    error.includes('successful') 
                      ? 'bg-green-100/10 border border-green-100/30' 
                      : 'bg-red-100/10 border border-red-100/30'
                  }`}>
                    <div className="flex items-center">
                      <svg className={`w-5 h-5 mr-3 ${error.includes('successful') ? 'text-green-100' : 'text-red-100'}`} fill="currentColor" viewBox="0 0 20 20">
                        {error.includes('successful') ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        )}
                      </svg>
                      <p className={`text-sm font-medium ${error.includes('successful') ? 'text-green-100' : 'text-red-100'}`}>{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-field">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                        required
                        className="form-input"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        className="form-input"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                      className="form-input"
                      placeholder="johndoe"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="form-input"
                      placeholder="Create a strong password"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Role</label>
                    <select
                      value={registerData.role}
                      onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                      className="form-input"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-100 to-blue-140 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Account
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <div className="flex items-center mb-4">
                    <div className="flex-1 border-t border-neutral-20"></div>
                    <span className="px-4 text-sm text-neutral-60">Already have an account?</span>
                    <div className="flex-1 border-t border-neutral-20"></div>
                  </div>
                  <button
                    onClick={() => setShowRegister(false)}
                    className="text-orange-100 font-medium hover:text-orange-140 transition-colors hover:underline"
                  >
                    Sign In Instead
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
