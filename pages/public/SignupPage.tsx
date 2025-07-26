

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordStrength } from '../../components/ui/PasswordStrength';
import * as api from '../../services/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Modal } from '../../components/layout/Modal';
import { AnimatedWaveBackground } from '../../components/ui/AnimatedWaveBackground';


const SocialIcon: React.FC<{ href: string, 'aria-label': string, children: React.ReactNode }> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-brand-light-gray/80 hover:text-brand-white transition-colors">
        {children}
    </a>
);

export const SignupPage: React.FC = () => {
  const { signup, finalizeRegistrationAndLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalStep, setPaymentModalStep] = useState<'select' | 'card' | null>(null);

  const [tempToken, setTempToken] = useState<string | null>(null);
  const [formDetails, setFormDetails] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [error, setError] = useState('');
  const [loadingMethod, setLoadingMethod] = useState<'card' | 'crypto' | null>(null);
  const [isTransakWidgetVisible, setIsTransakWidgetVisible] = useState(false);
  
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setFormDetails(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [location.search]);
  

  useEffect(() => {
    if (!formDetails.username) {
      setUsernameStatus('idle');
      setUsernameMessage('');
      return;
    }

    setUsernameStatus('checking');
    const handler = setTimeout(async () => {
      try {
        const res = await api.mockCheckUsername(formDetails.username);
        if (res.available) {
          setUsernameStatus('available');
          setUsernameMessage('Username is available!');
        } else {
          setUsernameStatus('taken');
          setUsernameMessage('Username is already taken.');
        }
      } catch (e) {
        setUsernameStatus('idle');
        setUsernameMessage('');
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [formDetails.username]);

  useEffect(() => {
    setPasswordsMatch(formDetails.password !== '' && formDetails.password === formDetails.confirmPassword);
  }, [formDetails.password, formDetails.confirmPassword]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };
  
  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };


  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    
    if (usernameStatus !== 'available') {
      setError('Please choose an available username.');
      return;
    }

    setLoadingMethod('card'); // Use loading state to disable button
    try {
        const token = await signup(formDetails);
        setTempToken(token);
        setStep('payment');
    } catch (err: any) {
        setError(err.message || 'Registration failed.');
    } finally {
        setLoadingMethod(null);
    }
  };

  const handleSuccessfulLogin = () => {
    navigate('/dashboard');
  };
  
  const handleCardPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMethod('card');
    setError('');

    await new Promise(res => setTimeout(res, 1500));
    console.log(`Simulating successful card payment with details:`, cardDetails);

    if (!tempToken) {
        setError('Session expired. Please start over.');
        setLoadingMethod(null);
        closePaymentModal();
        setStep('details');
        return;
    }
      
    try {
        await finalizeRegistrationAndLogin(tempToken);
        handleSuccessfulLogin();
    } catch(err: any) {
        setError(err.message || 'Finalizing your account failed. Please contact support.');
    } finally {
        setLoadingMethod(null);
    }
  }

  const launchTransak = () => {
      setLoadingMethod('crypto');
      setError('');
      
      setTimeout(() => {
          setIsTransakWidgetVisible(true);
          setLoadingMethod(null);
      }, 750);
  };

  const handleTransakPaymentConfirm = async () => {
    setLoadingMethod('crypto');
    setError('');

    await new Promise(res => setTimeout(res, 2000));
    console.log('Simulating Transak success event...');

    if (!tempToken) {
      setError('Session expired. Please start over.');
      setLoadingMethod(null);
      setIsTransakWidgetVisible(false);
      setStep('details');
      return;
    }
    
    try {
      await finalizeRegistrationAndLogin(tempToken);
      handleSuccessfulLogin();
    } catch(err: any) {
      setError(err.message || 'Finalizing your account failed. Please contact support.');
      setLoadingMethod(null);
    } 
  };
  
  const closePaymentModal = () => {
      setIsPaymentModalOpen(false);
      setPaymentModalStep(null);
      setError('');
      setLoadingMethod(null);
  }

  const handlePaymentSelection = (paymentMethod: 'card' | 'crypto') => {
      if (paymentMethod === 'crypto') {
          closePaymentModal();
          launchTransak();
          return;
      }
      setPaymentModalStep('card');
  }

  const handleGetAccessClick = () => {
    setIsPaymentModalOpen(true);
    setPaymentModalStep('select');
  };
  
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

        <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center flex-grow justify-center py-12">
            {step === 'details' && (
                <>
                    <h1 className="text-5xl font-extrabold">Join the Optivus Protocol</h1>
                    <p className="mt-2 text-lg text-brand-light-gray/80">
                      Create your account to start earning commissions.
                    </p>
                    <div className="w-full max-w-lg mt-4 border-t border-white/20"></div>
                    <form onSubmit={handleDetailsSubmit} className="mt-12 w-full max-w-5xl">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-x-8 gap-y-6">
                            <div className="text-center lg:text-left flex-shrink-0">
                                <h2 className="text-3xl font-bold">Create Account</h2>
                                <p className="text-brand-light-gray/80 mt-1 max-w-[250px]">
                                    Use your referral code and add your personal details to create your own Optivus Protocol account.
                                </p>
                            </div>

                            <div className="flex-grow w-full max-w-lg">
                                {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm mb-4">{error}</div>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <Input name="referralCode" placeholder="Referral Code*" value={formDetails.referralCode} onChange={handleChange} required className={inputClasses} />
                                    </div>
                                    <Input name="firstName" placeholder="First Name*" value={formDetails.firstName} onChange={handleChange} required className={inputClasses} />
                                    <Input name="lastName" placeholder="Last Name*" value={formDetails.lastName} onChange={handleChange} required className={inputClasses} />
                                    <Input name="email" type="email" placeholder="Email Address*" value={formDetails.email} onChange={handleChange} required className={inputClasses} />
                                    <div>
                                        <Input name="username" placeholder="User Name*" value={formDetails.username} onChange={handleChange} required className={inputClasses} />
                                        {usernameStatus !== 'idle' && (
                                          <p className={`text-xs mt-1 text-left px-2 ${
                                              usernameStatus === 'available' ? 'text-success' : 
                                              usernameStatus === 'taken' ? 'text-error' : 'text-brand-light-gray'
                                          }`}>
                                              {usernameStatus === 'checking' && 'Checking...'}
                                              {usernameMessage}
                                          </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password*" value={formDetails.password} onChange={handleChange} required className={inputClasses} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-light-gray/60 hover:text-brand-light-gray">
                                            <PasswordToggleIcon visible={showPassword} />
                                        </button>
                                        <PasswordStrength password={formDetails.password} />
                                    </div>
                                    <div className="relative">
                                        <Input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password*" value={formDetails.confirmPassword} onChange={handleChange} required className={inputClasses} />
                                         <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-light-gray/60 hover:text-brand-light-gray">
                                             <PasswordToggleIcon visible={showConfirmPassword} />
                                        </button>
                                         {passwordsMatch && formDetails.password && (
                                          <span className="absolute right-12 top-3 text-xs text-success flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                          </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <Button type="submit" size="lg" className="w-full sm:w-1/2 !rounded-full !text-lg" isLoading={loadingMethod !== null} disabled={usernameStatus !== 'available'}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </div>
                         <p className="text-center text-sm text-brand-light-gray mt-8 lg:col-span-2">
                            Already have an account? <Link to="/login" className="font-semibold text-brand-secondary hover:underline">Log In</Link>
                        </p>
                    </form>
                </>
            )}

            {step === 'payment' && (
                <div className="w-full h-full flex-grow flex flex-col items-center justify-center gap-8 animate-fade-in-up px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-8">
                        {/* Left Image (static) */}
                        <div className="flex justify-center">
                            <img 
                                src="https://i.imgur.com/MXSW4eu.png" 
                                alt="Optivus Protocol Graphic" 
                                className="h-40 w-40 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-96 lg:w-96 object-contain"
                            />
                        </div>
                        {/* Right column with animated image and button */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex justify-center">
                                <img 
                                    src="https://i.imgur.com/AKMJf5b.png" 
                                    alt="Floating Crypto Orb" 
                                    className="h-40 w-40 sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-96 lg:w-96 object-contain animate-float"
                                />
                            </div>
                            <Button 
                                onClick={handleGetAccessClick} 
                                size="lg" 
                                className="!rounded-lg font-bold w-full max-w-sm"
                            >
                                GET ACCESS
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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

        <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={paymentModalStep === 'card' ? 'Enter Card Details' : 'Select Payment Method'}>
            {paymentModalStep === 'select' && (
                 <div className="space-y-4">
                    <p className="text-brand-light-gray text-center">Complete your registration by paying the one-time <span className="font-bold text-brand-secondary">£50 fee</span>.</p>
                    {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                    
                    <div className="bg-brand-dark/50 p-4 rounded-lg space-y-3 border border-brand-ui-element/50">
                        <Button onClick={() => handlePaymentSelection('card')} className="w-full" isLoading={loadingMethod === 'card'}>Continue with Card</Button>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-ui-element"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-brand-dark text-brand-light-gray">OR</span></div>
                        </div>
                        <Button onClick={() => handlePaymentSelection('crypto')} variant="secondary" className="w-full" isLoading={loadingMethod === 'crypto'}>Pay with Crypto (via Transak)</Button>
                    </div>
                </div>
            )}
             {paymentModalStep === 'card' && (
                <form onSubmit={handleCardPaymentSubmit} className="space-y-4">
                    <p className="text-brand-light-gray text-center text-sm">You will be charged a one-time fee of £50.</p>
                    {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                    <Input name="name" label="Cardholder Name" value={cardDetails.name} onChange={handleCardDetailsChange} required />
                    <Input name="number" label="Card Number" value={cardDetails.number} onChange={handleCardDetailsChange} required placeholder="0000 0000 0000 0000" />
                    <div className="flex gap-4">
                        <Input name="expiry" label="Expiry (MM/YY)" value={cardDetails.expiry} onChange={handleCardDetailsChange} required placeholder="MM/YY" />
                        <Input name="cvc" label="CVC" value={cardDetails.cvc} onChange={handleCardDetailsChange} required placeholder="123" />
                    </div>
                    <Button type="submit" className="w-full" isLoading={loadingMethod === 'card'}>Pay £50 Securely</Button>
                    <button type="button" onClick={() => setPaymentModalStep('select')} className="text-sm text-brand-light-gray hover:text-brand-secondary transition-colors w-full text-center mt-2" disabled={loadingMethod === 'card'}>
                        &larr; Back to payment options
                    </button>
                </form>
            )}
        </Modal>

        {isTransakWidgetVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
          <div 
            className="bg-brand-panel border border-brand-ui-element rounded-lg shadow-2xl w-full max-w-sm p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-brand-secondary">Transak Secure Checkout</h3>
            <p className="text-brand-light-gray">
              You will be redirected to Transak to complete your payment securely.
            </p>
            <div className="bg-brand-dark/50 p-4 rounded-lg">
              <p className="text-brand-light-gray">Total to Pay:</p>
              <p className="text-3xl font-bold text-white">£50.00</p>
            </div>
            
            {error && <div className="text-error p-2 rounded bg-error/10 border border-error text-sm">{error}</div>}

            <p className="text-xs text-brand-ui-element">
              This is a simulation. In a live environment, a Transak window would open here for you to choose a cryptocurrency and finalize the payment.
            </p>

            <div className="space-y-2 pt-2">
              <Button
                className="w-full"
                onClick={handleTransakPaymentConfirm}
                isLoading={loadingMethod === 'crypto'}
              >
                Confirm & Simulate Payment
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsTransakWidgetVisible(false)}
                disabled={loadingMethod === 'crypto'}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};