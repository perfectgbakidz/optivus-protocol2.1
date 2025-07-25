
import React, { useState, useEffect } from 'react';
import { StatCard } from '../../../components/ui/StatCard';
import { Spinner } from '../../../components/ui/Spinner';
import * as api from '../../../services/api';
import { AdminStats } from '../../../types';

export const AdminOverviewTab: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const statsData = await api.mockFetchAdminStats();
                setStats(statsData);
            } catch (err: any) {
                setError(err.message || 'Failed to load admin stats.');
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
            <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
            
            {/* Main Balance Displays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-brand-panel backdrop-blur-lg border-2 border-brand-primary/50 p-6 rounded-xl shadow-2xl shadow-brand-primary/10 text-center flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-brand-light-gray">Total Paid to Users</h2>
                        <p className="text-5xl font-extrabold text-brand-white my-4">£{stats?.totalEarningsDistributed.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-brand-ui-element mt-2">This is the cumulative amount of commissions and bonuses distributed to all users.</p>
                </div>
                <div className="bg-brand-panel backdrop-blur-lg border-2 border-success/50 p-6 rounded-xl shadow-2xl shadow-success/10 text-center flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-brand-light-gray">Protocol's Available Balance</h2>
                        <p className="text-5xl font-extrabold text-success my-4">£{stats?.protocolFeesCollected.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-brand-ui-element mt-2">This is the remaining balance from fees available for withdrawal by the protocol administrators.</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>

             <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome, Administrator</h2>
                <p className="text-brand-light-gray">
                    This is the central control panel for the Optivus Protocol. From here, you can manage users, monitor financial activity, and process requests.
                    Use the navigation on the left to access different sections.
                </p>
                 <ul className="list-disc list-inside mt-4 space-y-2 text-brand-light-gray">
                    <li><span className="font-semibold text-white">User Management:</span> View, search, and manage all user accounts. You can adjust balances or freeze accounts if necessary.</li>
                    <li><span className="font-semibold text-white">KYC Management:</span> Review and process KYC (Know Your Customer) submissions from users to enable fiat withdrawals.</li>
                    <li><span className="font-semibold text-white">Withdrawals:</span> Review and process all pending withdrawal requests from users.</li>
                    <li><span className="font-semibold text-white">Transactions:</span> See a complete log of all financial transactions that have occurred on the platform.</li>
                </ul>
            </div>
        </div>
    );
};
