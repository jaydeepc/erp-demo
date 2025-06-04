'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { expenseAPI } from '@/utils/api';

interface Expense {
  _id: string;
  amount: number;
  currency: string;
  description: string;
  expenseDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    fullName: string;
    email: string;
  };
  comments?: string;
}

interface PendingExpense {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  amount: number;
  currency: string;
  description: string;
  expenseDate: string;
  status: 'PENDING';
  submittedAt: string;
  comments?: string;
}

// Manager Dashboard Component
const ManagerDashboard = () => {
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showModal, setShowModal] = useState<{
    type: 'approve' | 'reject';
    expense: PendingExpense;
  } | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseAPI.getPendingExpenses();
      setPendingExpenses(data);
    } catch (error) {
      console.error('Error fetching pending expenses:', error);
      setMessage({ type: 'error', text: 'Failed to load pending expenses' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId: string, comments: string) => {
    try {
      setProcessing(expenseId);
      await expenseAPI.approveExpense(expenseId, comments);
      setMessage({ type: 'success', text: 'Expense approved successfully!' });
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
      await fetchPendingExpenses();
      setShowModal(null);
      setComments('');
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to approve expense' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (expenseId: string, comments: string) => {
    try {
      setProcessing(expenseId);
      await expenseAPI.rejectExpense(expenseId, comments);
      setMessage({ type: 'success', text: 'Expense rejected successfully!' });
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
      await fetchPendingExpenses();
      setShowModal(null);
      setComments('');
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to reject expense' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <>
      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-white' 
            : 'bg-red-100 text-white'
        }`}>
          {message.text}
        </div>
      )}

      {/* Pending Claims Table */}
      <div className="bg-white rounded-lg border border-neutral-20 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-20">
          <h3 className="text-lg font-semibold text-neutral-80">Pending Expense Claims</h3>
          <p className="text-sm text-neutral-60 mt-1">
            Review and approve or reject expense claims from your team
          </p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-orange-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-60">Loading pending expenses...</p>
          </div>
        ) : pendingExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-neutral-80 mb-2">All caught up!</h4>
            <p className="text-neutral-60">No pending expense claims to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
                        <tbody className="bg-white divide-y divide-neutral-20">
                          {pendingExpenses.map((expense, index) => (
                            <tr key={expense._id} className={`table-row animate-slide-up ${index % 2 === 0 ? 'bg-white' : 'bg-steel-20'}`} style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-neutral-80">
                          {expense.user.fullName}
                        </div>
                        <div className="text-sm text-neutral-60">
                          {expense.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-80">
                      {formatDate(expense.expenseDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-80">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-80">
                      {formatCurrency(expense.amount, expense.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-60">
                      {formatDate(expense.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowModal({ type: 'approve', expense })}
                          disabled={processing === expense._id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-white hover:bg-green-140 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === expense._id ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => setShowModal({ type: 'reject', expense })}
                          disabled={processing === expense._id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-white hover:bg-red-140 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === expense._id ? (
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval/Rejection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
          <div className="bg-white rounded-lg border border-neutral-20 w-full max-w-md mx-4 transform transition-all modal-content hover-lift">
            <div className="px-6 py-4 border-b border-neutral-20">
              <h3 className="text-lg font-semibold text-neutral-80">
                {showModal.type === 'approve' ? 'Approve' : 'Reject'} Expense
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-neutral-60 mb-2">Employee:</p>
                <p className="font-medium text-neutral-80">{showModal.expense.user.fullName}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-neutral-60 mb-2">Expense:</p>
                <p className="font-medium text-neutral-80">
                  {formatCurrency(showModal.expense.amount, showModal.expense.currency)} - {showModal.expense.description}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-80 mb-2">
                  Comments {showModal.type === 'reject' ? '*' : '(Optional)'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-transparent"
                  placeholder={
                    showModal.type === 'approve' 
                      ? 'Add any comments about the approval...' 
                      : 'Please provide a reason for rejection...'
                  }
                  required={showModal.type === 'reject'}
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-neutral-20 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(null);
                  setComments('');
                }}
                className="px-4 py-2 text-sm font-medium text-neutral-60 hover:text-neutral-80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showModal.type === 'reject' && !comments.trim()) {
                    setMessage({ type: 'error', text: 'Comments are required for rejection' });
                    return;
                  }
                  
                  if (showModal.type === 'approve') {
                    handleApprove(showModal.expense._id, comments);
                  } else {
                    handleReject(showModal.expense._id, comments);
                  }
                }}
                disabled={processing === showModal.expense._id}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  showModal.type === 'approve'
                    ? 'bg-green-100 text-white hover:bg-green-140'
                    : 'bg-red-100 text-white hover:bg-red-140'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing === showModal.expense._id ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  showModal.type === 'approve' ? 'Approve' : 'Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'my-claims' | 'submit-expense'>('my-claims');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    expenseDate: ''
  });

  useEffect(() => {
    if (user?.role === 'EMPLOYEE') {
      fetchMyExpenses();
    }
  }, [user]);

  const fetchMyExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseAPI.getMyExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setMessage({ type: 'error', text: 'Failed to load expenses' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.expenseDate) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);
      
      await expenseAPI.submitExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      setMessage({ type: 'success', text: 'Expense submitted successfully!' });
      setFormData({ amount: '', currency: 'USD', description: '', expenseDate: '' });
      
      // Refresh the expenses list
      await fetchMyExpenses();
      
      // Switch to My Claims tab to see the new expense
      setActiveTab('my-claims');
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit expense' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-white`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-white`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-white`;
      default:
        return `${baseClasses} bg-neutral-40 text-white`;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-10 animate-fade-in">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-neutral-20 px-6 py-4 mobile-p-4">
        <div className="flex justify-between items-center mobile-stack">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover-lift">
              <span className="text-white font-semibold text-sm">ERP</span>
            </div>
            <h1 className="text-xl font-semibold text-neutral-80 mobile-hidden">Expense Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4 mobile-stack mobile-text-center">
            <div className="text-right mobile-text-center">
              <p className="text-sm font-medium text-neutral-80">{user.fullName}</p>
              <p className="text-xs text-neutral-60">{user.role}</p>
            </div>
            <div className="w-8 h-8 bg-steel-100 rounded-full flex items-center justify-center hover-lift">
              <span className="text-white text-sm">{user.fullName.charAt(0)}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-100 hover:text-blue-140 transition-colors hover-lift px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-80 mb-2">
              Welcome back, {user.fullName}!
            </h2>
            <p className="text-neutral-60">
              {user.role === 'EMPLOYEE' 
                ? 'Manage your expense claims and submit new expenses.'
                : 'Review and approve pending expense claims from your team.'
              }
            </p>
          </div>

          {/* Employee Dashboard */}
          {user.role === 'EMPLOYEE' && (
            <>
              {/* Navigation Tabs */}
              <div className="mb-6">
                <div className="border-b border-neutral-20">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('my-claims')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'my-claims'
                          ? 'border-orange-100 text-orange-100'
                          : 'border-transparent text-neutral-60 hover:text-neutral-80 hover:border-neutral-40'
                      }`}
                    >
                      My Claims
                    </button>
                    <button
                      onClick={() => setActiveTab('submit-expense')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'submit-expense'
                          ? 'border-orange-100 text-orange-100'
                          : 'border-transparent text-neutral-60 hover:text-neutral-80 hover:border-neutral-40'
                      }`}
                    >
                      Submit Expense
                    </button>
                  </nav>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-white' 
                    : 'bg-red-100 text-white'
                }`}>
                  {message.text}
                </div>
              )}

              {/* My Claims Tab */}
              {activeTab === 'my-claims' && (
                <div className="bg-white rounded-lg border border-neutral-20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-20">
                    <h3 className="text-lg font-semibold text-neutral-80">My Expense Claims</h3>
                  </div>
                  
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="w-8 h-8 border-4 border-orange-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-neutral-60">Loading expenses...</p>
                    </div>
                  ) : expenses.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-neutral-60 mb-4">No expense claims found.</p>
                      <button
                        onClick={() => setActiveTab('submit-expense')}
                        className="text-orange-100 hover:text-orange-140 font-medium"
                      >
                        Submit your first expense →
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-neutral-20">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                              Submitted
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-80 uppercase tracking-wider">
                              Comments
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-20">
                          {expenses.map((expense, index) => (
                            <tr key={expense._id} className={index % 2 === 0 ? 'bg-white' : 'bg-steel-20'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-80">
                                {formatDate(expense.expenseDate)}
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-80">
                                {expense.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-80">
                                {formatCurrency(expense.amount, expense.currency)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={getStatusBadge(expense.status)}>
                                  {expense.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-60">
                                {formatDate(expense.submittedAt)}
                              </td>
                              <td className="px-6 py-4 text-sm text-neutral-60">
                                {expense.comments || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Expense Tab */}
              {activeTab === 'submit-expense' && (
                <div className="bg-white rounded-lg border border-neutral-20 p-6">
                  <h3 className="text-lg font-semibold text-neutral-80 mb-6">Submit New Expense</h3>
                  
                  <form onSubmit={handleSubmitExpense} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-80 mb-2">
                          Amount *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-transparent"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-80 mb-2">
                          Currency *
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-transparent"
                          required
                        >
                          <option value="USD">USD</option>
                          <option value="INR">INR</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-80 mb-2">
                        Expense Date *
                      </label>
                      <input
                        type="date"
                        value={formData.expenseDate}
                        onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                        className="w-full px-3 py-2 border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-80 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-transparent"
                        placeholder="Describe your expense (e.g., Taxi fare - airport to office)"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          submitting
                            ? 'bg-neutral-40 text-neutral-60 cursor-not-allowed'
                            : 'bg-orange-100 text-white hover:bg-orange-140'
                        }`}
                      >
                        {submitting ? 'Submitting...' : 'Submit Expense'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Manager Dashboard */}
          {user.role === 'MANAGER' && (
            <ManagerDashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
