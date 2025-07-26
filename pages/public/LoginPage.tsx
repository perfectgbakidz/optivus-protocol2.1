

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/ui/Logo';
import { validateEmail, validateInput } from '../../services/api';
import { AnimatedWaveBackground } from '../../components/ui/AnimatedWaveBackground';


const SocialIcon: React.FC<{ href: string, 'aria-label': string, children: React.ReactNode }> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-brand-light-gray/80 hover:text-brand-white transition-colors">
        {children}
    </a>
);

const PasswordToggleIcon: React.FC<{visible: boolean}> = ({ visible }) => (
    <>
    {visible ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3.93 3.93l16.14 16.14" /></svg>
    )}
    </>
);

export const LoginPage: React.FC = () => {
  const { login, verifyTwoFactor } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Input validation
      validateEmail(email);
      validateInput(password, 'Password');

      const result = await login(email, password);
      if (result && result.twoFactorRequired) {
        setStep('2fa');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
        validateInput(twoFactorToken, '2FA Token');
        await verifyTwoFactor(twoFactorToken);
        navigate('/dashboard');
    } catch (err: any) {
        setError(err.message || 'Failed to verify 2FA token.');
    } finally {
        setIsLoading(false);
    }
  }
  
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

        <main className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center flex-grow justify-center py-12">
            
            <h1 className="text-5xl md:text-6xl font-extrabold">Welcome Back!</h1>
            <p className="mt-2 text-lg text-brand-light-gray/80">
                Log In with personal details to enter user dashboard.
            </p>
            <div className="w-full max-w-lg mt-4 border-t border-white/20"></div>

            <div className="mt-12 w-full">
                {step === 'credentials' && (
                    <div className="w-full">
                        {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm mb-6 max-w-lg mx-auto">{error}</div>}
                        
                        <form onSubmit={handleLogin}>
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-x-8 gap-y-6">
                                
                                <div className="text-center lg:text-left flex-shrink-0">
                                    <h2 className="text-3xl font-bold">Log In</h2>
                                    <p className="text-brand-light-gray/80 mt-1">
                                        Log In with personal details to enter user dashboard.
                                    </p>
                                </div>

                                <div className="w-full max-w-md">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Email Address*"
                                            id="login-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className={inputClasses}
                                            aria-label="Email Address"
                                        />
                                        <div className="relative">
                                            <Input
                                                placeholder="Password*"
                                                id="login-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className={inputClasses}
                                                aria-label="Password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-light-gray/60 hover:text-brand-light-gray">
                                                <PasswordToggleIcon visible={showPassword} />
                                            </button>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <Button type="submit" size="lg" className="w-full !rounded-full !text-lg" isLoading={isLoading}>
                                                Log In
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <Link
                                to="/forgot-password"
                                className="text-sm text-brand-light-gray/80 hover:text-brand-secondary underline mt-6 inline-block"
                            >
                                Forgot Password?
                            </Link>
                        </form>
                         <div className="text-center text-sm text-brand-light-gray mt-8 space-y-2">
                            <p>
                                Don't have an account? <Link to="/signup" className="font-semibold text-brand-secondary hover:underline">Sign Up</Link>
                            </p>
                            <p className="pt-2">
                                Are you an administrator? <Link to="/admin-login" className="font-semibold text-brand-secondary hover:underline">Admin Login</Link>
                            </p>
                        </div>
                    </div>
                )}
                {step === '2fa' && (
                     <form onSubmit={handle2faSubmit} className="max-w-sm mx-auto space-y-6 bg-brand-panel/50 backdrop-blur-md border border-brand-ui-element/30 p-8 rounded-2xl">
                        <h3 className="text-xl font-semibold text-brand-white">Enter 2FA Code</h3>
                        <p className="text-brand-light-gray">Enter the code from your authenticator app to continue.</p>
                        {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                        <Input
                            label="2FA Code"
                            id="2fa-token"
                            type="text"
                            value={twoFactorToken}
                            onChange={(e) => setTwoFactorToken(e.target.value)}
                            required
                            maxLength={6}
                            className={inputClasses}
                            aria-label="2FA Code"
                        />
                        <Button type="submit" className="w-full !rounded-full" isLoading={isLoading}>Verify</Button>
                    </form>
                )}
            </div>
        </main>

        <footer className="relative z-10 text-center">
             <p className="text-lg font-semibold text-brand-light-gray/90">Follow us on</p>
             <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
                <SocialIcon href="https://discord.gg/zGGtpydJxE" aria-label="Join on Discord">
                    <img src="https://i.imgur.com/muFS1AD.png" alt="Discord" className="h-7 w-7" />
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