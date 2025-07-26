


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  emailVerified: boolean;
  referralCode: string;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  walletAddress?: string;
  paypalEmail?: string;
  payoutConnected: boolean;
  hasPin: boolean;
  is2faEnabled: boolean;
  role: 'user' | 'admin';
  status: 'active' | 'frozen';
  balance: number;
  withdrawalStatus?: 'active' | 'paused';
  kycData?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    idDocumentUrl: string;
  };
  kycRejectionReason?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  walletAccount: string | null;
  login: (email: string, pass: string) => Promise<{ twoFactorRequired: boolean } | void>;
  adminLogin: (email: string, pass: string) => Promise<void>;
  verifyTwoFactor: (token: string) => Promise<void>;
  isAwaiting2FA: boolean;
  isAdmin: boolean;
  loginWithWallet: () => Promise<void>;
  logout: () => void;
  signup: (details: any) => Promise<string>; // Returns a temporary token
  finalizeRegistrationAndLogin: (tempToken: string) => Promise<void>;
  connectWallet: () => Promise<void>;
  updateUser: (newUser: Partial<User>) => void;
}

export interface DashboardStats {
  totalEarnings: number;
  totalTeamSize: number;
  directReferrals: number;
}

export interface DownlineLevel {
  level: number;
  users: number;
  earnings: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Commission' | 'Withdrawal' | 'Bonus' | 'Fee' | 'Adjustment' | 'Reversal';
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  user?: {
    name: string;
    email: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  level: number;
  joinDate: string;
  totalEarningsFrom: number;
  children: TeamMember[];
}

// --- Admin Types ---

export interface AdminStats {
    totalUsers: number;
    totalUserReferralEarnings: number;
    pendingWithdrawalsCount: number;
    protocolBalance: number;
}

export interface KycRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    dateSubmitted: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    documentUrl: string;
}

export interface WithdrawalRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    date: string;
    method: 'Crypto' | 'Stripe' | 'PayPal';
    destination: string; // Wallet address or email
}