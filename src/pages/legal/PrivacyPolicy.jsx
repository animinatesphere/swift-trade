import LegalLayout, { Section, List } from "./LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="PRIVACY POLICY"
      updated="July 2026"
    >
      <Section title="1. Overview">
        Swift Trade ("we", "us", "our") provides a platform for exchanging
        cryptocurrency and gift cards for Nigerian Naira. This Privacy Policy
        explains what information we collect, how we use it, and the choices
        you have regarding your data when you use our website, mobile
        experience, and related services (the "Services").
      </Section>

      <Section title="2. Information We Collect">
        We collect information you provide directly to us, information we
        collect automatically, and information from identity verification
        partners.
        <List
          items={[
            "Account information — full name, email address, phone number, and password.",
            "Identity verification (KYC) data — government-issued ID details, document images, selfie images, and date of birth, submitted when you verify your account.",
            "Transaction data — wallet addresses, bank account details, trade amounts, and transaction history.",
            "Device and usage data — IP address, browser type, and how you interact with our Services.",
          ]}
        />
      </Section>

      <Section title="3. How We Use Your Information">
        We use the information we collect to:
        <List
          items={[
            "Create and maintain your account.",
            "Verify your identity and comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) obligations.",
            "Process trades, conversions, and withdrawals.",
            "Detect, investigate, and prevent fraud or other unauthorized activity.",
            "Communicate with you about your account, transactions, and updates to our Services.",
            "Comply with applicable laws and regulatory requirements in Nigeria.",
          ]}
        />
      </Section>

      <Section title="4. Sharing Your Information">
        We do not sell your personal information. We may share your
        information with:
        <List
          items={[
            "Identity verification and compliance providers, to confirm your identity and screen for sanctions or fraud risk.",
            "Banking and payment partners, to process withdrawals to your bank account.",
            "Regulators and law enforcement, where required by law or a valid legal request.",
            "Service providers who help us operate the platform (e.g. cloud hosting, customer support tooling), under confidentiality obligations.",
          ]}
        />
      </Section>

      <Section title="5. Data Retention">
        We retain your personal and transaction data for as long as your
        account is active, and for a period afterward as required to meet
        our legal, regulatory, and AML record-keeping obligations.
      </Section>

      <Section title="6. Data Security">
        We use industry-standard technical and organizational measures —
        including encryption in transit and at rest — to protect your
        information. No system is completely secure, and we encourage you to
        use a strong, unique password and enable any available account
        protections.
      </Section>

      <Section title="7. Your Rights">
        Depending on your location, you may have the right to access,
        correct, or request deletion of your personal information, subject
        to our legal and regulatory retention obligations. To exercise these
        rights, contact us using the details below.
      </Section>

      <Section title="8. Changes to This Policy">
        We may update this Privacy Policy from time to time. We will notify
        you of material changes by posting the updated policy on this page
        with a new "Last updated" date.
      </Section>

      <Section title="9. Contact Us">
        If you have questions about this Privacy Policy or how we handle
        your data, reach out via our{" "}
        <a href="/contact" style={{ color: "#0ECB81", fontWeight: 600 }}>
          Contact page
        </a>
        .
      </Section>
    </LegalLayout>
  );
}
