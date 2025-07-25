

import { User, DashboardStats, DownlineLevel, Transaction, TeamMember, AdminStats, WithdrawalRequest, KycRequest } from '../types';
import { ethers } from 'ethers';

// --- INPUT VALIDATION UTILITIES ---
// This is a basic client-side check. True protection MUST be on the backend.
const sqlInjectionPattern = /(\'|\")|(\-\-)|(;)|(\b(OR|AND)\b.*=)|(\/\*)|(\*\/)/i;

/**
 * Checks for common SQL injection patterns.
 * @param input The string to check.
 * @returns True if the input seems suspicious, false otherwise.
 */
const hasPotentialSqlInjection = (input: string): boolean => {
  if (!input) return false;
  return sqlInjectionPattern.test(input);
};

/**
 * A generic input validator. Throws an error if validation fails.
 * @param value The value to validate.
 * @param fieldName The name of the field for error messages.
 */
export const validateInput = (value: string | number, fieldName: string = 'Input'): void => {
    if (typeof value === 'string' && hasPotentialSqlInjection(value)) {
        throw new Error(`${fieldName} contains invalid characters.`);
    }
};

/**
 * Validates an email address. Throws an error if validation fails.
 * @param email The email to validate.
 */
export const validateEmail = (email: string): void => {
    validateInput(email, 'Email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        throw new Error('Please enter a valid email address.');
    }
};

/**
 * Validates a username. Throws an error if validation fails.
 * @param username The username to validate.
 */
export const validateUsername = (username: string): void => {
    validateInput(username, 'Username');
    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernamePattern.test(username)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores.');
    }
};

/**
 * Validates a password. Throws an error if validation fails.
 * @param password The password to validate.
 */
export const validatePassword = (password: string): void => {
    validateInput(password, 'Password');
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
    }
};


// --- MOCK DATABASE ---
let mockUser: User = {
  id: 'user123',
  firstName: 'Alex',
  lastName: 'Doe',
  username: 'alexd',
  email: 'alex.doe@example.com',
  emailVerified: true,
  referralCode: 'ALEXD123',
  kycStatus: 'unverified',
  walletAddress: undefined, // Start with no wallet
  paypalEmail: undefined, // Start with no paypal email
  payoutConnected: false,
  hasPin: false,
  is2faEnabled: false,
  role: 'user',
  status: 'active',
  balance: 850.25
};

const mockAdmin: User = {
  id: 'admin001',
  firstName: 'Admin',
  lastName: 'User',
  username: 'admin',
  email: 'admin@optivus.com',
  emailVerified: true,
  referralCode: 'ADMIN',
  kycStatus: 'verified',
  walletAddress: undefined,
  paypalEmail: undefined,
  payoutConnected: true,
  hasPin: true,
  is2faEnabled: false,
  role: 'admin',
  status: 'active',
  balance: 0
};

let allMockUsers: User[] = [
    mockUser,
    { id: 'user002', firstName: 'Bob', lastName: 'Smith', username: 'bobsmith', email: 'bob.s@example.com', emailVerified: true, referralCode: 'BOB123', kycStatus: 'verified', payoutConnected: true, hasPin: true, is2faEnabled: true, role: 'user', status: 'active', balance: 1500.50 },
    { 
        id: 'user003', firstName: 'Charlie', lastName: 'Brown', username: 'charlieb', email: 'charlie.b@example.com', emailVerified: false, referralCode: 'CHARLIE456', 
        kycStatus: 'pending', 
        kycData: {
            address: '123 Snoopy St',
            city: 'Sparkyville',
            postalCode: '12345',
            country: 'United Kingdom',
            idDocumentUrl: '/mock-document/charlie-id.pdf'
        },
        payoutConnected: true, hasPin: false, is2faEnabled: false, role: 'user', status: 'active', balance: 250.00 
    },
    { 
        id: 'user004', firstName: 'Diana', lastName: 'Prince', username: 'dianap', email: 'diana.p@example.com', emailVerified: true, referralCode: 'DIANA789', 
        kycStatus: 'rejected',
        kycRejectionReason: 'The provided ID document was blurry and unreadable. Please upload a clearer image.',
        payoutConnected: false, hasPin: true, is2faEnabled: false, role: 'user', status: 'active', balance: 50.25 
    },
];

const mockStats: DashboardStats = {
  totalEarnings: 1250.75,
  totalTeamSize: 42,
  directReferrals: 7,
};

const mockDownline: DownlineLevel[] = [
  { level: 1, users: 7, earnings: 700 },
  { level: 2, users: 15, earnings: 450 },
  { level: 3, users: 20, earnings: 100.75 },
];

let mockTransactions: Transaction[] = Array.from({ length: 25 }, (_, i) => {
    const types: Transaction['type'][] = ['Commission', 'Withdrawal', 'Bonus', 'Fee'];
    const statuses: Transaction['status'][] = ['Completed', 'Pending', 'Failed'];
    const date = new Date();
    date.setDate(date.getDate() - i);
    const isWithdrawal = i % types.length === 1;
    return {
        id: `txn_${i}`,
        date: date.toISOString().split('T')[0],
        type: isWithdrawal ? 'Withdrawal' : types[i % types.length],
        description: isWithdrawal ? 'Withdrawal to account' : `From user_xyz${i}`,
        amount: isWithdrawal ? -200 - i : 50 + i * 2,
        status: isWithdrawal ? 'Completed' : statuses[i % statuses.length],
    }
});


const teamMembers: TeamMember[] = [
    {
        id: 'ref1', name: 'Bob Smith', username: 'bobsmith', level: 1, joinDate: '2023-02-20', totalEarningsFrom: 700,
        children: [
            { id: 'ref1-1', name: 'Charlie Brown', username: 'charlieb', level: 2, joinDate: '2023-03-10', totalEarningsFrom: 250, children: [] },
            { 
                id: 'ref1-2', name: 'Diana Prince', username: 'dianap', level: 2, joinDate: '2023-04-01', totalEarningsFrom: 200, 
                children: [
                    { id: 'ref1-2-1', name: 'Eve Adams', username: 'evea', level: 3, joinDate: '2023-05-05', totalEarningsFrom: 100.75, children: [] }
                ]
            },
        ]
    },
    { 
        id: 'ref2', name: 'Frank White', username: 'frankw', level: 1, joinDate: '2023-06-15', totalEarningsFrom: 0, 
        children: [] 
    },
    { id: 'ref3', name: 'Grace Hopper', username: 'graceh', level: 1, joinDate: '2023-07-01', totalEarningsFrom: 0, children: [] },
    { id: 'ref4', name: 'Heidi Lamar', username: 'heidil', level: 1, joinDate: '2023-07-05', totalEarningsFrom: 0, children: [] },
    { id: 'ref5', name: 'Ivan Drago', username: 'ivand', level: 1, joinDate: '2023-07-10', totalEarningsFrom: 0, children: [] },
    { id: 'ref6', name: 'Judy Garland', username: 'judyg', level: 1, joinDate: '2023-07-12', totalEarningsFrom: 0, children: [] },
    { id: 'ref7', name: 'Ken Adams', username: 'kena', level: 1, joinDate: '2023-07-20', totalEarningsFrom: 0, children: [] },
];


let recentlyRegisteredUser: any = null;
const existingUsernames = ['alexd', 'satoshi', 'vitalik', 'admin'];
const challengeNonces = new Map<string, string>();

let userAwaiting2FA: User | null = null;
let temp2FASecret: string | null = null;

let mockAllTransactions: Transaction[] = [
    { id: 'txn_101', date: '2023-10-26', type: 'Commission', description: 'From user_abc', amount: 50, status: 'Completed', user: { name: 'Alex Doe', email: 'alex.doe@example.com' } },
    { id: 'txn_102', date: '2023-10-26', type: 'Withdrawal', description: 'Withdrawal to account', amount: -350, status: 'Pending', user: { name: 'Bob Smith', email: 'bob.s@example.com' } },
    { id: 'txn_103', date: '2023-10-25', type: 'Bonus', description: 'Sign-up bonus', amount: 10, status: 'Completed', user: { name: 'Charlie Brown', email: 'charlie.b@example.com' } },
    ...mockTransactions.map(tx => ({ ...tx, user: { name: 'Alex Doe', email: 'alex.doe@example.com'} }))
];

let mockPendingWithdrawals: WithdrawalRequest[] = [
    { id: 'wd_123', userId: 'user002', userName: 'Bob Smith', userEmail: 'bob.s@example.com', amount: 350.00, date: '2023-10-26', method: 'Crypto', destination: '0x1234...abcd' },
];


// --- MOCK API FUNCTIONS ---
const simulateRequest = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

const simulateError = (message: string, delay = 500): Promise<never> => {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));
}

// Auth
export const mockLogin = (email: string, pass: string) => {
  const foundUser = allMockUsers.find(u => u.email === email && u.role === 'user');
  
  if (foundUser && pass === 'password123') { // generic password for all mock users
    mockUser = foundUser; // Set the logged in user
    userAwaiting2FA = mockUser;
    if (mockUser.is2faEnabled) {
      return simulateRequest({ success: true, data: { twoFactorRequired: true } });
    }
    return simulateRequest({ success: true, data: { user: mockUser } });
  }
  return simulateError('Invalid credentials');
};

export const mockAdminLogin = (email: string, pass: string) => {
    if (email === 'admin@optivus.com' && pass === 'adminpassword') {
        mockUser = mockAdmin;
        return simulateRequest({ success: true, data: { user: mockAdmin } });
    }
    return simulateError('Invalid admin credentials.');
}

export const mockLogin2FA = (token: string) => {
    if (token === '123456' && userAwaiting2FA) {
        const user = userAwaiting2FA;
        userAwaiting2FA = null; // Clear temp user
        return simulateRequest({ success: true, data: { user } });
    }
    return simulateError('Invalid 2FA token.');
}

export const mockWalletChallenge = (address: string) => {
    const nonce = `nonce-${Math.random().toString(36).substring(2, 15)}`;
    const lowerCaseAddress = address.toLowerCase();
    challengeNonces.set(lowerCaseAddress, nonce);
    const message = `Please sign this message to log in to Optivus Protocol. Nonce: ${nonce}`;
    console.log(`Generated challenge for ${lowerCaseAddress}: ${message}`);
    return simulateRequest({ success: true, message });
};

export const mockWalletVerify = (address: string, signature: string) => {
    const lowerCaseAddress = address.toLowerCase();
    const nonce = challengeNonces.get(lowerCaseAddress);

    if (!nonce) {
        return simulateError('No challenge found for this address. Please try again.');
    }
    
    const message = `Please sign this message to log in to Optivus Protocol. Nonce: ${nonce}`;

    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        
        if (recoveredAddress.toLowerCase() === lowerCaseAddress) {
            challengeNonces.delete(lowerCaseAddress); // Invalidate nonce after use
            const userForThisWallet: User = { ...mockUser, walletAddress: address, firstName: 'Wallet', lastName: 'User' };
            return simulateRequest(userForThisWallet);
        } else {
            return simulateError('Signature verification failed.');
        }
    } catch(e) {
        console.error("Verification error:", e);
        return simulateError('Invalid signature format.');
    }
};

export const mockRegister = (details: any) => {
    recentlyRegisteredUser = details;
    return simulateRequest({ success: true, message: 'Details submitted.', data: { token: 'temp_jwt_for_payment' } });
}

export const mockFinalizePayment = (tempToken: string) => {
    if (tempToken === 'temp_jwt_for_payment' && recentlyRegisteredUser) {
        const newUser: User = {
            id: `user_${Date.now()}`,
            firstName: recentlyRegisteredUser.firstName,
            lastName: recentlyRegisteredUser.lastName,
            username: recentlyRegisteredUser.username,
            email: recentlyRegisteredUser.email,
            emailVerified: false,
            referralCode: `${recentlyRegisteredUser.username.toUpperCase()}NEW`,
            kycStatus: 'unverified',
            walletAddress: undefined,
            paypalEmail: undefined,
            payoutConnected: false,
            hasPin: false,
            is2faEnabled: false,
            role: 'user',
            status: 'active',
            balance: 0,
        };
        allMockUsers.push(newUser);
        recentlyRegisteredUser = null; // Clear temp data
        return simulateRequest(newUser);
    }
    return simulateError('Invalid payment token or session expired.');
};


export const mockForgotPassword = (email: string) => simulateRequest({ success: true, message: 'If an account exists, a reset link has been sent.' });
export const mockResetPassword = (token: string, pass: string) => {
    if(token === 'valid_token') return simulateRequest({ success: true, message: 'Password reset successfully.' });
    return simulateError('Token is invalid or has expired.');
}

export const mockSubmitContactForm = (data: any) => {
    console.log("Contact form submitted:", data);
    return simulateRequest({ success: true, message: 'Your message has been received. We will get back to you within 24 hours.' });
};

export const mockCheckUsername = (username: string) => {
    if (existingUsernames.includes(username.toLowerCase())) {
        return simulateRequest({ available: false });
    }
    return simulateRequest({ available: true });
}

// Dashboard
export const mockFetchDashboardStats = () => simulateRequest(mockStats);
export const mockFetchDownline = () => simulateRequest(mockDownline);
export const mockFetchBalance = () => simulateRequest({ availableBalance: mockUser.balance });
export const mockWithdraw = (data: { type: string, amount: number, pin: string, twoFactorToken?: string, network?: string, address?: string }) => {
    console.log("Withdrawal request received:", data);
    if (data.pin !== '123456') { // Assuming PIN is 123456 for now
        return simulateError('Invalid PIN.');
    }
    if (mockUser.is2faEnabled && data.twoFactorToken !== '123456') {
        return simulateError('Invalid 2FA token.');
    }
    if (data.type === 'Crypto' && (!data.network || !data.address)) {
        return simulateError('Network and address are required for crypto withdrawals.');
    }
    if (data.amount > mockUser.balance) {
        return simulateError('Withdrawal amount exceeds available balance.');
    }

    // Deduct balance immediately
    mockUser.balance -= data.amount;

    // Add to user's personal transaction history
    const newTx: Transaction = {
        id: `txn_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Withdrawal',
        description: `Pending withdrawal to ${data.type === 'Crypto' ? data.address : 'Fiat Account'}`,
        amount: -data.amount,
        status: 'Pending',
    };
    mockTransactions.unshift(newTx);
    
    // Add to global admin transaction history
    mockAllTransactions.unshift({ ...newTx, user: { name: `${mockUser.firstName} ${mockUser.lastName}`, email: mockUser.email }});

    // Add to admin pending withdrawals queue
    mockPendingWithdrawals.unshift({
      id: `wd_${Date.now()}`,
      userId: mockUser.id,
      userName: `${mockUser.firstName} ${mockUser.lastName}`,
      userEmail: mockUser.email,
      amount: data.amount,
      date: new Date().toISOString().split('T')[0],
      method: data.type === 'Crypto' ? 'Crypto' : 'Stripe', // default to Stripe for Fiat
      destination: data.address || 'Stripe Connect Account'
    });
    
    // Also update the total pending count for admin stats
    mockAdminStats.pendingWithdrawalsCount = mockPendingWithdrawals.length;

    return simulateRequest({ success: true, message: 'Withdrawal initiated successfully. Your balance has been updated.'});
};
export const mockFetchTransactions = (page: number, limit = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = mockTransactions.slice(start, end);
    return simulateRequest({
        transactions: paginatedItems,
        totalPages: Math.ceil(mockTransactions.length / limit),
        currentPage: page
    })
}
export const mockFetchTeamTree = (): Promise<TeamMember[]> => simulateRequest(teamMembers, 1000);

// KYC
let mockPendingKycRequests: KycRequest[] = [
    {
        id: 'user003',
        userId: 'user003',
        userName: 'Charlie Brown',
        userEmail: 'charlie.b@example.com',
        dateSubmitted: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
        address: '123 Snoopy St',
        city: 'Sparkyville',
        postalCode: '12345',
        country: 'United Kingdom',
        documentUrl: '/mock-document/charlie-id.pdf'
    }
];

export const mockFetchKycStatus = () => simulateRequest({ status: mockUser.kycStatus, payoutConnected: mockUser.payoutConnected });
export const mockConnectPayout = () => {
    mockUser.payoutConnected = true;
    return simulateRequest({ success: true, data: { onboardingUrl: 'https://connect.stripe.com/express/onboarding' } });
};

export const mockSubmitKyc = (data: any) => {
    mockUser.kycStatus = 'pending';
    mockUser.kycRejectionReason = undefined;
    const kycData = {
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        idDocumentUrl: `/mock-document/${mockUser.id}-${Date.now()}.pdf`
    };
    mockUser.kycData = kycData;
    
    // Remove existing request if user re-submits
    mockPendingKycRequests = mockPendingKycRequests.filter(r => r.userId !== mockUser.id);
    
    mockPendingKycRequests.unshift({
        id: mockUser.id,
        userId: mockUser.id,
        userName: `${mockUser.firstName} ${mockUser.lastName}`,
        userEmail: mockUser.email,
        dateSubmitted: new Date().toISOString().split('T')[0],
        address: kycData.address,
        city: kycData.city,
        postalCode: kycData.postalCode,
        country: kycData.country,
        documentUrl: kycData.idDocumentUrl,
    });

    return simulateRequest({ success: true, message: 'KYC documents submitted for review.' });
};


// Settings
export const mockFetchUser = () => simulateRequest(mockUser);
export const mockUpdateProfile = (data: Partial<User>) => {
    Object.assign(mockUser, data);
    return simulateRequest(mockUser);
};
export const mockUpdatePassword = () => simulateRequest({ success: true, message: 'Password updated successfully. Please log in again.' });
export const mockSendPinToken = () => simulateRequest({ success: true, message: 'A verification code has been sent to your email.' });
export const mockSetPin = (code: string) => {
    if(code === '123456'){
        mockUser.hasPin = true;
        return simulateRequest({ success: true, message: 'PIN has been set successfully.' });
    }
    return simulateError('Invalid verification code.');
};
export const mockVerifyEmail = () => simulateRequest({ success: true, message: 'Verification email sent.'});

// 2FA Endpoints
export const mockEnable2FA = () => {
    temp2FASecret = 'JBSWY3DPEHPK3PXP';
    const qrCodeUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwaDI1NnYyNTZIMHoiLz48cGF0aCBkPSJNNCA0aDI0OHYyNDhINHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzIgMzJoNjR2NjRIMzJ6bTEyOCAw Sixty-fourdjY0aC02NHptLTIyIDEwMiAxMCAyIDIgMTAtMiA0LTYtNC0xMi04LTEwLTEyLTYtMTQgMi04IDgtMTJ2MThoNnYtOGw0IDQgMi0ydi02bC0xMi0yem0xNi0xMDYgMTIgMiA4IDQgMiAxMCA0IDYtNCAxMi0yIDgtMiA4IDQgNi0yIDgtMTAtMi0yLTYtNC00LTQtMTAtMi0xMi0yem0xMCAxMCA0IDIgMiA0LTIgNC00IDQtMi0yem00NiAxMDItNiA0LTEwIDgtMTYgOC02IDItNi0yLTQtNmgtMnYtNmgybC0yLTJoMmwtMi0yaDJ2LTRoMmwtMi0yaDJ2LTJoMmwtMi0yaDJ2LTJoMmwtMi0yaDJvLTJoNGwtNi00em0yLTIgMi0yem0tMTYtMTQgMi0yem0xMiAxNiAyLTJ6bS00IDQgMi0yem0tOCAxOC0yIDJ2MmgtMnYyaC0ydi0yaC0ydi0yaC0yaC0ybC0yLTJoLTR2MmgtMnYtNmgydi0yaDJ2LTJoMmwtMi0yaDR2LTJoMnYtMmg0djJoMi4wM2wtLjAzLjA1em0yMC45Ny0uMDV2MmgtMnYyaC0ydjJoLTJsMiAyaC0ydjJoLTJsMiAyaC0ybC0yIDJoLTRsLTIgMmgtdjRoMnYyaDR2MmgtMnYyaC0ydjJoLTJsLTIgMmg0djJoMmwtMiA0aDRsLTIgMmg0djJoMnYyaDJ2MmgtMnYyaC0ybC0yLTJoMnYtMmgydi0yaDJ2LTJoMnYtMmg0di0yaDJ2LTJoMnYtMmgydjJoMnYtMmgybC0yLTJoLTRsLTIgMi0yLTQtMi0yem0tMjYgMTYgMi0yem0tNCA0IDItMnptLTYgMiAyLTJ6bS00IDYgMi0yem0tMiA0IDItMnptLTYtMiAyLTJ6bS00IDQgMi0yem0yIDYgMi0yem00IDQgMi0yem02IDIgMi0yem00LTQgMi0yem04LTYgMi0yem00LTQgMi0yem0tMy45Ny0xOS45NWgydjJoLTJ6bS0yIDJoMnYyaC0yem0tMiAyaDJ2MmgtMnptLTQgMmgydjJoLTJ6bS0yIDJoMnYyaC0yem0tMi0yLTQtMnYtNGgtMnYtNGgtMnYtMmgtMnYtMmgtMnYtMmgtMnYtNGgtMnYtMmgtMnYtMmgtMnYtNmgtMnYtMmgtMnYtNGgtMnYtMmgtMnYtMmgtMnYtNGgtNnY2aDR2NGgydjJoMnY0aDJ2MmgydjJoMnYyaDJ2MmgydjRoMnY0aDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ2MmgydjJoMnYyaDJ->';
    return simulateRequest({ success: true, data: { qrCodeUrl, secret: temp2FASecret } });
};

export const mockVerify2FA = (token: string) => {
    if (token === '123456') { // In a real app, you would verify against the stored secret
        mockUser.is2faEnabled = true;
        return simulateRequest({ success: true, message: '2FA enabled successfully.' });
    }
    return simulateError('Invalid 2FA token.');
};

export const mockDisable2FA = (token: string) => {
    // In a real app, this should probably verify the token against the user's 2FA secret
    if (token === '123456') {
        mockUser.is2faEnabled = false;
        return simulateRequest({ success: true, message: '2FA disabled successfully.' });
    }
    return simulateError('Invalid 2FA token.');
};


// --- ADMIN API ---
let mockAdminStats: AdminStats = {
    totalUsers: allMockUsers.length,
    totalEarningsDistributed: 5280.45,
    pendingWithdrawalsCount: mockPendingWithdrawals.length,
    protocolFeesCollected: 1250.60
};

export const mockFetchAdminStats = () => simulateRequest<AdminStats>(mockAdminStats, 700);
export const mockFetchAllUsers = () => simulateRequest<User[]>(allMockUsers, 1000);

export const mockAdminUpdateUser = (userId: string, data: Partial<User>) => {
    const userIndex = allMockUsers.findIndex(u => u.id === userId);
    if(userIndex > -1) {
        const userToUpdate = allMockUsers[userIndex];
        // Create a new transaction for balance adjustments
        if (data.balance !== undefined && data.balance !== userToUpdate.balance) {
            const oldBalance = userToUpdate.balance;
            const newBalance = data.balance;
            mockAllTransactions.unshift({
                id: `txn_adj_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                type: 'Adjustment',
                description: `Admin adjustment from £${oldBalance.toFixed(2)} to £${newBalance.toFixed(2)}`,
                amount: newBalance - oldBalance,
                status: 'Completed',
                user: { name: `${userToUpdate.firstName} ${userToUpdate.lastName}`, email: userToUpdate.email }
            });
        }
        Object.assign(userToUpdate, data);
        return simulateRequest({ success: true, user: userToUpdate });
    }
    return simulateError('User not found.');
};

export const mockFetchAllTransactions = (page: number, limit = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = mockAllTransactions.slice(start, end);
     return simulateRequest({
        transactions: paginatedItems,
        totalPages: Math.ceil(mockAllTransactions.length / limit),
        currentPage: page
    })
};

export const mockFetchPendingWithdrawals = () => simulateRequest<WithdrawalRequest[]>(mockPendingWithdrawals, 800);

export const mockProcessWithdrawal = (withdrawalId: string, action: 'approve' | 'deny') => {
    const reqIndex = mockPendingWithdrawals.findIndex(w => w.id === withdrawalId);
    if(reqIndex === -1) {
        return simulateError('Withdrawal request not found.');
    }
    
    const request = mockPendingWithdrawals[reqIndex];
    const userIndex = allMockUsers.findIndex(u => u.id === request.userId);

    if (userIndex === -1) {
        mockPendingWithdrawals.splice(reqIndex, 1); // Remove orphan request
        return simulateError('Associated user not found. Request removed.');
    }
    
    const userToUpdate = allMockUsers[userIndex];
    const isCurrentUser = mockUser.id === userToUpdate.id;

    const findAndUpdatetransaction = (status: Transaction['status'], description: string) => {
        // Update global log
        const allTxIndex = mockAllTransactions.findIndex(t => t.type === 'Withdrawal' && t.status === 'Pending' && t.user?.email === request.userEmail && Math.abs(t.amount) === request.amount);
        if (allTxIndex > -1) {
            mockAllTransactions[allTxIndex].status = status;
            mockAllTransactions[allTxIndex].description = description;
        }
        // Update current user's log if applicable
        if (isCurrentUser) {
            const userTxIndex = mockTransactions.findIndex(t => t.type === 'Withdrawal' && t.status === 'Pending' && Math.abs(t.amount) === request.amount);
            if(userTxIndex > -1) {
                mockTransactions[userTxIndex].status = status;
                mockTransactions[userTxIndex].description = description;
            }
        }
    }

    if (action === 'approve') {
        findAndUpdatetransaction('Completed', `Withdrawal to ${request.destination}`);
    } else if (action === 'deny') {
        // Refund balance
        userToUpdate.balance += request.amount;
        if (isCurrentUser) {
            mockUser.balance += request.amount;
        }

        // Mark original as failed
        findAndUpdatetransaction('Failed', `Withdrawal denied by admin.`);
        
        // Add a reversal transaction to global log
        const reversalTx: Transaction = {
            id: `rev_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Reversal',
            description: `Refund for denied withdrawal`,
            amount: request.amount,
            status: 'Completed',
            user: { name: request.userName, email: request.userEmail }
        };
        mockAllTransactions.unshift(reversalTx);
        
        // Add reversal to current user log if applicable
        if (isCurrentUser) {
            const { user, ...userTx } = reversalTx;
            mockTransactions.unshift(userTx);
        }
    }

    mockPendingWithdrawals.splice(reqIndex, 1);
    mockAdminStats.pendingWithdrawalsCount = mockPendingWithdrawals.length;
    return simulateRequest({ success: true, message: `Withdrawal has been ${action}d.`});
};


export const mockFetchPendingKycRequests = () => simulateRequest<KycRequest[]>(mockPendingKycRequests, 800);

export const mockProcessKyc = (userId: string, action: 'approve' | 'reject', reason?: string) => {
    const requestIndex = mockPendingKycRequests.findIndex(r => r.userId === userId);
    const userIndex = allMockUsers.findIndex(u => u.id === userId);

    if (requestIndex > -1 && userIndex > -1) {
        if (action === 'approve') {
            allMockUsers[userIndex].kycStatus = 'verified';
            allMockUsers[userIndex].kycRejectionReason = undefined;
        } else {
            allMockUsers[userIndex].kycStatus = 'rejected';
            allMockUsers[userIndex].kycRejectionReason = reason || 'Your submission was rejected. Please review your documents and try again.';
        }
        allMockUsers[userIndex].kycData = undefined; // Clear submitted data after processing
        mockPendingKycRequests.splice(requestIndex, 1);
        
        // also update mockUser if we are processing the logged in user for testing purposes
        if (mockUser.id === userId) {
            mockUser.kycStatus = allMockUsers[userIndex].kycStatus;
            mockUser.kycRejectionReason = allMockUsers[userIndex].kycRejectionReason;
            mockUser.kycData = undefined;
        }

        return simulateRequest({ success: true, message: `KYC request has been ${action}d.`});
    }
    return simulateError('KYC request or user not found.');
};