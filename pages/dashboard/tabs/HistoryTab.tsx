import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/api';
import { Transaction } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block';
    const variantClasses = {
        Completed: 'bg-success/20 text-success',
        Pending: 'bg-warning/20 text-warning',
        Failed: 'bg-error/20 text-error',
    };
    return <span className={`${baseClasses} ${variantClasses[status]}`}>{status}</span>;
}

export const HistoryTab: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = useCallback(async (pageNum: number) => {
        setIsLoading(true);
        try {
            const data = await api.mockFetchTransactions(pageNum);
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(page);
    }, [page, fetchHistory]);
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg overflow-hidden">
                {isLoading ? <Spinner /> : (
                    <>
                        {/* Mobile View */}
                        <div className="md:hidden">
                            <div className="p-4 space-y-4">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="bg-brand-dark/30 p-4 rounded-lg border border-brand-ui-element/20">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-white">{tx.type}</p>
                                                <p className="text-sm text-brand-light-gray">{tx.description}</p>
                                            </div>
                                            <p className={`font-mono text-lg shrink-0 ml-4 ${tx.amount > 0 ? 'text-success' : 'text-error'}`}>
                                                {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-brand-ui-element/80">
                                            <span>{tx.date}</span>
                                            <StatusBadge status={tx.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-dark/50">
                                    <tr>
                                        <th className="p-4 font-semibold text-brand-white">Date</th>
                                        <th className="p-4 font-semibold text-brand-white">Type</th>
                                        <th className="p-4 font-semibold text-brand-white">Description</th>
                                        <th className="p-4 font-semibold text-right text-brand-white">Amount</th>
                                        <th className="p-4 font-semibold text-center text-brand-white">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="border-b border-brand-ui-element/20 last:border-0">
                                            <td className="p-4 whitespace-nowrap">{tx.date}</td>
                                            <td className="p-4">{tx.type}</td>
                                            <td className="p-4 text-brand-light-gray">{tx.description}</td>
                                            <td className={`p-4 font-mono text-right ${tx.amount > 0 ? 'text-success' : 'text-error'}`}>
                                                {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount).toFixed(2)}
                                            </td>
                                            <td className="p-4 text-center"><StatusBadge status={tx.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                <div className="p-4 bg-brand-dark/50 flex justify-between items-center">
                    <Button onClick={() => setPage(p => p - 1)} disabled={page <= 1 || isLoading} variant="secondary">Previous</Button>
                    <span className="text-brand-light-gray">Page {page} of {totalPages}</span>
                    <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages || isLoading} variant="secondary">Next</Button>
                </div>
            </div>
        </div>
    );
};