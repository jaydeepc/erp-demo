# Test Users for ERP Expense Portal

## Quick Test Setup

### Employee User
- **Username**: `alice`
- **Password**: `password123`
- **Full Name**: `Alice Employee`
- **Email**: `alice@company.com`
- **Role**: `EMPLOYEE`

### Manager User
- **Username**: `manager`
- **Password**: `password123`
- **Full Name**: `John Manager`
- **Email**: `manager@company.com`
- **Role**: `MANAGER`

## Testing Workflow

### 1. Register Users
1. Go to http://localhost:3000
2. Click "Create account"
3. Register the Employee user first
4. Register the Manager user second

### 2. Test Employee Flow
1. Login as Alice (Employee)
2. Submit a few test expenses:
   - **Expense 1**: $50.00 USD, "Taxi fare - airport to office", yesterday's date
   - **Expense 2**: ₹1500 INR, "Client lunch meeting", today's date
   - **Expense 3**: €75.00 EUR, "Hotel accommodation", 2 days ago
3. Check "My Claims" tab to see submitted expenses

### 3. Test Manager Flow
1. Logout and login as Manager
2. View pending claims in the manager dashboard
3. Test approval workflow:
   - Click "Approve" on one expense
   - Add comment: "Approved - valid business expense"
   - Confirm approval
4. Test rejection workflow:
   - Click "Reject" on another expense
   - Add comment: "Missing receipt - please resubmit with documentation"
   - Confirm rejection

### 4. Verify End-to-End
1. Login back as Employee
2. Check "My Claims" to see updated statuses and manager comments
3. Submit another expense to test the full cycle

## Expected Results

✅ **Registration**: Both users created successfully
✅ **Employee Dashboard**: Clean interface with tabs, expense submission works
✅ **Manager Dashboard**: Pending claims table with approve/reject buttons
✅ **Approval Flow**: Smooth modal experience, comments saved, status updated
✅ **Rejection Flow**: Required comments validation, status updated
✅ **Real-time Updates**: Changes reflect immediately across user sessions
✅ **UI Polish**: Animations, hover effects, responsive design
✅ **Error Handling**: Proper validation and error messages

## Features to Test

### UI/UX Features
- [ ] Floating label animations on login/register
- [ ] Hover effects on buttons and table rows
- [ ] Loading states during API calls
- [ ] Success message auto-dismiss (3 seconds)
- [ ] Modal animations (slide in/out)
- [ ] Responsive design on mobile
- [ ] Table row stagger animations
- [ ] Status badge colors and styling

### Functional Features
- [ ] User registration and login
- [ ] JWT token authentication
- [ ] Role-based access control
- [ ] Expense submission with validation
- [ ] Currency support (USD, INR, EUR, GBP)
- [ ] Date formatting and validation
- [ ] Manager approval/rejection workflow
- [ ] Comment system (optional for approval, required for rejection)
- [ ] Real-time status updates
- [ ] Proper error handling

### Technical Features
- [ ] No CORS errors
- [ ] API routes working correctly
- [ ] Database persistence
- [ ] Session management
- [ ] Form validation
- [ ] Loading states
- [ ] Error boundaries

## Browser Testing
Test on:
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

## Performance Checks
- [ ] Fast page loads
- [ ] Smooth animations
- [ ] No console errors
- [ ] Responsive interactions
- [ ] Efficient API calls
