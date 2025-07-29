
import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start my-2">
        <svg className="flex-shrink-0 h-6 w-6 text-success mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{children}</span>
    </li>
);

const InfoItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row py-2 border-b border-brand-ui-element/10 last:border-b-0">
        <strong className="w-full sm:w-1/3 text-brand-light-gray/90 shrink-0">{label}</strong>
        <span className="w-full sm:w-2/3">{value}</span>
    </div>
);


export const AboutPage: React.FC = () => {
  return (
    <PageWrapper title="Optivus Protocol White Paper">
      <div className="text-right text-brand-light-gray/80 mb-6 -mt-4">
        <p>Version 1.0 | July 2025</p>
      </div>

      <section>
        <h2>Abstract</h2>
        <p>Optivus Protocol is advancing the next phase of Web3 through a combination of sustainable tokenomics, fixed supply strategy, and community-led growth. Designed for stability and long-term utility, the OPTIV token prioritizes real-world value, not speculative hype. Our mission is to create a more trustworthy, human-centered digital economy by rewarding meaningful participation and removing predatory mechanics from the Web3 equation.</p>
      </section>

      <section>
        <h2>1. Introduction</h2>
        <p>The Web3 ecosystem has grown rapidly—but often at the cost of long-term sustainability, user trust, and meaningful utility. Optivus Protocol introduces a new standard: a fixed-supply, deflation-aware store-of-value token (OPTIV) that incentivizes holding, strengthens network participation, and aligns with real economic principles.</p>
      </section>

      <section>
        <h2>2. Vision & Mission</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">Vision:</h3>
        <p>To establish OPTIV as a modern digital store of value—scarce, secure, and scalable.</p>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">Mission:</h3>
        <p>To empower users through fair tokenomics, transparent rewards, and long-term alignment, creating a decentralized ecosystem that benefits contributors, not just early adopters or speculators.</p>
      </section>
      
      <section>
        <h2>3. Token Overview</h2>
        <div className="space-y-1 my-4 p-4 border border-brand-ui-element/20 rounded-lg bg-brand-panel/50">
            <InfoItem label="Token Name" value="Optivus Protocol" />
            <InfoItem label="Symbol" value="OPTIV" />
            <InfoItem label="Total Supply" value="10,000,000,000 OPTI" />
            <InfoItem label="Starting Price" value="$0.0001" />
            <InfoItem label="Liquidity Provided at Launch" value="$10,000" />
            <InfoItem label="Launch Pairings" value="OPTIV/USDC and OPTIV/SOL" />
            <InfoItem label="Minting Policy" value="No additional minting post-launch" />
            <InfoItem label="Burn Mechanism" value="Optional activation (manual/auto)" />
            <InfoItem label="Staking" value="Under consideration (non-inflationary)" />
        </div>
      </section>

      <section>
        <h2>4. Tokenomics Design</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">4.1 Store-of-Value Architecture</h3>
        <p>Unlike volatile, hype-based tokens, OPTIV is engineered to be held:</p>
        <ul className="space-y-2 my-4">
            <li><strong>Fixed Max Supply:</strong> 10 billion OPTIV – no inflation.</li>
            <li><strong>Deflationary Potential:</strong> Burnable via transactions, fees, or governance-triggered.</li>
            <li><strong>Staking-Ready:</strong> Optional yield mechanics via existing pool, not inflation.</li>
        </ul>
        <p>This model supports long-term trust and minimizes price volatility.</p>

        <h3 className="text-2xl font-semibold text-brand-white mt-6 mb-2 !border-none">4.2 Liquidity Strategy</h3>
        <p><strong>Initial Liquidity Pool:</strong></p>
        <div className="my-4 p-4 border border-brand-ui-element rounded-lg bg-brand-panel/50">
            <p className="font-bold text-brand-secondary">OPTIV/USDC:</p>
            <p>7M OPTIV + $7,000 USDC</p>
            <p className="mt-2 text-sm text-brand-light-gray">Provides price stability, ideal for long-term holders</p>
        </div>
        <div className="my-4 p-4 border border-brand-ui-element rounded-lg bg-brand-panel/50">
            <p className="font-bold text-brand-secondary">OPTIV/SOL:</p>
            <p>3M OPTIV + $3,000 SOL</p>
            <p className="mt-2 text-sm text-brand-light-gray">Reduces SOL exposure risk during market downturns</p>
        </div>
        <ul>
            <CheckListItem>Protects price floor</CheckListItem>
            <CheckListItem>Encourages utility adoption</CheckListItem>
            <CheckListItem>Reduces impact of token dumps</CheckListItem>
        </ul>
      </section>

      <section>
        <h2>5. Referral-Based Growth Engine</h2>
        <p>Traditional crypto projects reward only buyers. Optivus rewards contributors.</p>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">Referral Model Highlights:</h3>
        <ul className="my-4">
            <li>Multi-level rewards structure</li>
            <li>Incentivizes real network expansion</li>
            <li>Strengthens community ownership</li>
        </ul>
        <p>This system makes the Web3 onboarding process inclusive, transparent, and human-first.</p>
      </section>

      <section>
        <h2>6. Advanced Tokenomics with Purpose</h2>
        <ul className="space-y-2 my-4">
            <li><strong>Fair Distribution:</strong> No hidden minting or unfair insider allocations</li>
            <li><strong>Transparency:</strong> Public access to token flow, reserves, and rewards</li>
            <li><strong>Treasury-Controlled Reserves:</strong> Reserved funds for development, marketing, and stabilization</li>
        </ul>
      </section>

      <section>
        <h2>7. Optional Features for Sustainable Expansion</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">Burn Functionality (Future Activation)</h3>
        <p>Manual or automated burns possible from:</p>
        <ul className="my-2 ml-4">
            <li>Transaction fees</li>
            <li>Treasury usage</li>
            <li>Governance proposals</li>
        </ul>
        <p><strong>Goal:</strong> Encourage long-term scarcity and value growth</p>

        <h3 className="text-2xl font-semibold text-brand-white mt-6 mb-2 !border-none">Staking System (Under Review)</h3>
        <ul className="my-4">
            <li>Lockup-based yield potential</li>
            <li>No new token emissions — rewards sourced from existing token pool</li>
            <li>Time-weighted multipliers under consideration</li>
        </ul>
      </section>
      
      <section>
        <h2>8. Strategic Positioning</h2>
        <p className="italic"><strong>Core Identity:</strong> "The modern store of value: scarce, secure, scalable."</p>
        <h3 className="text-xl font-semibold text-brand-light-gray/90 mt-4 mb-2 !border-none">Messaging Pillars:</h3>
        <ul>
            <li>Scarcity + Trust = Value</li>
            <li>Hold-to-earn mindset</li>
            <li>Stability &gt; speculation</li>
        </ul>
        <h3 className="text-xl font-semibold text-brand-light-gray/90 mt-4 mb-2 !border-none">Key Taglines:</h3>
        <ul>
            <li>"Built to hold. Designed to grow.”</li>
            <li>"Optivus: Your future in digital form."</li>
            <li>"Wealth you can own, not inflate."</li>
        </ul>
      </section>

      <section>
        <h2>9. Market Fit & Target Audiences</h2>
        <h3 className="text-xl font-semibold text-brand-light-gray/90 mt-4 mb-2 !border-none">Audience—Value Proposition</h3>
        <ul className="space-y-2 my-4">
            <li><strong>Long-Term Holders</strong>—Asset protection, fixed supply, staking options</li>
            <li><strong>Crypto Newcomers</strong>—Clean design, clear use case, trust-first approach</li>
            <li><strong>DeFi Users</strong>—Advanced mechanics, vault/staking potential</li>
            <li><strong>Global Audiences</strong>—Hedge against inflation, store of value in unstable markets</li>
        </ul>
      </section>
      
      <section>
        <h2>10. Governance & Community</h2>
        <p>Optivus Protocol is built on community-first principles. Future updates include:</p>
        <ul className="my-4">
            <li>DAO-based decision-making</li>
            <li>Governance token integrations</li>
            <li>Proposal and voting systems</li>
        </ul>
        <p>All designed to give real power back to users, not centralized teams.</p>
      </section>

      <section>
        <h2>11. Summary Snapshot</h2>
        <div className="space-y-1 my-4 p-4 border border-brand-ui-element/20 rounded-lg bg-brand-panel/50">
            <InfoItem label="Max Supply" value="10,000,000,000 OPTIV" />
            <InfoItem label="Inflation" value="None (fixed cap)" />
            <InfoItem label="Burn Capabilities" value="Optional, not default" />
            <InfoItem label="Staking" value="Optional, non-dilutive" />
            <InfoItem label="Launch Price" value="$0.0001" />
            <InfoItem label="Liquidity Strategy" value="70% USDC / 30% SOL" />
            <InfoItem label="Primary Narrative" value='"Digital gold with real-world reach"' />
            <InfoItem label="Launch Ethos" value="Community-first, anti-hype, trust-driven" />
        </div>
      </section>

      <section>
        <h2>12. Closing Thoughts</h2>
        <p>Optivus Protocol isn't just another token. It's a movement to reclaim what crypto was meant to be—transparent, fair, and empowering. With robust tokenomics, sustainable design, and community-aligned incentives, OPTIV is laying the foundation for a more stable and rewarding digital economy.</p>
      </section>
    </PageWrapper>
  );
};
