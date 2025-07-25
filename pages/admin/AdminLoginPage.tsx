
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/ui/Logo';
import { validateEmail, validateInput } from '../../services/api';
import { AnimatedWaveBackground } from '../../components/ui/AnimatedWaveBackground';

const inputClasses = "bg-white/10 backdrop-blur-sm border-white/20 rounded-full py-3 px-5 focus:bg-white/20 w-full";

const PasswordToggleIcon: React.FC<{visible: boolean}> = ({ visible }) => (
    <>
    {visible ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3.93 3.93l16.14 16.14" /></svg>
    )}
    </>
);

export const AdminLoginPage: React.FC = () => {
    const { adminLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            validateEmail(email);
            validateInput(password, 'Password');
            await adminLogin(email, password);
            navigate('/admin');
        } catch(err: any) {
            setError(err.message || 'Failed to login as admin.');
        } finally {
            setIsLoading(false);
        }
    }

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

        <main className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center flex-grow justify-center py-12">
            
            <h1 className="text-5xl md:text-6xl font-extrabold">Admin Portal</h1>
            <p className="mt-2 text-lg text-brand-light-gray/80">
                Please login to continue.
            </p>
            <div className="w-full max-w-sm mt-4 border-t border-white/20"></div>

            <form onSubmit={handleLogin} className="mt-12 w-full space-y-6">
                 {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                 <Input
                    placeholder="Admin Email"
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClasses}
                    aria-label="Admin Email"
                />
                <div className="relative">
                    <Input
                        placeholder="Admin Password"
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClasses}
                        aria-label="Admin Password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-light-gray/60 hover:text-brand-light-gray">
                        <PasswordToggleIcon visible={showPassword} />
                    </button>
                </div>
                <Button type="submit" size="lg" className="w-full !rounded-full !text-lg" isLoading={isLoading}>
                    Login
                </Button>
                <Link to="/login" className="text-sm text-brand-light-gray/80 hover:text-brand-secondary underline mt-6 inline-block">
                    Return to user login
                </Link>
            </form>
        </main>

        <footer className="relative z-10 text-center text-xs text-brand-light-gray/50">
           <p>&copy; {new Date().getFullYear()} Optivus Protocol. Admin Access.</p>
        </footer>
    </div>
    );
};
