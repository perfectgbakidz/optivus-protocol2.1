
import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const TermsPage: React.FC = () => {
  return (
    <PageWrapper title="Terms of Service">
      <section>
        <h2>1. Eligibility</h2>
        <p>You must be at least 18 years old and of legal age in your jurisdiction to use the Optivus Protocol. By using our service, you represent and warrant that you meet these requirements.</p>
      </section>
      <section>
        <h2>2. Account Registration</h2>
        <p>To access the protocol, you must register for an account and pay a one-time, non-refundable entry fee. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.</p>
      </section>
      <section>
        <h2>3. Referral Program</h2>
        <p>The core service of the Optivus Protocol is its referral program. Commissions are paid out according to the multi-tier structure outlined in our official documentation. Payouts are automated and final. We are not responsible for payments sent to incorrect wallet addresses provided by you.</p>
      </section>
      <section>
        <h2>4. Payouts and Fees</h2>
        <p>A portion of each entry fee is retained by the protocol to cover operational costs. The remaining amount is distributed as commissions. Withdrawal of earned commissions may be subject to network fees and a minimum withdrawal amount.</p>
      </section>
      <section>
        <h2>5. Prohibited Activities</h2>
        <p>You agree not to engage in any of the following prohibited activities: (a) using automated scripts to interact with the service; (b) creating multiple accounts to abuse the referral system; (c) engaging in any activity that is fraudulent, deceptive, or harmful to the protocol or its users.</p>
      </section>
    </PageWrapper>
  );
};
