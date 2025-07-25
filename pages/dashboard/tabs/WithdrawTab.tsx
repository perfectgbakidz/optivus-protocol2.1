

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { User } from '../../../types';

const WithdrawalForm: React.FC<{ 
    method: 'Crypto' | 'Stripe' | 'PayPal'; 
    balance: number; 
    payoutDestination?: string; 
    hasPin: boolean; 
    is2faEnabled: boolean;
    kycStatus: User['kycStatus'] | undefined;
}> = ({ method, balance, payoutDestination, hasPin, is2faEnabled, kycStatus }) => {
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [twoFactorToken, setTwoFactorToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State for crypto withdrawals
    const [network, setNetwork] = useState('Ethereum');
    const [address, setAddress] = useState('');

    const typeForApi = method === 'Crypto' ? 'Crypto' : 'Fiat';
    const isKycVerified = kycStatus === 'verified';
    const cryptoWithdrawalLimit = 200;

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

        if (method === 'Crypto' && !isKycVerified && withdrawalAmount > cryptoWithdrawalLimit) {
            setError(`For non-verified accounts, crypto withdrawals are limited to £${cryptoWithdrawalLimit.toFixed(2)}. Please complete KYC for unlimited withdrawals.`);
            return;
        }

        setIsLoading(true);
        try {
            const withdrawalData: any = { 
                type: typeForApi, 
                amount: withdrawalAmount, 
                pin,
            };

            if (is2faEnabled) {
                withdrawalData.twoFactorToken = twoFactorToken;
            }

            if (method === 'Crypto') {
                withdrawalData.network = network;
                withdrawalData.address = address;
            }

            const result = await api.mockWithdraw(withdrawalData);
            setMessage(result.message);
            setAmount('');
            setPin('');
            setTwoFactorToken('');
            if (method === 'Crypto') {
                setAddress('');
            }
        } catch (err: any)
 {
            setError(err.message || 'Withdrawal failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const cryptoNetworkOptions = ['Ethereum', 'Solana', 'USDT (ERC-20)'];

    const addressPlaceholder = {
        'Ethereum': 'Enter your ETH address (0x...)',
        'Solana': 'Enter your SOL address',
        'USDT (ERC-20)': 'Enter your ERC-20 address (0x...)'
    }[network] || 'Enter wallet address';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Withdraw via {method}</h3>
            {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
            {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
            
            {method === 'Crypto' && !isKycVerified && (
                <div className="text-center text-sm text-warning p-3 bg-warning/10 border border-warning/30 rounded-lg">
                    Crypto withdrawals are limited to <strong>£{cryptoWithdrawalLimit.toFixed(2)}</strong> until your KYC is approved.
                </div>
            )}

            {method === 'Crypto' && (
                 <>
                    <div>
                        <label className="block text-sm font-medium text-brand-light-gray mb-2">Network</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {cryptoNetworkOptions.map(net => (
                                <Button
                                    key={net}
                                    type="button"
                                    onClick={() => setNetwork(net)}
                                    variant={network === net ? 'primary' : 'secondary'}
                                    size="sm"
                                    className="!rounded-lg"
                                >
                                    {net}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Input 
                        label="Wallet Address" 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder={addressPlaceholder} 
                        required 
                    />
                </>
            )}
            
            {payoutDestination && method !== 'Crypto' && (
                <div className="text-sm text-brand-light-gray break-all">
                    Will be sent to: <span className="font-mono text-brand-secondary">{payoutDestination}</span>
                </div>
            )}
            
            {method === 'Stripe' && (
                 <div className="text-sm text-brand-light-gray flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Connected Stripe Account</span>
                </div>
            )}

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
    const [selectedFiatMethod, setSelectedFiatMethod] = useState<'stripe' | 'paypal' | null>(null);
    
    // State for PayPal email form
    const [paypalEmailInput, setPaypalEmailInput] = useState('');
    const [isSavingPaypal, setIsSavingPaypal] = useState(false);
    const [paypalError, setPaypalError] = useState('');
    
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

    const handleSavePaypalEmail = async () => {
        if (!paypalEmailInput.includes('@')) {
            setPaypalError('Please enter a valid email address.');
            return;
        }
        setIsSavingPaypal(true);
        setPaypalError('');
        try {
            const updatedUser = await api.mockUpdateProfile({ paypalEmail: paypalEmailInput });
            updateUser(updatedUser);
        } catch (err: any) {
            setPaypalError(err.message || 'Failed to save PayPal email.');
        } finally {
            setIsSavingPaypal(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Crypto Withdrawal Card */}
                <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg">
                    <WithdrawalForm 
                        method="Crypto" 
                        balance={balance ?? 0} 
                        hasPin={user?.hasPin ?? false}
                        is2faEnabled={user?.is2faEnabled ?? false}
                        kycStatus={user?.kycStatus}
                    />
                </div>
                {/* Fiat Withdrawal Card */}
                <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg">
                    {user?.kycStatus === 'verified' ? (
                        <div>
                           {!selectedFiatMethod && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                     <h3 className="text-xl font-semibold text-white">Fiat Withdrawals</h3>
                                     <p className="text-brand-light-gray mt-2 mb-4">Choose your preferred withdrawal method.</p>
                                     <Button onClick={() => setSelectedFiatMethod('stripe')} variant="secondary" className="w-full max-w-xs">Withdraw with Stripe</Button>
                                     <Button onClick={() => setSelectedFiatMethod('paypal')} variant="secondary" className="w-full max-w-xs">Withdraw with PayPal</Button>
                                </div>
                           )}
                           
                           {selectedFiatMethod === 'stripe' && (
                               <div className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        {user.payoutConnected ? (
                                             <WithdrawalForm 
                                                method="Stripe" 
                                                balance={balance ?? 0}
                                                hasPin={user.hasPin}
                                                is2faEnabled={user.is2faEnabled}
                                                kycStatus={user.kycStatus}
                                             />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <h3 className="text-xl font-semibold text-white">Stripe Account Required</h3>
                                                <p className="text-brand-light-gray mt-2 mb-4">Connect your Stripe account to enable these withdrawals.</p>
                                                {stripeError && <p className="text-sm text-error mb-4">{stripeError}</p>}
                                                <Button onClick={handleConnectStripe} isLoading={isConnectingStripe} variant="secondary">Connect Stripe Account</Button>
                                            </div>
                                        )}
                                    </div>
                                    <Button onClick={() => setSelectedFiatMethod(null)} variant="outline" size="sm" className="mt-4 self-start">
                                        &larr; Back to methods
                                    </Button>
                               </div>
                           )}

                           {selectedFiatMethod === 'paypal' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        {user.paypalEmail ? (
                                            <WithdrawalForm 
                                                method="PayPal"
                                                balance={balance ?? 0}
                                                payoutDestination={user.paypalEmail}
                                                hasPin={user.hasPin}
                                                is2faEnabled={user.is2faEnabled}
                                                kycStatus={user.kycStatus}
                                            />
                                        ) : (
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-semibold text-white">Set up PayPal Withdrawals</h3>
                                                <p className="text-brand-light-gray">Enter your PayPal email address to enable withdrawals.</p>
                                                {paypalError && <p className="text-sm text-error">{paypalError}</p>}
                                                <Input label="PayPal Email" type="email" value={paypalEmailInput} onChange={e => setPaypalEmailInput(e.target.value)} required />
                                                <Button onClick={handleSavePaypalEmail} isLoading={isSavingPaypal}>Save PayPal Email</Button>
                                            </div>
                                        )}
                                    </div>
                                     <Button onClick={() => setSelectedFiatMethod(null)} variant="outline" size="sm" className="mt-4 self-start">
                                        &larr; Back to methods
                                    </Button>
                                </div>
                           )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <h3 className="text-xl font-semibold text-white">Fiat Withdrawals Locked</h3>
                            <p className="text-brand-light-gray mt-2">Please complete KYC verification to enable withdrawals to a bank account or PayPal.</p>
                            <Button onClick={() => window.location.hash = '/dashboard/kyc'} variant="outline" className="mt-4">Go to KYC</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};