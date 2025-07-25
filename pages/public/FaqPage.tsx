import React from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AccordionItem } from '../../components/ui/Accordion';

const faqs = [
    {
        question: "What is the Optivus Protocol?",
        answer: "Optivus Protocol is a decentralized, multi-tier affiliate marketing system. It allows users to earn commissions by referring others to the platform through a unique referral link."
    },
    {
        question: "How do I join?",
        answer: "You can join by signing up and paying a one-time £50 entry fee. This activates your account and gives you a unique referral link to share."
    },
    {
        question: "Is the £50 fee refundable?",
        answer: "No, as stated in our Terms of Service, the entry fee is non-refundable. It is immediately used to fund the commission payouts up the referral chain and cover protocol operational costs."
    },
    {
        question: "How do I earn money?",
        answer: "You earn commissions when someone joins using your referral link (Tier 1). You also earn smaller commissions when your referrals successfully refer new members (Tier 2, Tier 3, and so on). The £50 entry fee from new members is distributed across these tiers."
    },
    {
        question: "How much can I earn per referral?",
        answer: "The commission structure is tiered. For a £50 entry fee, a typical distribution is: £20 to the direct sponsor (you), £10 to your sponsor, £5 to their sponsor, and so on, with £10 going to the protocol."
    },
    {
        question: "How do I withdraw my earnings?",
        answer: "You can withdraw your earnings from the 'Withdraw' tab in your dashboard. You can withdraw to a connected crypto wallet or, after completing KYC verification, to a connected bank account."
    },
    {
        question: "What is KYC and why is it required?",
        answer: "KYC (Know Your Customer) is a verification process required for fiat (bank) withdrawals to comply with financial regulations. It involves submitting identification documents. Crypto withdrawals do not require KYC."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take security seriously. We use industry-standard measures to protect your data. For enhanced security, we strongly recommend enabling Two-Factor Authentication (2FA) in your account settings."
    }
];

export const FaqPage: React.FC = () => {
    return (
        <PageWrapper title="Frequently Asked Questions">
            <div className="space-y-2">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} title={faq.question}>
                        <p>{faq.answer}</p>
                    </AccordionItem>
                ))}
            </div>
        </PageWrapper>
    );
};
