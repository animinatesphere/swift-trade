import LegalLayout, { Section, List, InfoBox } from "./LegalLayout";

export default function AMLPolicy() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="AML POLICY"
      updated="July 2026"
    >
      <Section title="1. Our Commitment">
        Swift Trade is committed to preventing the use of its platform for
        money laundering, terrorist financing, or any other financial crime.
        We maintain a risk-based Anti-Money Laundering (AML) and
        Counter-Financing of Terrorism (CFT) program aligned with applicable
        Nigerian regulations and international best practice.
      </Section>

      <Section title="2. Know Your Customer (KYC)">
        Every user must complete identity verification before withdrawing
        funds. Our KYC process is designed to confirm that users are who
        they claim to be, using accepted identity documents.
        <List
          items={[
            "Accepted documents: National Identification Number (NIN), Driver's License, Voter's Card, or International Passport.",
            "A live selfie is required to help confirm the document belongs to the account holder.",
            "Submissions are manually reviewed by our compliance team before an account is marked verified.",
            "We may request additional documentation or information at any time as part of ongoing due diligence.",
          ]}
        />
      </Section>

      <Section title="3. Risk-Based Approach">
        We apply a risk-based approach to customer due diligence, meaning
        the level of scrutiny applied to an account or transaction scales
        with its assessed risk — considering factors such as transaction
        size, frequency, and behavioral patterns.
      </Section>

      <Section title="4. Transaction Monitoring">
        Transactions on Swift Trade are monitored for patterns consistent
        with money laundering, structuring, or fraud. Unusual or high-risk
        activity may result in a transaction being held for review, or an
        account being temporarily restricted while we investigate.
      </Section>

      <Section title="5. Sanctions Screening">
        We screen users against applicable sanctions and watchlists as part
        of onboarding and ongoing monitoring. Swift Trade will not knowingly
        provide services to individuals or entities on a sanctions list, or
        to users in jurisdictions subject to comprehensive sanctions.
      </Section>

      <Section title="6. Record Keeping">
        We retain KYC documentation and transaction records for the period
        required under applicable law, to support regulatory reporting and
        investigations when required.
      </Section>

      <Section title="7. Reporting Obligations">
        Where required by law, we cooperate with regulators and law
        enforcement and may file reports on suspicious activity. We do not
        disclose to a user that a report has been made about their account.
      </Section>

      <InfoBox>
        Our identity verification standards are designed with the same
        rigor as leading KYC and compliance infrastructure providers, such
        as Prembly, to give every Swift Trade user confidence that the
        platform is protected against fraud and financial crime.
      </InfoBox>

      <Section title="8. Compliance Contact">
        If you believe an account is being used for suspicious activity, or
        if you have questions about our AML program, please reach out
        through our{" "}
        <a href="/contact" style={{ color: "#0ECB81", fontWeight: 600 }}>
          Contact page
        </a>
        .
      </Section>
    </LegalLayout>
  );
}
