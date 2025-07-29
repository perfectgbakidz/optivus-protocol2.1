
import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const TermsPage: React.FC = () => {
  return (
    <PageWrapper title="Optivus Protocol Program Terms of Service">
      <div className="text-right text-brand-light-gray/80 mb-6 -mt-4">
        <p>Last Updated: 25/07/2025</p>
      </div>

      <p className="mb-6">Welcome to the Optivus Protocol Referral Program ("Program"). This Program is designed to reward our community for sharing access to Optivus and its ecosystem. By participating, you agree to comply with these Terms of Service ("Terms"). Please read them carefully.</p>

      <section>
        <h2>Overview</h2>
        <p>The Optivus Protocol Referral Program is an optional feature available to users of the OPTiVision platform. By referring new users who purchase access to OPTiVision services, participants may receive limited promotional rewards. Participation is entirely voluntary and is not required to access the platform.</p>
      </section>

      <section>
        <h2>OPTiVision Paid Access Benefits</h2>
        <p>All paying users of OPTiVision receive:</p>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>Full access to our exclusive Discord community</li>
            <li>Access to staking dashboards and performance analytics</li>
            <li>Eligibility for community airdrops, competitions, and updates</li>
        </ul>
        <p className="italic">Note: Referral rewards are optional promotional bonuses and are not part of the core OPTiVision product offering.</p>
      </section>
      
      <section>
        <h2>Referral Rewards Structure</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">Reward Levels</h3>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li><strong>Level 1 (Direct Bonus):</strong> A reward for each referred user who signs up and pays.</li>
            <li><strong>Levels 2-6 (Indirect Bonus):</strong> Rewards for referrals made by your invitees, decreasing by 15% per level (e.g., Level 2 receives 85% of Level 1 value, Level 3 receives 70%, etc.).</li>
        </ul>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">Possible Rewards</h3>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>$OPTIV tokens</li>
            <li>Boosted staking rewards</li>
            <li>Airdrop priority</li>
            <li>Promotional cash equivalents (via Stripe, PayPal, or other supported methods)</li>
        </ul>
        <p className="p-4 bg-brand-panel/50 border-l-4 border-warning my-4">
          <strong>Important:</strong> All rewards are discretionary, limited in availability, and not guaranteed. Referral bonuses are subject to modification, suspension, or cancellation at any time at Optivus' sole discretion.
        </p>
      </section>

      <section>
        <h2>Program Rules & Participant Obligations</h2>
        <p>This Program is a promotional campaign—not an income opportunity or investment program. Participants must agree to the following:</p>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>Creating multiple accounts, engaging in fraud, or abusing the referral system will result in immediate disqualification.</li>
            <li>Referral links must not be distributed through spam, deceptive promotions, or in violation of Optivus' Terms of Use.</li>
            <li>Participants may not present the Program as a guaranteed source of income or investment opportunity.</li>
            <li>Referral bonuses are not dependent on downstream referral volume beyond the sixth level.</li>
            <li>All promotional activities must comply with local, state, and international laws.</li>
        </ul>
      </section>

      <section>
        <h2>Legal & Compliance Notice</h2>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>This Program does not constitute a financial service, investment opportunity, or income-generating scheme.</li>
            <li>Optivus Protocol makes no guarantees regarding the monetary value or availability of any referral bonus.</li>
            <li>Participants are solely responsible for reporting any rewards as taxable income, where applicable.</li>
            <li>The Program is void where prohibited by law. Participants must comply with all relevant local regulations.</li>
            <li>Referral bonuses are funded from Optivus' marketing budget—not from user subscription payments.</li>
            <li>$OPTIV tokens and promotional payouts do not represent securities, equity, or investment instruments.</li>
            <li>Participation is void if a user violates Optivus Platform Terms of Use.</li>
        </ul>
      </section>

       <section>
        <h2>Promotional Giveaways & Launch Bonuses</h2>
        <p>As part of marketing campaigns, Optivus may offer:</p>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>Optional giveaways of $OPTIV tokens to active, paying users</li>
            <li>Additional entries or bonuses for referrals made up to six levels</li>
            <li>Nominal indirect referral rewards (Levels 2–6), decreasing by 15% per level to ensure fairness and sustainability</li>
        </ul>
        <p className="italic">Disclaimer: Giveaways and launch bonuses are optional and time-limited. They hold no guaranteed or intrinsic monetary value and are subject to change.</p>
      </section>

      <section>
        <h2>Program Administration & Authority</h2>
        <p>Optivus reserves the right to:</p>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>Modify, suspend, or terminate the Program at any time without prior notice</li>
            <li>Make final decisions regarding disputes, fraud investigations, and eligibility assessments</li>
            <li>Determine bonus eligibility, limit rewards, and enforce Program rules at its sole discretion</li>
        </ul>
        <p>To remain eligible for referral bonuses, participants must:</p>
        <ul className="list-disc list-inside space-y-2 my-4">
            <li>Maintain an active, paid OPTiVision subscription</li>
            <li>Abide by all Optivus platform policies, including the Terms of Use</li>
            <li>Ensure all promotional activity remains lawful and aligned with platform guidelines</li>
        </ul>
      </section>
      
      <section>
        <h2>Acknowledgment of Terms</h2>
        <p>By participating in the Referral Program, you acknowledge and agree that:</p>
         <ul className="list-disc list-inside space-y-2 my-4">
            <li>You are purchasing access to OPTiVision tools and services—not an investment product</li>
            <li>Referral bonuses and token giveaways are optional promotional incentives and are not guaranteed</li>
            <li>Participation in the Referral Program is secondary to the core utility and access provided by OPTiVision</li>
            <li>You understand and accept that all rewards are discretionary, limited in nature, and may be modified or revoked</li>
        </ul>
      </section>

      <section>
        <h2>Questions & Support</h2>
        <p>If you have questions about the Referral Program or these Terms, please contact us at: <a href="mailto:contact@optivusprotocol.io" className="text-brand-secondary hover:underline">contact@optivusprotocol.io</a></p>
        <p>You may also reach out via the OPTiVision Discord community for real-time support and announcements.</p>
      </section>
    </PageWrapper>
  );
};
