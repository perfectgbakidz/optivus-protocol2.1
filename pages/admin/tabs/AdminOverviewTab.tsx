


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../../components/ui/StatCard';
import { Spinner } from '../../../components/ui/Spinner';
import * as api from '../../../services/api';
import { AdminStats, User } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

const SettingsCard: React.FC<{title: string, children: React.ReactNode, footer?: React.ReactNode}> = ({title, children, footer}) => (
    <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg flex flex-col">
        <div className="p-6 flex-grow">
            <h2 className="text-xl font-semibold text-white border-b border-brand-ui-element/50 pb-3 mb-4">{title}</h2>
            {children}
        </div>
        {footer && <div className="bg-brand-dark/30 px-6 py-3 border-t border-brand-ui-element/20 rounded-b-lg">{footer}</div>}
    </div>
);


export const AdminOverviewTab: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [areWithdrawalsPaused, setAreWithdrawalsPaused] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                // In a real app, you might fetch user data and admin stats separately
                const statsData = await api.mockFetchAdminStats();
                setStats(statsData);
            } catch (err: any) {
                setError(err.message || 'Failed to load admin data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <Spinner />;
    if (error) return <div className="text-error text-center p-4">{error}</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

            {/* Screen 1: User-like View for Master Account */}
            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Master Account Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Referral Earnings" 
                        value={`£${(1250.75).toFixed(2)}`} // Mocked for demonstration
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                    />
                    <StatCard 
                        title="Balance" 
                        value={`£${user?.balance.toFixed(2)}`}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    />
                    <div className="bg-brand-dark p-6 rounded-lg flex flex-col items-center justify-center text-center">
                        <p className="font-semibold">Withdrawal Management</p>
                        <p className="text-sm text-brand-light-gray mt-2">Manage and withdraw the master account's balance.</p>
                        <button onClick={() => navigate('/admin/withdrawals')} className="mt-4 text-brand-secondary hover:underline">Go to Withdrawals &rarr;</button>
                    </div>
                </div>
            </div>
            
            {/* Screen 2: Admin-specific View */}
            <div>
                 <h2 className="text-2xl font-bold text-white mb-4">Platform Controls & Overview</h2>
                 <div className="space-y-6">
                    {/* Main Balance Displays */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-brand-panel backdrop-blur-lg border-2 border-brand-primary/50 p-6 rounded-xl shadow-2xl shadow-brand-primary/10 text-center flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-brand-light-gray">Total User Referral Earnings</h2>
                                <p className="text-5xl font-extrabold text-brand-white my-4">£{stats?.totalUserReferralEarnings.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-brand-ui-element mt-2">The cumulative amount of commissions and bonuses distributed to all users.</p>
                        </div>
                        <div className="bg-brand-panel backdrop-blur-lg border-2 border-success/50 p-6 rounded-xl shadow-2xl shadow-success/10 text-center flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-brand-light-gray">Remaining Protocol Balance</h2>
                                <p className="text-5xl font-extrabold text-success my-4">£{stats?.protocolBalance.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-brand-ui-element mt-2">This is the remaining balance from fees available for withdrawal by the protocol administrators.</p>
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         <StatCard 
                            title="Total Users" 
                            value={stats?.totalUsers || 0}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        />
                         <StatCard 
                            title="Pending Withdrawals" 
                            value={stats?.pendingWithdrawalsCount || 0}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                        <SettingsCard title="Master Account">
                             <p className="text-sm text-brand-light-gray">This is the premade account from which all referral chains stem.</p>
                             <div className="mt-3 font-mono text-xs space-y-1">
                                <p><span className="font-bold text-brand-light-gray">Username:</span> master</p>
                                <p><span className="font-bold text-brand-light-gray">Ref Code:</span> MASTERKEY</p>
                            </div>
                        </SettingsCard>
                        <SettingsCard title="Global Withdrawal Controls">
                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                     <p className="font-semibold text-brand-white">All User Withdrawals</p>
                                      <p className={`text-sm ${areWithdrawalsPaused ? 'text-warning' : 'text-success'}`}>
                                        {areWithdrawalsPaused ? 'Paused' : 'Active'}
                                      </p>
                                </div>
                                <button onClick={() => setAreWithdrawalsPaused(!areWithdrawalsPaused)} aria-label="Toggle all withdrawals">
                                    <div className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${areWithdrawalsPaused ? 'bg-warning' : 'bg-success'}`}>
                                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${areWithdrawalsPaused ? 'translate-x-0' : 'translate-x-6'}`}></div>
                                    </div>
                                </button>
                            </div>
                             <p className="text-xs text-brand-ui-element mt-3">This switch immediately pauses or unpauses withdrawals for all users on the platform.</p>
                        </SettingsCard>
                    </div>
                 </div>
            </div>
        </div>
    );
};
