
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
        answer: "You can join by signing up and paying a one-time £50 entry fee. This activates your account and gives you a unique referral link to share where you then have access to the exclusive Discord to obtain rewards."
    },
    {
        question: "Is the £50 fee refundable?",
        answer: "No, as stated in our Terms of Service, the entry fee is non-refundable. It is immediately used to fund the commission payouts and cover protocol operational costs."
    },
    {
        question: "Where is the sign up fee used for?",
        answer: "Operational costs of the server and a large portion is given back to the community via OPTIV buy backs and distributed fairly in community competitions."
    },
    {
        question: "What is KYC?",
        answer: "KYC (Know Your Customer) is a verification process required for fiat (bank) withdrawals to comply with financial regulations. It involves submitting identification documents. Crypto withdrawals do not require KYC."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we take security seriously. We use industry-standard measures to protect your data. For enhanced security, we strongly recommend enabling Two-Factor Authentication (2FA) in your account settings."
    },
    {
        question: "How do I join Discord?",
        answer: "Discord is reserved for those who sign up with our website OPTiVision where a direct link will be provided to ensure those who have contributed are the soul benefactors of the giveaways."
    },
    {
        question: "Do I have to invite people to join the competitions?",
        answer: "No. Anyone who pays their one time fee will be able to take place in the competitions but the more people you bring the more entries you will get, increasing your odds of winning OPTIV giveaways."
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
