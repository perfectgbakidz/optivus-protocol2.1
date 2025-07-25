
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import * as api from '../../services/api';
import { Logo } from '../../components/ui/Logo';
import { AnimatedWaveBackground } from '../../components/ui/AnimatedWaveBackground';

// Copied from other auth pages for consistency
const SocialIcon: React.FC<{ href: string, 'aria-label': string, children: React.ReactNode }> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-brand-light-gray/80 hover:text-brand-white transition-colors">
        {children}
    </a>
);


export const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('No reset token found. Please request a new reset link.');
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            setError('Invalid token.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await api.mockResetPassword(token, password);
            setMessage(result.message);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClasses = "bg-white/10 backdrop-blur-sm border-white/20 rounded-full py-3 px-5 focus:bg-white/20 w-full";

    return (
        <div className="min-h-screen bg-brand-dark text-brand-white flex flex-col p-4 relative overflow-hidden">
            <AnimatedWaveBackground />
    
            <header className="relative z-20 w-full max-w-6xl mx-auto">
                 <Link to="/" className="text-brand-light-gray/80 hover:text-brand-white transition-colors flex items-center gap-1.5 text-sm group mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span>Back to Home</span>
                </Link>
                <Logo />
            </header>
    
            <main className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center flex-grow justify-center py-12">
                <h1 className="text-5xl md:text-6xl font-extrabold">Set New Password</h1>
                <p className="mt-2 text-lg text-brand-light-gray/80">
                    Enter and confirm your new password below.
                </p>
                <div className="w-full max-w-sm mt-4 border-t border-white/20"></div>

                <div className="mt-12 w-full max-w-md">
                    {success ? (
                        <div className="space-y-4 bg-brand-panel/50 backdrop-blur-md border border-brand-ui-element/30 p-8 rounded-2xl">
                             <div className="mx-auto bg-success/20 w-16 h-16 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
                            <p className="text-brand-light-gray">{message}</p>
                            <Button onClick={() => navigate('/login')} className="w-full !rounded-full mt-4">Back to Login</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                            <Input
                                placeholder="New Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={!token || isLoading}
                                className={inputClasses}
                            />
                            <Input
                                placeholder="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={!token || isLoading}
                                className={inputClasses}
                            />
                            <Button type="submit" size="lg" className="w-full !rounded-full !text-lg" isLoading={isLoading} disabled={!token}>
                                Reset Password
                            </Button>
                        </form>
                    )}
                </div>
            </main>

            <footer className="relative z-10 text-center">
                <p className="text-lg font-semibold text-brand-light-gray/90">Follow us on</p>
                <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
                    <SocialIcon href="https://discord.gg/zGGtpydJxE" aria-label="Join on Discord">
                        <img src="/discord.png" alt="Discord" className="h-7 w-7" />
                    </SocialIcon>
                    <SocialIcon href="https://x.com/OptivusProtocol?t=t15w-GFwUR-Dyo4JVoChuQ&s=09" aria-label="Follow on X">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </SocialIcon>
                    <SocialIcon href="https://www.youtube.com/@OptivusProtocol" aria-label="Watch on YouTube">
                         <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.502-9.407-.502-9.407-.502s-7.537 0-9.407.502a3.007 3.007 0 0 0-2.088 2.088C.002 8.073 0 12 0 12s.002 3.927.505 5.795a3.007 3.007 0 0 0 2.088 2.088c1.87.502 9.407.502 9.407.502s7.537 0 9.407-.502a3.007 3.007 0 0 0 2.088-2.088C23.998 15.927 24 12 24 12s-.002-3.927-.505-5.795zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </SocialIcon>
                </div>
            </footer>
        </div>
    );
};
