



import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { User } from '../../../types';

const WithdrawalForm: React.FC<{ 
    balance: number; 
    hasPin: boolean; 
    is2faEnabled: boolean;
}> = ({ balance, hasPin, is2faEnabled }) => {
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [twoFactorToken, setTwoFactorToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if(!hasPin) {
            setError('Please set up a withdrawal PIN in Settings first.');
            return;
        }

        const withdrawalAmount = parseFloat(amount);
        if (withdrawalAmount > balance) {
            setError('Withdrawal amount cannot exceed your available balance.');
            return;
        }

        setIsLoading(true);
        try {
            const withdrawalData: any = { 
                type: 'Fiat', 
                amount: withdrawalAmount, 
                pin,
            };

            if (is2faEnabled) {
                withdrawalData.twoFactorToken = twoFactorToken;
            }

            const result = await api.mockWithdraw(withdrawalData);
            setMessage(result.message);
            setAmount('');
            setPin('');
            setTwoFactorToken('');
        } catch (err: any)
 {
            setError(err.message || 'Withdrawal failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Withdraw via Stripe</h3>
            {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
            {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
            
            <div className="text-sm text-brand-light-gray flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Payouts will be sent to your connected Stripe Account.</span>
            </div>

            <Input label="Amount (£)" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            <Input label="Withdrawal PIN" type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter your PIN" required maxLength={6} />
            {is2faEnabled && (
                <Input label="2FA Code" type="text" value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)} placeholder="123456" required maxLength={6} />
            )}
            <Button type="submit" className="w-full" isLoading={isLoading}>Withdraw</Button>
        </form>
    );
};

export const WithdrawTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for Stripe connection
    const [isConnectingStripe, setIsConnectingStripe] = useState(false);
    const [stripeError, setStripeError] = useState('');

    const fetchBalance = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.mockFetchBalance();
            setBalance(data.availableBalance);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);
    
    const handleConnectStripe = async () => {
        setIsConnectingStripe(true);
        setStripeError('');
        try {
            const res = await api.mockConnectPayout();
            // In a real app, you would redirect to this URL. Here we simulate success.
            console.log('Redirecting to Stripe Onboarding:', res.data.onboardingUrl);
            updateUser({ payoutConnected: true });
        } catch (err: any) {
            setStripeError(err.message || "Failed to initiate Stripe connection.");
        } finally {
            setIsConnectingStripe(false);
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Withdraw Funds</h1>
            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg text-center">
                <p className="text-sm text-brand-light-gray">Withdrawable Balance</p>
                <p className="text-4xl font-bold text-brand-secondary">£{balance?.toFixed(2) ?? '0.00'}</p>
            </div>
            
            <div className="max-w-md mx-auto">
                <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg">
                    {user?.kycStatus === 'verified' ? (
                        <>
                           {user.payoutConnected ? (
                                <WithdrawalForm 
                                   balance={balance ?? 0}
                                   hasPin={user.hasPin}
                                   is2faEnabled={user.is2faEnabled}
                                />
                           ) : (
                               <div className="flex flex-col items-center justify-center h-full text-center">
                                   <h3 className="text-xl font-semibold text-white">Stripe Account Required</h3>
                                   <p className="text-brand-light-gray mt-2 mb-4">Connect your Stripe account to enable withdrawals.</p>
                                   {stripeError && <p className="text-sm text-error mb-4">{stripeError}</p>}
                                   <Button onClick={handleConnectStripe} isLoading={isConnectingStripe} variant="secondary">Connect Stripe Account</Button>
                               </div>
                           )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <h3 className="text-xl font-semibold text-white">Withdrawals Locked</h3>
                            <p className="text-brand-light-gray mt-2">Please complete KYC verification to enable withdrawals to your Stripe account.</p>
                            <Button onClick={() => window.location.hash = '/dashboard/kyc'} variant="outline" className="mt-4">Go to KYC</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
