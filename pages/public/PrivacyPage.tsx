import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const PrivacyPage: React.FC = () => {
  return (
    <PageWrapper title="Privacy Policy">
      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, complete your KYC profile, or contact us. This may include your name, email address, and government-issued identification.</p>
        <p>We also collect information automatically when you use our services, such as your IP address, device information, and transaction history on our platform.</p>
      </section>
      <section>
        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services;</li>
            <li>Process transactions and send you related information, including confirmations and receipts;</li>
            <li>Verify your identity and prevent fraud (KYC);</li>
            <li>Communicate with you about products, services, and events;</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
          </ul>
      </section>
      <section>
        <h2>3. Data Sharing</h2>
        <p>We do not sell your personal information. We may share your information with third-party vendors and service providers who need access to such information to carry out work on our behalf (e.g., payment processors, KYC verification services). We may also share information in response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</p>
      </section>
      <section>
        <h2>4. Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
      </section>
    </PageWrapper>
  );
};