import LegalLayout, { Section, List } from "./LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="TERMS OF SERVICE"
      updated="July 2026"
    >
      <Section title="1. Acceptance of Terms">
        By creating an account or using Swift Trade's website and Services,
        you agree to be bound by these Terms of Service. If you do not agree,
        please do not use the Services.
      </Section>

      <Section title="2. Eligibility">
        You must be at least 18 years old and legally capable of entering
        into binding contracts to use Swift Trade. By registering, you
        confirm that all information you provide is accurate and that you
        will keep it up to date.
      </Section>

      <Section title="3. Account & Verification">
        You are responsible for maintaining the confidentiality of your
        account credentials and for all activity under your account. Certain
        features, including withdrawals, require identity verification
        (KYC). We may suspend or limit your account until verification is
        complete or if we cannot verify your identity.
      </Section>

      <Section title="4. Trading & Withdrawals">
        <List
          items={[
            "Rates shown on the platform are indicative and may change based on market conditions before a trade is confirmed.",
            "Crypto and gift card submissions are reviewed before your Naira balance is credited.",
            "Withdrawal requests are reviewed manually and are subject to applicable limits and processing times.",
            "We reserve the right to decline or reverse a transaction that appears fraudulent, erroneous, or in violation of these Terms.",
          ]}
        />
      </Section>

      <Section title="5. Prohibited Use">
        You agree not to use Swift Trade for money laundering, terrorist
        financing, fraud, or any other unlawful activity, and not to submit
        gift cards or crypto that you do not own or that were obtained
        illegally.
      </Section>

      <Section title="6. Fees">
        Applicable fees, if any, will be disclosed before you confirm a
        transaction. We may update our fee structure from time to time.
      </Section>

      <Section title="7. Limitation of Liability">
        Swift Trade is provided on an "as is" basis. To the maximum extent
        permitted by law, we are not liable for indirect, incidental, or
        consequential damages arising from your use of the Services,
        including losses due to market volatility.
      </Section>

      <Section title="8. Suspension & Termination">
        We may suspend or terminate your account if we reasonably believe you
        have violated these Terms, applicable law, or our AML Policy.
      </Section>

      <Section title="9. Changes to These Terms">
        We may revise these Terms from time to time. Continued use of the
        Services after changes take effect constitutes acceptance of the
        revised Terms.
      </Section>

      <Section title="10. Contact Us">
        Questions about these Terms can be sent to us via our{" "}
        <a href="/contact" style={{ color: "#0ECB81", fontWeight: 600 }}>
          Contact page
        </a>
        .
      </Section>
    </LegalLayout>
  );
}
