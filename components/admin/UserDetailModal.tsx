


import React, { useState } from 'react';
import { Modal } from '../layout/Modal';
import { User } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import * as api from '../../services/api';

interface UserDetailModalProps {
    user: User;
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose, onUpdate }) => {
    const [balance, setBalance] = useState(user.balance.toString());
    const [status, setStatus] = useState(user.status);
    const [withdrawalStatus, setWithdrawalStatus] = useState<'active' | 'paused'>(user.withdrawalStatus || 'active');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSaveChanges = async () => {
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await api.mockAdminUpdateUser(user.id, {
                balance: parseFloat(balance),
                status,
                withdrawalStatus
            });
            onUpdate(res.user);
            setMessage('User updated successfully!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch(err: any) {
            setError(err.message || 'Failed to update user.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Manage User: ${user.firstName} ${user.lastName}`}>
            <div className="space-y-6">
                {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
                {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}

                <div>
                    <h3 className="text-lg font-semibold text-brand-white">Account Info</h3>
                    <p className="text-sm text-brand-light-gray"><span className="font-semibold">Email:</span> {user.email}</p>
                    <p className="text-sm text-brand-light-gray"><span className="font-semibold">Username:</span> @{user.username}</p>
                    <p className="text-sm text-brand-light-gray"><span className="font-semibold">KYC Status:</span> <span className="capitalize">{user.kycStatus}</span></p>
                </div>
                
                <div className="border-t border-brand-ui-element/30 pt-4">
                    <h3 className="text-lg font-semibold text-brand-white mb-2">Adjust Balance</h3>
                    <div className="flex items-center gap-2">
                         <span className="text-brand-secondary font-bold text-lg">£</span>
                         <Input 
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="flex-grow"
                         />
                    </div>
                </div>

                <div className="border-t border-brand-ui-element/30 pt-4">
                    <h3 className="text-lg font-semibold text-brand-white mb-2">Account Status</h3>
                    <div className="flex gap-4">
                        <Button 
                            variant={status === 'active' ? 'primary' : 'secondary'}
                            onClick={() => setStatus('active')}
                        >
                            Active
                        </Button>
                         <Button 
                            variant={status === 'frozen' ? 'danger' : 'secondary'}
                            onClick={() => setStatus('frozen')}
                        >
                            Frozen
                        </Button>
                    </div>
                </div>

                 <div className="border-t border-brand-ui-element/30 pt-4">
                    <h3 className="text-lg font-semibold text-brand-white mb-2">Withdrawal Status</h3>
                    <div className="flex gap-4">
                        <Button 
                            variant={withdrawalStatus === 'active' ? 'primary' : 'secondary'}
                            onClick={() => setWithdrawalStatus('active')}
                            className="bg-success/80 hover:bg-success"
                        >
                            Active
                        </Button>
                         <Button 
                            variant={withdrawalStatus === 'paused' ? 'danger' : 'secondary'}
                            onClick={() => setWithdrawalStatus('paused')}
                        >
                            Paused
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-brand-ui-element/30">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSaveChanges} isLoading={isLoading}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};