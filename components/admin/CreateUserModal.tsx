
import React, { useState } from 'react';
import { Modal } from '../layout/Modal';
import { User } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import * as api from '../../services/api';

interface CreateUserModalProps {
    onClose: () => void;
    onUserCreated: (newUser: User) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onUserCreated }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: 'password123', // Default password for simplicity
        referrerUsername: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await api.mockAdminCreateUser(formData);
            onUserCreated(res.user);
        } catch (err: any) {
            setError(err.message || "Failed to create user.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Create New Tier 2 Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-brand-light-gray">
                    Manually create a new user account. This account will not require a payment fee.
                    You can optionally assign a referrer.
                </p>
                {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required />
                    <Input name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required />
                </div>
                <Input name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
                <Input name="username" label="Username" value={formData.username} onChange={handleChange} required />
                <Input name="referrerUsername" label="Referrer's Username (Optional)" value={formData.referrerUsername} onChange={handleChange} />
                <Input name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
                <p className="text-xs text-brand-ui-element">A default password is provided. The user can change this after logging in.</p>

                <div className="flex justify-end gap-4 pt-4 border-t border-brand-ui-element/30">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading}>Create User</Button>
                </div>
            </form>
        </Modal>
    );
};
