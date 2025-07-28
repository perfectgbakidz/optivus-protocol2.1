



import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { User, AuthContextType } from '../types';
import * as api from '../services/api';

export const AuthContext = createContext<AuthContextType | null>(null);

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletAccount, setWalletAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isAwaiting2FA, setIsAwaiting2FA] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      // This is where you might check for a session token in localStorage
      // For now, we just initialize as not logged in.
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setIsAwaiting2FA(false);
    try {
      const result = await api.mockLogin(email, pass);
      if ('twoFactorRequired' in result.data && result.data.twoFactorRequired) {
        setIsAwaiting2FA(true);
        return { twoFactorRequired: true };
      }
      if ('user' in result.data) {
        const userData = result.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(false);
        if (userData.walletAddress) {
            setWalletAccount(userData.walletAddress);
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const adminLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
        const result = await api.mockAdminLogin(email, pass);
        const userData = result.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(true);
    } catch(error) {
        console.error(error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  }

  const verifyTwoFactor = async (token: string) => {
      setIsLoading(true);
      try {
          const result = await api.mockLogin2FA(token);
          const userData = result.data.user;
          setUser(userData);
          setIsAuthenticated(true);
          setIsAwaiting2FA(false);
          if (userData.walletAddress) {
              setWalletAccount(userData.walletAddress);
          }
      } catch (error) {
          console.error(error);
          throw error;
      } finally {
          setIsLoading(false);
      }
  }
  
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            setIsLoading(true);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const connectedAddress = accounts[0];
            
            const ethersProvider = new ethers.BrowserProvider(window.ethereum);
            
            setWalletAccount(connectedAddress);
            setProvider(ethersProvider);
            
            // Immediately update the user profile with the new wallet address
            if (user) {
                const updatedUser = await api.mockUpdateProfile({ walletAddress: connectedAddress });
                updateUser(updatedUser);
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            throw new Error("User rejected the request or an error occurred.");
        } finally {
            setIsLoading(false);
        }
    } else {
        throw new Error('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const loginWithWallet = async () => {
    setIsLoading(true);
    try {
        let account = walletAccount;
        let ethersProvider = provider;

        if (!account || !ethersProvider) {
            if (typeof window.ethereum !== 'undefined') {
                 const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                 account = accounts[0];
                 ethersProvider = new ethers.BrowserProvider(window.ethereum);
                 setWalletAccount(account);
                 setProvider(ethersProvider);
            } else {
                 throw new Error('MetaMask is not installed.');
            }
        }
        
        const challenge = await api.mockWalletChallenge(account!);

        const signer = await ethersProvider!.getSigner();
        const signature = await signer.signMessage(challenge.message);

        const userData = await api.mockWalletVerify(account!, signature);
        setUser(userData);
        setIsAuthenticated(true);
        if (userData.walletAddress) {
            setWalletAccount(userData.walletAddress);
        }

    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unknown error occurred during wallet login.');
    } finally {
        setIsLoading(false);
    }
  };

  const signup = async (details: any): Promise<string> => {
      setIsLoading(true);
      try {
        const result = await api.mockRegister(details);
        if (result.success && result.data?.token) {
            return result.data.token;
        }
        throw new Error(result.message || 'Registration failed to produce a token.');
      } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unknown error occurred during signup.');
      } finally {
          setIsLoading(false);
      }
  };
  
  const finalizeRegistrationAndLogin = async (tempToken: string) => {
    setIsLoading(true);
    try {
      const userData = await api.mockFinalizePayment(tempToken);
      setUser(userData);
      setIsAuthenticated(true);
      // Wallet is no longer connected at this stage, so this is removed.
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setWalletAccount(null);
    setProvider(null);
    setIsAwaiting2FA(false);
    setIsAdmin(false);
  };
  
  const updateUser = (newUser: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        return { ...prevUser, ...newUser };
      }
      return prevUser;
    });
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    walletAccount,
    isAdmin,
    login,
    adminLogin,
    verifyTwoFactor,
    isAwaiting2FA,
    loginWithWallet,
    logout,
    signup,
    finalizeRegistrationAndLogin,
    connectWallet,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
