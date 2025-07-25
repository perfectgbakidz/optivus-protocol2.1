
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import * as api from '../../../services/api';
import { Modal } from '../../../components/layout/Modal';

const SettingsCard: React.FC<{title: string, children: React.ReactNode, footer?: React.ReactNode}> = ({title, children, footer}) => (
    <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg flex flex-col">
        <div className="p-6 flex-grow">
            <h2 className="text-xl font-semibold text-white border-b border-brand-ui-element/50 pb-3 mb-4">{title}</h2>
            {children}
        </div>
        {footer && <div className="bg-brand-dark/30 px-6 py-3 border-t border-brand-ui-element/20 rounded-b-lg">{footer}</div>}
    </div>
);

const ProfileInfo: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const updatedUser = await api.mockUpdateProfile({ firstName, lastName });
            updateUser(updatedUser);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
         <form onSubmit={handleProfileUpdate} className="space-y-4">
            {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
             </div>
             <Input label="Email Address" value={user?.email || ''} readOnly />
             <Button type="submit" isLoading={isLoading} variant="secondary">Save Changes</Button>
        </form>
    )
}

const ChangePassword = () => {
    const { logout } = useAuth();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPasswords({...passwords, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(passwords.new !== passwords.confirm) {
            setError('New passwords do not match.');
            return;
        }
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            const res = await api.mockUpdatePassword();
            setMessage(res.message);
            setTimeout(() => logout(), 2000);
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
            {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
            <Input label="Current Password" name="current" type="password" value={passwords.current} onChange={handleChange} required/>
            <Input label="New Password" name="new" type="password" value={passwords.new} onChange={handleChange} required/>
            <Input label="Confirm New Password" name="confirm" type="password" value={passwords.confirm} onChange={handleChange} required/>
            <Button type="submit" isLoading={isLoading} variant="secondary">Change Password</Button>
        </form>
    )
}

const ManagePin = () => {
    const { user, updateUser } = useAuth();
    const [step, setStep] = useState<'initial' | 'verify'>('initial');
    const [pin, setPin] = useState({ new: '', confirm: ''});
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => setPin({...pin, [e.target.name]: e.target.value });

    const handleSendToken = async () => {
        if(pin.new.length < 4 || pin.new.length > 6) {
             setError('PIN must be between 4 and 6 digits.');
             return;
        }
        if (pin.new !== pin.confirm) {
            setError('PINs do not match.');
            return;
        }
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            const res = await api.mockSendPinToken();
            setMessage(res.message);
            setStep('verify');
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSetPin = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);
        try {
            const res = await api.mockSetPin(code);
            setMessage(res.message);
            updateUser({ hasPin: true });
            setStep('initial');
            setPin({new: '', confirm: ''});
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (user?.hasPin) {
        return <p className="text-brand-light-gray">Your PIN is set. For security, PIN reset is handled via support.</p>
    }

    return (
        <div className="space-y-4">
             {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
             {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
             {step === 'initial' && (
                <div className="space-y-4">
                    <Input label="New 4-6 Digit PIN" name="new" type="password" maxLength={6} value={pin.new} onChange={handlePinChange} />
                    <Input label="Confirm PIN" name="confirm" type="password" maxLength={6} value={pin.confirm} onChange={handlePinChange} />
                    <Button onClick={handleSendToken} isLoading={isLoading}>Set PIN</Button>
                </div>
             )}
             {step === 'verify' && (
                <div className="space-y-4">
                    <Input label="Email Verification Code" type="text" value={code} onChange={e => setCode(e.target.value)} />
                    <Button onClick={handleSetPin} isLoading={isLoading}>Confirm & Set PIN</Button>
                </div>
             )}
        </div>
    )
}

const Manage2FA = () => {
    const { user, updateUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<'enable' | 'disable' | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEnableClick = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.mockEnable2FA();
            setQrCodeUrl(res.data.qrCodeUrl);
            setSecret(res.data.secret);
            setModalContent('enable');
            setIsModalOpen(true);
        } catch (err: any) {
            setError(err.message || "Failed to start 2FA setup.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisableClick = () => {
        setError('');
        setModalContent('disable');
        setIsModalOpen(true);
    };

    const handleVerifyEnable = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.mockVerify2FA(verificationCode);
            updateUser({ is2faEnabled: true });
            closeModal();
        } catch (err: any) {
            setError(err.message || 'Verification failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleVerifyDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.mockDisable2FA(verificationCode);
            updateUser({ is2faEnabled: false });
            closeModal();
        } catch (err: any) {
            setError(err.message || 'Disabling 2FA failed.');
        } finally {
            setIsLoading(false);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        setVerificationCode('');
        setError('');
        setIsLoading(false);
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-brand-light-gray">Enhance your account security by requiring a second verification step on login and withdrawals.</p>
                    <button onClick={user?.is2faEnabled ? handleDisableClick : handleEnableClick} disabled={isLoading}>
                        <div className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${user?.is2faEnabled ? 'bg-success' : 'bg-brand-ui-element'}`}>
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${user?.is2faEnabled ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </button>
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent === 'enable' ? 'Enable 2FA' : 'Disable 2FA'}>
                {modalContent === 'enable' && (
                    <form onSubmit={handleVerifyEnable} className="space-y-4 text-center">
                        <p className="text-brand-light-gray">1. Scan the QR code with your authenticator app.</p>
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                        </div>
                        <p className="text-sm text-brand-ui-element">Or manually enter this key:</p>
                        <p className="font-mono bg-brand-dark p-2 rounded-md">{secret}</p>
                        <p className="text-brand-light-gray pt-2">2. Enter the 6-digit code from your app.</p>
                        {error && <div className="bg-error/10 text-error p-2 rounded-md">{error}</div>}
                        <Input 
                            label="Verification Code"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            required
                            maxLength={6}
                        />
                        <Button type="submit" className="w-full" isLoading={isLoading}>Verify & Enable</Button>
                    </form>
                )}
                 {modalContent === 'disable' && (
                    <form onSubmit={handleVerifyDisable} className="space-y-4 text-center">
                        <p className="text-brand-light-gray">To confirm, please enter a 6-digit code from your authenticator app.</p>
                        {error && <div className="bg-error/10 text-error p-2 rounded-md">{error}</div>}
                        <Input 
                            label="Authentication Code"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                            required
                            maxLength={6}
                        />
                        <Button type="submit" variant="danger" className="w-full" isLoading={isLoading}>Confirm & Disable</Button>
                    </form>
                )}
            </Modal>
        </>
    );
};


export const SettingsTab: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <SettingsCard title="Profile Information"><ProfileInfo /></SettingsCard>
                    <SettingsCard title="Change Password"><ChangePassword /></SettingsCard>
                </div>
                <div className="space-y-8">
                    <SettingsCard title="Manage Withdrawal PIN"><ManagePin /></SettingsCard>
                    <SettingsCard title="Two-Factor Authentication (2FA)">
                        <Manage2FA />
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};