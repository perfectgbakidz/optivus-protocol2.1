



import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const StatusDisplay: React.FC<{status: 'verified' | 'pending', message: string, icon: React.ReactNode}> = ({status, message, icon}) => (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg">
        <div className={`mb-4 p-4 rounded-full ${status === 'verified' ? 'bg-success/20' : 'bg-warning/20'}`}>
            {icon}
        </div>
        <h2 className={`text-2xl font-bold ${status === 'verified' ? 'text-success' : 'text-warning'}`}>{status === 'verified' ? 'Verification Complete' : 'Verification Pending'}</h2>
        <p className="text-brand-light-gray mt-2">{message}</p>
    </div>
);

export const KycTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'United Kingdom',
    });
    const [idDocument, setIdDocument] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setIdDocument(e.target.files[0]);
        }
    };

    const handleConnectStripe = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.mockConnectPayout();
            if (res.data.onboardingUrl) {
                // In a real app, you would redirect or open this URL.
                window.open(res.data.onboardingUrl, '_blank');
                updateUser({ payoutConnected: true });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to connect payout account.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if(!idDocument || !user?.payoutConnected) {
            setError('Please upload a document and set up a payout method.');
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.mockSubmitKyc({...formData, idDocument});
            setMessage(res.message);
            updateUser({ kycStatus: 'pending' });
        } catch(err: any) {
            setError(err.message || 'Verification submission failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.kycStatus === 'pending') {
        return <StatusDisplay status="pending" message="Your documents are under review. This usually takes 1-2 business days." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />;
    }
    
    if (user?.kycStatus === 'verified') {
        return <StatusDisplay status="verified" message="You have been fully verified and can access all platform features." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />;
    }
    
    const isRejected = user?.kycStatus === 'rejected';

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
            
            {isRejected && (
                <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
                    <h3 className="font-bold">Submission Rejected</h3>
                    <p>Reason: {user.kycRejectionReason || 'No reason provided.'}</p>
                    <p className="mt-2 text-sm">Please correct the issues and resubmit your information below.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-8 rounded-lg space-y-6">
                {message && <div className="text-success p-3 rounded bg-success/10 border border-success">{message}</div>}
                {error && <div className="text-error p-3 rounded bg-error/10 border border-error">{error}</div>}

                <div className="border-b border-brand-ui-element/50 pb-6">
                    <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input label="First Name" value={user?.firstName || ''} readOnly />
                        <Input label="Last Name" value={user?.lastName || ''} readOnly />
                    </div>
                </div>

                <div className="border-b border-brand-ui-element/50 pb-6">
                    <h2 className="text-xl font-semibold text-white">Address Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input name="address" label="Street Address" value={formData.address} onChange={handleInputChange} required />
                        <Input name="city" label="City" value={formData.city} onChange={handleInputChange} required />
                        <Input name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleInputChange} required />
                         <Input name="country" label="Country" value={formData.country} onChange={handleInputChange} required />
                    </div>
                </div>
                
                 <div className="border-b border-brand-ui-element/50 pb-6">
                    <h2 className="text-xl font-semibold text-white">Document Upload</h2>
                    <p className="text-sm text-brand-light-gray mt-1">Upload a clear image of your Passport or Driver's License.</p>
                    <Input type="file" onChange={handleFileChange} className="mt-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-dark hover:file:opacity-90 transition-opacity" required />
                </div>
                
                <div className="border-b border-brand-ui-element/50 pb-6">
                    <h2 className="text-xl font-semibold text-white">Set Up Payout Method</h2>
                     {user?.payoutConnected ? (
                         <div className="mt-4 flex items-center gap-2 bg-success/10 border border-success text-success p-3 rounded-md">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                           <span>Stripe Account Connected Successfully</span>
                         </div>
                     ) : (
                         <>
                            <p className="text-sm text-brand-light-gray mt-1">Connect a Stripe account to receive payouts.</p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-4">
                                <Button type="button" onClick={handleConnectStripe} variant="secondary" className="w-full sm:w-auto" isLoading={isLoading}>
                                    Connect with Stripe
                                </Button>
                            </div>
                         </>
                     )}
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading} disabled={!idDocument || !user?.payoutConnected}>
                    {isRejected ? 'Resubmit for Verification' : 'Submit for Verification'}
                </Button>
            </form>
        </div>
    );
};
