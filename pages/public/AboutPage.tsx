
import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const AboutPage: React.FC = () => {
  return (
    <PageWrapper title="Optivus Protocol White Paper">
      <section>
        <h2>Abstract</h2>
        <p>Optivus Protocol is a decentralized, multi-tier affiliate marketing system built to automate and secure commission payouts. By leveraging smart contract logic, the protocol ensures transparent, immediate, and tamper-proof distribution of referral fees. This white paper outlines the protocol's architecture, tokenomics, and strategic vision.</p>
      </section>
      <section>
        <h2>1. Introduction</h2>
        <p>Traditional affiliate marketing is plagued by inefficiencies, including delayed payments, lack of transparency, and high intermediary fees. Optivus Protocol addresses these issues by creating a self-sustaining ecosystem where participants are rewarded in real-time based on a clear, unchangeable set of rules encoded within the protocol.</p>
      </section>
      <section>
        <h2>2. Vision & Mission</h2>
        <p><strong>Vision:</strong> To become the industry-standard framework for decentralized referral-based growth, empowering individuals to create sustainable income streams through network effects.</p>
        <p><strong>Mission:</strong> To provide a secure, transparent, and efficient platform that automates multi-tier commission payouts, removing the need for trusted intermediaries and reducing friction in value transfer.</p>
      </section>
      <section>
        <h2>3. Tokenomics</h2>
        <p>While the initial version operates with fiat and major cryptocurrencies for the entry fee, a future native token (OPT) is planned to facilitate governance and enhance utility.</p>
        <div className="overflow-x-auto my-6">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-brand-ui-element/20">
                        <th className="p-3">Attribute</th>
                        <th className="p-3">Detail</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-brand-ui-element">
                        <td className="p-3">Token Name</td>
                        <td className="p-3">Optivus Token</td>
                    </tr>
                    <tr className="border-b border-brand-ui-element">
                        <td className="p-3">Ticker</td>
                        <td className="p-3">OPT</td>
                    </tr>
                    <tr className="border-b border-brand-ui-element">
                        <td className="p-3">Total Supply</td>
                        <td className="p-3">1,000,000,000</td>
                    </tr>
                    <tr className="border-b border-brand-ui-element">
                        <td className="p-3">Utility</td>
                        <td className="p-3">Governance, Staking Rewards, Reduced Protocol Fees</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </section>
    </PageWrapper>
  );
};