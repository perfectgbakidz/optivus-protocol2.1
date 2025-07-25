import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import * as api from '../../services/api';

export const ContactPage: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const res = await api.mockSubmitContactForm(formData);
            setSuccessMessage(res.message);
            setFormData(prev => ({
                ...prev,
                subject: '',
                message: ''
            }));
        } catch (err: any) {
            setError(err.message || "Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <PageWrapper title="Contact Us">
            <p className="mb-6">
                Have a question or need assistance? Fill out the form below and our team will get back to you shortly.
            </p>

            {successMessage ? (
                <div className="bg-success/10 border border-success text-success p-4 rounded-lg text-center">
                    <h3 className="font-bold text-lg">Message Sent!</h3>
                    <p>{successMessage}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Your Name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            disabled={!!user}
                        />
                        <Input 
                            label="Your Email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            disabled={!!user}
                        />
                    </div>
                    <Input 
                        label="Subject" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        required 
                    />
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-brand-light-gray mb-1">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full bg-brand-dark/50 border border-brand-ui-element rounded-md px-3 py-2 text-brand-white placeholder-brand-light-gray/50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-300"
                        ></textarea>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto" isLoading={isLoading}>
                        Send Message
                    </Button>
                </form>
            )}
        </PageWrapper>
    );
};
