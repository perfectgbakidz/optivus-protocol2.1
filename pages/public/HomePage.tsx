

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { AnimatedWaveBackground } from '../../components/ui/AnimatedWaveBackground';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="mb-4 h-20 w-20 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="font-exo2 text-[20px] font-bold text-white mb-3 flex items-center justify-center text-center min-h-[56px]">{title}</h3>
    <p className="text-brand-light-gray leading-relaxed">{children}</p>
  </div>
);


export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = (path: string) => {
      navigate(path);
      setIsMobileMenuOpen(false);
  };

  const handleLaunchClick = () => {
      navigate('/login');
      setIsMobileMenuOpen(false);
  };
  
  // A functional header is retained as the new design doesn't specify one.
  const LandingHeaderContent = (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-4 sm:px-8 flex justify-between items-center py-6">
          <div className="flex items-center gap-10">
              <Logo />
              <nav className="hidden md:flex items-center space-x-8">
                  <Link to="/about" className="text-sm font-medium text-brand-light-gray hover:text-brand-white transition-colors">Whitepaper</Link>
                  <Link to="/contact" className="text-sm font-medium text-brand-light-gray hover:text-brand-white transition-colors">Contact</Link>
                  <Link to="/faq" className="text-sm font-medium text-brand-light-gray hover:text-brand-white transition-colors">FAQ</Link>
              </nav>
          </div>
          <button onClick={handleLaunchClick} className="hidden md:block bg-white text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition-colors shadow-lg">
              Launch App
          </button>
          <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-brand-light-gray hover:text-brand-white" aria-label="Toggle menu">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                   </svg>
              </button>
          </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
          <div className="bg-brand-dark/95 backdrop-blur-md">
              <div className="container mx-auto px-8 py-4 flex flex-col items-center space-y-4">
                  <button onClick={() => handleMobileLinkClick('/about')} className="font-medium text-brand-light-gray hover:text-brand-white transition-colors w-full text-center py-2">Whitepaper</button>
                  <button onClick={() => handleMobileLinkClick('/contact')} className="font-medium text-brand-light-gray hover:text-brand-white transition-colors w-full text-center py-2">Contact</button>
                  <button onClick={() => handleMobileLinkClick('/faq')} className="font-medium text-brand-light-gray hover:text-brand-white transition-colors w-full text-center py-2">FAQ</button>
                  <button onClick={handleLaunchClick} className="w-full bg-white text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-200 transition-colors shadow-lg mt-2">
                      Launch App
                  </button>
              </div>
          </div>
      </div>
    </header>
  );

  return (
    <div className="bg-brand-dark text-brand-white">
      <div className="relative min-h-screen overflow-hidden is-home-page">
        <AnimatedWaveBackground />
        {LandingHeaderContent}
        
        <div className="relative z-10 container mx-auto px-6 flex items-center min-h-screen">
          <section className="w-full py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-center text-center">
                  <p className="font-montserrat text-[21.8px] text-brand-light-gray mb-4">
                    Next-generation Modular DeFi<br/>
                    infrastructure for scalable,permissionless<br/>
                    finance.
                  </p>
                  <h1 className="font-exo2 text-[58.3px] font-extrabold text-white leading-tight">
                    Own your value.
                    <br />
                    Grow your
                    <br />
                    network.
                  </h1>
                  <div className="mt-8 inline-flex flex-col gap-4">
                    <div className="bg-white text-black font-semibold py-3 px-6 rounded-lg shadow-lg">
                      $OPTIV is our Store of Value Powered by OPTIVision
                    </div>
                    <Button 
                        onClick={() => navigate('/signup')} 
                        size="lg" 
                        className="!rounded-lg font-bold"
                    >
                        GET STARTED – £50 ONE-TIME FEE
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center h-80 md:h-[560px]">
                    <img src="https://i.imgur.com/XY1ip5H.png" alt="A purple, geometric, glowing orb representing DeFi infrastructure" className="h-full w-full object-contain animate-float" />
                </div>
            </div>
          </section>
        </div>
      </div>

      <main className="relative z-10">
        {/* Bringing Ideas to Life Section */}
        <section className="bg-white py-12 md:py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 items-center">
                    <div className="text-center">
                      <h2 className="font-orbitron text-[35px] font-bold text-brand-dark leading-tight">
                        Bringing Ideas to<br/>Life
                      </h2>
                    </div>
                    <div className="text-center">
                      <p className="font-montserrat text-[16.4px] text-gray-700 leading-relaxed">
                        Optivus Protocol: The Smarter Way to Earn. Stake,<br/> refer, and grow with $OPTIV — the next-generation<br/> asset for passive income and long-term value.
                      </p>
                    </div>
                </div>
            </div>
        </section>

        {/* OPTIVision Section */}
        <section className="bg-brand-dark py-8 md:py-12">
            <div className="container mx-auto px-6">
                <div className="text-left mb-12">
                    <h2 className="font-audiowide text-4xl lg:text-5xl font-bold text-white">OPTIVision</h2>
                    <div className="mt-4 w-full h-px bg-brand-ui-element/50"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                    icon={<img src="https://i.imgur.com/lVi4Sa1.png" alt="Buy $OPTI Icon" className="h-20 w-20 object-contain" />} 
                    title="Buy $OPTIV. Direct, Fast, Secure."
                    >
                    Optivus Protocol makes it simple to invest in your future – no third parties, no delays. Purchase $OPTIV instantly on-site with full transparency and total control.
                    </FeatureCard>
                    <FeatureCard 
                    icon={<img src="https://i.imgur.com/xduWcEA.png" alt="Refer with Optivus Icon" className="h-20 w-20 object-contain" />} 
                    title="Refer with Optivus. Earn Without Limits."
                    >
                    Optivus Protocol turns your network into a growth engine with smart, blockchain-powered referrals. Share. Earn. Expand – effortlessly and transparently, with rewards you can trust.
                    </FeatureCard>
                    <FeatureCard 
                    icon={<img src="https://i.imgur.com/SYw5YPZ.png" alt="Stake $OPTI Icon" className="h-20 w-20 object-contain" />} 
                    title="Stake $OPTIV. Grow with Purpose."
                    >
                    Optivus Protocol empowers your financial future with secure, scalable Web3 infrastructure. Earn rewards while supporting next-gen blockchain innovation – fast, reliable, and built to last.
                    </FeatureCard>
                </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
