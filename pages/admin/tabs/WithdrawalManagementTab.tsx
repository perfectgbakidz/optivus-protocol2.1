
import React, { useState, useEffect } from 'react';
import * as api from '../../../services/api';
import { WithdrawalRequest } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';

export const WithdrawalManagementTab: React.FC = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.mockFetchPendingWithdrawals();
            setRequests(data);
        } catch (err: any) {
            setError(err.message || "Failed to load withdrawal requests.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleProcessRequest = async (id: string, action: 'approve' | 'deny') => {
        setProcessingId(id);
        try {
            await api.mockProcessWithdrawal(id, action);
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err: any) {
            setError(err.message || `Failed to ${action} request.`);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Withdrawal Management</h1>

            {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md mb-4">{error}</div>}

            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {requests.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-brand-dark/50">
                                <tr>
                                    <th className="p-4 font-semibold text-brand-white">Date</th>
                                    <th className="p-4 font-semibold text-brand-white">User</th>
                                    <th className="p-4 font-semibold text-brand-white hidden md:table-cell">Method</th>
                                    <th className="p-4 font-semibold text-right text-brand-white">Amount</th>
                                    <th className="p-4 font-semibold text-center text-brand-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} className="border-b border-brand-ui-element/20 last:border-0 hover:bg-brand-ui-element/10">
                                        <td className="p-4 whitespace-nowrap">{req.date}</td>
                                        <td className="p-4">
                                            <div>{req.userName}</div>
                                            <div className="text-xs text-brand-light-gray">{req.userEmail}</div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="font-semibold">{req.method}</div>
                                            <div className="text-xs text-brand-light-gray truncate max-w-xs">{req.destination}</div>
                                        </td>
                                        <td className="p-4 font-mono text-right text-error">£{req.amount.toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="bg-success/80 hover:bg-success"
                                                    onClick={() => handleProcessRequest(req.id, 'approve')}
                                                    isLoading={processingId === req.id}
                                                    disabled={!!processingId}
                                                >
                                                    Approve
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="danger"
                                                    onClick={() => handleProcessRequest(req.id, 'deny')}
                                                    isLoading={processingId === req.id}
                                                    disabled={!!processingId}
                                                >
                                                    Deny
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-8 text-brand-light-gray">
                            There are no pending withdrawal requests.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
